# SpawnPlaylist.py

import spotipy
from spotipy.oauth2 import SpotifyOAuth

def create_playlist(client_id, client_secret, redirect_uri, username, playlist_name, playlist_description):
    # Set the scope of the permissions
    scope = 'playlist-modify-public'

    # Authenticate
    token = SpotifyOAuth(client_id=client_id, client_secret=client_secret, redirect_uri=redirect_uri, scope=scope, username=username)
    spotify = spotipy.Spotify(auth_manager=token)

    # Create a playlist
    playlist = spotify.user_playlist_create(user=username, name=playlist_name, public=True, description=playlist_description)
    return playlist['id'], playlist['external_urls']['spotify']