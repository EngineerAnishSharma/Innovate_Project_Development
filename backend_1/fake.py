import json

# Load the JSON file
with open("fakesites.json", "r", encoding="utf-8") as file:  # No leading "/"
    data = json.load(file)

# Extract initial domain names
fakeDomains = [entry["Domain"].split('.')[0] for entry in data]

# Save to a new Python file
with open("fakedomain.py", "w", encoding="utf-8") as file:
    file.write("fakeDomains = " + str(fakeDomains))
