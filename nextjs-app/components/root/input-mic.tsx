'use client';
import { API_URL } from '@/lib/actions/const';
import { Mic } from 'lucide-react';
import { useRef, useState } from 'react';
export default function MicPopup() {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startVisualizer = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);
    analyserRef.current = analyser;
    audioContextRef.current = audioContext;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      if (!ctx || !canvas) return;
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const radius = Math.min(100, volume); // tránh quá to

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#4CAF50';
      ctx.fill();

      animationIdRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const stopVisualizer = () => {
    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm',
      });
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice.webm');

      const res = await fetch(`${API_URL}/speech-to-text`, {
        body: formData,
        method: 'POST',
      });

      const data = await res.json();
      setText(data.text || 'Không nhận diện được');
    };
    mediaRecorder.start();
    startVisualizer(stream);
  };
  console.log('🚀 ~ MicPopup ~ text:', text);
  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream
      .getTracks()
      .forEach((track) => track.stop());
    stopVisualizer();
  };

  return (
    <div className="text-center">
      <Mic
        className="hover:text-red-600"
        size={26}
        onClick={isRecording ? stopRecording : startRecording}
      >
        🎤
      </Mic>

      {isRecording && (
        <div className="mt-4 p-4 bg-blue-300 rounded-lg shadow-lg inline-block">
          <canvas ref={canvasRef} width={200} height={200}></canvas>
          <p className="mt-2">Đang nghe...</p>
        </div>
      )}
    </div>
  );
}
