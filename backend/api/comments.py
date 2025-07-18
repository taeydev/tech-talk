from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from models.post import Post
from models.comment import Comment
from database import SessionLocal
from dto.comment import CommentCreate
import bcrypt

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 댓글 생성 API
@router.post("/comments")
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == comment.postId).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    password_hash = bcrypt.hashpw(comment.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    new_comment = Comment(
        post_id=comment.postId,
        content=comment.content,
        password_hash=password_hash,
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return {
        "id": new_comment.id,
        "postId": new_comment.post_id,
        "content": new_comment.content,
        "createdAt": new_comment.created_at.isoformat() + 'Z',
    }

# 댓글 수정 API
@router.patch("/comments/{comment_id}")
def update_comment(
    comment_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    password = data.get("password")
    content = data.get("content")
    if not password or not content:
        raise HTTPException(status_code=400, detail="Password and content required")
    if not bcrypt.checkpw(password.encode("utf-8"), comment.password_hash.encode("utf-8")):
        raise HTTPException(status_code=403, detail="Incorrect password")
    comment.content = content
    db.commit()
    db.refresh(comment)
    return {
        "id": comment.id,
        "postId": comment.post_id,
        "content": comment.content,
        "createdAt": comment.created_at.isoformat() + 'Z',
    }

# 댓글 삭제 API
@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    password = data.get("password")
    if not password:
        raise HTTPException(status_code=400, detail="Password required")
    if not bcrypt.checkpw(password.encode("utf-8"), comment.password_hash.encode("utf-8")):
        raise HTTPException(status_code=403, detail="Incorrect password")
    db.delete(comment)
    db.commit()
    return {"success": True}

# 댓글 페이징 조회 API
@router.get("/comments/{post_id}")
def get_comments(post_id: int, offset: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    comments = (
        db.query(Comment)
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": c.id,
            "postId": c.post_id,
            "content": c.content,
            "createdAt": c.created_at.isoformat() + 'Z',
        }
        for c in comments
    ] 