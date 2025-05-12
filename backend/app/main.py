from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
from services.service_text import check_fake_news, analyze_news_with_agent
from services.service_image import analyze_news_from_image
from PIL import Image
import shutil
import os
 
app = FastAPI(title="Fake News Detection API")

# Create uploads directory if not exists
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.post("/check-text")
async def check_text_news(news: str = Form(...)):
    """
    Check if the news text is real or fake.
    """
    try:
        result = analyze_news_with_agent(news)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})



from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from newspaper import Article
from serpapi import GoogleSearch
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")
SERP_API_KEY = "99867c1cf003bd78125ac94a58d374d533bb759131a5f08be5fd4a9f10d6c8dd"

TRUSTED_DOMAINS = ["bbc.com", "reuters.com", "indiatoday.in", "cnn.com", "ndtv.com", "thehindu.com", "timesofindia.indiatimes.com"]

class LinkInput(BaseModel):
    url: str

@app.post("/check-link")
async def check_news_link(link: LinkInput):
    # Step 1: Extract content from article
    try:
        article = Article(link.url)
        article.download()
        article.parse()
        query = article.title
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse article: {str(e)}")

    if not query:
        raise HTTPException(status_code=400, detail="Article has no title to analyze.")

    # Step 2: Search on Google using SerpAPI
    try:
        search = GoogleSearch({
            "q": query,
            "api_key": SERP_API_KEY,
            "num": 10,
        })
        results = search.get_dict()
        organic = results.get("organic_results", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail="Search failed: " + str(e))

    if not organic:
        return {"verdict": "Fake", "reason": "No results found"}

    # Step 3: Embedding and comparison
    input_embed = model.encode(query, convert_to_tensor=True)
    high_sim_count = 0
    trusted_hit = False

    for item in organic:
        title = item.get("title", "")
        snippet = item.get("snippet", "")
        url = item.get("link", "")
        combined = f"{title}. {snippet}"

        result_embed = model.encode(combined, convert_to_tensor=True)
        sim_score = util.pytorch_cos_sim(input_embed, result_embed).item()

        if sim_score >= 0.7:
            high_sim_count += 1

        for domain in TRUSTED_DOMAINS:
            if domain in url:
                trusted_hit = True

    # Step 4: Decision logic
    if high_sim_count >= 2 and trusted_hit:
        verdict = "Real"
    # elif high_sim_count >= 1:
    #     verdict = "Possibly Real"
    else:
        verdict = "Fake"

    return {
        "title": query,
        "verdict": verdict,
        "similar_results": high_sim_count,
        "trusted_source_found": trusted_hit
    }

@app.post("/check-query")
async def check_query_news(query: str = Form(...)):
    
    if not query:
        raise HTTPException(status_code=400, detail="Article has no title to analyze.")

    # Step 2: Search on Google using SerpAPI
    try:
        search = GoogleSearch({
            "q": query,
            "api_key": SERP_API_KEY,
            "num": 10,
        })
        results = search.get_dict()
        organic = results.get("organic_results", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail="Search failed: " + str(e))

    if not organic:
        return {"verdict": "Fake", "reason": "No results found"}

    # Step 3: Embedding and comparison
    input_embed = model.encode(query, convert_to_tensor=True)
    high_sim_count = 0
    trusted_hit = False

    for item in organic:
        title = item.get("title", "")
        snippet = item.get("snippet", "")
        url = item.get("link", "")
        combined = f"{title}. {snippet}"

        result_embed = model.encode(combined, convert_to_tensor=True)
        sim_score = util.pytorch_cos_sim(input_embed, result_embed).item()

        if sim_score >= 0.7:
            high_sim_count += 1

        for domain in TRUSTED_DOMAINS:
            if domain in url:
                trusted_hit = True

    # Step 4: Decision logic
    if high_sim_count >= 2 and trusted_hit:
        verdict = "Real"
    # elif high_sim_count >= 1:
    #     verdict = "Possibly Real"
    else:
        verdict = "Fake"

    return {
        "title": query,
        "verdict": verdict,
        "similar_results": high_sim_count,
        "trusted_source_found": trusted_hit
    }



# @app.post("/analyze/image/")
# async def analyze_image_news(file: UploadFile = File(...)):
#     """
#     Analyze image (with news text) to check if it's fake, real or unclear.
#     """
#     try:
#         # Save uploaded file to uploads directory
#         file_path = os.path.join(UPLOAD_FOLDER, file.filename)
#         with open(file_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)

#         # Call the analyzer
#         result = analyze_news_from_image(file_path)
#         return JSONResponse(content=result)

#     except Exception as e:
#         return JSONResponse(status_code=500, content={"error": str(e)})



if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)