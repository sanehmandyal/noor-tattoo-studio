import urllib.request
import re
import json

url = 'https://www.justdial.com/Una/Noor-Tattooz-Near-Sabji-Mandi-Prem-Nagar/9999PX197-X197-240108152541-M4W2_BZDET'
req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
    }
)
try:
    h = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', h)
    if m:
        data = json.loads(m.group(1))
        with open('jd_next_data.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print("Success! Saved jd_next_data.json. Keys:", list(data.keys()))
    else:
        print("No __NEXT_DATA__ tag found. HTML length:", len(h))
        with open('jd_raw.html', 'w', encoding='utf-8') as f:
            f.write(h)
except Exception as e:
    print("Error:", e)
