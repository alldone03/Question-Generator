# train_merak_mcq.py
import logging
from pathlib import Path
import torch
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    Trainer,
    TrainingArguments,
    DataCollatorForLanguageModeling
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 🔹 Sesuaikan path dataset dan output model
TRAIN_FILE = r"E:\Project Ai 2\dataset_improved.jsonl"
OUTPUT_DIR = r"E:\Project Ai 2\merak_mcq_model"
MODEL_NAME = "Ichsan2895/Merak-7B-v4"  # contoh model Merak 7B

def main():
    if not Path(TRAIN_FILE).exists():
        logger.error(f"Dataset not found: {TRAIN_FILE}")
        return

    device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info(f"Using device: {device}")

    # 🔹 Load tokenizer dan model Merak
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
    model.to(device)

    # 🔹 Load dataset
    dataset = load_dataset("json", data_files={"train": TRAIN_FILE})
    train_data = dataset["train"]
    logger.info(f"Dataset size: {len(train_data)}")

    # 🔹 Preprocessing: gabungkan input dan output
    def preprocess_function(examples):
        texts = [f"{ex['input']}\n{ex['output']}" for ex in examples]
        tokenized = tokenizer(
            texts,
            truncation=True,
            max_length=512,
            padding="max_length"
        )
        return tokenized

    tokenized_dataset = train_data.map(
        preprocess_function, batched=True, remove_columns=train_data.column_names
    )

    # 🔹 Data collator
    data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

    # 🔹 Training arguments
    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        overwrite_output_dir=True,
        per_device_train_batch_size=1,  # kecil karena Merak 7B besar
        gradient_accumulation_steps=4,  # untuk simulasikan batch lebih besar
        learning_rate=2e-5,
        num_train_epochs=3,
        save_steps=200,
        save_total_limit=2,
        logging_steps=20,
        fp16=True,  # gunakan jika GPU mendukung
        report_to=None
    )

    # 🔹 Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
        tokenizer=tokenizer,
        data_collator=data_collator
    )

    logger.info("Starting training on Merak model...")
    trainer.train()

    # 🔹 Simpan model & tokenizer
    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    logger.info("✅ Training completed successfully!")

if __name__ == "__main__":
    main()
