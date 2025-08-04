# api/predict.py

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import json
import os
from ultralytics import YOLO
import cv2
from PIL import Image
import numpy as np

# Load label map
with open("utils/label_map.json", "r") as f:
    label_map = json.load(f)
label_map = {int(k): v for k,v in label_map.items()}

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load YOLOv5 model
yolo_model = YOLO("yolov8m.pt")

# Load model
def load_classifier():
    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    num_features = model.fc.in_features
    model.fc = nn.Linear(num_features, len(label_map))
    model.load_state_dict(torch.load("model_training/waste_classifier.pth", map_location=device))
    model.to(device)
    model.eval()
    return model

classifier_model = load_classifier()

# Image transform for classifier
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# 🧠 Function to predict class for one cropped object
def predict_crop(crop):
    image = crop.convert("RGB")
    img_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = classifier_model(img_tensor)
        _, predicted = torch.max(outputs, 1)
    return label_map[predicted.item()]

# Predict function
def predict_image(image_path):
    results = yolo_model(image_path)
    image = Image.open(image_path).convert("RGB")
    predictions=[]

    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            # Crop detected object from image
            image_np = np.array(image)
            crop = image_np[y1:y2, x1:x2]
            if crop.size == 0:
                continue
            pil_crop = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))

            # Classify the cropped object
            pred_class = predict_crop(pil_crop)
            predictions.append({
                "bbox": [x1, y1, x2, y2],
                "prediction": pred_class
            })

    return predictions if predictions else [{"prediction":"no object detected"}]