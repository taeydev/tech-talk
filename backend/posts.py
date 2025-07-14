from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session, joinedload
from models import Post, Comment
from database import SessionLocal
from dto import PostCreate, PostUpdate
import bcrypt
from sqlalchemy import func

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 게시글 목록 조회 API
@router.get("/posts")
def read_posts(db: Session = Depends(get_db)):
    posts_with_count = (
        db.query(
            Post,
            func.count(Comment.id).label("comment_count")
        )
        .outerjoin(Comment, Comment.post_id == Post.id)
        .group_by(Post.id)
        .order_by(Post.created_at.desc())
        .all()
    )
    return [
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

# 게시글 단일 조회 API
@router.get("/posts/{post_id}")
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).options(joinedload(Post.comments)).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.views += 1
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
        "comments": [
            {
                "id": comment.id,
                "postId": comment.post_id,
                "content": comment.content,
                "createdAt": comment.created_at.isoformat() + 'Z',
            }
            for comment in post.comments
        ],
    }

# 게시글 생성 API
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