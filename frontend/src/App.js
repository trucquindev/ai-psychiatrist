import { useState } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]); // Lưu lịch sử chat
  const [input, setInput] = useState(''); // Lưu tin nhắn nhập vào
  const [userId, setUserId] = useState(null); // Lưu user_id của phiên chat
  const [loading, setLoading] = useState(false); // Hiển thị trạng thái "Đang phản hồi..."

  // 📨 Gửi tin nhắn đến chatbot
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages); // Cập nhật giao diện ngay lập tức
    setInput(''); // Xóa ô nhập tin nhắn
    setLoading(true); // Hiển thị trạng thái "Đang phản hồi..."

    try {
      let response;

      if (!userId) {
        // 🆕 Tin nhắn đầu tiên => Gọi API /chat (tạo user_id mới)
        response = await axios.post('http://127.0.0.1:8000/chat', {
          message: input,
        });
        setUserId(response.data.user_id);
      } else {
        // 📌 Tin nhắn tiếp theo => Gọi API /answer
        response = await axios.post('http://127.0.0.1:8000/answer', {
          user_id: userId,
          message: input,
        });
        console.log('🚀 ~ sendMessage ~ response:', response);
      }

      // Cập nhật state với phản hồi từ chatbot
      setMessages([
        ...newMessages,
        { sender: 'bot', text: response.data.response.response },
      ]);
    } catch (error) {
      console.error('❌ Lỗi gửi tin nhắn:', error);
    }

    setLoading(false); // Tắt trạng thái loading
  };

  return (
    <div className="chat-container">
      <h1>Chatbot Tâm Lý</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">Đang phản hồi...</div>}
      </div>
      <div className="input-box">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
}

export default App;
