/*---------------------------------------------------------------
* Author: Chad Cromwell
* Date: 2019-04-10
* Description: JavaScript for dashboard.php. Provides functionality for AJAX/JSON communication with mySQL database.
*               - Updates/populates statistics for buttons, graph, and date forms
*
* Functions: -  -
---------------------------------------------------------------*/
let canvas = document.getElementById("graph"); //Get canvas to place chart
let label = "Games won"; //Chart label

let userStatArray; //Holds user stat array

let fromDate = document.getElementById("fromDate");
let toDate = document.getElementById("toDate");
let currentDate = new Date(); //Initialize current date
currentDate.setHours(0,0,0,0); //Strip time away
let maxDate; //Hold max date for date picker

//Initialize empty arrays to hold individual stats
let gamesWonArray = [];
let gamesLostArray = [];
let gamesPlayedArray = [];
let winRateArray = [];
let averageScoreArray = [];
let timePlayedArray = [];
let totalGamesWonArray = [];
let totalGamesLostArray = [];
let totalGamesPlayedArray = [];

let type = "Games Won"; //Initialize type as "Games Won"

let statButtonsHeader = document.getElementById("statButtons"); //Assign group of stat buttons
let statButtons = statButtonsHeader.getElementsByClassName("btn"); //Assign buttons

Chart.defaults.global.defaultFontFamily = "Lato"; //Set font for chart
Chart.defaults.global.defaultFontSize = 18; //Set chart font size

//AJAX
let response; //JSON object
let xmlhttp = new XMLHttpRequest(); //xmlhttp request for AJAX

//xmlhttp callback - Is performed when xmlhttp response is received
xmlhttp.onreadystatechange = function() {

    //If request is finished and response is ready
    if(xmlhttp.readyState === 4) {

        //If status is OK
        if(xmlhttp.status === 200) {
            response = JSON.parse(xmlhttp.responseText); //Parse JSON object into JavaScript array
            //If response is "logIn: F", the user is not logged in and will be redirected to the log in page
            if(response["logIn"] === "F") {
                window.location.href = "../../game/";
            }
            else {
                userStatArray = response["userStatArray"]; //Assign user stat array
                if(typeof usersStatArray !== undefined) {
                    sortByDate(userStatArray); //Sort the array by chronological order

                    let gamesWonThatDay = 0;
                    let gamesLostThatDay = 0;

                    if(userStatArray[0].won) {
                        gamesWonThatDay = 1;
                    }
                    else {
                        gamesLostThatDay = 1;
                    }
                    let gamesPlayedThatDay = 1;
                    let winRateThatDay = (gamesWonThatDay+gamesLostThatDay*100);
                    let averageScoreThatDay = userStatArray[0].score;
                    let timePlayedThatDay = userStatArray[0].elapsedTime;

                    let dayOfGames = [];
                    let daySorted = [];

                    //Sort games by date and place them into an array based off of date.
                    let lastEntry = userStatArray[0]; //Assign first userStatArray element as lastEntry for comparison in sort
                    dayOfGames.push(userStatArray[0]); //Push first userStatArray element into dayOfGames array

                    //Iterate through all user's games
                    let j = 0; //counter for daySorted index
                    for(let i = 0; i < userStatArray.length; i++) {
                        //If the current element is the same day, push it into dayOfGames array
                        if(moment(userStatArray[i].date ).format("YYYY-MM-DD") === moment(lastEntry.date).format("YYYY-MM-DD")) {
                            dayOfGames.push(userStatArray[i]); //Add this element to the dayOfGames array
                        }
                        //Else. the current element is a new day or at the end of the userStatArray
                        if(moment(userStatArray[i].date ).format("YYYY-MM-DD") !== moment(lastEntry.date).format("YYYY-MM-DD") || i === userStatArray.length-1) {
                            daySorted[j] = {"games": dayOfGames, //Assign dayOfGames to games property
                                                "date": userStatArray[i-1].date, //Assign the previous userStatArray's date to date property
                                                "stats": {"gamesWon": 0, //Assign empty stats property, to be filled later
                                                            "gamesLost": 0,
                                                            "gamesPlayed": 0,
                                                            "winRate": 0,
                                                            "averageScore": 0,
                                                            "timePlayed": 0}}; //Push object of array of games and date key to daySorted array, as well as stats object consisting of gamesWon, gamesLost, gamesPlayed, winRate, averageScore, and timePlayed
                            dayOfGames = []; //Clear dayOfGames
                            dayOfGames.push(userStatArray[i]); //Add this element to the fresh dayOfGames array
                            lastEntry = userStatArray[i];
                            j++;
                        }
                    }

                    //Calculate totals and averages for each day
                    for(let i = 0; i < daySorted.length; i++) {

                        let gamesWonThatDay = 0;
                        let gamesLostThatDay = 0;
                        let gamesPlayedThatDay = 0;
                        let winRateThatDay = 0;
                        let averageScoreThatDay = 0;
                        let scoreThatDay = 0;
                        let timePlayedThatDay = 0;

                        //Iterate through nested games for each day
                        for(let j = 0; j < daySorted[i].games.length; j++) {
                            //If the player won this game
                            if(daySorted[i].games[j].result) {
                                gamesWonThatDay++; //Increment gamesWonThatDay
                            }
                            //Else, the player lost the game
                            else {
                                gamesLostThatDay++; //Increment gamesLostThatDay
                            }
                            scoreThatDay += parseInt(daySorted[i].games[j].score); //Add score
                            timePlayedThatDay += parseInt(daySorted[i].games[j].elapsedTime); //Add time played
                        }

                        //Done adding up stats for the day
                        gamesPlayedThatDay = parseInt(gamesWonThatDay+gamesLostThatDay); //Calculate games played that day
                        winRateThatDay = Math.round((gamesWonThatDay/gamesPlayedThatDay)*100); //Calculate win rate for the day
                        averageScoreThatDay = parseInt(scoreThatDay/gamesPlayedThatDay); //Calculate average score for the day

                        //Assign stats for day
                        daySorted[i].stats.gamesWon = gamesWonThatDay;
                        daySorted[i].stats.gamesLost = gamesLostThatDay;
                        daySorted[i].stats.gamesPlayed = gamesPlayedThatDay;
                        daySorted[i].stats.winRate = parseInt(winRateThatDay);
                        daySorted[i].stats.averageScore = parseInt(averageScoreThatDay);
                        daySorted[i].stats.timePlayed = parseInt(timePlayedThatDay);
                    }
                    userStatArray = daySorted; //Update userStatArray to be the new sorted, multidimensional array
                    filterAll(); //Set dates to today
                    gamesWon(); //Highlight Games Won stat
                }
            }
        }
        else {
            console.log("Failed"); //For debugging
        }
    }
};

