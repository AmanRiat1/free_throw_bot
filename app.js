const nba = require('nba-api-client');

const NBA = require("nba");
const curry = NBA.findPlayer('Stephen Curry');
console.log(curry);
// 1610612745

// console.log(NBA)

// console.log(NBA.data.scoreboard().then(result =>{
// 	console.log(result);
// }));

// console.log(NBA.data.teamSchedule("2019", 1610612745).then(result =>{
// 	console.log(result.league.standard);
// }));


// console.log(NBA.stats.scoreboard({ gameDate : '2020-02-02' }).then(result =>{
// 	console.log(result);
// }));

let plays =  NBA.stats.playByPlay({ GameID: '0021900892' }).then(result =>{
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
});

// 0021900892
// 0021900903