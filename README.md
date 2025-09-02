# ♻️ Ecofinder – Smart Waste Classification & Recycling Assistant

Ecofinder is an AI-powered waste classification system that helps users identify household waste types (plastic, glass, paper, cardboard, metal, trash, etc.) from images and find nearby recycling centers.  
It combines **Computer Vision (YOLOv8 + ResNet50)**, a **FastAPI backend**, and a **React (Vite) frontend**, with **Firebase** for user/shopkeeper data storage.

---

## 🌍 Problem Statement
Urban households struggle with improper waste segregation, leading to:
- Inefficient recycling
- High landfill dependency
- Environmental pollution  

Ecofinder aims to solve this by providing an **easy-to-use mobile/web app** that:
1. **Classifies waste in real-time** using AI.
2. **Suggests nearby recycling centers** where users can deposit waste.
3. **Incentivizes recycling** by rewarding users and helping shopkeepers earn value from waste.

---

## 🛠️ Tech Stack
- **Frontend:** React (Vite + Tailwind + shadcn/ui)
- **Backend:** FastAPI (Python)
- **AI Models:** 
  - YOLOv8 → Object detection (detects waste items in image)
  - ResNet50 → Waste type classification
- **Database:** Firebase (Users, Shopkeepers, Recycling Centers)
- **Deployment:** GitHub + FastAPI (local/cloud)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Yogendiran-SP/Ecofinder.git
cd Ecofinder
