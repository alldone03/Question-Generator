# create_better_dataset.py
import json
from datasets import load_dataset

def create_simple_dataset():
    # Load original dataset
    dataset = load_dataset("json", data_files={"train": r"E:\Project Ai 2\dataset.jsonl"})
    train_data = dataset["train"]
    
    simple_data = []
    
    for item in train_data:
        original_input = item["input"]
        original_output = item["output"]
        
        # Extract context only (remove "Context:" and "Instruction:")
        if "Context:" in original_input:
            context = original_input.split("Context: ")[1].split("Instruction:")[0].strip()
        else:
            context = original_input
        
        # Extract just the QUESTION from output (remove options/answers for simplicity)
        if "Pertanyaan:" in original_output:
            question = original_output.split("Pertanyaan: ")[1].split("\nA.")[0].strip()
        else:
            question = original_output.split("\n")[0].strip()
        
        # Create SIMPLE input-output pairs
        simple_data.append({
            "input": f"buat pertanyaan: {context}",
            "output": question
        })
        
        # Also create variation with full output
        simple_data.append({
            "input": f"buat soal pilihan ganda: {context}",
            "output": original_output
        })
    
    # Save simple dataset
    output_file = r"E:\Project Ai 2\dataset_simple.jsonl"
    with open(output_file, 'w', encoding='utf-8') as f:
        for item in simple_data:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')
    
    print(f"✅ Simple dataset saved to {output_file}")
    print(f"Total samples: {len(simple_data)}")
    
    # Show samples
    print("\n=== SAMPLE FORMAT ===")
    for i in range(min(3, len(simple_data))):
        print(f"\nSample {i+1}:")
        print(f"Input: {simple_data[i]['input']}")
        print(f"Output: {simple_data[i]['output']}")
        print(f"Different: {simple_data[i]['input'] != simple_data[i]['output']}")
    
    return output_file

if __name__ == "__main__":
    create_simple_dataset()