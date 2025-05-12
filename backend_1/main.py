import requests
import time
import json
import re
from flask import Flask, request, jsonify
from urllib.parse import urlparse
from bs4 import BeautifulSoup  
from fakedomain import fakeDomains  
from flask_cors import CORS


app = Flask(__name__)
CORS(app) 

MASTODON_INSTANCE_URL = 'https://mastodon.social'
ACCESS_TOKEN = 'tQ3x_EHs80n8FJVSlem6vKew5tEAfXSbOxLpc0ghpJg'
HEADERS = {
    'Authorization': f'Bearer {ACCESS_TOKEN}'
}


def fetch_public_posts(max_posts=50, limit=5000):
    """Fetch posts for a given tag (keyword) from Mastodon's tag timeline."""
    # print(f"Fetching posts with keyword: {keyword}")
    posts = []
    url = f'{MASTODON_INSTANCE_URL}/api/v1/timelines/public'
    while len(posts) < max_posts:
        response = requests.get(url, headers=HEADERS, params={'limit': limit})
        if response.status_code == 200:
            data = response.json()
            if not data:
                break
            for post in data:
                posts.append(post['id'])
                if len(posts) >= max_posts:
                    break
            next_url = response.links.get('next', {}).get('url')
            if next_url:
                url = next_url
            else:
                break
        else:
            print(f"Error fetching posts: {response.status_code}")
            break
    return posts

def fetch_posts_with_tag(keyword, max_posts=50, limit=5000):
    """Fetch posts for a given tag (keyword) from Mastodon's tag timeline."""
    print(f"Fetching posts with keyword: {keyword}")
    posts = []
    url = f'{MASTODON_INSTANCE_URL}/api/v1/timelines/tag/{keyword}'
    while len(posts) < max_posts:
        response = requests.get(url, headers=HEADERS, params={'limit': limit})
        if response.status_code == 200:
            data = response.json()
            if not data:
                break
            for post in data:
                posts.append(post['id'])
                if len(posts) >= max_posts:
                    break
            next_url = response.links.get('next', {}).get('url')
            if next_url:
                url = next_url
            else:
                break
        else:
            print(f"Error fetching posts: {response.status_code}")
            break
    return posts

def fetch_post_details(post_ids):
    """Retrieve detailed information for each post."""
    print("Fetching post details...")
    all_posts = []
    for post_id in post_ids:
        url = f"{MASTODON_INSTANCE_URL}/api/v1/statuses/{post_id}"
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            post_data = response.json()
            formatted_post = {
                "id": post_data["id"],
                "account": {
                    "username": post_data["account"]["username"],
                    "acct": post_data["account"]["acct"],
                    "display_name": post_data["account"]["display_name"],
                    "avatar": post_data["account"]["avatar"],
                    "url": post_data["account"]["url"]
                },
                "content": post_data["content"],
                "created_at": post_data["created_at"],
                "url": post_data["url"],
                "visibility": post_data["visibility"],
                "media_attachments": [
                    {
                        "type": media["type"],
                        "url": media["url"],
                        "preview_url": media.get("preview_url", ""),
                        "description": media.get("description", "")
                    }
                    for media in post_data.get("media_attachments", [])
                ],
                "tags": [tag["name"] for tag in post_data.get("tags", [])]
            }
            all_posts.append(formatted_post)
        elif response.status_code == 429:  # Rate limit
            print("Rate limited. Waiting for 60 seconds...")
            time.sleep(60)
    return all_posts

def detect_fake_domains(post_content):
    """
    Parse the HTML post content to extract URLs,
    get their domains, and return a list of fake domain keywords detected.
    """
    found_fakes = []
    soup = BeautifulSoup(post_content, 'html.parser')
    # Iterate over all <a> tags with href attributes
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        parsed = urlparse(href)
        domain = parsed.netloc  # This gives the domain part
        if domain:
            # Check if any fake domain is a substring of this domain
            for fake in fakeDomains:
                if fake.lower() in domain.lower() and fake not in found_fakes:
                    found_fakes.append(fake)
    return found_fakes

@app.route('/search', methods=['POST'])
def search_mastodon():
    """
    POST endpoint to search Mastodon posts by keyword,
    detect fake domain keywords in the post content,
    and return only posts with fake domains, adding a 'fake' field.
    """
    data = request.get_json()
    keyword = data.get("keyword", "").strip()
    if not keyword:
        return jsonify({"error": "Keyword is required"}), 400

    # Fetch posts by tag using the provided keyword
    post_ids = fetch_posts_with_tag(keyword)
    posts = fetch_post_details(post_ids)

    # Check each post for fake domain URLs and add a 'fake' field if found
    result_posts = []
    for post in posts:
        fake_hits = detect_fake_domains(post.get("content", ""))
        if fake_hits:
            post["fake"] = fake_hits  # Add array of detected fake domains
            result_posts.append(post)

    return jsonify(result_posts)


@app.route('/get', methods=['GET'])
def checker():
    
    # Fetch posts by tag using the provided keyword
    post_ids = fetch_public_posts()
    posts = fetch_post_details(post_ids)

    result_posts = []
    for post in posts:
        fake_hits = detect_fake_domains(post.get("content", ""))
        if fake_hits:
            post["fake"] = fake_hits 
            result_posts.append(post)

    return jsonify(result_posts)

if __name__ == "__main__":
    # When running directly, start the Flask app.
    app.run(debug=True)
