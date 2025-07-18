from pydantic import BaseModel
from typing import List, Optional

class PostCreate(BaseModel):
    title: str
    content: str
    tags: List[str] = []
    url: Optional[str] = None
    thumbnailUrl: Optional[str] = None
    password: str

class PostUpdate(BaseModel):
    title: str
    content: str
    tags: List[str]
    url: Optional[str] = None
    thumbnailUrl: Optional[str] = None