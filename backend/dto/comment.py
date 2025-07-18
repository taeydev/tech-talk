from pydantic import BaseModel

class CommentCreate(BaseModel):
    postId: int
    content: str
    password: str 