//Send as POST to getDashboard.php
xmlhttp.open("GET", "../../lib/dashboard/getDashboard.php", true); //Asynchronously open xmlhttp to getDashboard.php
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); //Set the request header
xmlhttp.send(); //Send JSON object

//Date initialization---------------------------------------------------------------------------------------------------
//If the month is 10 11 or 12, no need to add 0
if(currentDate.getMonth() >= 10) {
    //If date is over 10, no need to add a 0
    if(currentDate.getDate() >= 10) {
        maxDate = currentDate.getFullYear() + "-" + (currentDate.getMonth()+1) + "-" + currentDate.getDate();
    }
    //Else, date is under 10 and need to add 0
    else {
        maxDate = currentDate.getFullYear() + "-" + (currentDate.getMonth()+1) + "-" + 0+(currentDate.getDate());
    }
}
//Else, if the month is Jan through Sept add a 0 before
else {
    //If the date is over 10, no need to add a 0
    if(currentDate.getDate() >= 10) {
        maxDate = currentDate.getFullYear() + "-" + 0 + (currentDate.getMonth() + 1) + "-" + currentDate.getDate();
    }
    else {
        maxDate = currentDate.getFullYear() + "-" + 0 + (currentDate.getMonth() + 1) + "-" + 0+(currentDate.getDate());
    }
}

fromDate.max = maxDate; //Set max date for date picker
fromDate.value = maxDate; //Set value for fromDate
toDate.max = maxDate; //Set max date for date picker
toDate.value = maxDate; //Set value for toDate

