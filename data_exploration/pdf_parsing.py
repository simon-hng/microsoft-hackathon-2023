import pdfminer.high_level
import re
import json
pdf_path = "/Users/pauldelseith/Documents/microsoft-hackathon-2023/Data/Modulhandbuecher/16_167_2021_Modulehandbook_Master's Program Finance and Information Management__20221118.pdf"
text = pdfminer.high_level.extract_text(pdf_path)
pages = pdfminer.high_level.extract_pages(pdf_path)
page_nr = sum(1 for _ in pages)
pdf_text_split = text.split("Module Description")
pattern = r'\n\n(.*?)\n\n'
pdf_text_dict = {}
for text_chunk in pdf_text_split[1:-1]:
    match = re.search(pattern, text_chunk, re.DOTALL)
    if match:
        pdf_text_dict[match.group(1)] = text_chunk.replace(match.group(1), "")
    else:
        print("Test")
with open("module_descriptions_dict_2.json", 'w') as json_file:
    json.dump(pdf_text_dict, json_file)
categories = ['Module Level:', 'Language:', 'Duration:', 
              'Frequency:', 'Credits:', 'Total Hours:', 
              'Self-study Hours:', 'Contact Hours:', 'Description of Examination Method:',
              'Repeat Examination:', '(Recommended) Prerequisites:', 'Content:', 'Intended Learning Outcomes:', 
              'Teaching and Learning Methods:', 'Media:', 'Reading List:', 'Responsible for Module:', 
              'Courses (Type of course, Weekly hours per semester), Instructor:']
categorized = {}
key = 'WI001287: Basics of FIM | Basics of FIM'
value = pdf_text_dict[key]
chopped_rest = value
temp = chopped_rest.split(category)
chopped_rest = temp[1]
for category in categories:
    temp = chopped_rest.split(category)
    categorized[category] = temp[0]
    if len(temp) > 1:
        chopped_rest = temp[1]
