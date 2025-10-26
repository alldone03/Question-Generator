# check_dataset.py
import json
from datasets import load_dataset

def check_dataset_quality():
    # Check original dataset
    original_file = r"E:\Project Ai 2\dataset.jsonl"
    simple_file = r"E:\Project Ai 2\dataset_simple.jsonl"
    
    print("=== CHECKING ORIGINAL DATASET ===")
    original_data = load_dataset("json", data_files={"train": original_file})["train"]
    
    problematic_count = 0
    for i, item in enumerate(original_data):
        if item['input'] == item['output']:
            print(f"❌ Problematic sample {i}: Input == Output")
            problematic_count += 1
    
    print(f"Total problematic samples: {problematic_count}/{len(original_data)}")
    
    print("\n=== CHECKING SIMPLE DATASET ===")
    try:
        simple_data = load_dataset("json", data_files={"train": simple_file})["train"]
        
        problematic_count = 0
        for i, item in enumerate(simple_data):
            if item['input'] == item['output']:
                print(f"❌ Problematic sample {i}: Input == Output")
                problematic_count += 1
                print(f"  Input: {item['input']}")
                print(f"  Output: {item['output']}")
        
        print(f"Total problematic samples: {problematic_count}/{len(simple_data)}")
        
        # Show good samples
        print("\n=== GOOD SAMPLES ===")
        good_count = 0
        for i, item in enumerate(simple_data):
            if item['input'] != item['output'] and len(item['output']) > 10:
                print(f"✅ Good sample {i}:")
                print(f"  Input: {item['input']}")
                print(f"  Output: {item['output']}")
                good_count += 1
                if good_count >= 3:
                    break
                    
    except Exception as e:
        print(f"Error loading simple dataset: {e}")

if __name__ == "__main__":
    check_dataset_quality()