import docx
import json
import re

def parse_docx(docx_path):
    doc = docx.Document(docx_path)
    emails = []
    current_email = {"language": "", "answer": ""}
    language_detected = False

    for paragraph in doc.paragraphs:
        text = paragraph.text.strip()

        # Detect language markers
        if text == 'EN' or text == 'DE' or text == 'EN:' or text == 'DE:':
            if language_detected:
                emails.append(current_email)
                current_email = {"language": "", "answer": ""}
            current_email["language"] = text
            language_detected = True
        else:
            if language_detected:
                current_email["answer"] += text + '\n'

    # Add the last email if any
    if current_email["language"]:
        emails.append(current_email)

    return emails

# Save json
emails = parse_docx('chatbot_master_answers.docx')

def propagate_single_topic(json_data):
    """
    Propagate a single topic in the JSON data. 
    The topic found after 'Mit freundlichen Grüßen' in a 'DE' email applies from the next email onwards.
    """
    # Variable to hold the current topic
    current_topic = ''

    # Iterate through each email in the JSON data
    for i in range(len(json_data)):
        email = json_data[i]

        # Update the email with the current topic
        email['topic'] = current_topic
        email["program"] = "Master in Management in Heilbronn" #['Bachelor in Management & Technology in Heilbronn', 'Bachelor in Management & Technology in Munich', 'Master in Management in Munich', 'Master in Management in Heilbronn']

        # Check for a new topic in the current email and update it for the next emails
        if (email['language'] == 'DE' or email['language'] == 'DE:') and 'Mit freundlichen Grüßen' in email['answer']:
            # Extract the topic from the content
            content_before, content_after = email['answer'].split('Mit freundlichen Grüßen', 1)
            
            # Update the content to only include the part before 'Mit freundlichen Grüßen' plus the phrase itself
            email['answer'] = content_before + 'Mit freundlichen Grüßen'
            
            # Extract the topic from the content after 'Mit freundlichen Grüßen'
            topic_line = content_after.strip().split('\n')[0].strip()

            # Update the current topic if available
            if topic_line:
                current_topic = topic_line

    return json_data

# Apply the function to propagate a single topic
single_topic_json_data = propagate_single_topic(emails)

# Save the updated JSON data to a new file
single_topic_file_path = 'master_output_final.json'
with open(single_topic_file_path, 'w', encoding='utf-8') as file:
    json.dump(single_topic_json_data, file, ensure_ascii=False, indent=4)