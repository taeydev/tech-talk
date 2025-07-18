from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, String
from datetime import datetime
from .base import Base

class Comment(Base):
    __tablename__ = "comment"

    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey("post.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    password_hash = Column(String(255), nullable=False)