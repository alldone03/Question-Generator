from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
from flask import Flask, jsonify,request
import faiss, requests, json, os
from flask_cors import CORS

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
            text = page.extract_text()
            if text:
                all_text += text

# === 3. Pecah teks jadi potongan kecil ===
def split_text(text, chunk_size=500):
    # Hapus semua karakter newline
    text = text.replace('\n', ' ')
    # Potong jadi beberapa bagian
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

chunks = split_text(all_text)
print(f"Total potongan teks: {len(chunks)}")

print(chunks)

# === 4. Buat embedding + index FAISS ===
print("Membuat embedding dan index FAISS...")
model_emb = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model_emb.encode(chunks)
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(embeddings)
print("Index FAISS selesai dibuat.")

# === 5. Fungsi RAG Query ===
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

# === 6. Buat Server Flask ===
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

@app.route("/generatesoal", methods=["GET"])
def generate_soal():
    # Ambil parameter dari URL
    context = request.args.get("context", "")
    count = request.args.get("count", "10")  # default 10 kalau tidak dikirim

    print(f"Menerima permintaan generate soal untuk konteks: {context}, jumlah: {count}")

    # Susun prompt dinamis berdasarkan parameter
    query = (
        f"Dari konteks berikut: '{context}', buat {count} pertanyaan pilihan ganda "
        f"dalam bahasa Indonesia dengan format JSON seperti "
        f'[{{"question": "pertanyaan?", '
        f'"options": ["", "", "", ""], '
        f'"answer": "A"}}]. '
        f"Jangan tambahkan teks lain, hanya keluarkan array JSON saja tanpa penjelasan."
    )

    # Kirim ke model RAG / AI kamu
    answer = rag_query(query)
  # 1. Bersihkan escape character dan newline
    clean_text = (
        answer.encode('utf-8')
        .decode('unicode_escape')  # hilangkan \n, \t, dll
        .replace('\\"', '"')       # perbaiki kutip ganda
        .replace('\\', '')         # hilangkan sisa backslash
        .strip()
    )

    # 2. Pastikan tidak ada kutip ekstra di awal/akhir
    if clean_text.startswith('"') and clean_text.endswith('"'):
        clean_text = clean_text[1:-1]

    # 3. Parsing hasil AI ke JSON
    try:
        response_json = json.loads(clean_text)
        print("✅ Parsed JSON:", response_json)

        # Jika hasil masih berupa string JSON di dalam dict
        if isinstance(response_json, dict) and "response_text" in response_json:
            try:
                inner_json = json.loads(response_json["response_text"])
                return jsonify(inner_json)
            except json.JSONDecodeError:
                return jsonify(response_json)

        return jsonify(response_json)

    except json.JSONDecodeError:
        print("❌ Gagal parsing JSON, kirim raw text:", clean_text[:200])
        return jsonify({"response_text": clean_text})
    


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)