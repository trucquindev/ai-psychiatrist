from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uuid
from chatbot_logic import process_message, handle_answer , handle_chat_normal

app = FastAPI()
# 🛠️ Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Chấp nhận tất cả các domain (có thể thay bằng frontend domain)
    allow_credentials=True,
    allow_methods=["*"],  # Chấp nhận tất cả phương thức HTTP (GET, POST, PUT, DELETE, v.v.)
    allow_headers=["*"],  # Chấp nhận tất cả header
)
# 🎯 Định nghĩa schema cho request
class ChatRequest(BaseModel):
    message: str

class AnswerRequest(BaseModel):
    user_id: str
    message: str
    
class ChatNormalRequest(BaseModel):
    message: str
    user_id: str
    normal: bool

# 📨 API xử lý tin nhắn ban đầu (Tự tạo user_id)
@app.post("/chat")
def chat(request: ChatRequest):
    user_id = str(uuid.uuid4())  # Sinh user_id mới
    response = process_message(request.message, user_id)
    return {"user_id": user_id, "response": response}

# 📨 API xử lý câu trả lời tiếp theo của người dùng
@app.post("/answer")
def answer(request: AnswerRequest):
    return handle_answer(request.message, request.user_id)

@app.post("/chat_normal")
def chat_normal(request: ChatNormalRequest):
    response = handle_chat_normal(request.message, request.user_id, request.normal)
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
