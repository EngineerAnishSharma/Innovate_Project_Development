
import os
from dotenv import load_dotenv
from agno.agent import Agent
from agno.models.groq import Groq
from agno.tools.duckduckgo import DuckDuckGoTools

import pytesseract
from PIL import Image
import pandas as pd

# Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Load environment variables
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

# Agent setup
agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile", api_key=groq_api_key),
    description="You're an expert in fake news detection. Analyze the text extracted from an image and tell whether it's real or fake news.",
    tools=[DuckDuckGoTools()],
    markdown=False,
    show_tool_calls=True
)

# --- Utility Methods ---
def load_dataset(csv_path: str) -> pd.DataFrame:
    return pd.read_csv(csv_path)

def get_credibility_score(domain: str, df: pd.DataFrame) -> float:
    row = df[df["Domain"].str.lower() == domain.lower()]
    return float(row["Score"].values[0]) if not row.empty else 0.1

# --- Main Analysis ---
def analyze_news_from_image(image_path: str, domain: str = None, csv_path: str = "iffy_news.csv") -> dict:
    """
    Analyze news by extracting text from an image and verifying credibility using domain score.

    Args:
        image_path: Path to the image
        domain: (Optional) News domain name (e.g., 'cnn.com')
        csv_path: Path to CSV containing credibility scores

    Returns:
        Dictionary with analysis result
    """
    try:
        # 1. Extract text
        extracted_text = pytesseract.image_to_string(Image.open(image_path))
        extracted_text = extracted_text.strip()

        if not extracted_text:
            return {
                "input": None,
                "label": "Unclear",
                "credibility_score": None,
                "explanation": "No readable text found in the image."
            }

        # 2. Credibility Check
        credibility_score = None
        if domain:
            df = load_dataset(csv_path)
            credibility_score = get_credibility_score(domain, df)

        # 3. Agent analysis
        prompt = (
            f"Analyze the following content and determine if it's fake news:\n\n"
            f"{extracted_text}\n\n"
            "Respond in this format:\n"
            "Label: [Fake/Real/Unclear]\nExplanation: ..."
        )

        response = agent.run(prompt)
        content = response.content.strip()

        # 4. Parse response
        lines = content.split("\n", 1)
        label_line = lines[0].replace("Label:", "").strip()
        explanation_line = lines[1].replace("Explanation:", "").strip() if len(lines) > 1 else ""

        # 5. Adjust based on credibility
        if domain and label_line.lower() == "real" and credibility_score is not None and credibility_score < 0.2:
            label_line = "Unclear"
            explanation_line += f"\n⚠️ The domain '{domain}' has a low credibility score ({credibility_score})."

        return {
            "input": extracted_text,
            "label": label_line,
            "credibility_score": credibility_score,
            "explanation": explanation_line
        }

    except Exception as e:
        return {
            "input": None,
            "label": "Error",
            "credibility_score": None,
            "explanation": str(e)
        }


