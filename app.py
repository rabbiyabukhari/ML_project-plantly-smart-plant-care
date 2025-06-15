from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import requests, base64
from bs4 import BeautifulSoup
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "6Fc2V5HLH6eYIgg8fNux17qJdavggDeDEPj99srUEmqdYYOMfi"

@app.post("/predict")
async def identify_plant(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        encoded_image = base64.b64encode(contents).decode("utf-8")

        # Plant.id API call
        url = "https://api.plant.id/v2/identify"
        headers = {
            "Content-Type": "application/json",
            "Api-Key": API_KEY
        }
        payload = {
            "images": [encoded_image],
            "modifiers": ["crops_fast", "similar_images"],
            "plant_language": "en",
            "plant_details": [
                "common_names", "wiki_description", "url"
            ]
        }
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code != 200:
            return {"error": "Plant.id API failed", "details": response.text}

        data = response.json()
        suggestion = data['suggestions'][0]
        plant_name = suggestion['plant_name']
        wiki_desc = suggestion['plant_details']['wiki_description']['value']

        # Wikipedia scraping
        care_info = extract_care_info(plant_name)

        return {
            "plant_name": plant_name,
            "common_names": suggestion['plant_details'].get('common_names', []),
            "wiki_url": suggestion['plant_details'].get('url', ''),
            "description": wiki_desc,
            "care_tips": care_info
        }
    except Exception as e:
        return {"error": str(e)}

def extract_care_info(plant_name):
    try:
        page_url = f"https://en.wikipedia.org/wiki/{plant_name.replace(' ', '_')}"
        html = requests.get(page_url).text
        soup = BeautifulSoup(html, "html.parser")
        paragraphs = soup.find_all('p')
        text = " ".join([re.sub(r"\[\d+\]", "", p.get_text()) for p in paragraphs])

        care_keywords = [
            "water", "watering", "soil", "light", "sun", "temperature",
            "humidity", "shade", "moist", "drain", "grow", "fertilizer"
        ]
        sentences = [s.strip() for s in text.split(".") if any(k in s.lower() for k in care_keywords)]
        return sentences[:6] if sentences else ["No specific care info found."]
    except Exception as e:
        return [f"Error fetching care info: {e}"]