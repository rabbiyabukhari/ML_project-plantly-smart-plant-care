````markdown
## 📥 Plantly Project - Setup & Execution Guide

### 1. Backend (FastAPI + ML Model)

**Prerequisites:**
- Python 3.9+ installed  
- `requirements.txt`  
- Your ML model code in `main.py` (or equivalent)

**Steps to run the backend:**  

python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
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
