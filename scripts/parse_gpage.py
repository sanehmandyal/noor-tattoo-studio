from bs4 import BeautifulSoup
import re
import json

with open("google_data.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

print("Title:", soup.title.string if soup.title else "No title")

# Look for text with rating, reviews, address
text = soup.get_text(separator="\n")
lines = [l.strip() for l in text.split("\n") if l.strip()]

keywords = ["star", "rating", "review", "sabji mandi", "una", "prem nagar", "tattooz", "8219811181", "noor"]
for i, line in enumerate(lines):
    if any(k in line.lower() for k in keywords):
        context = " | ".join(lines[max(0, i-2):min(len(lines), i+3)])
        print(f"[{i}] {line}")

# Find images
imgs = [img.get('src') or img.get('data-src') for img in soup.find_all('img')]
valid_imgs = [i for i in imgs if i and ('google' in i or 'ggpht' in i or 'http' in i)]
print("\nFound images count:", len(valid_imgs))
for img in valid_imgs[:10]:
    print("IMG:", img[:120])
