import json

# Load the JSON data
file_path = 'master_output_final.json'
with open(file_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Define the topics and corresponding programs in the order they should be updated
update_points = [
    ("Standardantworten MCS", "General Master in Munich"),
    ("Standardantworten MiM", "Master in Consumer Science"),
    ("Standardantworten MMT", "Master in Management in Munich")
]

# Initialize current program as the last one (default for entries beyond last keyword)
current_program = "Master in Management and Technology"

# Iterate backwards through the data to update the 'program' field correctly
for entry in reversed(data):
    # Check if the current entry's topic matches any of the specified update points
    for topic, program in update_points:
        if entry['topic'] == topic:
            current_program = program
            break
    # Update the 'program' field of the entry
    entry['program'] = current_program

# Save the corrected data into a new JSON file
corrected_file_path = 'corrected_master_programs.json'
with open(corrected_file_path, 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=2)
