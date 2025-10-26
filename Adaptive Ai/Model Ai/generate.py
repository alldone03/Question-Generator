# generate_improved.py
from transformers import AutoTokenizer, MT5ForConditionalGeneration
import torch
import re

MODEL_PATH = r"E:\Project Ai 2\mt5_mcq_model_fixed5"

# Load model & tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = MT5ForConditionalGeneration.from_pretrained(MODEL_PATH)

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)
print(f"🧠 Using device: {device}")

def clean_generated_text(text):
    """Membersihkan teks hasil generate dari repetisi"""
    # Hapus repetisi berlebihan
    text = re.sub(r'(Jawaban:.*?)(Jawaban:.*?)+', r'\1', text)
    text = re.sub(r'(pilihan ganda.*?)(pilihan ganda.*?)+', 'pilihan ganda', text)
    
    # Hapus token khusus jika ada
    text = text.replace('<extra_id_0>', '').strip()
    
    return text

def generate_question(model, tokenizer, context):
    """Generate pertanyaan MCQ dari konteks teks dengan prompt yang lebih baik."""
    prompt = f"buat soal: {context}"

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=256,
        padding=True
    ).to(device)

    # Parameter generation yang lebih baik
    outputs = model.generate(
        **inputs,
        max_new_tokens=256,  # Increased for complete questions
        num_beams=5,
        do_sample=True,
        top_p=0.92,  # Slightly higher for diversity
        temperature=0.8,  # Slightly higher for creativity
        repetition_penalty=3.0,  # Increased to prevent repetition
        length_penalty=1.2,  # Encourage longer, complete outputs
        early_stopping=True,
        no_repeat_ngram_size=3  # Prevent repeating n-grams
    )

    result = tokenizer.decode(outputs[0], skip_special_tokens=True)
    cleaned_result = clean_generated_text(result)
    return cleaned_result

def main():
    test_contexts = [
        "PLC digunakan untuk mengontrol proses industri secara otomatis menggunakan logika pemrograman.",
        "Energi terbarukan berasal dari sumber yang tidak akan habis seperti matahari dan angin.",
        "Pemeliharaan sarana dan prasarana harus dilakukan secara teratur untuk menjaga fungsinya.",
        "Servis mesin AC baik indoor maupun outdoor dianjurkan dilakukan setiap enam bulan.",
        "Suhu ideal yang dianjurkan di ruang kerja ber-AC berkisar antara 23 hingga 26 derajat Celcius."
    ]

    print("\n🚀 Generating improved questions...\n")
    for i, context in enumerate(test_contexts, 1):
        print("=" * 90)
        print(f"🧩 Context {i}:\n{context}")
        print("-" * 90)
        
        try:
            output = generate_question(model, tokenizer, context)
            print(f"📘 Generated Question:\n{output}")
        except Exception as e:
            print(f"❌ Error generating question: {e}")
            
        print("=" * 90 + "\n")

if __name__ == "__main__":
    main()