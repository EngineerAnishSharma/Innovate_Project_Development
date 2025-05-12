import json
import re

# Load fake domains from fakedomain.py
from fakedomain import fakeDomains

# Load all posts from JSON file
with open("all_posts.json", "r", encoding="utf-8") as f:
    all_posts = json.load(f)

def find_fake_domains(post_content):
    """Return a list of fake domains found in the post content using a full-match regex."""
    found = []
    for domain in fakeDomains:
        # This pattern requires that after the domain comes either a dot or a slash or the end of the string.
        pattern = rf"https?://(?:www\.)?{re.escape(domain)}(?=[./]|$)"
        if re.search(pattern, post_content, re.IGNORECASE):
            found.append(domain)
    return found

# Iterate through posts and check for fake domains, then print results
for post in all_posts:
    fake_domains_found = find_fake_domains(post.get("content", ""))
    if fake_domains_found:
        print(f"Post ID: {post['id']} - Fake domains found: {fake_domains_found}")
