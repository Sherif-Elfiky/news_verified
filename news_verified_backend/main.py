from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from transformers import pipeline
import requests
from bs4 import BeautifulSoup
import os





# Init FastAPI app
app = FastAPI()


# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],  # Next.js frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema
class VerifyRequest(BaseModel):
    url: str

class ArticleRequest(BaseModel):
    url: str = None
    content: str

# Load summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
classifier = pipeline("zero-shot-classification", model = "facebook/bart-large-mnli")

@app.get("/")
def root():
    return {"message": "News Verified backend is running!"}

@app.post("/verify")
def verify_news(request: VerifyRequest):
    # 1. Fetch article text
    try:
        res = requests.get(request.url, timeout=5)
        soup = BeautifulSoup(res.text, "html.parser")
        paragraphs = " ".join([p.get_text() for p in soup.find_all("p")])
    except Exception as e:
        return {"error": f"Failed to fetch article: {str(e)}"}

    if not paragraphs:
        return {"error": "No readable text found in article."}

    # 2. Summarize
    try:
        summary = summarizer(paragraphs[:2000], max_length=120, min_length=40, do_sample=False)
        return {
            "original_url": request.url,
            "summary": summary[0]["summary_text"]
        }
    except Exception as e:
        return {"error": f"Summarization failed: {str(e)}"}


@app.post("/classify")
def classify(article: ArticleRequest):
    labels = ["biased", "neutral", "propaganda", "satire"]
    result = classifier(article.content, candidate_labels=labels)
    return {
        "label": result["labels"][0],       # top label
        "scores": dict(zip(result["labels"], result["scores"]))
    }





