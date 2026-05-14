from socket import socket
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()


app = FastAPI()
client = OpenAI(api_key=os.getenv("API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.post("/chat")
async def chat(request: Request):
    try:
        data: dict = await request.json()
        messages = data.get("messages", [])
        
        # Si no hay mensajes de sistema, agregamos uno por defecto
        if not any(msg.get("role") == "system" for msg in messages):
            messages.insert(0, {"role": "system", "content": "Eres un asistente de inteligencia artificial"})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        print(response.choices[0].message.content)
        return {"response": response.choices[0].message.content}

    except Exception as e: 
        return {"error": str(e)}

