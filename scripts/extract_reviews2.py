from bs4 import BeautifulSoup
import re

with open("jd_profile.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

raw_text = soup.get_text(separator="\n")
lines = [l.strip() for l in raw_text.split("\n") if l.strip()]
print(f"Total lines: {len(lines)}")
for i, l in enumerate(lines):
    if any(k in l.lower() for k in ["star", "rating", "review", "sabji mandi", "una", "prem nagar", "tattooz", "experience", "clean"]):
        print(f"Line [{i}]:", l)
