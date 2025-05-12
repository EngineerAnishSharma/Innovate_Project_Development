import requests

def is_query_true(query):
    api_key = "AIzaSyDh46o_OSOxGGsI4iJ9glIynm9y-POSRGk"
    cse_id = "27d6f3abcb1a74f96"
    url = "https://www.googleapis.com/customsearch/v1"
    
    params = {
        "key": api_key,
        "cx": cse_id,
        "q": query,
    }

    response = requests.get(url, params=params)
    results = response.json()
    return results


print(is_query_true("Is the sky blue?"))


