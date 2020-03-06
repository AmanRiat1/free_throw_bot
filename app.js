const NBA = require("nba");

function formatDate(date) {
	let d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2)
		month = '0' + month;
	if (day.length < 2)
		day = '0' + day;

	return [year, month, day].join('');
}

async function getGameID(date) {
	let fullSchedule = await NBA.data.teamSchedule("2019", 1610612745);
	let schedule = fullSchedule['league']['standard'];

	let start = 0,
		end = schedule.length - 1;

	//Binary search to match gameID to Date
	while (start <= end) {

		let mid = Math.floor((start + end) / 2);

		if (schedule[mid]['startDateEastern'] == date) {
			return schedule[mid]['gameId'];
		} else if (schedule[mid]['startDateEastern'] < date) {
			start = mid + 1;
		} else {
			end = mid - 1;
		}

	}

	return false;

}

async function getHardenFT(gameNum) {
	let plays = await NBA.stats.playByPlay({
		GameID: gameNum
	});
	let freeThrows = plays['playByPlay'].filter(play => {
		if (play['visitordescription'] != null) {
			key = 'visitordescription';
		} else if (play['homedescription'] != null) {
			key = 'homedescription';
		} else {
			return false;
		}

		return play['eventmsgtype'] == 3 && play[key].includes('Harden');
	})
	return freeThrows.length;
	console.log('error2')
}

//Main
(async () => {
	let dateObj = new Date();
	dateObj.setDate(dateObj.getDate() - 2);
	let yesterdayDate = formatDate(dateObj);

	let gameID = await getGameID(yesterdayDate);
	if (!gameID) {
		let ft = await getHardenFT(gameID);
		console.log(ft);
	} else {
		console.log('No game yesterday');
	}

})();