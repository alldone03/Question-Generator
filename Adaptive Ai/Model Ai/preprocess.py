# preprocess.py
import json
import re
from pathlib import Path
import pdfplumber
import docx
from tqdm import tqdm

# Paths (sesuaikan jika perlu)
MODULE_PATH = r"E:\Project Ai 2\Dataset dan Modul\Modul Pelatihan.docx"
DATASET_PDF = r"E:\Project Ai 2\Dataset dan Modul\Dataset.pdf"
OUT_JSONL = Path("E:\Project Ai 2\dataset.jsonl")
CONTEXTS_TXT = Path("E:\Project Ai 2\contexts.txt")

def extract_text_docx(path):
    doc = docx.Document(path)
    paras = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    return "\n\n".join(paras)

def extract_mcq_from_pdf(path):
    # Heuristik sederhana: baca semua teks, pecah baris, cari pola soal dan opsi
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    items = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # detect question line: sering diawali dengan nomor "1." atau "1)"
        m = re.match(r'^(\d+)[\).\s]+(.+)$', line)
        if m:
            q_text = m.group(2).strip()
            i += 1
            opts = []
            # collect next up to 6 lines to find options A/B/C/D
            j=0
            while j<8 and i < len(lines):
                l = lines[i]
                # match opsi: A. text  or A) text  or A text
                optm = re.match(r'^[A-D][\.\)\s-]+\s*(.+)$', l)
                if optm:
                    opts.append(optm.group(1).strip())
                # match jawaban explicit like "Jawaban: B" or "Answer: B"
                j += 1
                i += 1
                # if we've collected 4 options break
                if len(opts) >= 4:
                    break
            # try find answer within next few lines
            ans = None
            for k in range(i, min(i+6, len(lines))):
                am = re.search(r'Jawaban[:\s]*([A-D])', lines[k], re.I)
                if am:
                    ans = am.group(1).upper()
                    break
                am2 = re.search(r'Answer[:\s]*([A-D])', lines[k], re.I)
                if am2:
                    ans = am2.group(1).upper()
                    break
            # fallback: choose A if not found
            if opts and len(opts) >= 2:
                items.append({"question": q_text, "options": opts[:4], "answer": ans if ans else "A"})
        else:
            i += 1
    return items

def build_jsonl_from_pdf_items(items, out_jsonl):
    with out_jsonl.open("w", encoding="utf-8") as f:
        for it in items:
            q = it["question"]
            opts = it["options"]
            out_text = f"Pertanyaan: {q}\n"
            labels = ['A','B','C','D']
            for idx, opt in enumerate(opts):
                out_text += f"{labels[idx]}. {opt}\n"
            out_text += f"Jawaban: {it.get('answer','A')}\nPenjelasan: \n"
            entry = {
                "input": f"Context: {q}\nInstruction: Buat 1 soal pilihan ganda (4 opsi) berdasarkan konteks tersebut.",
                "output": out_text
            }
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    print("Wrote", out_jsonl)

def split_module_into_paragraphs(module_text, out_txt):
    paras = [p.strip() for p in module_text.splitlines() if p.strip()]
    # keep paragraphs longer than, say, 30 chars
    paras = [p for p in paras if len(p) > 30]
    with out_txt.open("w", encoding="utf-8") as f:
        for p in paras:
            f.write(p.replace("\n"," ") + "\n")
    print("Wrote contexts to", out_txt, "count:", len(paras))

def main():
    print("Extracting module docx...")
    mod_text = extract_text_docx(MODULE_PATH)
    split_module_into_paragraphs(mod_text, CONTEXTS_TXT)

    print("Extracting MCQ from PDF (heuristic)...")
    items = extract_mcq_from_pdf(DATASET_PDF)
    print("Found items:", len(items))
    build_jsonl_from_pdf_items(items, OUT_JSONL)
    print("Preprocessing done. Files:", OUT_JSONL, CONTEXTS_TXT)

if __name__ == "__main__":
    main()
