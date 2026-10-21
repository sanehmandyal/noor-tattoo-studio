import urllib.request
import re

url = "https://www.google.com/search?kgmid=/g/11y3p5lshz&q=Noor+Tattooz+Studio"
req = urllib.request.Request(
    url,
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
    }
)
try:
    resp = urllib.request.urlopen(req, timeout=15)
    content = resp.read().decode('utf-8', errors='ignore')
    with open("google_data.html", "w", encoding="utf-8") as f:
        f.write(content)
    print("Downloaded google_data.html successfully. Size:", len(content))
except Exception as e:
    print("Error:", e)
