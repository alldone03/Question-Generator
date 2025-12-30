import requests



url = f"https://a2cb7f714c83.ngrok-free.app/generate"

resp = requests.post(url, json={"prompt": "halo", "model": "llama3:latest"})
print(resp.content)
print(resp.status_code)
