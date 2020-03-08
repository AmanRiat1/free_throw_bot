//This will be used for later if I can get livetime Data
const NBA = require("nba");

async function schedule(date){
	let schedule = NBA.data.teamSchedule("2019", 1610612745).then(result =>{
		games = result['league']['standard'].filter(game => game['startDateEastern'] > 20200303 )
		console.log(games);
	});
	return gameID;
}


(async () =>{

	let fullSchedule = await NBA.data.teamSchedule("2019", 1610612755);
    let schedule = fullSchedule['league']['standard'];
    //console.log(schedule[31]);

//0021900928
//0021900944
    // let plays = await NBA.stats.playByPlay({
    //     GameID: '0021900928'
    // });

    // let freeThrows = plays['playByPlay'].filter(play => {
    //     if (play['visitordescription'] != null)
    //         key = 'visitordescription';
    //     else if (play['homedescription'] != null)
    //         key = 'homedescription';
    //     else
    //         return false;

    //     return play['eventmsgtype'] == 3;
    // });

    let x = await NBA.data.boxScore("20200305", "0021900928");
    if (x['sports_content']['game']['home']['id'] == 1610612755)
    	console.log(x['sports_content']['game']['visitor']['nickname']);
    else
    	console.log(x['sports_content']['game']['home']['nickname']);

})();	