//Event listeners on date pickers---------------------------------------------------------------------------------------
//Add event listener to fromDate form, when date is changed perform this action
fromDate.addEventListener("change", function() {
    //If the from date is greater than the to date
    if(fromDate.value > toDate.value) {
        toDate.value = null; //Clear toDate value
    }
    fromDate = document.getElementById("fromDate"); //Get "fromDate" HTML element

    let min = false;
    let max = false;

    //Find min and max, these need to be optimized for scale. Binary search that returns first date within target?
    //Find earliest element
    for(let i = 0; i < userStatArray.length; i++) {
        let a = moment(userStatArray[i].date).format("YYYY-MM-DD");
        let b = moment(fromDate.value).format("YYYY-MM-DD");
        if(moment(a).isAfter(moment(b)) || moment(a).isSame(moment(b))) {
            min = i;
            break;
        }
    }

    //Find latest element
    for(let i = userStatArray.length-1; i >= 0; i--) {
        let a = moment(userStatArray[i].date).format("YYYY-MM-DD");
        let b = moment(toDate.value).format("YYYY-MM-DD");
        if(moment(a).isBefore(moment(b)) || moment(a).isSame(moment(b))) {
            max = i;
            break;
        }
    }

    if(min !== false) {
        if(max === false) {
            max = min;
        }
    }

    updateDatasets(min, max); //Call updateDatasets to update the chart's data
    if(moment(fromDate.value).isBefore(moment(toDate.value)) || moment(fromDate.value).isSame(moment(toDate.value))) {
        updateStatBlocks(min, max);
    }
    else {
        updateStatBlocks(false, false); //Reset stat blocks to 0
    }
    document.getElementById("timeFilter").innerHTML = "Time: Custom";
}, false);

//Add event listener to toDate form, when date is changed perform this action
toDate.addEventListener("change", function() {
    //If the to date is less than the from date
    if(toDate.value < fromDate.value) {
        fromDate.value = null; //Clear the fromDate value
    }
    toDate = document.getElementById("toDate"); //Get "toDate" HTML element

    let min = false;
    let max = false;

    //Find min and max, these need to be optimized for scale. Binary search that returns first date within target?
    //Find earliest element
    for(let i = 0; i < userStatArray.length; i++) {
        let a = moment(userStatArray[i].date).format("YYYY-MM-DD");
        let b = moment(fromDate.value).format("YYYY-MM-DD");
        if(moment(a).isAfter(moment(b)) || moment(a).isSame(moment(b))) {
            min = i;
            break;
        }
    }

    //Find latest element
    for(let i = userStatArray.length-1; i >= 0; i--) {
        let a = moment(userStatArray[i].date).format("YYYY-MM-DD");
        let b = moment(toDate.value).format("YYYY-MM-DD");
        if(moment(a).isBefore(moment(b)) || moment(a).isSame(moment(b))) {
            max = i;
            break;
        }
    }

    if(min !== false) {
        if(max === false) {
            max = min;
        }
    }

    updateDatasets(min, max); //Call updateDatasets to update the chart's data
    if(moment(fromDate.value).isBefore(moment(toDate.value)) || moment(fromDate.value).isSame(moment(toDate.value))) {
        updateStatBlocks(min, max);
    }
    else {
        updateStatBlocks(false, false); //Reset stat blocks to 0
    }
    document.getElementById("timeFilter").innerHTML = "Time: Custom";
}, false);

//Show current stat button as active - Iterate through all buttons
for(let i = 0; i < statButtons.length; i++) {
    //Add event listener for when clicked
    statButtons[i].addEventListener("click", function() {
        //Iterate through all stat buttons
        for(let i = 0; i < statButtons.length; i++) {
            //If the stat button is active
            if(statButtons[i].className.includes("active")) {
                statButtons[i].className = statButtons[i].className.replace(" active", ""); //Remmove active tag
            }
        }
        this.className += " active"; //Add active tag
    });
}

let initializeData = {
    datasets: [{label: [""],
                data: [{x: moment("2019-01-01"), y: 4}],
                backgroundColor: "rgb(0, 0, 255, .5)",
                borderWidth: "1",
                borderColor: "rgb(0, 0, 255, 1.0)"
                }]
};

//Chart - bar type, initialized with yAxis as "Games Played" and xAxis as date in the form of "YYYY-MM-DD"
let chart = new Chart(canvas, {
    type: 'bar', //Bar type chart
    data: initializeData, //Set initializeData, otherwise it will result in error
    options: { //Chart options
        scales: { //Scale options
            yAxes: [{ //yAxes
                scaleLabel: { //Label
                    display: true, //Show the label
                    labelString: "Games played" //"Games played" is the label
                }
            }],
            xAxes: [{ //xAxes
                type: "time", //Axes is denoting time
                time: {
                    parser: "YYYY-MM-DD", //Format "YYYY-MM-DD"
                    tooltipFormat: 'll', //Use ll format for the tooltip popup
                    unit: "day", //Days are the units used
                },
                scaleLabel: { //Lablel
                    display: true, //Show the label
                    labelString: "Date" //"Date" is the label
                }
            }]
        }
    }
});

