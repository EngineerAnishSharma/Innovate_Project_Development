# utils/utils_csv.py

import pandas as pd
import os

def load_dataset(csv_path: str) -> pd.DataFrame:
    """Load the dataset from the CSV file."""
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"{csv_path} not found.")
    return pd.read_csv(csv_path)

def get_domain_info(domain: str, df: pd.DataFrame) -> dict:
    """
    Get all known information for a given domain.
    Returns a dictionary with the row or an empty dict if not found.
    """
    row = df[df["Domain"].str.lower() == domain.lower()]
    if not row.empty:
        return row.iloc[0].to_dict()
    return {}

def get_credibility_score(domain: str, df: pd.DataFrame) -> float:
    """
    Retrieve the
    credibility score for a given domain from the dataset.
    Returns a score or 0.0 if not found.
    """
    row = df[df["Domain"].str.lower() == domain.lower()]
    if not row.empty:
        return float(row.iloc[0].get("Score", 0.0))
    return 0.0

