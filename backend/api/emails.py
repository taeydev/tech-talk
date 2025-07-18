from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from services.email_service import email_service
from scheduler.scheduler import email_scheduler
from datetime import datetime, timedelta

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/email/send-weekly")
async def send_weekly_email(db: Session = Depends(get_db)):
    """수동으로 주간 이메일을 발송합니다."""
    try:
        success = email_service.send_weekly_email()
        if success:
            return {"message": "주간 이메일 발송이 완료되었습니다.", "success": True}
        else:
            raise HTTPException(status_code=500, detail="이메일 발송에 실패했습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이메일 발송 중 오류가 발생했습니다: {str(e)}")

@router.get("/email/weekly-posts")
async def get_weekly_posts(db: Session = Depends(get_db)):
    """지난 주 게시글 목록을 조회합니다."""
    try:
        posts = email_service.get_weekly_posts(db)
        return {
            "posts": posts,
            "count": len(posts),
            "week_range": {
                "start": (datetime.now() - timedelta(days=datetime.now().weekday() + 7)).strftime("%Y-%m-%d"),
                "end": (datetime.now() - timedelta(days=datetime.now().weekday() + 1)).strftime("%Y-%m-%d")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"게시글 조회 중 오류가 발생했습니다: {str(e)}")

@router.get("/email/status")
async def get_email_status():
    """이메일 서비스 상태를 확인합니다."""
    try:
        # 스케줄러 상태 확인
        jobs = email_scheduler.scheduler.get_jobs()
        job_status = []
        
        for job in jobs:
            job_status.append({
                "id": job.id,
                "name": job.name,
                "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
                "trigger": str(job.trigger)
            })
        
        # 이메일 설정 상태 확인
        email_config = {
            "smtp_server": email_service.smtp_server,
            "smtp_port": email_service.smtp_port,
            "sender_email": email_service.sender_email,
            "recipient_count": len(email_service.recipient_emails),
            "is_configured": all([
                email_service.smtp_username,
                email_service.smtp_password,
                email_service.sender_email,
                email_service.recipient_emails
            ])
        }
        
        return {
            "scheduler": {
                "is_running": email_scheduler.scheduler.running,
                "jobs": job_status
            },
            "email_config": email_config
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"상태 확인 중 오류가 발생했습니다: {str(e)}")

@router.post("/email/test")
async def test_email_config():
    """이메일 설정을 테스트합니다."""
    try:
        if not all([
            email_service.smtp_username,
            email_service.smtp_password,
            email_service.sender_email,
            email_service.recipient_emails
        ]):
            raise HTTPException(
                status_code=400, 
                detail="이메일 설정이 완료되지 않았습니다. 환경 변수를 확인해주세요."
            )
        
        # 간단한 테스트 이메일 발송
        test_html = """
        <html>
        <body>
            <h1>Tech Talk 이메일 설정 테스트</h1>
            <p>이메일 발송이 정상적으로 설정되었습니다.</p>
            <p>발송 시간: {}</p>
        </body>
        </html>
        """.format(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        
        for recipient in email_service.recipient_emails:
            email_service._send_email(
                recipient, 
                test_html, 
                "테스트", 
                "테스트"
            )
        
        return {
            "message": "테스트 이메일이 발송되었습니다.",
            "recipients": email_service.recipient_emails,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"테스트 이메일 발송 실패: {str(e)}") 