//Set ticks to be linear and start a 0
Chart.scaleService.updateScaleDefaults("linear", {
    ticks: {
        min: 0
    }
});


//sortByDate(array) function - Accepts userStatArray (games, wins, losses, winRate, score, elapsedTime, date) and orders it by chronological order
function sortByDate(array) {
    //Sort, compare 2 elements
    array = array.sort((a, b) => {
        let date1 = moment(a[6], "YYYY MM DD hh:mm:ss A"); //a date
        let date2 = moment(b[6], "YYYY MM DD hh:mm:ss A"); //b date

        //If date 2 comes after date 1 (using moment.js)
        if (date2.isAfter(date1)) {
            return 1; //Rank after
        }
        //If date 1 comes after date 2 (using moment.js)
        if (date1.isAfter(date2)) {
            return -1; //Rank before
        }
        //Otherwise, do nothing
        else {
            return 0;
        }
    });
    return array; //Return sorted array
}

//momentToString(moment) function - Pass moment of date from json, always has proper syntax so no need to add a 0 or +1 to month. Do not use for any moment object other than what is passed from getDashboard.php or you will encounter errors.
function momentToString(mo) {
    if(mo instanceof moment) {
        let date; //Declare date
        //If passed moment month is over 10
        if (mo.month() >= 10) {
            date = mo.year() + "-" + (mo.month() + 1) + "-" + mo.date(); //Assign to date variable in format of "YYYY-MM-DD"
        }
        //Else, the month is under 10 and needs a 0 appended to the front of it
        else {
            date = mo.year() + "-" + 0+(mo.month() + 1) + "-" + mo.date(); //Assign to date variable in format of "YYYY-MM-DD"
        }
        return date; //Return the date string
    }
}

//dateToString(date) function - Accepts a date object and returns it as a string
function dateToString(date) {
    let string; //Decalre date
    //If the month is 10 11 or 12, no need to add 0
    if(date.getMonth() >= 10) {
        string = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(); //Assign to string variable in format of "YYYY-MM-DD"
    }
    //Else, if the month is Jan through Sept add a 0 before
    else {
        string = date.getFullYear() + "-" + 0+(date.getMonth() + 1) + "-" + date.getDate(); //Assign to string variable in format of "YYYY-MM-DD"
    }
    return string; //Return the date as a string
}

//modDate(y, m, d) function - Used to get a modified date based on current date. Example: modDate(-1, 0, 0) will return a date 1 year ago from today.
function modDate(y, m, d) {
    let temp = new Date(); //Assign current date
    let year; //Declare year
    let month; //Declare month
    let date; //Declare date

    temp.setFullYear(temp.getFullYear()+y); //Update year with passed value
    temp.setMonth(temp.getMonth()+1+m); //Update month with passed value
    temp.setDate(temp.getDate()+d); //U[date date with passed value

    year = temp.getFullYear(); //Assign year variable

    //If month is >= 10, no need to add 0 to front
    if(temp.getMonth() >= 10) {
        month = ""+temp.getMonth(); //Assign month as string
    }
    //Else, month is < 10 must add 0 to front
    else {
        month = ""+0+temp.getMonth(); //Assign month as string with 0 in front
    }

    //If date is >= 10, no need to add 0 to front
    if(temp.getDate() >= 10) {
        date = ""+temp.getDate(); //Assign date as string
    }
    //Else, date is < 10 must add 0 to front
    else{
        date = ""+0+temp.getDate(); //Assign date as string with 0 in front
    }

    return year + "-" + month + "-" + date; //Return string date in form of YYYY-MM-DD
}

function updateChart() {
    let min = false;
    let max = false;

    //Find min and max, these need to be optimized for scale. Binary search that returns first date within target?
    //Find earliest element
    for(let i = 0; i < userStatArray.length; i++) {
        let a = moment(userStatArray[i].date).format("YYYY-MM-DD");
        let b = moment(fromDate.value).format("YYYY-MM-DD");
        if(moment(a).isAfter(moment(b)) || moment(a).isSame(moment(b))) {
            min = i;
            break;
        }
    }

    //Find latest element
    for(let i = userStatArray.length-1; i >= 0; i--) {
        let a = moment(userStatArray[i].date).format("YYYY-MM-DD");
        let b = moment(toDate.value).format("YYYY-MM-DD");
        if(moment(a).isBefore(moment(b)) || moment(a).isSame(moment(b))) {
            max = i;
            break;
        }
    }

    if(min !== false) {
        if(max === false) {
            max = min;
        }
    }
    updateDatasets(min, max);
}
function binarySearch(array, target, start, end) {
    //Base condition
    if (start > end) {
        return false;
    }

    //Find the middle index
    let middle = Math.round((start+end)/2);

    //If target is middle element
    if (moment(array[middle].date).startOf("day").isSame(moment(target).startOf("day"))) {
        return middle; //Return index
    }

    //If the target date is earlier than the middle date, search first half
    if (moment(array[middle].date).startOf("day").isAfter(moment(target).startOf("day"))) {
        return binarySearch(array, target, start, middle-1);
    }
    //Else, if target date is after the middle date, search last half
    else {
        return binarySearch(array, target, middle+1, end);
    }
}

