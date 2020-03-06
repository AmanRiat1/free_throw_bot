//This will be used for later if I can get livetime Data
const nba = require('nba-api-client');

const NBA = require("nba");

async function schedule(date){
	let schedule = NBA.data.teamSchedule("2019", 1610612745).then(result =>{
		games = result['league']['standard'].filter(game => game['startDateEastern'] > 20200303 )
		console.log(games);
	});
	return gameID;
}