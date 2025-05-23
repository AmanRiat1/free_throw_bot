import os
import logging
from typing import Dict
from datetime import datetime, timedelta

from atproto import Client

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

def get_player_game_data(game_id: str, player_id: int) -> Dict[str, any]:
    boxscore = boxscoretraditionalv2.BoxScoreTraditionalV2(game_id=game_id)
    player_stats = boxscore.player_stats.get_dict()
    team_stats = boxscore.team_stats.get_dict()
    
    free_throws_made = 0
    opponent_team = ""
    game_date = ""

    for player in player_stats['data']:
        if player[player_stats['headers'].index('PLAYER_ID')] == player_id:
            free_throws_made = player[player_stats['headers'].index('FTM')]
            player_team_id = player[player_stats['headers'].index('TEAM_ID')]
            break

    for team in team_stats['data']:
        if team[team_stats['headers'].index('TEAM_ID')] != player_team_id:
            opponent_team = team[team_stats['headers'].index('TEAM_NAME')]
            break

    gamefinder = leaguegamefinder.LeagueGameFinder(game_id_nullable=game_id)
    games = gamefinder.get_data_frames()[0]
    if not games.empty:
        game_date = games.iloc[0]['GAME_DATE']
        game_date = game_date.split('T')[0]

    return {
        "free_throws_made": free_throws_made,
        "opponent_team": opponent_team,
        "game_date": game_date
    }

def generate_post(player_name: str, free_throws: int, opposing_team: str) -> str:
    if free_throws < 5:
        return f"A cold night for {player_name} with only {free_throws} free throw attempts against the {opposing_team}."
    elif free_throws < 10:
        return f"Just a regular night for {player_name} with {free_throws} free throw attempts against the {opposing_team}."
    elif free_throws < 15:
        return f"{player_name} was cooking with {free_throws} free throw attempts against the {opposing_team}."
    else:
        return f"The {player_name} was in his BAG with {free_throws} free throw attempts against the {opposing_team}."

if __name__ == '__main__':
    log_level = os.environ.get('LOG_LEVEL', 'INFO')
    logging.basicConfig(level=log_level)
    
    PLAYER_NAME = os.environ.get('PLAYER_NAME')
    BSKY_PASSWORD = os.environ.get('BSKY_PASSWORD')
    
    client = Client()   
    client.login('freethrowbot.bsky.social', BSKY_PASSWORD)
    
    player_id = get_player_id(PLAYER_NAME)
    game_id = get_latest_game_id(player_id)
    
    player_game_data = get_player_game_data(game_id, player_id)
    game_date = player_game_data['game_date']
    date_one_day_ago = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
    if game_date == date_one_day_ago:
        free_throws = player_game_data['free_throws_made']
        opposing_team = player_game_data['opponent_team']
        post = generate_post(PLAYER_NAME, free_throws, opposing_team)
        sent_post = client.send_post(post)
        logging.info(f"Bluesky post made for game ID {game_id} (Game Date: {game_date}, Script Run Date: {date_one_day_ago}). Post URI: {sent_post.uri}")
    else:
        logging.info("No game data available for today.")