function updateStatBlocks(min, max) {
    //Calculate total stats
    let gamesWon = 0;
    let gamesLost = 0;
    let gamesPlayed = 0;
    let winRate;
    let averageScore = 0;
    let timePlayed = 0;

    //If min and max dates are the same, and there's an actual entry, just get stats with the min element
    if(min === max && min !== false ) {
        gamesWon += parseInt(userStatArray[min].stats.gamesWon);
        gamesLost += parseInt(userStatArray[min].stats.gamesLost);
        gamesPlayed += parseInt(userStatArray[min].stats.gamesPlayed);
        averageScore += parseInt(userStatArray[min].stats.averageScore);
        timePlayed += parseInt(userStatArray[min].stats.timePlayed);
        winRate = Math.trunc((gamesWon / gamesPlayed) * 100);
    }
    //Else, min and max are different dates
    else if (min !== false) {
        //If there's a time span
        if (max !== false) {
            //Iterate through all stats and get total stats
            for (let i = min; i <= max; i++) {
                gamesWon += parseInt(userStatArray[i].stats.gamesWon);
                gamesLost += parseInt(userStatArray[i].stats.gamesLost);
                gamesPlayed += parseInt(userStatArray[i].stats.gamesPlayed);
                averageScore += parseInt(userStatArray[i].stats.averageScore);
                timePlayed += parseInt(userStatArray[i].stats.timePlayed);
            }
            winRate = Math.trunc((gamesWon / gamesPlayed) * 100);
        }
        //Else, there's only one entry
        else {
            gamesWon += parseInt(userStatArray[min].stats.gamesWon);
            gamesLost += parseInt(userStatArray[min].stats.gamesLost);
            gamesPlayed += parseInt(userStatArray[min].stats.gamesPlayed);
            averageScore += parseInt(userStatArray[min].stats.averageScore);
            timePlayed += parseInt(userStatArray[min].stats.timePlayed);
            winRate = Math.trunc((gamesWon / gamesPlayed) * 100);
        }
    }
    else {
        gamesWon = 0;
        gamesLost = 0;
        gamesPlayed = 0;
        averageScore = 0;
        winRate = 0;
        timePlayed = 0;
    }

    document.getElementById("Games Won Button").innerHTML = gamesWon; //Update the games won button with the new statistic
    document.getElementById("Games Lost Button").innerHTML = gamesLost; //Update the games los button with the new statistic
    document.getElementById("Games Played Button").innerHTML = gamesPlayed; //Update the games played button with the new statistic
    document.getElementById("Win Rate Button").innerHTML = winRate + "%"; //Update the win rate button with the new statistic
    document.getElementById("Average Score Button").innerHTML = averageScore; //Update the average score button with the new statistic
    let duration = moment.duration(timePlayed, "seconds"); //Assign total time played as a moment duration object
    document.getElementById("Time Played Button").innerHTML = duration.days() + "d " + duration.hours() + "h " + duration.minutes() + "m " + duration.seconds() + "s"; //Assign the moment duration object as a string in the form of d## h## m## s##
}

//filterToday() function - Update form dates to today
function filterToday() {
    document.getElementById("timeFilter").innerHTML = "Time: Today";
    fromDate.value = maxDate; //Set fromDate to maxDate
    toDate.value = maxDate; //Set toDate to maxDate
    fromDate.max = maxDate; //Set fromDate max to maxDate
    toDate.max = maxDate; //Set toDate max maxDate

    let min = binarySearch(userStatArray, fromDate.value, 0, userStatArray.length-1); //Call binarySearch to get min element
    let max = binarySearch(userStatArray, toDate.value, 0, userStatArray.length-1); //Call binarySearch to get max element

    updateDatasets(min, max); //Update the chart dataset
    updateStatBlocks(min, max);
}


