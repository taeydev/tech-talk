from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .comment import Comment
from .base import Base

class Post(Base):
    __tablename__ = "post"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    views = Column(Integer, nullable=False, default=0)
    tags = Column(JSON)
    url = Column(String(500))
    thumbnail_url = Column(String(500))
    password_hash = Column(String(255), nullable=False)
    
    # Relationship
    comments = relationship(
        "Comment",
        cascade="all, delete-orphan",
        order_by=lambda: Comment.created_at
    )