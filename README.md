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


## 📥 Setup & Execution Guide

### 1. Backend (FastAPI + ML Model)

**Prerequisites:**
- Python 3.9+ installed  
- `requirements.txt`  
- Your ML model code in `main.py` (or equivalent)

**Steps to run the backend:**  
````markdown

python -m venv venv
````
# Windows
````markdown

venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
````

# macOS/Linux
````markdown

# source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
````

> By default the API runs at `http://localhost:8000`
> Explore Swagger UI at `http://localhost:8000/docs`

---

### 2. Frontend (React / Next.js + Tailwind CSS)

**Prerequisites:**

* Node.js & npm installed
* React/Next.js scaffold in `/frontend/`

**Steps to run the frontend:**

```bash
cd frontend
npm install
npm run dev
```

> Open your browser at `http://localhost:3000`

---

### 3. Workflow

1. User opens the React app at `http://localhost:3000`
2. Uploads a plant image
3. Frontend POSTs to `http://localhost:8000/identify`
4. Backend returns `{ plant, confidence }`
5. Frontend GETs `/info/{plant}` and displays care tips

Now you’re ready to run Plantly end-to-end! 🌱