//filterYesterday() function - Update form dates to yesterday
function filterYesterday() {
    document.getElementById("timeFilter").innerHTML = "Time: Yesterday";
    fromDate.value = modDate(0,0,-1); //Set fromDate to yesterday
    toDate.value = modDate(0,0,-1); //Set toDate to yesterday
    fromDate.max = maxDate;  //Set fromDate max to yesterday
    toDate.max = maxDate; //Set toDate max to yesterday

    let min = binarySearch(userStatArray, fromDate.value, 0, userStatArray.length-1); //Call binarySearch to get min element
    let max = binarySearch(userStatArray, toDate.value, 0, userStatArray.length-1); //Call binarySearch to get max element

    updateDatasets(min, max); //Update the chart dataset
    updateStatBlocks(min, max);
}

//filterWeek() function - Update form dates to week
function filterWeek() {
    document.getElementById("timeFilter").innerHTML = "Time: Week";
    fromDate.value = modDate(0,0,-7); //Set fromDate value to a week ago
    toDate.value = maxDate; //Set toDate value to a week to today
    fromDate.max = maxDate; //Set fromDate max to today
    toDate.max = maxDate; //Set toDate max to today

    let min = binarySearch(userStatArray, fromDate.value, 0, userStatArray.length-1); //Call binarySearch to get min element
    let max = binarySearch(userStatArray, toDate.value, 0, userStatArray.length-1); //Call binarySearch to get max element

    updateDatasets(min, max); //Update the chart dataset
    updateStatBlocks(min, max); //Update the statistic blocks
}


//filterMonth() function - Update form dates to month
function filterMonth() {
    document.getElementById("timeFilter").innerHTML = "Time: Month";
    fromDate.value = modDate(0, -1, 0); //Set fromDate value to a month ago
    toDate.value = maxDate; //Set toDate value to today
    fromDate.max = maxDate; //Set fromDate max to today
    toDate.max = maxDate; //Set toDate max to today

    let min = binarySearch(userStatArray, fromDate.value, 0, userStatArray.length-1); //Call binarySearch to get min element
    let max = binarySearch(userStatArray, toDate.value, 0, userStatArray.length-1); //Call binarySearch to get max element

    updateDatasets(min, max); //Update the chart dataset
    updateStatBlocks(min, max); //Update the statistic blocks
}

//filterMonth() function - Update form dates to month
function filterAll() {
    document.getElementById("timeFilter").innerHTML = "Time: All";
    let date = momentToString(moment(userStatArray[0].date)); //Set date as earliest user date
    fromDate.value = date; //Set fromDate value to earliest date
    toDate.value = maxDate; //Set toDate value to today
    fromDate.max = maxDate; //Set fromDate max to today
    toDate.max = maxDate; //Set toDate max to today

    let min = binarySearch(userStatArray, fromDate.value, 0, userStatArray.length-1); //Call binarySearch to get min element
    let max = binarySearch(userStatArray, toDate.value, 0, userStatArray.length-1); //Call binarySearch to get max element

    updateDatasets(min, max); //Update the chart dataset

    //Calculate total stats
    let gamesWon = 0;
    let gamesLost = 0;
    let gamesPlayed = 0;
    let winRate;
    let averageScore = 0;
    let timePlayed = 0;

    //Iterate through all stats and get total stats
    for(let i = 0; i < userStatArray.length; i++) {
        gamesWon += parseInt(userStatArray[i].stats.gamesWon);
        gamesLost += parseInt(userStatArray[i].stats.gamesLost);
        gamesPlayed += parseInt(userStatArray[i].stats.gamesPlayed);
        averageScore += parseInt(userStatArray[i].stats.averageScore);
        timePlayed += parseInt(userStatArray[i].stats.timePlayed);
    }

    winRate = Math.trunc((gamesWon/gamesPlayed)*100);

    document.getElementById("Games Won Button").innerHTML = gamesWon; //Update the games won button with the new statistic
    document.getElementById("Games Lost Button").innerHTML = gamesLost; //Update the games los button with the new statistic
    document.getElementById("Games Played Button").innerHTML = gamesPlayed; //Update the games played button with the new statistic
    document.getElementById("Win Rate Button").innerHTML = winRate + "%"; //Update the win rate button with the new statistic
    document.getElementById("Average Score Button").innerHTML = averageScore; //Update the average score button with the new statistic
    let duration = moment.duration(timePlayed, "seconds"); //Assign total time played as a moment duration object
    document.getElementById("Time Played Button").innerHTML = duration.days() + "d " + duration.hours() + "h " + duration.minutes() + "m " + duration.seconds() + "s"; //Assign the moment duration object as a string in the form of d## h## m## s##
}

