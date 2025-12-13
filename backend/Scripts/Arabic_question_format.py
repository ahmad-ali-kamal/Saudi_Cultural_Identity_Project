import pandas as pd
import re
import os

INPUT = "Words.xlsx"
OUTPUT = "Words_final_output.xlsx"

def extract_options(text):
    pattern = r'([أ-د])\)\s*(.*?)(?=(?:[أ-د]\)|الإجابة|الجواب|$))'
    matches = list(re.finditer(pattern, text, flags=re.S))

    options = []
    for m in matches:
        letter = m.group(1)
        opt_text = m.group(2).strip()
        opt_text = "\n".join([ln.strip() for ln in opt_text.splitlines() if ln.strip()])
        options.append((letter, opt_text))

    choices_lines = "\n".join([f"{l}) {t}" for l, t in options])
    return options, choices_lines


def extract_answer_letter(text):
    text = text.replace(")", "").replace("(", "").strip()

    patterns = [
        r"(?:الإجابة|الاجابة|الجواب)\s*(?:الصحيحة|النهائية)?[:：]?\s*([أ-د])\b",
        r"الإجابة[:：]?\s*([أ-د])\b",
        r"الجواب[:：]?\s*([أ-د])\b",
        r"\b([أ-د])$"
    ]

    for pat in patterns:
        m = re.search(pat, text)
        if m:
            return m.group(1)
    return ""


def extract_question_block(text):

    m1 = re.search(r"(المهمة.*?)(?=السؤال)", text, re.S)
    mission = m1.group(1).strip() if m1 else ""

    m2 = re.search(r"(السؤال.*?)(?:الخيارات|أ\)|$)", text, re.S)
    question = m2.group(1).strip() if m2 else ""

    return (mission + "\n" + question).strip()


if not os.path.exists(INPUT):
    print(f"❌ الملف '{INPUT}' غير موجود في المجلد: {os.getcwd()}")
else:
    df = pd.read_excel(INPUT)

    col_q = []
    col_choices = []
    col_ans_letter = []
    col_ans_text = []

    for cell in df["Question"]:
        if pd.isna(cell):
            col_q.append("")
            col_choices.append("")
            col_ans_letter.append("")
            col_ans_text.append("")
            continue

        text = str(cell)

        question_block = extract_question_block(text)

        opt_raw = re.search(r"(?:الخيارات[:：]?)?\s*([أ-د]\).*?)(?:الإجابة|الجواب|$)", text, re.S)
        opt_raw_text = opt_raw.group(1).strip() if opt_raw else ""

        options_list, choices_lines = extract_options(opt_raw_text)

        ans_letter = extract_answer_letter(text)

        ans_text = ""
        if ans_letter:
            for letter, t in options_list:
                if letter == ans_letter:
                    ans_text = t
                    break

        col_q.append(question_block)
        col_choices.append(choices_lines)
        col_ans_letter.append(ans_letter)
        col_ans_text.append(ans_text)

    df["Question_Final"] = col_q
    df["Choices"] = col_choices
    df["Answer_Letter"] = col_ans_letter
    df["Answer_Text"] = col_ans_text

    df.to_excel(OUTPUT, index=False)
    print("Done: ", OUTPUT)
