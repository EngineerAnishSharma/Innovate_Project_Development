from pydantic import BaseModel
from typing import Optional


# 📄 TEXT ANALYSIS
class TextInput(BaseModel):
    content: str

class TextOutput(BaseModel):
    input: str
    result: str
    confidence: Optional[float] = None  # Optional confidence score


# 🖼️ IMAGE ANALYSIS
class ImageOutput(BaseModel):
    filename: str
    content_type: str
    llm_analysis: str
    confidence: Optional[float] = None
