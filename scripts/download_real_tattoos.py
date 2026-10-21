import urllib.request
import os

os.makedirs("client/public/tattoos/noor-una", exist_ok=True)

urls = [
    "https://content.jdmagicbox.com/v2/comp/una-himachal-pradesh/g9/9999p1975.1975.240426123327.w7g9/catalogue/noor-tattooz-prem-nagar-una-himachal-pradesh-tattoo-artists-qcain2i0ka.jpg",
    "https://content.jdmagicbox.com/v2/comp/una-himachal-pradesh/g9/9999p1975.1975.240426123327.w7g9/catalogue/noor-tattooz-prem-nagar-una-himachal-pradesh-tattoo-artists-1qqi52mp5o.jpg",
    "https://content.jdmagicbox.com/v2/comp/una-himachal-pradesh/g9/9999p1975.1975.240426123327.w7g9/catalogue/noor-tattooz-prem-nagar-una-himachal-pradesh-tattoo-artists-5oncry7tg8.jpg",
    "https://content.jdmagicbox.com/v2/comp/una-himachal-pradesh/g9/9999p1975.1975.240426123327.w7g9/catalogue/noor-tattooz-prem-nagar-una-himachal-pradesh-tattoo-artists-a05i92r2mv.jpg",
    "https://content.jdmagicbox.com/v2/comp/una-himachal-pradesh/g9/9999p1975.1975.240426123327.w7g9/catalogue/noor-tattooz-prem-nagar-una-himachal-pradesh-tattoo-artists-dz97lmyaqe.jpg",
    "https://content.jdmagicbox.com/v2/comp/una-himachal-pradesh/g9/9999p1975.1975.240426123327.w7g9/catalogue/noor-tattooz-prem-nagar-una-himachal-pradesh-tattoo-artists-qcain2i0ka-250.jpg?w=640&q=75"
]

for i, u in enumerate(urls):
    filename = f"client/public/tattoos/noor-una/original-tattoo-{i+1}.jpg"
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=10).read()
        with open(filename, 'wb') as f:
            f.write(data)
        print(f"Downloaded {filename}: {len(data)} bytes from {u}")
    except Exception as e:
        print(f"Failed {u}: {e}")
