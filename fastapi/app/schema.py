from pydantic import BaseModel, Field
from typing import *
class ChatRequest(BaseModel):
    prompt: str = Field(default='Cách code fastapi router')
    
    context: Optional[str] = Field(
        default=""
    )