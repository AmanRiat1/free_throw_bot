import os
from atproto import Client
from datetime import datetime, timedelta
from nba_api.stats.static import players
from nba_api.stats.endpoints import leaguegamefinder, boxscoretraditionalv2

def get_player_id(player_name: str) -> int:
    nba_players = players.get_players()
    player = [player for player in nba_players if player['full_name'] == player_name][0]
    return player['id']

def get_latest_game_id(player_id: int) -> str:
    gamefinder = leaguegamefinder.LeagueGameFinder(player_id_nullable=player_id)
    games = gamefinder.get_data_frames()[0]
    if not games.empty:
        return games.iloc[0]['GAME_ID']
    return None

def get_player_free_throws_made(game_id: str, player_id: int) -> int:
    boxscore = boxscoretraditionalv2.BoxScoreTraditionalV2(game_id=game_id)
    player_stats = boxscore.player_stats.get_normalized_dict()
    player_stats = player_stats[player_stats['PLAYER_ID'] == player_id]
    if not player_stats.empty:
        return player_stats.iloc[0]['FTM']
    return 0

if __name__ == '__main__':
    player_name = 'LeBron James'  # Replace with the player's name
    player_id = get_player_id(player_name)
    game_id = get_latest_game_id(player_id)
    
    if game_id:
        free_throws = get_player_free_throws_made(game_id, player_id)
        print(f"{player_name} had {free_throws} free throw attempts in yesterday's game.")
    else:
        print(f"No game found for {player_name} on {date}.")
    # client.login('freethrowbot.bsky.social', BSKY_PASSWORD)

    # post = client.send_post('Hello world! I posted this via the Python SDK.')