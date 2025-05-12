# combined_analyzer.py

import os
from dotenv import load_dotenv
from agno.agent import Agent
from agno.models.groq import Groq

# Load environment variables and API key
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

# Initialize agent
agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile", api_key=groq_api_key),
    description="You're a fake news detection expert. Analyze input and classify it as Fake or Real.",
    markdown=False
)

# Core Analysis Function
def analyze_news_with_agent(text: str) -> dict:
    """
    Analyze news text to classify it as Fake or Real.

    Args:
        text: The text content to analyze

    Returns:
        Dictionary with input, label, explanation
    """
    try:
        # Prompt the agent (Unclear is removed)
        prompt = (
            f"Analyze the following news content and determine if it's fake or real:\n\n"
            f"{text}\n\n"
            f"Respond in this format:\n"
            f"Label: [Fake/Real]\nExplanation: ..."
        )
        response = agent.run(prompt)
        content = response.content.strip()

        # Parse agent response
        lines = content.split("\n", 1)
        label_line = lines[0].replace("Label:", "").strip().capitalize()
        explanation_line = lines[1].replace("Explanation:", "").strip() if len(lines) > 1 else ""

        # Enforce only Fake or Real (default to Fake if uncertain)
        if label_line not in ["Fake", "Real"]:
            label_line = "Fake"
            explanation_line += "\n⚠️ Defaulted to 'Fake' due to ambiguous response."

        return {
            "input": text,
            "label": label_line,
            # "explanation": explanation_line
        }

    except Exception as e:
        return {
            "input": text,
            "label": "Error",
            "explanation": str(e)
        }


from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from fastapi.responses import JSONResponse
from serpapi import GoogleSearch

model = SentenceTransformer('all-MiniLM-L6-v2')

# Your SerpAPI Key
SERP_API_KEY = "99867c1cf003bd78125ac94a58d374d533bb759131a5f08be5fd4a9f10d6c8dd"

class NewsInput(BaseModel):
    text: str

def check_fake_news(news: NewsInput):
    query = news.text
    search = GoogleSearch({
        "engine": "google",
        "q": query,
        "api_key": SERP_API_KEY
    })

    results = search.get_dict()
    organic_results = results.get("organic_results", [])

    if not organic_results:
        return {"verdict": "Unverifiable", "reason": "No search results found."}

    headlines = [res["title"] for res in organic_results]
    similarities = [util.cos_sim(model.encode(query), model.encode(h)).item() for h in headlines]
    avg_score = sum(similarities) / len(similarities)

    if avg_score > 0.6:
        verdict = "True"
    elif avg_score > 0.3:
        verdict = "Possibly Fake"
    else:
        verdict = "Fake or Unverifiable"

    return {
        "verdict": verdict,
        "average_similarity": round(avg_score, 3),
        "top_results": headlines[:3]
    }
