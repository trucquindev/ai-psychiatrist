import os
import uuid
from pydub import AudioSegment
import speech_recognition as sr
from fastapi import UploadFile, File
from fastapi.responses import JSONResponse

async def speech_to_text(file: UploadFile = File(...)):
    temp_id = str(uuid.uuid4())
    input_path = f"temp_{temp_id}.webm"
    output_path = f"temp_{temp_id}.wav"

    try:
        # Bước 1: Nhận dữ liệu file
        file_data = await file.read()

        # Bước 2: Lưu file webm
        with open(input_path, "wb") as f:
            f.write(file_data)

        # Bước 3: Chuyển từ webm → wav
        audio = AudioSegment.from_file(input_path)
        audio.export(output_path, format="wav")

        # Bước 4: Dùng speech_recognition để chuyển thành text
        recognizer = sr.Recognizer()
        with sr.AudioFile(output_path) as source:
            audio_data = recognizer.record(source)

        text = recognizer.recognize_google(audio_data, language="vi-VN")
        return {"text": text}

    except sr.UnknownValueError:
        return JSONResponse(content={"text": ""}, status_code=200)
    except sr.RequestError as e:
        return JSONResponse(content={"error": "Google API error", "details": str(e)}, status_code=500)
    except Exception as e:
        return JSONResponse(content={"error": "Xử lý thất bại", "details": str(e)}, status_code=500)
    finally:
        # Cleanup file tạm
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(output_path):
            os.remove(output_path)
