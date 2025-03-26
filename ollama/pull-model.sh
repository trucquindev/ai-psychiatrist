#!/bin/sh


./bin/ollama serve &

pid=$!

sleep 5


echo "Pulling qwen2.5-coder model"
ollama pull qwen2.5-coder:0.5b


wait $pid