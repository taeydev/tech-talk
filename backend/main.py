from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.posts import router as posts_router
from api.comments import router as comments_router
from api.openai import router as openai_router
from api.emails import router as emails_router
from scheduler.scheduler import email_scheduler
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# 환경 변수 로드
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[App] Tech Talk 애플리케이션이 시작되었습니다.")
    email_scheduler.start()
    yield
    print("[App] Tech Talk 애플리케이션이 종료되었습니다.")
    email_scheduler.stop()

app = FastAPI(lifespan=lifespan)

#CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(posts_router)
app.include_router(comments_router)
app.include_router(openai_router)
app.include_router(emails_router)
