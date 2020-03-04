const nba = require('nba-api-client');

const NBA = require("nba");

// TODO: Filter through games and find gameID
// Maybe remove the hardcoded after date
async function schedule(date){
	let schedule = NBA.data.teamSchedule("2019", 1610612745).then(result =>{
		games = result['league']['standard'].filter(game => game['startDateEastern'] > 20200303 )
		console.log(games);
	});
	return gameID;
}

//
async function gamePlays(gameNum) {
  let plays =  await NBA.stats.playByPlay({ GameID: gameNum }).then(result =>{
	freeThrows = result['playByPlay'].filter(play =>{
			if (play['visitordescription'] != null){
				key = 'visitordescription';
			}else if (play['homedescription'] != null){
				key = 'homedescription';
			}else{
				return false; 
			}

			return play['eventmsgtype'] ==3 && play[key].includes('Harden');
		}) 
		console.log(freeThrows)
		console.log(freeThrows.length)
	});
  return plays;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('');
}

var dateObj = new Date(); 
dateObj.setDate(dateObj.getDate() - 1);
console.log(formatDate(dateObj));

// 0021900892
// 0021900903