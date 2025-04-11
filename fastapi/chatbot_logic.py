import json
from pymongo import MongoClient
from langchain_core.prompts import PromptTemplate
from langchain_community.llms import Ollama
from langchain_core.output_parsers import StrOutputParser
import os
from dotenv import load_dotenv

load_dotenv()

# Kết nối MongoDB
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client["chatbot_db"]
chat_collection = db["chats"]

# Tải kịch bản câu hỏisdsdj
def load_question_templates():
    with open("question_templates.json", "r", encoding="utf-8") as f:
        return json.load(f)

question_templates = load_question_templates()

# Kết nối Ollama AI
llm = Ollama(base_url="http://localhost:11434", model="qwen2.5-coder:0.5b")

template = PromptTemplate.from_template(
    """
    Dưới đây là cuộc hội thoại của một bệnh nhân với bác sĩ tâm lý:

    {context}
    
    {context_db}
    
    Trả lời câu hỏi sau:
    {question}

    Phản hồi của bác sĩ:
    """
)

llm_chain = (
  template
  | llm
  | StrOutputParser()
)

def handle_chat_normal(user_message,user_id,normal):
    user_message = user_message.lower()
    chat_session_normal= chat_collection.find_one({"user_id": user_id, "normal": True}, sort=[("_id", -1)])
    print("DEBUG chat_session_normal:", chat_session_normal)
    # chat_session_normal = chat_collection.find_one({"user_id": user_id})
    # print("DEBUG result:", chat_session_normal)

    if chat_session_normal:
        answers = chat_session_normal["answers"]
        bot= chat_session_normal["bot"]
        answers.append(user_message)
        # update_data = {"answers": answers, "step": step}
        response = llm_chain.invoke({"context": "", "context_db": "", "question": user_message})
        print("DEBUG response:", response)
        bot.append(response)
        chat_collection.update_one({"_id": chat_session_normal["_id"]}, {"$set": {"answers": answers, "bot": bot}})
        return {"response": response, "normal": normal}
    return {"normal":normal, "response": "Xin lỗi, tôi không hiểu."}
# 🔹 Hàm xử lý khi người dùng nhập tin nhắn ban đầu
def process_message(user_message, user_id):
    user_message = user_message.lower()

    # Kiểm tra xem user có đang trong cuộc hội thoại không
    chat_session = chat_collection.find_one({"user_id": user_id, "completed": False}, sort=[("_id", -1)])

    if chat_session:
        return handle_answer(user_message, user_id)

    # Nếu user bắt đầu một hội thoại mới
    for key in question_templates.keys():
        if key in user_message:
            questions = question_templates[key]

            chat_collection.insert_one({
                "user_id": user_id,
                "user": user_message,
                "bot": "Tôi sẽ hỏi bạn một số câu để hiểu rõ hơn.",
                "context": key,
                "questions": questions,
                "answers": [],
                "step": 0,  # Bắt đầu từ câu hỏi đầu tiên
                "completed": False
            })

            return {"response": questions[0], "context": key}
    
    # Nếu không tìm thấy câu hỏi nào trong templates, gửi đến AI để xử lý
    response = llm_chain.invoke({"context": "", "context_db": "", "question": user_message})
    return {"response": response,"normal": True}
# 🔹 Hàm xử lý câu trả lời của người dùng
def handle_answer(user_message, user_id):
    chat_session = chat_collection.find_one({"user_id": user_id, "completed": False}, sort=[("_id", -1)])
    if chat_session:
        questions = chat_session["questions"]
        answers = chat_session["answers"]
        step = chat_session["step"]

        answers.append(user_message)
        step += 1

        update_data = {"answers": answers, "step": step}

        if step < len(questions):  # Còn câu hỏi tiếp theo
            update_data["completed"] = False
            chat_collection.update_one({"_id": chat_session["_id"]}, {"$set": update_data})
            return {"response": {"response":questions[step]}}

        else:  # Hết câu hỏi, tiến hành phân tích
            update_data["completed"] = True
            chat_collection.update_one({"_id": chat_session["_id"]}, {"$set": update_data})
            analysis = analyze_answers(chat_session["context"], answers)
            return {"response": analysis}

   
    return {"response":{"response":"Xin lỗi, tôi không hiểu."}}

# 🔹 Hàm gửi dữ liệu đến AI để phân tích khi kết thúc câu hỏi
def analyze_answers(context, answers):
    # Tạo prompt gửi đến AI
    prompt = f"Tôi đang tư vấn cho một bệnh nhân về vấn đề {context}. Họ đã trả lời:\n"
    for idx, ans in enumerate(answers):
        prompt += f"Câu {idx+1}: {ans}\n"
    prompt += "Bạn có thể phân tích tình trạng của họ và đưa ra lời khuyên không?"
    # 🔥 Gửi đến AI để phân tích
    analysis = llm_chain.invoke({"context": "Tư vấn tâm lý", "context_db": "", "question": prompt})
    # Trả về format đúng
    return {"response":analysis }
   
