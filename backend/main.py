from fastapi import FastAPI, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from models import Post
from database import SessionLocal, engine
from dto import PostCreate, PostUpdate
from fastapi.middleware.cors import CORSMiddleware
import bcrypt

app = FastAPI()

#CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


# 게시글 생성 API
@app.post("/posts")
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
    return {
        "id": new_post.id,
        "title": new_post.title,
        "content": new_post.content,
        "createdAt": new_post.created_at,
        "views": new_post.views,
        "tags": new_post.tags,
        "url": new_post.url,
        "thumbnailUrl": new_post.thumbnail_url,
    }

# 게시글 업데이트 API
@app.put("/posts/{post_id}")
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
        "createdAt": post.created_at,
        "views": post.views,
        "tags": post.tags,
        "url": post.url,
        "thumbnailUrl": post.thumbnail_url,
    }

# 게시글 삭제 API
@app.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"ok": True}

# 게시글 비밀번호 검증 API
@app.post("/posts/{post_id}/verify-password")
def verify_post_password(post_id: int, password: str = Body(..., embed=True), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not bcrypt.checkpw(password.encode("utf-8"), post.password_hash.encode("utf-8")):
        raise HTTPException(status_code=403, detail="비밀번호가 일치하지 않습니다.")
    return {"ok": True}
