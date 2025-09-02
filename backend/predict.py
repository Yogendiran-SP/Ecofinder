# backend/predict.py

import os
import json
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
import cv2
from ultralytics import YOLO

# -------------------------
# Load Label Map
# -------------------------
LABELS_PATH = "model_training/labels.json"
if not os.path.exists(LABELS_PATH):
    raise FileNotFoundError(f"❌ labels.json not found at {LABELS_PATH}")

with open(LABELS_PATH, "r") as f:
    label_map = json.load(f)
label_map = {int(k): v for k, v in label_map.items()}

# -------------------------
# Device Setup
# -------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# -------------------------
# Load YOLOv8 Model
# -------------------------
YOLO_PATH = "yolov8m.pt"
if not os.path.exists(YOLO_PATH):
    raise FileNotFoundError(f"❌ YOLO model not found at {YOLO_PATH}")

yolo_model = YOLO(YOLO_PATH)

# -------------------------
# Load Waste Classifier
# -------------------------
def load_classifier():
    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    num_features = model.fc.in_features
    model.fc = nn.Linear(num_features, len(label_map))

    CLASSIFIER_PATH = "model_training/waste_classifier.pt"
    if not os.path.exists(CLASSIFIER_PATH):
        raise FileNotFoundError(f"❌ Waste classifier weights not found at {CLASSIFIER_PATH}")

    model.load_state_dict(torch.load(CLASSIFIER_PATH, map_location=device))
    model.to(device)
    model.eval()
    return model

classifier_model = load_classifier()

# -------------------------
# Transform for Classifier
# -------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# -------------------------
# Predict a Single Crop
# -------------------------
def predict_crop(crop):
    image = crop.convert("RGB")
    img_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = classifier_model(img_tensor)
        probs = torch.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probs, 1)

    return {
        "class": label_map[predicted.item()],
        "confidence": float(confidence.item())
    }

# -------------------------
# Predict Function
# -------------------------
def predict_image(image_path):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"❌ Image not found at {image_path}")

    results = yolo_model(image_path)
    image = Image.open(image_path).convert("RGB")
    image_np = np.array(image)
    predictions = []

    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            # Ensure bounding box is valid
            if x2 <= x1 or y2 <= y1:
                continue

            crop = image_np[y1:y2, x1:x2]
            if crop.size == 0:
                continue

            # Convert crop to PIL
            pil_crop = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))

            # Classify crop
            pred = predict_crop(pil_crop)
            predictions.append({
                "bbox": [x1, y1, x2, y2],
                "prediction": pred["class"],
                "confidence": pred["confidence"]
            })

    if not predictions:
        return [{"prediction": "no object detected", "confidence": 0.0}]

    return predictions
