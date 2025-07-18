import os
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from models.post import Post
from database import SessionLocal
from jinja2 import Template
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# 환경 변수에서 이메일 설정 가져오기
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
RECIPIENT_EMAILS = os.getenv("RECIPIENT_EMAILS", "").split(",") if os.getenv("RECIPIENT_EMAILS") else []

class EmailService:
    def __init__(self):
        self.smtp_server = SMTP_SERVER
        self.smtp_port = SMTP_PORT
        self.smtp_username = SMTP_USERNAME
        self.smtp_password = SMTP_PASSWORD
        self.sender_email = SENDER_EMAIL
        self.recipient_emails = [email.strip() for email in RECIPIENT_EMAILS if email.strip()]
    
    def get_weekly_posts(self, db: Session) -> List[Dict[str, Any]]:
        # 지난 주 월요일부터 일요일까지
        today = datetime.now()
        last_monday = today - timedelta(days=today.weekday() + 7)
        last_sunday = last_monday + timedelta(days=6)
        
        posts = (
            db.query(
                Post,
                func.count(Post.id).label("comment_count")
            )
            .outerjoin(Post.comments)
            .filter(
                Post.created_at >= last_monday,
                Post.created_at <= last_sunday
            )
            .group_by(Post.id)
            .order_by(Post.created_at.desc())
            .all()
        )
        
        return [
            {
                "id": post.id,
                "title": post.title,
                "content": post.content[:200] + "..." if len(post.content) > 200 else post.content,
                "created_at": post.created_at.strftime("%Y-%m-%d %H:%M"),
                "views": post.views,
                "tags": post.tags or [],
                "url": post.url,
                "comment_count": comment_count
            }
            for post, comment_count in posts
        ]
    
    def create_email_html(self, posts: List[Dict[str, Any]], week_start: str, week_end: str) -> str:
        template_str = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset=\"UTF-8\">
            <title>Tech Talk 주간 신규 게시글 안내</title>
            <style>
                body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #222; }
                .container { background: #fff; max-width: 550px; margin: 40px auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px; }
                h1 { color: #0a80ed; font-size: 1.5rem; margin-bottom: 8px; }
                .period { color: #666; font-size: 1rem; margin-bottom: 24px; }
                ul { padding-left: 1.2em; }
                li { margin-bottom: 10px; font-size: 1.08rem; }
                .footer { margin-top: 32px; color: #888; font-size: 0.95rem; text-align: center; }
            </style>
        </head>
        <body>
            <div class=\"container\">
                <h1>Tech Talk 주간 신규 게시글 안내</h1>
                <div class=\"period\">{{ week_start }} ~ {{ week_end }}</div>
                {% if posts %}
                <ul>
                    {% for post in posts %}
                        <li>{{ post.title }}</li>
                    {% endfor %}
                </ul>
                {% else %}
                <div>이번 주에는 새로운 게시글이 없습니다.</div>
                {% endif %}
                <div class=\"footer\">이 이메일은 Tech Talk의 주간 신규 게시글 안내 서비스에 따라 자동 발송되었습니다.</div>
            </div>
        </body>
        </html>
        """
        template = Template(template_str)
        return template.render(posts=posts, week_start=week_start, week_end=week_end)
    
    def send_weekly_email(self) -> bool:
        if not all([self.smtp_username, self.smtp_password, self.sender_email, self.recipient_emails]):
            print("[Email] 이메일 설정이 완료되지 않았습니다.")
            return False
        
        try:
            db = SessionLocal()
            posts = self.get_weekly_posts(db)

            # 게시글이 없으면 발송하지 않음
            if not posts:
                print("[Email] 지난 주에 새로운 게시글이 없어 이메일을 발송하지 않습니다.")
                return False
            
            # 지난 주 날짜 계산
            today = datetime.now()
            last_monday = today - timedelta(days=today.weekday() + 7)
            last_sunday = last_monday + timedelta(days=6)
            
            week_start = last_monday.strftime("%Y년 %m월 %d일")
            week_end = last_sunday.strftime("%Y년 %m월 %d일")
            
            # 이메일 HTML 생성
            html_content = self.create_email_html(posts, week_start, week_end)
            
            # 이메일 발송
            for recipient in self.recipient_emails:
                self._send_email(recipient, html_content, week_start, week_end)
            
            print(f"[Email] 주간 게시글 요약 이메일 발송 완료: {len(self.recipient_emails)}명")
            return True
            
        except Exception as e:
            print(f"[Email] 이메일 발송 실패: {str(e)}")
            return False
        finally:
            db.close()
    
    def _send_email(self, recipient: str, html_content: str, week_start: str, week_end: str):
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f'Tech Talk 주간 게시글 ({week_start} ~ {week_end})'
            msg['From'] = self.sender_email
            msg['To'] = recipient
            
            # HTML 버전
            html_part = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(html_part)
            
            # SMTP 서버 연결 및 발송
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            print(f"[Email] 이메일 발송 성공: {recipient}")
            
        except Exception as e:
            print(f"[Email] 이메일 발송 실패 ({recipient}): {str(e)}")

# 전역 이메일 서비스 인스턴스
email_service = EmailService() 