#CreateAnArtNite.py
import json
import uuid
from datetime import datetime, timedelta
from urllib.parse import urlparse, parse_qs


        
# Function to extract SpotifyPlaylistId from the SpotifyCollaborateLink
def extract_spotify_playlist_id(collaborate_link):
    parsed_url = urlparse(collaborate_link)
    path_segments = parsed_url.path.split('/')
    playlist_id_index = path_segments.index('playlist') + 1 if 'playlist' in path_segments else -1
    return path_segments[playlist_id_index] if playlist_id_index != -1 else None

def add_new_artnite_event(input_file_path, output_file_path, spotify_collaborate_link, title):
    with open(input_file_path, 'r') as file:
        json_data = json.load(file)
    # Check if the SpotifyCollaborateLink already exists in the JSON data
    for event in json_data['artNite']:
        if event['SpotifyCollaborateLink'] == spotify_collaborate_link:
            return "Please update data/spotifylink.txt with a new playlist."

    spotify_playlist_id = extract_spotify_playlist_id(spotify_collaborate_link)
    last_event = json_data['artNite'][-1]
    last_event_date = datetime.strptime(last_event['Date'], '%Y-%m-%dT%H:%M:%SZ')
    new_event_date = last_event_date + timedelta(days=7)
    new_event_number = int(last_event['EventNumber']) + 1

    new_event = {
        "UUIDEvent": str(uuid.uuid4()),
        "EventNumber": str(new_event_number),
        "Date": new_event_date.strftime('%Y-%m-%dT%H:%M:%SZ'),
        "Title": f"Art Nite #{new_event_number} {new_event_date.strftime('%y%m%d')}",
        "SpotifyCollaborateLink": spotify_collaborate_link,
        "SpotifyPlaylistId": spotify_playlist_id
    }

    json_data['artNite'].append(new_event)
    return json_data

# File paths
input_file_path = 'data/artNite.json'
output_file_path = 'data/artNite.json'
spotify_link_file = 'data/spotifylink.txt'

# Read the existing JSON data
with open(input_file_path, 'r') as file:
    json_data = json.load(file)

# Read SpotifyCollaborateLink from the file
with open(spotify_link_file, 'r') as file:
    spotify_collaborate_link = file.read().strip()

# Check if the link already exists and update the JSON data with a new event
result = add_new_artnite_event(json_data, spotify_collaborate_link)

if isinstance(result, str):
    print(result)
else:
    # Write the updated JSON data to the file
    with open(output_file_path, 'w') as file:
        json.dump(result, file, indent=4)