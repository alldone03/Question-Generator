import json
from pathlib import Path

def improve_dataset(input_file, output_file):
    """Memperbaiki format dataset untuk training yang lebih baik"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    improved_data = []
    
    for line in lines:
        data = json.loads(line)
        input_text = data["input"]
        output_text = data["output"]
        
        # Ekstrak konteks dari input
        if "Buat soal pilihan ganda dari konteks berikut:" in input_text:
            context = input_text.replace("Buat soal pilihan ganda dari konteks berikut:", "").strip()
        else:
            context = input_text
        
        # Format input yang lebih baik
        improved_input = f"Buat soal pilihan ganda tentang: {context}"
        
        # Format output yang lebih baik (hilangkan repetisi)
        if output_text.startswith("Buat soal pilihan ganda:"):
            improved_output = output_text.replace("Buat soal pilihan ganda:\n", "Soal: ").strip()
        else:
            improved_output = output_text
        
        improved_data.append({
            "input": improved_input,
            "output": improved_output
        })
    
    # Simpan dataset yang diperbaiki
    with open(output_file, 'w', encoding='utf-8') as f:
        for item in improved_data:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')
    
    print(f"✅ Dataset improved! {len(improved_data)} entries saved to {output_file}")

# Jalankan perbaikan dataset
input_file = r"E:\Project Ai 2\dataset_improved.jsonl" 
output_file = r"E:\Project Ai 2\dataset_fixed.jsonl"

improve_dataset(input_file, output_file)