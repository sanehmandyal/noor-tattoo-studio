from bs4 import BeautifulSoup
import json
import re

with open("jd_profile.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

print("Title:", soup.title.string if soup.title else "")

# Check JSON-LD
for s in soup.find_all("script", type="application/ld+json"):
    try:
        data = json.loads(s.string)
        if isinstance(data, list):
            data_items = data
        else:
            data_items = [data]
        for item in data_items:
            print("\nJSON-LD Type:", item.get("@type"))
            if "name" in item:
                print("Name:", item.get("name"))
            if "address" in item:
                print("Address:", item.get("address"))
            if "telephone" in item:
                print("Telephone:", item.get("telephone"))
            if "aggregateRating" in item:
                print("AggregateRating:", item.get("aggregateRating"))
            if "review" in item:
                print(f"Reviews count: {len(item['review'])}")
                with open("reviews_found.json", "w", encoding="utf-8") as rf:
                    json.dump(item["review"], rf, indent=2)
                for r in item["review"][:10]:
                    print("- Author:", r.get("author", {}).get("name"), "| Rating:", r.get("reviewRating", {}).get("ratingValue"))
                    print("  Text:", r.get("reviewBody") or r.get("description") or r.get("name"))
            if "image" in item:
                print("Images:", item.get("image"))
    except Exception as e:
        print("JSON err:", e)

# Find all photos / images on the page
image_urls = []
for tag in soup.find_all(["img", "a", "source"]):
    for attr in ["src", "data-src", "data-original", "href"]:
        val = tag.get(attr) or ""
        if any(ext in val.lower() for ext in [".jpg", ".jpeg", ".png", ".webp"]) and ("jdmagicbox" in val or "content" in val or "justdial" in val):
            image_urls.append(val)

print(f"\nUnique tattoo/studio image URLs found: {len(set(image_urls))}")
with open("images_found.txt", "w", encoding="utf-8") as imf:
    for u in sorted(set(image_urls)):
        imf.write(u + "\n")
        print("IMG:", u)
