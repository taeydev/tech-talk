from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from posts import router as posts_router
from comments import router as comments_router
from dotenv import load_dotenv
from openai_api import router as openai_router

# 환경 변수 로드
load_dotenv()

app = FastAPI()

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
