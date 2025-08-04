import os
import torch
import torch.nn as nn
import numpy as np
import torch.optim as optim
import json
from tqdm import tqdm
from torchvision.models import resnet50, ResNet50_Weights
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from torch.utils.data import Subset

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using Device:",device)

# Define Transform
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485,0.456,0.406],
                         std=[0.229,0.224,0.225])
])

# Load Dataset
data_dir = "../data/Garbage classification/train"
dataset = datasets.ImageFolder(root=data_dir, transform=transform)
dataLoader = DataLoader(dataset, batch_size=32, shuffle=True)

indices = list(range(len(dataset)))
train_idx, val_idx = train_test_split(indices, test_size = 0.2, stratify=[label for _, label in dataset.imgs])
train_dataset = Subset(dataset, train_idx)
val_dataset = Subset(dataset, val_idx)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

# Save label map
label_map = {i: cls_name for i, cls_name in enumerate(dataset.classes)}
os.makedirs("../utils", exist_ok=True)
with open("../utils/label_map.json","w") as f:
    json.dump(label_map, f)
print("Saved label_map.json:", label_map)

# Compute class weights
labels = [label for _, label in dataset.imgs]
class_weights = compute_class_weight(
    class_weight="balanced",
    classes=np.unique(labels),
    y=labels
)
class_weights_tensor = torch.tensor(class_weights, dtype=torch.float).to(device)

# Load ResNet18
weights = ResNet50_Weights.DEFAULT
model = resnet50(weights=weights)
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, len(dataset.classes))
model = model.to(device)

# Loss and Optimizer
criterion = nn.CrossEntropyLoss(weight=class_weights_tensor)
optimizer = optim.Adam(model.parameters(), lr=0.0001)

EPOCHS = 10
# Training loop
for epoch in range(EPOCHS):
    model.train()
    running_loss = 0.0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss+=loss.item()
    print(f"Epoch {epoch+1}/{EPOCHS}, Train Loss: {running_loss/len(dataLoader):.4f}")

    # Validation
    model.eval()
    all_preds = []
    all_labels = []
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, preds = torch.max(outputs, 1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    cm = confusion_matrix(all_labels, all_preds)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=dataset.classes)
    fig, ax = plt.subplots(figsize=(8, 6))
    disp.plot(cmap='Blues', xticks_rotation=45, ax=ax)
    ax.set_title(f"Confusion Matrix - Epoch {epoch+1}")
    plt.tight_layout()
    plt.savefig(f"conf_matrix_epoch{epoch+1}.png")
    plt.close()


# Saving the model
torch.save(model.state_dict(), "waste_classifier.pth")
print("Model saved to waste_classifier.pth")