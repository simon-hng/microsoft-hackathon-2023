import pandas as pd
import json

program_abbr_to_name = {
    "MiM Muc": "Master in Management in Munich",
    "BMT HN": "Bachelor in Management & Technology in Heilbronn",
    "Allgemein Master Muc": "General Master in Munich",
    "MMT": "Master in Management & Technology",
    "FIM": "Master in Finance & Information Management",
    "MiM HN": "Master in Management in Heilbronn",
    "BMT Muc": "Bachelor in Management & Technology in Munich",
    "MCS": "Master in Consumer Science",
}

emails_df = pd.read_csv("/Users/pauldelseith/Documents/microsoft-hackathon-2023/Data/questions_answers_real_mails.csv", encoding="utf-8", sep=",")

emails_list = []
# iterate over every line of the dataframe and create a dictionary with the following structure: {question, answer, topic }
for index, row in emails_df.iterrows():
    email_dict = {}
    email_dict["question"] = row["question"]
    email_dict["answer"] = row["answer"]
    email_dict["topic"] = row["txtfile"].split("/")[1] # get the topic from the txtfile path
    email_dict["topic"] = email_dict["topic"].split(".")[0] # remove .txt
    email_dict["program"] = program_abbr_to_name[row["txtfile"].split("/")[0]] # get the program from the txtfile path
    emails_list.append(email_dict)
with open("emails_list.json", 'w', encoding="utf-8") as json_file:
    json.dump(emails_list, json_file, ensure_ascii=False)
