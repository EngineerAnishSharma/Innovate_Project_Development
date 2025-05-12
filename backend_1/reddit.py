import praw
import json
from datetime import datetime

# Initialize Reddit API (Replace with your credentials)
reddit = praw.Reddit(
    client_id="Lez2V0Vm2VcZUSxeziWC4w",
    client_secret="DY14qK_nufPo0sdxUA_faB5T6rWGmQ",
    user_agent="Anish"
)

# Select subreddit
subreddit = reddit.subreddit("Python")

# Fetch top posts of the month
posts = subreddit.top("month")

# Prepare data for JSON conversion
data = {
    "subreddit": {
        "display_name": subreddit.display_name,
        "title": subreddit.title
    },
    "posts": []
}

for i, post in enumerate(posts):
    post_entry = {
        "id": str(i),
        "account": {
            "username": "RedditUser",
            "acct": "RedditUser@reddit.com",
            "display_name": "Reddit Post",
            "avatar": "https://www.redditstatic.com/avatars/default.png",
            "url": post.url
        },
        "content": f"<p>{post.title}</p><p>{post.selftext}</p><p>Original post: <a href=\"{post.url}\" target=\"_blank\">View on Reddit</a></p>",
        "created_at": datetime.utcnow().isoformat() + "Z",
        "url": post.url,
        "visibility": "public",
        "media_attachments": [],
        "tags": []
    }
    data["posts"].append(post_entry)

# Save JSON file
json_filename = "reddit.json"
with open(json_filename, "w", encoding="utf-8") as json_file:
    json.dump(data, json_file, indent=4)

print("Reddit data successfully saved as", json_filename)
