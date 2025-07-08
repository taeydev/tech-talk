from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List
from models import Post, Base
from database import SessionLocal, engine

app = FastAPI()

# 의존성: DB 세션
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 게시글 목록 조회 API
@app.get("/posts")
def read_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).order_by(Post.created_at.desc()).all()
    # SQLAlchemy 객체를 dict로 변환
    return [
        {
            "id": p.id,
            "title": p.title,
            "content": p.content,
            "createdAt": p.created_at,
            "views": p.views,
            "tags": p.tags,
            "url": p.url,
            "thumbnailUrl": p.thumbnail_url,
        }
        for p in posts
    ]

# 게시글 조회 API
@app.get("/posts/{post_id}")
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "createdAt": post.created_at,
        "views": post.views,
        "tags": post.tags,
        "url": post.url,
        "thumbnailUrl": post.thumbnail_url,
    }