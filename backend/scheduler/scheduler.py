from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from services.email_service import email_service
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmailScheduler:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.setup_jobs()
    
    def setup_jobs(self):
        # 매주 월요일 오전 9시에 이메일 발송
        self.scheduler.add_job(
            func=self.send_weekly_email_job,
            trigger=CronTrigger(day_of_week='mon', hour=9, minute=0),
            id='weekly_email',
            name='주간 게시글 요약 이메일 발송',
            replace_existing=True
        )
        
        # 매일 오전 8시에 스케줄러 상태 로그
        self.scheduler.add_job(
            func=self.log_scheduler_status,
            trigger=CronTrigger(hour=8, minute=0),
            id='scheduler_status',
            name='스케줄러 상태 로그',
            replace_existing=True
        )
    
    def send_weekly_email_job(self):
        try:
            logger.info("[Scheduler] 주간 게시글 요약 이메일 발송 시작")
            success = email_service.send_weekly_email()
            if success:
                logger.info("[Scheduler] 주간 게시글 요약 이메일 발송 완료")
            else:
                logger.error("[Scheduler] 주간 게시글 요약 이메일 발송 실패")
        except Exception as e:
            logger.error(f"[Scheduler] 이메일 발송 중 오류 발생: {str(e)}")
    
    def log_scheduler_status(self):
        jobs = self.scheduler.get_jobs()
        logger.info(f"[Scheduler] 현재 등록된 작업 수: {len(jobs)}")
        for job in jobs:
            next_run = job.next_run_time
            if next_run:
                logger.info(f"[Scheduler] 작업 '{job.name}': 다음 실행 예정 {next_run}")
    
    def start(self):
        try:
            self.scheduler.start()
            logger.info("[Scheduler] 이메일 스케줄러가 시작되었습니다.")
            self.log_scheduler_status()
        except Exception as e:
            logger.error(f"[Scheduler] 스케줄러 시작 실패: {str(e)}")
    
    def stop(self):
        try:
            self.scheduler.shutdown()
            logger.info("[Scheduler] 이메일 스케줄러가 중지되었습니다.")
        except Exception as e:
            logger.error(f"[Scheduler] 스케줄러 중지 실패: {str(e)}")
    
    def manual_send_weekly_email(self):
        """수동으로 주간 이메일을 발송합니다 (테스트용)"""
        logger.info("[Scheduler] 수동 주간 이메일 발송 시작")
        return self.send_weekly_email_job()

# 전역 스케줄러 인스턴스
email_scheduler = EmailScheduler() 