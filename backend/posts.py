from fastapi import APIRouter, Depends, HTTPException, Body, Query
from sqlalchemy.orm import Session, joinedload
from models import Post, Comment
from database import SessionLocal
from dto import PostCreate, PostUpdate
import bcrypt
from sqlalchemy import func
import os
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
import re
import html
import json

# 환경 변수 로드
load_dotenv()

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def auto_link_urls(text: str) -> str:
    """
    본문 내 http/https로 시작하는 URL을 <a href="...">...</a>로 변환
    href 속성의 URL 내 & 등 특수문자는 html.escape로 이스케이프
    텍스트(보여지는 부분) 내 & 등도 html.escape로 이스케이프
    """
    url_pattern = re.compile(r"(https?://[\w\-._~:/?#\[\]@!$&'()*+,;=%]+)")
    def escape_url(match):
        url = match.group(1)
        safe_url = html.escape(url, quote=True)  # href용
        safe_text = html.escape(url)             # 텍스트 노드용 (&, <, >)
        return f'<a href="{safe_url}">{safe_text}</a>'
    return url_pattern.sub(escape_url, text)

def text_to_html_paragraphs(text: str) -> str:
    """
    두 줄 이상 줄바꿈은 <p>문단</p>, 한 줄 줄바꿈은 <br/>로 변환
    연속 줄바꿈(빈 줄)도 <p><br/></p>로 보존
    URL은 자동으로 <a href>로 변환
    """
    text = auto_link_urls(text)
    # 문단 분리 (두 줄 이상 줄바꿈 기준, 구분자도 보존)
    paragraphs = re.split(r'(\n{2,})', text)
    html_paragraphs = []
    for para in paragraphs:
        if para.startswith('\n'):
            # 연속 줄바꿈(빈 줄)은 개수만큼 <p><br/></p> 추가
            count = para.count('\n') // 2  # 두 줄마다 한 번
            html_paragraphs.extend(['<p><br/></p>'] * count)
        elif para.strip() == '':
            continue  # 완전 빈 문자열은 무시
        else:
            html_paragraphs.append('<p>' + para.replace('\n', '<br/>') + '</p>')
    return ''.join(html_paragraphs)

def make_tag_html(tags):
    if not tags:
        return ''
    tag_str = ' '.join(f'#{tag}' for tag in tags)
    return (
        '<br/><br/>'  # 본문과 태그 사이 두 줄 띄우기
        '<div style="color: #888; font-size: 0.95em; margin-top: 16px; '
        'border-top: 1px solid #eee; padding-top: 8px;">'
        f'{tag_str}</div>'
    )

def post_to_confluence_blog(title: str, content: str, tags=None):
    url = os.getenv("CONFLUENCE_BLOG_API_URL")
    email = os.getenv("CONFLUENCE_EMAIL")
    api_token = os.getenv("CONFLUENCE_API_TOKEN")
    space_key = os.getenv("CONFLUENCE_SPACE_KEY")
    if not all([url, email, api_token, space_key]):
        print("[Confluence] 환경변수 누락: URL, EMAIL, API_TOKEN, SPACE_KEY를 모두 설정하세요.")
        return
    url = str(url)
    email = str(email)
    api_token = str(api_token)
    space_key = str(space_key)
    auth = HTTPBasicAuth(email, api_token)
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    html_content = text_to_html_paragraphs(content)
    if tags:
        html_content += make_tag_html(tags)
    payload = {
        "type": "blogpost",
        "title": title,
        "space": {"key": space_key},
        "body": {
            "storage": {
                "value": html_content,  # HTML 변환된 본문 + 태그
                "representation": "storage"
            }
        }
    }
    print("[Confluence] 전체 payload 미리보기:")
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    try:
        response = requests.post(url, headers=headers, json=payload, auth=auth, timeout=10)
        if not response.ok:
            print(f"[Confluence] 업로드 실패: {response.status_code} {response.text}")
        else:
            print(f"[Confluence] 블로그 포스트 업로드 성공: {title}")
    except Exception as e:
        print(f"[Confluence] 예외 발생: {e}")

# 게시글 목록 조회 API (페이징 지원)
@router.get("/posts")
def read_posts(
    db: Session = Depends(get_db),
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    total = db.query(Post).count()
    posts_with_count = (
        db.query(
            Post,
            func.count(Comment.id).label("comment_count")
        )
        .outerjoin(Comment, Comment.post_id == Post.id)
        .group_by(Post.id)
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    posts = [
        {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "createdAt": post.created_at.isoformat() + 'Z',
            "views": post.views,
            "tags": post.tags,
            "url": post.url,
            "thumbnailUrl": post.thumbnail_url,
            "commentCount": comment_count,
        }
        for post, comment_count in posts_with_count
    ]
    has_next = offset + limit < total
    return {
        "posts": posts,
        "has_next": has_next,
        "total": total
    }

# 게시글 단일 조회 API
@router.get("/posts/{post_id}")
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).options(joinedload(Post.comments)).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.views += 1
    db.commit()
    db.refresh(post)
    
    # 댓글 10개만 페이징해서 가져오기 및 댓글 카운트
    comments = (
        db.query(Comment)
        .filter(Comment.post_id == post.id)
        .order_by(Comment.created_at.asc())
        .limit(10)
        .all()
    )
    comment_count = db.query(Comment).filter(Comment.post_id == post.id).count()
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "createdAt": post.created_at.isoformat() + 'Z',
        "views": post.views,
        "tags": post.tags,
        "url": post.url,
        "thumbnailUrl": post.thumbnail_url,
        "commentCount": comment_count,
        "comments": [
            {
                "id": comment.id,
                "postId": comment.post_id,
                "content": comment.content,
                "createdAt": comment.created_at.isoformat() + 'Z',
            }
            for comment in comments
        ],
    }

# 게시글 생성 API에서 post_to_confluence_blog를 호출하도록 변경
@router.post("/posts")
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    password_hash = bcrypt.hashpw(post.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    new_post = Post(
        title=post.title,
        content=post.content,
        tags=post.tags,
        url=post.url,
        thumbnail_url=post.thumbnailUrl,
        password_hash=password_hash,
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    # Confluence 블로그 포스트로 복제
    post_to_confluence_blog(new_post.title, new_post.content, new_post.tags)

    return {
        "id": new_post.id,
        "title": new_post.title,
        "content": new_post.content,
        "createdAt": new_post.created_at.isoformat() + 'Z',
        "views": new_post.views,
        "tags": new_post.tags,
        "url": new_post.url,
        "thumbnailUrl": new_post.thumbnail_url,
    }

# 게시글 수정 API
@router.put("/posts/{post_id}")
def update_post(post_id: int, post_update: PostUpdate, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.title = post_update.title
    post.content = post_update.content
    post.tags = post_update.tags
    post.url = post_update.url
    post.thumbnail_url = post_update.thumbnailUrl
    db.commit()
    db.refresh(post)
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "createdAt": post.created_at.isoformat() + 'Z',
        "views": post.views,
        "tags": post.tags,
        "url": post.url,
        "thumbnailUrl": post.thumbnail_url,
    }

# 게시글 삭제 API
@router.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"ok": True}

# 게시글 비밀번호 검증 API
@router.post("/posts/{post_id}/verify-password")
def verify_post_password(post_id: int, password: str = Body(..., embed=True), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not bcrypt.checkpw(password.encode("utf-8"), post.password_hash.encode("utf-8")):
        raise HTTPException(status_code=403, detail="비밀번호가 일치하지 않습니다.")
    return {"ok": True} 