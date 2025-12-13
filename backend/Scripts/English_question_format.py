import pandas as pd
import re

input_file = 'SOUTH.xlsx'  
output_file = 'SOUTH_final_output.xlsx' 

def clean_data(file_path):
    try:
        df = pd.read_excel(file_path)
    except FileNotFoundError:
        print(f"الملف {file_path} غير موجود، تأكد من الاسم والمكان.")
        return

    df['Question_Type'] = df['Question_Type'].fillna('')
    df['Answer'] = df['Answer'].fillna('')
    df['Choices'] = df['Choices'].fillna('')

    def process_row(row):
        q_type = row['Question_Type']
        answer = str(row['Answer']).strip()
        choices = str(row['Choices']).strip()

        new_answer = answer
        answer_letters = "-"
        new_choices = choices

        if choices != '-' and choices != '':
            new_choices = re.sub(r'\b([A-Z])\.', r'\1-', choices)

        if q_type == 'open_ended':
            pass 

        elif q_type == 'single_choice':
            match = re.match(r'^\s*([A-Z])[\.\-]\s*(.*)', answer)
            if match:
                answer_letters = match.group(1)
                new_answer = match.group(2)
            
        elif q_type == 'multi_choice':
            pattern = r'([A-Z])[\.\-]\s*(.*?)(?=\s+[A-Z][\.\-]|$)'
            matches = re.findall(pattern, answer, re.DOTALL)
            
            if matches:
                letters_list = [m[0] for m in matches]
                answer_letters = "[" + ", ".join(letters_list) + "]" 
                
                text_list = [m[1].strip() for m in matches]
                new_answer = "[" + ", ".join(text_list) + "]"

        return pd.Series([new_answer, answer_letters, new_choices])

    df[['Answer', 'Answer_Letters', 'Choices']] = df.apply(process_row, axis=1)

    df.to_excel(output_file, index=False)

if __name__ == "__main__":
    clean_data(input_file)