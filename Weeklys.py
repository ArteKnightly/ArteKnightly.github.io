# Weekly.py

import SpawnPlaylist
import CreateAnArtNite

def main():
    # Define Spotify credentials
    client_id = 'YOUR_CLIENT_ID'
    client_secret = 'YOUR_CLIENT_SECRET'
    redirect_uri = 'YOUR_REDIRECT_URI'
    username = 'YOUR_SPOTIFY_USERNAME'

    # Playlist details
    playlist_name = "Art Nite Playlist"
    playlist_description = "A playlist for the upcoming Art Nite event"

    # Create a new playlist and get its ID and link
    playlist_id, playlist_link = SpawnPlaylist.create_playlist(client_id, client_secret, redirect_uri, username, playlist_name, playlist_description)

    # Add a new art nite event using the playlist link
    input_file_path = 'data/artNite.json'
    output_file_path = 'data/artNite.json'
    CreateAnArtNite.add_new_artnite_event(input_file_path, output_file_path, playlist_link, playlist_name)

if __name__ == "__main__":
    main()