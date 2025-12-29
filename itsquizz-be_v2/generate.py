from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
import faiss, requests, json
import os

# === 1. Tentukan folder tempat file PDF disimpan ===
folder_path = r"C:\Users\LENOVO\OneDrive\Desktop\questionGenerator\Adaptive Ai\Model Ai\Dataset dan Modul"

# === 2. Baca semua file PDF dalam folder ===
all_text = ""
for file_name in os.listdir(folder_path):
    if file_name.lower().endswith(".pdf"):
        pdf_path = os.path.join(folder_path, file_name)
        print(f"Membaca: {file_name}")

        reader = PdfReader(pdf_path)
        for page in reader.pages:
            all_text += page.extract_text()

# === 3. Pecah teks jadi potongan kecil ===
def split_text(text, chunk_size=500):
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

chunks = split_text(all_text)

# === 4. Tampilkan hasil potongan ===
print(f"Total potongan teks: {len(chunks)}")
print(chunks)  # tampilkan 3 potongan pertama

# === 3. Buat embedding + index FAISS ===
model_emb = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model_emb.encode(chunks)
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(embeddings)

# === 4. Fungsi RAG Query ===
def rag_query(query):
    q_emb = model_emb.encode([query])
    D, I = index.search(q_emb, k=3)
    context = "\n".join([chunks[i] for i in I[0]])

    prompt = f"Gunakan konteks berikut untuk menjawab pertanyaan:\n{context}\n\nPertanyaan: {query}"

    data = {"model": "llama3", "prompt": prompt}
    r = requests.post("http://localhost:11434/api/generate", json=data, stream=True)
    answer = ""
    for line in r.iter_lines():
        if line:
            obj = json.loads(line.decode())
            if "response" in obj:
                answer += obj["response"]
    return answer

# === 5. Tes ===
print(rag_query("dari dokumen ini buatlah 10 pertanyaan pilihan ganda dalam bahasa indonesia, buat dalam bentuk JSON"))