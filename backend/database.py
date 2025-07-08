import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# .env 파일 자동 로드
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# SQLAlchemy 엔진 및 세션 생성
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)