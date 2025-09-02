# backend/main.py

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from predict import predict_image
import shutil
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Ecofinder Waste Classifier API")

# -------------------------
# CORS setup for frontend dev server (adjust as needed)
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # React Vite dev
        "http://127.0.0.1:5173",
        "*"                        # (Optional) allow all for hackathon/demo
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Upload Directory
# -------------------------
UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# -------------------------
# Health Check
# -------------------------
@app.get("/")
async def root():
    return {"message": "✅ Ecofinder Waste Classifier API is running!"}

# -------------------------
# Prediction Endpoint
# -------------------------
@app.post("/predict")
async def classify_waste(file: UploadFile = File(...)):
    try:
        # Validate file type
        ext = file.filename.split(".")[-1].lower()
        if ext not in ["jpg", "jpeg", "png"]:
            raise HTTPException(status_code=400, detail="Only JPG/PNG images are supported")

        # Save uploaded file temporarily
        temp_filename = f"{uuid.uuid4()}.{ext}"
        temp_path = os.path.join(UPLOAD_DIR, temp_filename)

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run prediction
        predictions = predict_image(temp_path)

        # Cleanup
        os.remove(temp_path)

        return {
            "status": "success",
            "file": file.filename,
            "predictions": predictions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
