import urllib.request
from bs4 import BeautifulSoup
import json
import re

url = 'https://www.justdial.com/Una/Noor-Tattooz-Near-Sabji-Mandi-Prem-Nagar/9999PX197-X197-240108152541-M4W2_BZDET'
req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
)
html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
soup = BeautifulSoup(html, 'html.parser')

print("Page Title:", soup.title.string if soup.title else "")

# Look for reviews or feedback in json-ld or tags
scripts = soup.find_all('script', type='application/ld+json')
for s in scripts:
    try:
        data = json.loads(s.string)
        print("JSON-LD type:", data.get('@type'))
        if 'review' in data:
            print("Found reviews in JSON-LD:", len(data['review']))
            print(json.dumps(data['review'][:5], indent=2))
        if 'aggregateRating' in data:
            print("Aggregate Rating:", data['aggregateRating'])
        if 'image' in data:
            print("JSON-LD Images:", data['image'])
    except:
        pass

# Look for images on page
imgs = []
for tag in soup.find_all('img'):
    src = tag.get('data-src') or tag.get('src') or ''
    if src and ('content' in src or 'jdmagicbox' in src or 'upload' in src or 'justdial' in src):
        imgs.append(src)

print(f"\nFound {len(imgs)} candidate image URLs:")
for img_url in set(imgs):
    print("IMG:", img_url)

# Save text snippets with reviews
text = soup.get_text(separator="\n")
lines = [l.strip() for l in text.split("\n") if l.strip()]
print("\nSample lines:")
for l in lines:
    if any(w in l.lower() for w in ['tattoo', 'rating', 'review', 'amb road', 'prem nagar', 'sabji mandi']):
        if len(l) > 15:
            print("TEXT:", l)
