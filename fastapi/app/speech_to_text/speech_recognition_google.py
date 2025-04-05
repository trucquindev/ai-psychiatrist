import speech_recognition as sr

def speech_to_text() -> str:
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Nói gì đó...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
    try:
        text = recognizer.recognize_google(audio, language="vi-VN")
        print("Bạn đã nói: " + text)
        return text
    except sr.UnknownValueError:
        print("Không nhận diện được giọng nói.")
    except sr.RequestError:
        print("Lỗi kết nối đến dịch vụ nhận diện giọng nói.")