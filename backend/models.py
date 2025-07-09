from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

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