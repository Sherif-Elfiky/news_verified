from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from transformers import pipeline
from diffusers import StableDiffusionPipeline
import torch
import requests
from bs4 import BeautifulSoup
import os





# Init FastAPI app
app = FastAPI()

# Initialize FLUX pipeline lazily (only when needed)
pipe = None

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

@app.post("/pic")
def pic(article: ArticleRequest):
    global pipe
    if not article.content:
        return {"error": "No content provided for image generation."}
    
    # Load Stable Diffusion model only when needed
    if pipe is None:
        try:
            pipe = StableDiffusionPipeline.from_pretrained(
                "runwayml/stable-diffusion-v1-5", 
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
            )
            if torch.cuda.is_available():
                pipe = pipe.to("cuda")
            else:
                pipe.enable_attention_slicing()  # Reduce memory usage on CPU
        except Exception as e:
            return {"error": f"Failed to load Stable Diffusion model: {str(e)}"}
    
    prompt = article.content
    try:
        # Generate image with Stable Diffusion (optimized for speed)
        image = pipe(
            prompt,
            height=512,
            width=512,
            guidance_scale=7.5,
            num_inference_steps=10,  # Reduced from 20 to 10 for faster generation
            generator=torch.Generator().manual_seed(42)
        ).images[0]
        image.save("generated-image.png")
        return {"message": "Image generated successfully", "filename": "generated-image.png"}
    except Exception as e:
        return {"error": f"Image generation failed: {str(e)}"}

@app.get("/image")
def get_image():
    """Serve the generated image"""
    image_path = "generated-image.png"
    if os.path.exists(image_path):
        return FileResponse(image_path, media_type="image/png")
    else:
        return {"error": "No image found. Generate an image first."}




