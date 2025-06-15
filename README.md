# Plantly: Smart Plant Care Companion

**Plantly** is a full-stack semester project that lets you:

1. 📸 **Identify** any plant from a photo  
2. 🌱 **Fetch** care instructions & background info from Wikipedia  

All in one smooth, responsive web app.

---

## 📑 Proposal

See the full project proposal—problem statement, goals, methodology, dataset plan, timeline, and team—included here:  
**[`Ml-project-proposal.pdf`](./Ml-project-proposal.pdf)**

---

## 🚀 Features

- **Plant Identification**  
  Uses the Plant .id API to detect your plant species and return name + confidence score.

- **Care & Info Retrieval**  
  Queries Wikipedia REST API for light/water/soil needs, fun facts, and cultivation tips.

- **React Frontend**  
  Drag-and-drop or file-picker upload, mobile-friendly UI built with React.

- **FastAPI Backend**  
  Exposes two endpoints:  
  - **POST** `/identify` — accepts an image, returns `{ plant, confidence }`  
  - **GET**  `/info/{plantName}` — returns care instructions + a Wikipedia URL

---
## 📥 Installation / Setup & Execution Guide

### 1. Backend (FastAPI + ML Model)

**✅ Prerequisites:**
- Python 3.9+ installed  
- `requirements.txt` available in `/backend/`  
- Your ML model code inside `main.py` (or similar)

**🚀 Steps to Run Backend:**
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