//updateDatasets(min, max) function - Accepts a min and max element, removes current dataset from chart, updates individual statistic arrays with statistics from within specific min and max dates, and then adds relevant statistical dataset to the chart
function updateDatasets(min, max) {
    let bool = true; //Used to determine if min or max are false

    //If max or min are false
    if (max === false && min === false) {
        removeData(chart); //Call removeData() to remove the dataset from the cahrt
        bool = false; //Set boolean to false
    }
    //If bool is true, update datasets
    if (bool) {
        removeData(chart); //Call removeData to remove data from the cahrt
        //If max is false, set max to last index of userStatArray
        if (max === false) {
            max = userStatArray.length - 1; //Set max to the last element of the userStatArray
        }
        //if min is false, set min to 0 index
        if (min === false) {
            min = 0; //Set min element to 0
        }

        //Initialize variables to hold statistics
        let wins = 0;
        let losses = 0;
        let games = 0;
        let winRate = 0;
        let score = 0;
        let elapsedTime = 0;

        //Reset arrays
        gamesWonArray = [];
        gamesLostArray = [];
        gamesPlayedArray = [];
        winRateArray = [];
        averageScoreArray = [];
        timePlayedArray = [];

        //Iterate through all elements
        for(let i = min; i <= max; i++) {
            //Reset counters
            wins = 0;
            losses = 0;
            games = 0;
            score = 0;
            elapsedTime = 0;
            winRate = 0;

            wins += parseInt(userStatArray[i].stats.gamesWon); //Add games won
            losses += parseInt(userStatArray[i].stats.gamesLost); //Add losses
            score += parseInt(userStatArray[i].stats.averageScore); //Add score
            elapsedTime += parseInt(userStatArray[i].stats.timePlayed); //Add time
            games = parseInt(wins+losses); //Calculate games played
            score = parseInt(score/games); //Calculate average score
            winRate = parseInt((wins/games)*100); //Calculate winRate
            gamesWonArray.push({x: userStatArray[i].date, y: wins}); //Push wins to gamesWonArray
            gamesLostArray.push({x: userStatArray[i].date, y: losses}); //Push losses to gamesLostArray
            gamesPlayedArray.push({x: userStatArray[i].date, y: games}); //Push number of games played to gamesPlayedArray
            winRateArray.push({x: userStatArray[i].date, y: winRate}); //Push number of wins to winRateArray
            averageScoreArray.push({x: userStatArray[i].date, y: score}); //Push average score to averageScoreArray
            timePlayedArray.push({x: userStatArray[i].date, y: (elapsedTime/3600).toFixed(2)}); //Push time played to timePlayedArray in hours
        }

        //If type is Games Won, populate games won data to the chart
        if(type === "Games Won") {
            addData(chart, "Games Won", gamesWonArray); //Add data to chart
            chart.options.scales.yAxes[0].scaleLabel.labelString = "Games Won"; //Update the chart label
            chart.options.tooltips.callbacks.label = function(tooltipItem, data) {
                let label = data.datasets[tooltipItem.datasetIndex].label || "";
                label = label + ": " + tooltipItem.yLabel;
                return label;
            };
        }
        //If type is Games Lost, populate games lost data to the chart
        if(type === "Games Lost") {
            addData(chart, "Games Lost", gamesLostArray); //Add data to chart
            chart.options.scales.yAxes[0].scaleLabel.labelString = "Games Lost"; //Update the chart label
            chart.options.tooltips.callbacks.label = function(tooltipItem, data) {
                let label = data.datasets[tooltipItem.datasetIndex].label || "";
                label = label + ": " + tooltipItem.yLabel;
                return label;
            };
        }
        //If type is Games Played, populate games played data to the chart
        if(type === "Games Played") {
            addData(chart, "Games Played", gamesPlayedArray); //Add data to chart
            chart.options.scales.yAxes[0].scaleLabel.labelString = "Games Played"; //Update the chart label
            chart.options.tooltips.callbacks.label = function(tooltipItem, data) {
                let label = data.datasets[tooltipItem.datasetIndex].label || "";
                label = label + ": " + tooltipItem.yLabel;
                return label;
            };
        }
        //If type is Win Rate, populate win rate data to the chart
        if(type === "Win Rate") {
            addData(chart, "Win Rate", winRateArray); //Add data to chart
            chart.options.scales.yAxes[0].scaleLabel.labelString = "Win Rate (%)"; //Update the chart label
            chart.scaleOverride = true;
            chart.scaleSteps = 100;
            chart.scaleStepsWidth = 1;
            chart.scaleStartValue = 0;
            chart.options.tooltips.callbacks.label = function(tooltipItem, data) {
                let label = data.datasets[tooltipItem.datasetIndex].label || "";
                label = label + ": " + tooltipItem.yLabel + " %";
                return label;
            };
        }
        //If type is Average Score, populate average score data to the chart
        if(type === "Average Score") {
            addData(chart, "Average Score Per Game", averageScoreArray); //Add data to chart
            chart.options.scales.yAxes[0].scaleLabel.labelString = "Average Score Per Game"; //Update the chart label
            chart.options.tooltips.callbacks.label = function(tooltipItem, data) {
                let label = data.datasets[tooltipItem.datasetIndex].label || "";
                label = label + ": " + tooltipItem.yLabel;
                return label;
            };
        }
        //If type is Time Played, populate time played data to the chart
        if(type === "Time Played") {
            addData(chart, "Time Played", timePlayedArray); //Add data to chart
            chart.options.scales.yAxes[0].scaleLabel.labelString = "Time Played (hours)"; //Update the chart label
            chart.scaleOverride = true;
            chart.scaleSteps = 1;
            chart.options.tooltips.callbacks.label = function(tooltipItem, data) {
                let label = data.datasets[tooltipItem.datasetIndex].label || "";
                label = label + ": " + tooltipItem.yLabel + " hours";
                return label;
            };
        }
    }
}

