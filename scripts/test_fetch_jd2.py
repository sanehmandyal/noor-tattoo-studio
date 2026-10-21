import urllib.request
import re

url = "https://www.justdial.com/una-himachal-pradesh/noor-tattooz-prem-nagar/9999P19751975240426123327_W7G9"
req = urllib.request.Request(
    url,
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
)
try:
    html = urllib.request.urlopen(req, timeout=10).read().decode("utf-8", errors="ignore")
    print("Fetched! Length:", len(html))
    with open("jd_profile.html", "w", encoding="utf-8") as f:
        f.write(html)
except Exception as e:
    print("Fetch error:", e)
