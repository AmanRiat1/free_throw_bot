const NBA = require("nba");

const TWIT = require('twit');

require('dotenv').config();

var T = new TWIT({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

function onAuthenticated(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Authentication successful.');
    }
}

function sendTweet(ft) {
    let tweet;

    if (ft < 5)
        tweet = `A cold night for the beard with only ${ft} free throws.`;
    else if (ft < 10)
        tweet = `Just a regular night for Harden with ${ft} free throws.`;
    else if (ft < 15)
        tweet = `Harden was cooking with ${ft} free throws.`;
    else
        tweet = `The beard was in his BAG with ${ft} free throws.`;

    T.post('statuses/update', {
        status: tweet
    });
}


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

        if (schedule[mid]['startDateEastern'] == date)
            return schedule[mid]['gameId'];
        else if (schedule[mid]['startDateEastern'] < date)
            start = mid + 1;
        else
            end = mid - 1;
    }

    return false;

}

async function getHardenFT(gameNum) {
    let plays = await NBA.stats.playByPlay({
        GameID: gameNum
    });

    let freeThrows = plays['playByPlay'].filter(play => {
        if (play['visitordescription'] != null)
            key = 'visitordescription';
        else if (play['homedescription'] != null)
            key = 'homedescription';
        else
            return false;

        return play['eventmsgtype'] == 3 && play[key].includes('Harden');
    });

    return freeThrows.length;
}

//Main
(async () => {
    let dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 2);
    let yesterdayDate = formatDate(dateObj);
    let gameID = await getGameID(yesterdayDate);

    if (gameID) {
        let ft = await getHardenFT(gameID);
        console.log(ft);

        try {
            T.get('account/verify_credentials', {
                include_entities: false,
                skip_status: true,
                include_email: false
            }, onAuthenticated);
            sendTweet(ft);

        } catch (err) {
            console.log('Error with Twitter Account, verify credentials');
        }

    } else {
        console.log('No game yesterday');
    }

})();