//removeData(c) function - Accepts a chart and removes the dataset data from it
 function removeData(c) {
    c.data.datasets[0].label.pop(); //Remove the label
    let chartSize = c.data.datasets[0].data.length; //Assign chart size
     // Iterate through all data in chart
    for(let i = 0; i < chartSize; i++) {
        c.data.datasets[0].data.pop(); //Remove data from chart
    }
    c.update(); //Update chart
}

//addData(c, label, data) function - Accepts a chart, a label, and array of data. Adds the label and data to the chart and updates it
 function addData(c, label, data) {
    c.data.datasets[0].label.push(label); //Add label to chart
    let dataSize = data.length; //Assign dataSize to length of passed data
     //Iterate thourgh all data
    for(let i = 0; i < dataSize; i++) {
        c.data.datasets[0].data.push(data[i]); //Add data to the chart
    }
    c.update(); //Update the chart
}

//gamesWon() function - Sets the graph's data set to gamesWonData
function gamesWon() {
    removeData(chart); //Remove data from the chart
    type = "Games Won"; //Set type
    let min = false; //Initialize false to pass to updateChart
    let max = false; //Initialize false to pass to updateChart
    updateChart(min, max); //call updateCart()
}

//gamesLost() function - Sets the graph's data set to gamesLostData
function gamesLost() {
    removeData(chart); //Remove data from the chart
    type = "Games Lost"; //Set type
    let min = false; //Initialize false to pass to updateChart
    let max = false; //Initialize false to pass to updateChart
    updateChart(min, max); //call updateCart()
}

//gamesPlayed() function - Sets the graph's data set to gamesPlayedData
function gamesPlayed() {
    removeData(chart); //Remove data from the chart
    type = "Games Played"; //Set type
    let min = false; //Initialize false to pass to updateChart
    let max = false; //Initialize false to pass to updateChart
    updateChart(min, max); //call updateCart()
}

//winRate() function - Sets the graph's data set to winRateData
function winRate() {
    removeData(chart); //Remove data from the chart
    type = "Win Rate"; //Set type
    let min = false; //Initialize false to pass to updateChart
    let max = false; //Initialize false to pass to updateChart
    updateChart(min, max); //call updateCart()
}

//averageScore() function - Sets the graph's data set to averageScoreData
function averageScore() {
    removeData(chart); //Remove data from the chart
    type = "Average Score"; //Set type
    let min = false; //Initialize false to pass to updateChart
    let max = false; //Initialize false to pass to updateChart
    updateChart(min, max); //call updateCart()
}

//timePlayed() function - Sets the graph's data set to timePlayedData
function timePlayed() {
    removeData(chart); //Remove data from the chart
    type = "Time Played"; //Set type
    let min = false; //Initialize false to pass to updateChart
    let max = false; //Initialize false to pass to updateChart
    updateChart(min, max); //call updateCart()
}