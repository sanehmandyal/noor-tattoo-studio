from bs4 import BeautifulSoup
import re
import json

with open("jd_profile.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

reviews = []

# Search for review cards or text
# Justdial reviews typically have classes like 'review_text', 'jsx-...', 'star_rate', or user names
for r_div in soup.find_all(lambda tag: tag.name in ['div', 'li'] and any(c in str(tag.get('class')) for c in ['review', 'feedback', 'comment', 'rating', 'testimonial'])):
    text = r_div.get_text(separator=" ").strip()
    if len(text) > 20 and len(text) < 500:
        reviews.append(text)

print(f"Candidate review divs: {len(reviews)}")
for r in set(reviews)[:15]:
    print("---", r)

# Also search for individual user names and review texts in raw text
raw_text = soup.get_text(separator="\n")
lines = [l.strip() for l in raw_text.split("\n") if l.strip()]
for i, l in enumerate(lines):
    if any(k in l.lower() for k in ["excellent", "superb", "best tattoo", "satisfied", "clean", "finishing", "perfect", "good experience"]):
        print(f"Line [{i}]:", " // ".join(lines[max(0, i-2):min(len(lines), i+3)]))
