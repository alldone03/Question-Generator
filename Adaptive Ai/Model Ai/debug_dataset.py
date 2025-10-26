# debug_dataset.py - PERBAIKAN
from datasets import load_dataset

def debug_dataset_structure():
    try:
        # Load dataset
        dataset = load_dataset("json", data_files={"train": r"E:\Project Ai 2\dataset_improved.jsonl"})
        train_data = dataset["train"]
        
        print("=== DATASET STRUCTURE DEBUG ===")
        print(f"Dataset type: {type(dataset)}")
        print(f"Train data type: {type(train_data)}")
        print(f"Number of samples: {len(train_data)}")
        print(f"Features: {train_data.features}")
        
        # Check first 3 items - FIXED ACCESS METHOD
        for i in range(min(3, len(train_data))):
            print(f"\n--- Item {i} ---")
            item = train_data[i]
            print(f"Type: {type(item)}")
            
            # CORRECT WAY TO ACCESS - menggunakan indexing numerical
            if hasattr(train_data, 'features') and 'input' in train_data.features:
                input_text = train_data[i]['input']  # Akses seperti ini
                output_text = train_data[i]['output']
                print(f"Input: {input_text}")
                print(f"Output: {output_text}")
            else:
                print(f"Content: {item}")
                
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

def simple_verification():
    """Simple verification that works"""
    try:
        dataset = load_dataset("json", data_files={"train": r"E:\Project Ai 2\dataset_improved.jsonl"})
        train_data = dataset["train"]
        
        print("\n=== SIMPLE VERIFICATION ===")
        print(f"Total samples: {len(train_data)}")
        
        # Check first 5 samples - CORRECT ACCESS
        for i in range(min(5, len(train_data))):
            print(f"\nSample {i+1}:")
            # AKSES YANG BENAR:
            input_text = train_data[i]['input']
            output_text = train_data[i]['output']
            
            print(f"Input: {input_text[:50]}...")
            print(f"Output: {output_text[:50]}...")
            
            # Check answer
            if "Jawaban:" in output_text:
                print("✅ Punya jawaban")
            else:
                print("❌ Tidak ada jawaban")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_dataset_structure()
    simple_verification()