# backend/main.py

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import predict_image
import shutil
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS setup for frontend dev server (adjust URL if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/predict")
async def classify_waste(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    ext = file.filename.split(".")[-1]
    temp_filename = f"{uuid.uuid4()}.{ext}"
    temp_path = os.path.join(UPLOAD_DIR, temp_filename)

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Call your model
    predictions = predict_image(temp_path)

    # Clean up
    os.remove(temp_path)

    return {"predictions": predictions}
