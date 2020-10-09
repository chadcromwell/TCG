/*---------------------------------------------------------------
* Author: Chad Cromwell
* Date: 2019-04-01
* Description: JavaScript for leaderboard.php. Provides functionality for AJAX/JSON communication with mySQL database.
*            - Updates/populates table with player information retrieved from database and dynamically shows/hides rows and buttons.
*            - Allows user to search through all players based off of nickname, stores all searches and allows user to select previous searches
*            - Allows user to sort by nickname, score, wins, losses, and win rate
*            - Allows user to go directly to top 10 players, or their position "globally" (amongst all players)
*            - Allows users to page through all ranks
*
* Functions: - updateRowIndex(string) function - Accepts a string ("right" or "left") and increments/decrements the rowIndex. If at first row, limits it to 0. If at end, limits it to allStatsArray-10 to prevent OOB
*            - updateTable(type) function - Accepts a string as a parameter (either "sort", "top10", or "global10", iterates through and updates cells accordingly
*            - show10Rows() function - Shows all ten row
*            - clearHighlight() function - Clears the highlight from the rows
*            - hideRow11() function - Hides the 11th row
*            - hideRightButton() function - Hides the right button if it is visible
*            - hideLeftButton() function - Hides the left button if it is visible
*            - showRightButton() function - Shows the right button if it is hidden
*            - showLeftButton() function - Shows the left button if it is hidden
*            - updateGlobalRankRow() function - Updates the globalRankRow
*            - sortNickname() function - Sorts allStatsArray by nickname
*            - sortScore() function - Sorts allStatsArray by score
*            - sortWins() function - Sorts allStatsArray by wins
*            - sortLosses() function - Sorts allStatsArray by losses
*            - sortWinRate() function - Sorts allStatsArray by win rate
*            - setHeader(string) function - Accepts a string and highlights the passed header "rank", "nickname", "score", "wins", "losses", "winRate" are all acceptable parameters
*            - resetSortBooleans(string) function - Resets all sort booleans to true except for the sort passed, if all is passed it resets all of them (used when top 10 or global are selected)
*            - endSearch() function - Used to clear the search variables/reset buttons
*            - clearSearchString() function - Clears the searchString variable
*            - updateRanks(string) function - Accepts a string such as "nickname", "score", "wins", "losses", "winRate" and updates the users rank based off of the new sorting of the allStatsArray
*            - removeArrows() function - Removes unicode arrows from table headers
*            - setRank() function - Iterates through newly sorted array and updates the user ranks accordingly
*            - searchRight() function - Increments to the next search element and updates the table
*            - searchLeft() function - Decrements to the previous search element and updates the table
---------------------------------------------------------------*/

//Variables
let userRank; //Hold user rank
let userRow; //Hold row user appears in for highlighting
let userStatArray; //Hold user stats
let searchUserRow; //Hold search user's row
let allStatsArray = []; //Hold all stats
let searchArray = []; //Holds indices of all matching users
let globalRankRow = 0; //Hold user rank out of all users sorted by user rank
let rowIndex = 0; //Initialize rowIndex to 0, keeps track of page index
let userNickname; //Holds user's nickname
let sortRankDir = true; //Used to determine sort direction
let sortNicknameDir = true; //Used to determine sort direction
let sortScoreDir = true; //Used to determine sort direction
let sortWinsDir = true; //Used to determine sort direction
let sortLossesDir = true; //Used to determine sort direction
let sortWinRateDir = true; //Used to determine sort direction
let curSort = ""; //Hold current sort type

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
                userStatArray = response["userStatArray"];
                allStatsArray = response["allStatsArray"];
                userRank = userStatArray[0].rank; //Assign user rank
                userNickname = userStatArray[0].nick; //Assign user nickname
                updateTable("top10"); //Call updateTable() to set initial table display to top 10

                for (let i = 0; i < allStatsArray.length; i++) {
                    if (allStatsArray[i].nick === userStatArray[0].nick) {
                        globalRankRow = i;
                        break;
                    }
                }
            }
        }
        else {
            console.log("Failed: " + xmlhttp.statusText);
        }
    }
};

//Send as POST to getLeaderboard.php
xmlhttp.open("GET", "../../lib/leaderboard/getLeaderboard.php", true); //Asynchronously open xmlhttp to getLeaderboard.php
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); //Set the request header
xmlhttp.send(); //Send JSON object

//updateRowIndex(string) function - Accepts a string ("right" or "left") and increments/decrements the rowIndex. If at first row, limits it to 0. If at end, limits it to allStatsArray-10 to prevent OOB
function updateRowIndex(string) {
    //If right
    if(string === "right") {
        rowIndex += 10; //Increment the rowIndex
        //If going past the end of the stats
        if(rowIndex >= allStatsArray.length-10) {
            rowIndex = allStatsArray.length-10; //Set rowIndex to 10 from the end to prevent OOB
            hideRightButton(); //Hide right button
            showLeftButton(); //Show left button
        }
    }

    //If left
    if(string === "left") {
        rowIndex -= 10; //Decrement the rowIndex
        //If going past the start of the stats
        if(rowIndex < 0) {
            rowIndex = 0; //Set rowIndex to 0 to prevent OOB
            hideLeftButton(); //Hide left button
            showRightButton(); //Show right button
        }
    }
}

//updateTable(type) function - Accepts a string as a parameter (either "sort", "top10", or "global10", iterates through and updates cells accordingly
let updateTable = function(type) {
    setRank(); //Set the user rank
    clearSearchString(); //Clear the search string
    let max = 0; //Holds max iteration amount for populating rows (if user is in top 10 or not determines how many iterations are needed for top 10 population)

    //If search - Update cells to show searched user--------------------------------------------------------------------
    if(type === "search") {
        resetSortBooleans("all"); //Reset all sort booleans
        setHeader(); //Reset all headers

        //Sort back by rank
        allStatsArray.sort(function (a, b) {
            return a.rank - b.rank;
        });

        updateGlobalRankRow(searchString); //Update global rank row with the search string

        //Show buttons
        showLeftButton();
        showRightButton();

        //If at the end for the ranks, hide right button
        if(allStatsArray.length-globalRankRow < 10) {
            hideRightButton(); //Hide the right button
        }

        //If user is in the top 10, hide the left button
        if(globalRankRow < 10) {
            hideLeftButton(); //Hide the left button
        }

        clearHighlight(); //Clear highlights

        //If user is not in the top 10, set rowIndex to 5 below their current position
        if(globalRankRow  > 10) {
            rowIndex = globalRankRow - 5; //rowIndex is 5 before the user rank
            searchUserRow = "row6"; //Set searchUserRow to 6 for highlighting
        }
        //Else, the user is in the top ten, set searchUserRow to their actual rank
        else {
            rowIndex = 0; //rowIndex is 0 because user is in top 10, so it's on the first page
            searchUserRow = "row"+(globalRankRow+1); //Set searchUserRow to Row#
        }

        let j = 0; //Index for iterating html rows

        //Iterate through all ranks
        for (let i = rowIndex; i < rowIndex+10; i++) {
            let rank = "rank" + (j + 1); //Assign rank
            let nickname = "nickname" + (j + 1); //Assign nickname
            let score = "score" + (j + 1); //Assign score
            let wins = "wins" + (j + 1); //Assign wins
            let losses = "losses" + (j + 1); //Assign loses
            let winRate = "winRate" + (j + 1); //Assign winRate

            //If i is within bounds of allStatsArray, update rows
            if (i < allStatsArray.length) {
                document.getElementById(rank).innerHTML = allStatsArray[i].rank; //Update HTML
                document.getElementById(nickname).innerHTML = allStatsArray[i].nick; //Update HTML
                document.getElementById(score).innerHTML = allStatsArray[i].score; //Update HTML
                document.getElementById(wins).innerHTML = allStatsArray[i].wins; //Update HTML
                document.getElementById(losses).innerHTML = allStatsArray[i].losses; //Update HTML
                document.getElementById(winRate).innerHTML = allStatsArray[i].winRate + "%"; //Update HTML
            }

            //If current iteration is OOB
            if (j+rowIndex+1 > (allStatsArray.length)) {
                document.getElementById("row" + (j + 1)).className += " d-none"; //Hide that row
            }

            j++; //Increment html index
        }
        document.getElementById(searchUserRow).className += " table-info"; //Add highlight to row the search user's rank
        hideRow11(); //Hide the 11th row
    }

    //If sort - Update cells to show players----------------------------------------------------------------------------
    if(type === "sort") {
        endSearch();
        show10Rows(); //Show the 10 rows
        hideRow11(); //Hide the 11th row
        hideLeftButton(); //Hide the left button because you can't go left
        showRightButton(); //Show the right button because you can go right

        updateGlobalRankRow(userNickname);

        //Show buttons
        showLeftButton();
        showRightButton();

        //If at the end for the ranks, hide right button and make sure left is shown
        if(allStatsArray.length-globalRankRow < 10) {
            hideRightButton(); //Hide the right button
        }

        //If user is in top 10, hide the left button
        if(globalRankRow < 10) {
            hideLeftButton(); //Hide the left button
        }

        clearHighlight(); //Clear highlights
        rowIndex = globalRankRow-5; //rowIndex is 5 before the user rank

        //If the user is not in the top 10, go to global position
        if(globalRankRow >= 10) {
            let j = 0; //Index for iterating html rows

            //Iterate through all ranks
            for (let i = rowIndex; i < globalRankRow+6; i++) {
                let rank = "rank" + (j + 1); //Assign rank
                let nickname = "nickname" + (j + 1); //Assign nickname
                let score = "score" + (j + 1); //Assign score
                let wins = "wins" + (j + 1); //Assign wins
                let losses = "losses" + (j + 1); //Assign loses
                let winRate = "winRate" + (j + 1); //Assign winRate

                //If not OOB of allStatsArray, update rows
                if (i < allStatsArray.length) {
                    document.getElementById(rank).innerHTML = allStatsArray[i].rank; //Update HTML
                    document.getElementById(nickname).innerHTML = allStatsArray[i].nick; //Update HTML
                    document.getElementById(score).innerHTML = allStatsArray[i].score; //Update HTML
                    document.getElementById(wins).innerHTML = allStatsArray[i].wins; //Update HTML
                    document.getElementById(losses).innerHTML = allStatsArray[i].losses; //Update HTML
                    document.getElementById(winRate).innerHTML = allStatsArray[i].winRate + "%"; //Update HTML
                }

                //If current iteration is OOB
                if (j+rowIndex+1 > (allStatsArray.length)) {
                    document.getElementById("row" + (j + 1)).className += " d-none"; //Hide that row
                }

                j++; //Increment html index
            }
            if(!document.getElementById("row6").classList.contains("table-info")) {
                document.getElementById("row6").className += " table-info"; //Add highlight to row 6
            }
        }
        else {
                max = 10; //Set max to 10
                userRow = "row"+(globalRankRow+1); //Update user row
                hideRow11();

            //Iterate through all ranks
            for (let i = 0; i < max; i++) {

                //Assign dynamic ids for updating html
                let rank = "rank" + (i+1); //Assign rank
                let nickname = "nickname" + (i+1); //Assign nickname
                let score = "score" + (i+1); //Assign score
                let wins = "wins" + (i+1); //Assign wins
                let losses = "losses" + (i+1); //Assign losses
                let winRate = "winRate" + (i+1); //Assign winRate

                //Update html
                document.getElementById(rank).innerHTML = allStatsArray[i].rank; //Update HTML
                document.getElementById(nickname).innerHTML = allStatsArray[i].nick; //Update HTML
                document.getElementById(score).innerHTML = allStatsArray[i].score; //Update HTML
                document.getElementById(wins).innerHTML = allStatsArray[i].wins; //Update HTML
                document.getElementById(losses).innerHTML = allStatsArray[i].losses; //Update HTML
                document.getElementById(winRate).innerHTML = allStatsArray[i].winRate + "%"; //Update HTML

                //If iterating to 11th position, only possible if user is not in top ten, add their stats to the 11th position
                if(i === 10) {
                    document.getElementById(rank).innerHTML = userStatArray[0].rank; //Update HTML
                    document.getElementById(nickname).innerHTML = userStatArray[0].nick; //Update HTML
                    document.getElementById(score).innerHTML = userStatArray[0].score; //Update HTML
                    document.getElementById(wins).innerHTML = userStatArray[0].wins; //Update HTML
                    document.getElementById(losses).innerHTML = userStatArray[0].losses; //Update HTML
                    document.getElementById(winRate).innerHTML = userStatArray[0].winRate + "%"; //Update HTML
                }
            }
            document.getElementById("row6").className = ""; //Remove row 6's highlight

            if(!document.getElementById(userRow).classList.contains("table-info")) {
                document.getElementById(userRow).className += " table-info"; //Add highlight to row 6
            }
        }
        hideRow11(); //Hide the 11th row
        }

    //If top10 - Update cells to show top 10 players--------------------------------------------------------------------
    if(type === "top10") {
        setArrow("down");
        endSearch();
        resetSortBooleans("all"); //Reset sort booleans
        //setHeader(); //Reset all headers

        //Sort back by rank
        allStatsArray.sort(function (a, b) {
            return a.rank - b.rank;
        });

        updateGlobalRankRow(userNickname); //Update global rank row with user's position

        show10Rows(); //Show the 10 rows
        hideLeftButton(); //Hide the left button because you can't go left
        showRightButton(); //Show the right button because you can go right

        rowIndex = 0; //Displaying top 10, so at the start of the stats

        //If the user is not in the top 10
        if(globalRankRow > 10) {
            max = 11; //Set max to 11
            userRow = "row11"; //User is in row 11
            showRow11(); //Show row 11
            //Iterate through all ranks
            for (let i = 0; i < max; i++) {

                //Assign dynamic ids for updating html
                let rank = "rank" + (i+1); //Assign rank
                let nickname = "nickname" + (i+1); //Assign nickname
                let score = "score" + (i+1); //Assign score
                let wins = "wins" + (i+1); //Assign wins
                let losses = "losses" + (i+1); //Assign losses
                let winRate = "winRate" + (i+1); //Assign winRate

                //Update html
                document.getElementById(rank).innerHTML = allStatsArray[i].rank; //Update HTML
                document.getElementById(nickname).innerHTML = allStatsArray[i].nick; //Update HTML
                document.getElementById(score).innerHTML = allStatsArray[i].score; //Update HTML
                document.getElementById(wins).innerHTML = allStatsArray[i].wins; //Update HTML
                document.getElementById(losses).innerHTML = allStatsArray[i].losses; //Update HTML
                document.getElementById(winRate).innerHTML = allStatsArray[i].winRate + "%"; //Update HTML

                //If iterating to 11th position, only possible if user is not in top ten, add their stats to the 11th position
                if(i === 10) {
                    document.getElementById(rank).innerHTML = allStatsArray[globalRankRow].rank; //Update HTML
                    document.getElementById(nickname).innerHTML = allStatsArray[globalRankRow].nick; //Update HTML
                    document.getElementById(score).innerHTML = allStatsArray[globalRankRow].score; //Update HTML
                    document.getElementById(wins).innerHTML = allStatsArray[globalRankRow].wins; //Update HTML
                    document.getElementById(losses).innerHTML = allStatsArray[globalRankRow].losses; //Update HTML
                    document.getElementById(winRate).innerHTML = allStatsArray[globalRankRow].winRate + "%"; //Update HTML
                }
            }
            document.getElementById("row6").className = ""; //Remove row 6's highlight

            //If the user row is not highlighted
            if(!document.getElementById(userRow).classList.contains("table-info")) {
                document.getElementById(userRow).className += " table-info"; //Add highlight to row 6
            }
        }

        //If the user is in the top 10
        else {
            max = 10; //Set max to 10
            userRow = "row"+(globalRankRow+1); //Update user row
            hideRow11(); //Hide row 11
            //Iterate through all ranks
            for (let i = 0; i < max; i++) {

                //Assign dynamic ids for updating html
                let rank = "rank" + (i+1); //Assign rank
                let nickname = "nickname" + (i+1); //Assign nickname
                let score = "score" + (i+1); //Assign score
                let wins = "wins" + (i+1); //Assign wins
                let losses = "losses" + (i+1); //Assign losses
                let winRate = "winRate" + (i+1); //Assign winRate

                //Update html
                document.getElementById(rank).innerHTML = allStatsArray[i].rank; //Update HTML
                document.getElementById(nickname).innerHTML = allStatsArray[i].nick; //Update HTML
                document.getElementById(score).innerHTML = allStatsArray[i].score; //Update HTML
                document.getElementById(wins).innerHTML = allStatsArray[i].wins; //Update HTML
                document.getElementById(losses).innerHTML = allStatsArray[i].losses; //Update HTML
                document.getElementById(winRate).innerHTML = allStatsArray[i].winRate + "%"; //Update HTML

                //If iterating to 11th position, only possible if user is not in top ten, add their stats to the 11th position
                if(i === 10) {
                    document.getElementById(rank).innerHTML = allStatsArray[globalRankRow].rank; //Update HTML
                    document.getElementById(nickname).innerHTML = allStatsArray[globalRankRow].nick; //Update HTML
                    document.getElementById(score).innerHTML = allStatsArray[globalRankRow].score; //Update HTML
                    document.getElementById(wins).innerHTML = allStatsArray[globalRankRow].wins; //Update HTML
                    document.getElementById(losses).innerHTML = allStatsArray[globalRankRow].losses; //Update HTML
                    document.getElementById(winRate).innerHTML = allStatsArray[globalRankRow].winRate + "%"; //Update HTML
                }
            }

            //If the user row is not highlighted
            if(!document.getElementById(userRow).classList.contains("table-info")) {
                document.getElementById(userRow).className += " table-info"; //Highlight it
            }
        }
        /*
        //Iterate through all ranks
        for (let i = 0; i < max; i++) {

            //Assign dynamic ids for updating html
            let rank = "rank" + (i+1); //Assign rank
            let nickname = "nickname" + (i+1); //Assign nickname
            let score = "score" + (i+1); //Assign score
            let wins = "wins" + (i+1); //Assign wins
            let losses = "losses" + (i+1); //Assign losses
            let winRate = "winRate" + (i+1); //Assign winRate

            //Update html
            document.getElementById(rank).innerHTML = allStatsArray[i].rank; //Update HTML
            document.getElementById(nickname).innerHTML = allStatsArray[i].nick; //Update HTML
            document.getElementById(score).innerHTML = allStatsArray[i].score; //Update HTML
            document.getElementById(wins).innerHTML = allStatsArray[i].wins; //Update HTML
            document.getElementById(losses).innerHTML = allStatsArray[i].losses; //Update HTML
            document.getElementById(winRate).innerHTML = allStatsArray[i].winRate + "%"; //Update HTML

            //If iterating to 11th position, only possible if user is not in top ten, add their stats to the 11th position
            if(i === 10) {
                document.getElementById(rank).innerHTML = allStatsArray[globalRankRow].rank; //Update HTML
                document.getElementById(nickname).innerHTML = allStatsArray[globalRankRow].nick; //Update HTML
                document.getElementById(score).innerHTML = allStatsArray[globalRankRow].score; //Update HTML
                document.getElementById(wins).innerHTML = allStatsArray[globalRankRow].wins; //Update HTML
                document.getElementById(losses).innerHTML = allStatsArray[globalRankRow].losses; //Update HTML
                document.getElementById(winRate).innerHTML = allStatsArray[globalRankRow].winRate + "%"; //Update HTML
            }
        }
        document.getElementById("row6").className = ""; //Remove row 6's highlight

        if(!document.getElementById(userRow).classList.contains("table-info")) {
            document.getElementById(userRow).className += " table-info"; //Add highlight to row 6
        }*/
    }

    //If global10 - Update cells to show global rank players (5 above, 5 below)-----------------------------------------
    if(type === "global10") {
        //setArrow("down");
        endSearch(); //End search
        resetSortBooleans("all"); //Reset all sort booleans

        //setHeader(); //Reset all headers
        //Sort back by rank
        /*allStatsArray.sort(function (a, b) {
            return a.rank - b.rank;
        });*/
        updateGlobalRankRow(userNickname);

        //Show buttons
        showLeftButton();
        showRightButton();

        //If at the end for the ranks, hide right button and make sure left is shown
        if(allStatsArray.length-globalRankRow < 10) {
            hideRightButton(); //Hide the right button
        }

        //If user is in top 10, hide the left button
        if(globalRankRow < 10) {
            hideLeftButton(); //Hide the left button
        }

        clearHighlight(); //Clear highlights
        rowIndex = globalRankRow-5; //rowIndex is 5 before the user rank

        //If the user is not in the top 10, go to global position
        if(globalRankRow > 10) {

            let j = 0; //Index for iterating html rows

            //Iterate through all ranks
            for (let i = globalRankRow-5; i < globalRankRow+6; i++) {
                let rank = "rank" + (j + 1); //Assign rank
                let nickname = "nickname" + (j + 1); //Assign nickname
                let score = "score" + (j + 1); //Assign score
                let wins = "wins" + (j + 1); //Assign wins
                let losses = "losses" + (j + 1); //Assign loses
                let winRate = "winRate" + (j + 1); //Assign winRate

                //If not OOB of allStatsArray, update rows
                if (i < allStatsArray.length) {
                    document.getElementById(rank).innerHTML = allStatsArray[i].rank; //Update HTML
                    document.getElementById(nickname).innerHTML = allStatsArray[i].nick; //Update HTML
                    document.getElementById(score).innerHTML = allStatsArray[i].score; //Update HTML
                    document.getElementById(wins).innerHTML = allStatsArray[i].wins; //Update HTML
                    document.getElementById(losses).innerHTML = allStatsArray[i].losses; //Update HTML
                    document.getElementById(winRate).innerHTML = allStatsArray[i].winRate + "%"; //Update HTML
                }

                //If current iteration is OOB
                if (j+rowIndex+1 > (allStatsArray.length)) {
                    document.getElementById("row" + (j + 1)).className += " d-none"; //Hide that row
                }

                j++; //Increment html index
            }
            document.getElementById("row6").className += " table-info"; //Add highlight to row 6
        }
        else {
            //Iterate through all ranks
            for (let i = 0; i < 10; i++) {

                //Assign dynamic ids for updating html
                let rank = "rank" + (i+1); //Assign rank
                let nickname = "nickname" + (i+1); //Assign nickname
                let score = "score" + (i+1); //Assign score
                let wins = "wins" + (i+1); //Assign wins
                let losses = "losses" + (i+1); //Assign losses
                let winRate = "winRate" + (i+1); //Assign winRate

                //Update html
                document.getElementById(rank).innerHTML = allStatsArray[i].rank; //Update HTML
                document.getElementById(nickname).innerHTML = allStatsArray[i].nick; //Update HTML
                document.getElementById(score).innerHTML = allStatsArray[i].score; //Update HTML
                document.getElementById(wins).innerHTML = allStatsArray[i].wins; //Update HTML
                document.getElementById(losses).innerHTML = allStatsArray[i].losses; //Update HTML
                document.getElementById(winRate).innerHTML = allStatsArray[i].winRate + "%"; //Update HTML
            }

            if(!document.getElementById("row"+(globalRankRow+1)).classList.contains("table-info")) {
                document.getElementById("row"+(globalRankRow+1)).className += " table-info";
            }
        }
        hideRow11(); //Hide the 11th row
    }

    //If pageRight - Update cells to show next users--------------------------------------------------------------------
    if(type === "pageRight") {
        endSearch();
        showLeftButton(); //Show the left button

        //If there is still more ranks to show
        if(rowIndex <= (allStatsArray.length-10)) {
            clearHighlight(); //Clear highlights
            hideRow11(); //Hide row 11, no need to show it when browsing.
            updateRowIndex("right"); //Paging right

            let j = 0; //Index for iterating html rows

            //Iterate through all ranks
            for (let i = 0; i < 10; i++) {
                let rank = "rank" + (j + 1); //Assign rank
                let nickname = "nickname" + (j + 1); //Assign nickname
                let score = "score" + (j + 1); //Assign score
                let wins = "wins" + (j + 1); //Assign wins
                let losses = "losses" + (j + 1); //Assign loses
                let winRate = "winRate" + (j + 1); //Assign winRate

                //If not OOB of allStatsArray, update rows
                if (i + rowIndex < allStatsArray.length) {
                    document.getElementById(rank).innerHTML = allStatsArray[i + rowIndex].rank; //Update HTML
                    document.getElementById(nickname).innerHTML = allStatsArray[i + rowIndex].nick; //Update HTML
                    document.getElementById(score).innerHTML = allStatsArray[i + rowIndex].score; //Update HTML
                    document.getElementById(wins).innerHTML = allStatsArray[i + rowIndex].wins; //Update HTML
                    document.getElementById(losses).innerHTML = allStatsArray[i + rowIndex].losses; //Update HTML
                    document.getElementById(winRate).innerHTML = allStatsArray[i + rowIndex].winRate + "%"; //Update HTML
                }

                //If current iteration is OOB
                if (i + rowIndex > allStatsArray.length) {
                    document.getElementById("row" + (i + 1)).className += " d-none"; //Hide that row
                }

                //If row matches user, highlight it
                if (allStatsArray[i + rowIndex].nick === userStatArray[0].nick) {
                    document.getElementById("row" + (i + 1)).className = " table-info"; //Highlight row
                }

                j++; //Increment html index
            }
        }
        hideRow11(); //Hide the 11th row
    }

    //If pageLeft - Update cells to show next users---------------------------------------------------------------------
    if(type === "pageLeft") {
        endSearch();
        clearHighlight(); //Clear highlights
        hideRow11(); //Hide the 11th row
        showRightButton(); //Show the right button
        updateRowIndex("left"); //Paging left

        //If at the top of ranks, hide left button
        if(rowIndex === 0) {
            hideLeftButton(); //Hide left button
        }

        let j = 0; //Index for iterating html rows

        //Iterate through all ranks
        for (let i = 0; i < 10; i++) {
            let rank = "rank" + (j + 1); //Assign rank
            let nickname = "nickname" + (j + 1); //Assign nickname
            let score = "score" + (j + 1); //Assign score
            let wins = "wins" + (j + 1); //Assign wins
            let losses = "losses" + (j + 1); //Assign loses
            let winRate = "winRate" + (j + 1); //Assign winRate

            //Update rows
            document.getElementById(rank).innerHTML = allStatsArray[i+rowIndex].rank; //Update HTML
            document.getElementById(nickname).innerHTML = allStatsArray[i+rowIndex].nick; //Update HTML
            document.getElementById(score).innerHTML = allStatsArray[i+rowIndex].score; //Update HTML
            document.getElementById(wins).innerHTML = allStatsArray[i+rowIndex].wins; //Update HTML
            document.getElementById(losses).innerHTML = allStatsArray[i+rowIndex].losses; //Update HTML
            document.getElementById(winRate).innerHTML = allStatsArray[i+rowIndex].winRate + "%"; //Update HTML

            //If nicknmes match, highlight the row
            if(allStatsArray[i+rowIndex].nick === userStatArray[0].nick) {
                document.getElementById("row"+(i+1)).className = " table-info"; //Highlight the row
            }

            j++; //Increment html index
        }
        hideRow11(); //Hide the 11th row
    }
};

//show10Rows() function - Shows all ten row
function show10Rows() {
    //Iterate through 10 rows
    for(let i = 1; i <= 10; i++) {
        document.getElementById("row"+i).className -= " d-none";
    }
}

//clearHighlight() function - Clears the highlight from the rows
function clearHighlight() {
    //Iterate through all rows
    for(let i = 1; i <= 11; i++) {
        document.getElementById("row"+i).className = ""; //Remove highlight from row
    }
}

//hideRow11() function - Hides the 11th row
function hideRow11() {
    if(!document.getElementById("row11").classList.contains("d-none")) {
        document.getElementById("row11").className += " d-none";
    }
}

//showRow11() function - show the 11th row
function showRow11() {
    if(document.getElementById("row11").classList.contains("d-none")) {
        document.getElementById("row11").className -= " d-none";
    }
}

//hideRightButton() function - Hides the right button if it is visible
function hideRightButton() {
    //If the button is being shown, hide it
    if(document.getElementById("rightButton").classList.contains("visible")) {
        document.getElementById("rightButton").className = document.getElementById("rightButton").className.replace("visible", "invisible"); //Hide it
    }
}

//hideLeftButton() function - Hides the left button if it is visible
function hideLeftButton() {
    //If the button is being shown, hide it
    if(document.getElementById("leftButton").classList.contains("visible")) {
        document.getElementById("leftButton").className = document.getElementById("leftButton").className.replace("visible", "invisible"); //Hide it
    }
}

//showRightButton() function - Shows the right button if it is hidden
function showRightButton() {
    //If the button is being shown, hide it
    if(document.getElementById("rightButton").classList.contains("invisible")) {
        document.getElementById("rightButton").className = document.getElementById("rightButton").className.replace("invisible", "visible"); //Hide it
    }
}

//showLeftButton() function - Shows the left button if it is hidden
function showLeftButton() {
    //If the button is being shown, hide it
    if(document.getElementById("leftButton").classList.contains("invisible")) {
        document.getElementById("leftButton").className = document.getElementById("leftButton").className.replace("invisible", "visible"); //Hide it
    }
}

//updateGlobalRankRow() function - Updates the globalRankRow
function updateGlobalRankRow(nick) {

    //If passed nickname is the user's nickname, perform regular search
    if(nick === userNickname) {
        //Iterate through allStatsArray
        for (let i = 0; i < allStatsArray.length; i++) {
            //If there is a match
            if (allStatsArray[i].nick === nick) {
                globalRankRow = i; //Update globalRankRow
                break; //Break out of loop
            }
        }
    }
    //Else, search for user name that has been provided by user
    else {
        //Iterate through allStatsArray
        for (let i = 0; i < allStatsArray.length; i++) {
            //If there is a match
            if (allStatsArray[i].nick.toUpperCase().includes(nick.toUpperCase())) {
                //globalRankRow = i; //Update globalRankRow
            }
        }
    }
}

//updateRanks(string) function - Accepts a string such as "nickname", "score", "wins", "losses", "winRate" and updates the users rank based off of the new sorting of the allStatsArray
function updateRanks(string) {
    let lastElement = allStatsArray[0];
    lastElement.rank = 1;
    let rankCount = 1;

    if(string === "nickname") {
        //Iterate through all stats
        for(let i = 0; i < allStatsArray.length; i++) {
            allStatsArray[i].rank = (i+1);
        }
    }
    else {
        //Iterate through all stats
        for (let i = 1; i < allStatsArray.length; i++) {

            if (string === "nickname") {
                allStatsArray[i].rank = rankCount;
                rankCount++;
            }

            if (string === "score") {
                //If current stat matches the previous one, they are tied
                if (lastElement.score === allStatsArray[i].score) {
                    allStatsArray[i].rank = lastElement.rank;
                }
                //Else, increment the rank counter and assign that rank to the current player
                else {
                    rankCount++;
                    allStatsArray[i].rank = rankCount;
                    lastElement = allStatsArray[i];
                }
            }

            if (string === "wins") {
                //If current stat matches the previous one, they are tied
                if (lastElement.wins === allStatsArray[i].wins) {
                    allStatsArray[i].rank = lastElement.rank;
                }
                //Else, increment the rank counter and assign that rank to the current player
                else {
                    rankCount++;
                    allStatsArray[i].rank = rankCount;
                    lastElement = allStatsArray[i];
                }
            }

            if (string === "losses") {
                //If current stat matches the previous one, they are tied
                if (lastElement.losses === allStatsArray[i].losses) {
                    allStatsArray[i].rank = lastElement.rank;
                }
                //Else, increment the rank counter and assign that rank to the current player
                else {
                    rankCount++;
                    allStatsArray[i].rank = rankCount;
                    lastElement = allStatsArray[i];
                }
            }

            if (string === "winRate") {
                //If current stat matches the previous one, they are tied
                if (lastElement.winRate === allStatsArray[i].winRate) {
                    allStatsArray[i].rank = lastElement.rank;
                }
                //Else, increment the rank counter and assign that rank to the current player
                else {
                    rankCount++;
                    allStatsArray[i].rank = rankCount;
                    lastElement = allStatsArray[i];
                }
            }

        }
    }
}

//clearSearchString() function - Clears the searchString variable
function clearSearchString() {
    searchString = "";
}

//removeArrows() function - Removes unicode arrows from table headers
function removeArrows() {
    document.getElementById("nicknameHeader").innerHTML = "Nickname";
    document.getElementById("scoreHeader").innerHTML = "Score";
    document.getElementById("winsHeader").innerHTML = "Wins";
    document.getElementById("lossesHeader").innerHTML = "Losses";
    document.getElementById("winRateHeader").innerHTML = "Win Rate";
}

function setArrow(string) {
    removeArrows();
    if(curSort === "nickname") {
        if (string === "up") {
            document.getElementById("nicknameHeader").innerHTML = "Nickname &#8593;";
        }
        else if (string === "down") {
            document.getElementById("nicknameHeader").innerHTML = "Nickname &#8595;";
        }
    }
    else if(curSort === "score") {
       if (string === "up") {
            document.getElementById("scoreHeader").innerHTML = "Score &#8593;";
        }
        else if (string === "down") {
            document.getElementById("scoreHeader").innerHTML = "Score &#8595;";
        }
    }
    else if(curSort === "wins") {
       if (string === "up") {
            document.getElementById("winsHeader").innerHTML = "Wins &#8593;";
        }
        else if (string === "down") {
            document.getElementById("winsHeader").innerHTML = "Wins &#8595;";
        }
    }
    else if(curSort === "losses") {
       if (string === "up") {
            document.getElementById("lossesHeader").innerHTML = "Losses &#8593;";
        }
        else if (string === "down") {
            document.getElementById("lossesHeader").innerHTML = "Losses &#8595;";
        }
    }
    else if(curSort === "winRate") {
       if (string === "up") {
            document.getElementById("winRateHeader").innerHTML = "Win Rate &#8593;";
        }
        else if (string === "down") {
            document.getElementById("winRateHeader").innerHTML = "Win Rate &#8595;";
        }
    }
}
//sortNickname() function - Sorts allStatsArray by nickname
function sortNickname() {
    curSort = "nickname";
    resetSortBooleans("nickname"); //Reset sort booleans except for nickname
    setHeader("nickname"); //Set the nickname header to show selection
    //If boolean is true, sort ascending
    if(sortNicknameDir) {
        removeArrows();
        document.getElementById("nicknameHeader").innerHTML = "Nickname &#8595;";
        allStatsArray.sort((a, b) => (a.nick.toUpperCase() > b.nick.toUpperCase()) ? 1 : -1);
        sortNicknameDir = false;
        updateRanks("nickname"); //Update ranks by nickname
    }
    //Else, sort descending
    else {
        document.getElementById("nicknameHeader").innerHTML = "Nickname &#8593;";
        allStatsArray.sort((a, b) => (a.rank > b.rank) ? -1 : 1);
        sortNicknameDir = true;
    }
    updateTable("sort"); //Update the table
}

//sortScore() function - Sorts allStatsArray by score
function sortScore() {
    curSort = "score";
    resetSortBooleans("score"); //Reset sort booleans except for score
    setHeader("score"); //Set the score header to show selection
    //If boolean is true, sort ascending
    if(sortScoreDir) {
        removeArrows(); //Remove arrows
        document.getElementById("scoreHeader").innerHTML = "Score &#8595;"; //Add down arrow to score header
        allStatsArray.sort(function (a, b) {
            return b.score - a.score;
        });
        sortScoreDir = false;
        updateRanks("score"); //Update ranks by score
    }
    //Else, sort descending
    else {
        document.getElementById("scoreHeader").innerHTML = "Score &#8593;"; //Add up arrow to score header
        allStatsArray.sort(function (a, b) {
            return a.score - b.score;
        });
        sortScoreDir = true;
    }
    updateTable("sort"); //Update the table
}

//sortWins() function - Sorts allStatsArray by wins
function sortWins() {
    curSort = "wins";
    resetSortBooleans("wins"); //Reset sort booleans except for wins
    setHeader("wins"); //Set the wins header to show selection
    //If boolean is true, sort ascending
    if(sortWinsDir) {
        removeArrows(); //Remove arrows
        document.getElementById("winsHeader").innerHTML = "Wins &#8595;"; //Add down arrow to wins header
        allStatsArray.sort(function (a, b) {
            return b.wins - a.wins;
        });
        sortWinsDir = false;
        updateRanks("wins"); //Update ranks by wins
    }
    //Else, sort descending
    else {
        document.getElementById("winsHeader").innerHTML = "Wins &#8593;"; //Add up arrow to wins header
        allStatsArray.sort(function (a, b) {
            return a.wins - b.wins;
        });
        sortWinsDir = true;
    }
    updateTable("sort"); //Update the table
}

//sortLosses() function - Sorts allStatsArray by losses
function sortLosses() {
    curSort = "losses";
    resetSortBooleans("losses"); //Reset sort booleans except for losses
    setHeader("losses"); //Set the losses header to show selection
    //If boolean is true, sort ascending
    if(sortLossesDir) {
        removeArrows(); //Remove arrows
        document.getElementById("lossesHeader").innerHTML = "Losses &#8595;"; //Add down arrow to losses header
        allStatsArray.sort(function (a, b) {
            return a.losses - b.losses;
        });
        sortLossesDir = false;
        updateRanks("losses"); //Update ranks by losses
    }
    //Else, sort descending
    else {
        document.getElementById("lossesHeader").innerHTML = "Losses &#8593;"; //Add up arrow to losses header
        allStatsArray.sort(function (a, b) {
            return b.losses - a.losses;
        });
        sortLossesDir = true;
    }
    updateTable("sort"); //Update the table
}

//sortWinRate() function - Sorts allStatsArray by win rate
function sortWinRate() {
    curSort = "winRate";
    resetSortBooleans("winRate"); //Reset sort booleans except for win rate
    setHeader("winRate"); //Set the win rate header to show selection
    //If boolean is true, sort ascending
    if(sortWinRateDir) {
        removeArrows();
        document.getElementById("winRateHeader").innerHTML = "Win Rate &#8595;"; //Add down arrow to win rate header
        allStatsArray.sort(function (a, b) {
            return b.winRate - a.winRate;
        });
        sortWinRateDir = false;
        updateRanks("winRate"); //Update ranks by win rate
    }
    //Else, sort descending
    else {
        document.getElementById("winRateHeader").innerHTML = "Win Rate &#8593;"; //Add up arrow to win rate header
        allStatsArray.sort(function (a, b) {
            return a.winRate - b.winRate;
        });
        sortWinRateDir = true;
    }
    updateTable("sort"); //Update the table
}

//setRank() function - Iterates through newly sorted array and updates the user ranks accordingly
function setRank() {
    for(let i = 0; i < allStatsArray.length; i++) {
        if(allStatsArray[i].nick === userNickname) {
            userRank = (i+1);
        }
    }
}

//setHeader(string) function - Accepts a string and highlights the passed header "rank", "nickname", "score", "wins", "losses", "winRate" are all acceptable parameters. If nothing is passed, it will clear all headers.
function setHeader(string) {

    //Clear highlight from all headers
    document.getElementById("nicknameHeader").className = "header";
    document.getElementById("scoreHeader").className = "header";
    document.getElementById("winsHeader").className = "header";
    document.getElementById("lossesHeader").className = "header";
    document.getElementById("winRateHeader").className = "header";

    //If "nickname" is passed
    if(string === "nickname") {
        document.getElementById("nicknameHeader").className = "selectedHeader"; //Highlight it
    }

    //If "score" is passed
    if(string === "score") {
        document.getElementById("scoreHeader").className = "selectedHeader"; //Highlight it
    }

    //If "wins" is passed
    if(string === "wins") {
        document.getElementById("winsHeader").className = "selectedHeader"; //Highlight it
    }

    //If "losses" is passed
    if(string === "losses") {
        document.getElementById("lossesHeader").className = "selectedHeader"; //Highlight it
    }

    //If "winRate" is passed
    if(string === "winRate") {
        document.getElementById("winRateHeader").className = "selectedHeader"; //Highlight it
    }
}

//resetSortBooleans(string) function - Resets all sort booleans to true except for the sort passed, if all is passed it resets all of them (used when top 10 or global are selected)
function resetSortBooleans(string) {

    //If "rank" is passed, set all but rank boolean to true
    if(string === "rank") {
        sortNicknameDir = true;
        sortScoreDir = true;
        sortWinsDir = true;
        sortLossesDir = true;
        sortWinRateDir = true;
    }

    //If "nickname" is passed, set all but nickname boolean to true
    if(string === "nickname") {
        sortRankDir = true;
        sortScoreDir = true;
        sortWinsDir = true;
        sortLossesDir = true;
        sortWinRateDir = true;
    }

    //If "score" is passed, set all but score boolean to true
    if(string === "score") {
        sortRankDir = true;
        sortNicknameDir = true;
        sortWinsDir = true;
        sortLossesDir = true;
        sortWinRateDir = true;
    }

    //If "wins" is passed, set all but wins boolean to true
    if(string === "wins") {
        sortRankDir = true;
        sortNicknameDir = true;
        sortScoreDir = true;
        sortLossesDir = true;
        sortWinRateDir = true;
    }

    //If "losses" is passed, set all but losses boolean to true
    if(string === "losses") {
        sortRankDir = true;
        sortNicknameDir = true;
        sortScoreDir = true;
        sortWinsDir = true;
        sortWinRateDir = true;
    }

    //If "winRate" is passed, set all but winRate boolean to true
    if(string === "winRate") {
        sortRankDir = true;
        sortNicknameDir = true;
        sortScoreDir = true;
        sortWinsDir = true;
        sortLossesDir = true;
    }

    //If "all" is passed, set all but all boolean to true
    if(string === "all") {
        sortRankDir = true;
        sortNicknameDir = true;
        sortScoreDir = true;
        sortWinsDir = true;
        sortLossesDir = true;
        sortWinRateDir = true;
    }
}

//searchRight() function - Increments to the next search element and updates the table
function searchRight() {
    //If there's still elements to search through to the right
    if(searchIndex < searchArray.length-1) {
        searchIndex++; //Incremenet searchIndex
        globalRankRow = searchArray[searchIndex]; //Assign globalRankRow
        updateTable("search"); //Update the table by calling "search"
    }
    //If there's nothing else to search to the right, so hide right button
    if(searchIndex === searchArray.length-1) {
        if(document.getElementById("rightSearchButton").classList.contains("visible")) {
            document.getElementById("rightSearchButton").className = document.getElementById("rightSearchButton").className.replace("visible", "invisible");
        }
    }
    //If not in top 10 and there's more to search, show left button
    if(searchIndex !== 0) {
        if(document.getElementById("leftSearchButton").classList.contains("invisible")) {
            document.getElementById("leftSearchButton").className = document.getElementById("leftSearchButton").className.replace("invisible", "visible");
        }
    }
}

//searchLeft() function - Decrements to the previous search element and updates the table
function searchLeft() {
    //If there's still search to do
    if(searchIndex > 0) {
        searchIndex--; //Incremenet searchIndex
        globalRankRow = searchArray[searchIndex]; //Assign globalRankRow
        updateTable("search"); //Update the table by calling "search"
    }
    //If there's nothing else to search to the left, so hide left button
    if(searchIndex === 0) {
        if(document.getElementById("leftSearchButton").classList.contains("visible")) {
            document.getElementById("leftSearchButton").className = document.getElementById("leftSearchButton").className.replace("visible", "invisible");
        }
    }
    //If there's more to search to the right, show right button
    if(searchIndex !== searchIndex.length-1) {
        if (document.getElementById("rightSearchButton").classList.contains("invisible")) {
            document.getElementById("rightSearchButton").className = document.getElementById("rightSearchButton").className.replace("invisible", "visible");
        }
    }
}

//dynamicSearch(string) function - Accepts a string and performs the search, used from dynamically created dropdown-items
function dynamicSearch(string) {
    document.getElementById("search").value = string; //Update value in the search form to reflect new search
    //If the submitted search string has changed from what it previously was, update the searchString variable and iterate through allStatsArray to get array of indices with matches
    searchArray = []; //Reset the searchArray
    searchIndex = 0; //Reset searchIndex because the user has initiated a new search
    searchString = string; //Assign passed string value as searchString

    //Iterate through allStatsArray
    for (let i = 0; i < allStatsArray.length; i++) {

        //If there is a match
        if (allStatsArray[i].nick.toUpperCase().includes(searchString.toUpperCase())) {
            searchArray.push(i); //Push the rank into searchArray
        }
    }
    globalRankRow = searchArray[searchIndex]; //Assign globalRankRow

    if(searchArray.length > 0) {
        updateTable("search"); //Update the table by calling "search"
    }

    //If there's nothing left to search to the right, hide right button
    if(searchIndex >= searchArray.length-1) {
        if(document.getElementById("rightSearchButton").classList.contains("visible")) {
            document.getElementById("rightSearchButton").className = document.getElementById("rightSearchButton").className.replace("visible", "invisible");
        }
    }

    //If searchIndex is at or below 0, hide left search button
    if(searchIndex <= 0) {
        if(document.getElementById("leftSearchButton").classList.contains("visible")) {
            document.getElementById("leftSearchButton").className = document.getElementById("leftSearchButton").className.replace("visible", "invisible");
        }
    }

    //If rank is not on last page and there's something to search, show right search button
    if(globalRankRow < allStatsArray.length-10 && searchArray.length > 1) {
        if (document.getElementById("rightSearchButton").classList.contains("invisible")) {
            document.getElementById("rightSearchButton").className = document.getElementById("rightSearchButton").className.replace("invisible", "visible");
        }
    }
}

let allSearches = []; //Holds all previous search strings
let searchIndex = 0; //Holds current search index
//Form eventListener - Captures search form submission and assigns it to searchString, prevents default refresh, updates filters and calls relevant functions
let searchString = ""; //Hold submitted string
document.getElementById("searchForm").addEventListener("submit", function(e) {

    //If the past searches button is not visible yet
    if(document.getElementById("pastSearchesButton").classList.contains("invisible")) {
        document.getElementById("pastSearchesButton").className = document.getElementById("pastSearchesButton").className.replace("invisible", "visible");
    }

    //If the submitted search string has changed from what it previously was, update the searchString variable and iterate through allStatsArray to get array of indices with matches
    if(searchString !== document.getElementById("search").value) {
        searchArray = [];
        searchIndex = 0; //Reset searchIndex because the user has initiated a new search
        searchString = document.getElementById("search").value; //Capture string

        let bool = true; //Used to determine if the searchString already exists in allSearches array
        //Iterate through allSearches
        for(let i = 0; i < allSearches.length; i++) {
            //If this searchstring already exists
            if(allSearches[i] === searchString) {
                bool = false; //Don't add it to the allSearches array
            }
        }
        //If bool is still true, add the searchString to allSearches
        if(bool) {
            allSearches.push(searchString); //Store search information in allSearches
            document.getElementById("pastSearches").innerHTML += "<a class=\"dropdown-item\" onClick=\"dynamicSearch(\'" +searchString+ "\')\">" + searchString + "</a>";
        }

        //Iterate through allStatsArray
        for (let i = 0; i < allStatsArray.length; i++) {

            //If there is a match
            if (allStatsArray[i].nick.toUpperCase().includes(searchString.toUpperCase())) {
                searchArray.push(i); //Push the rank into searchArray
            }
        }
    }
    e.preventDefault(); //Prevent default refresh
    globalRankRow = searchArray[searchIndex]; //Assign globalRankRow

    if(searchArray.length > 0) {
        updateTable("search"); //Update the table by calling "search"
    }

    //If there's nothing left to search to the right, hide right button
    if(searchIndex >= searchArray.length-1) {
        if(document.getElementById("rightSearchButton").classList.contains("visible")) {
            document.getElementById("rightSearchButton").className = document.getElementById("rightSearchButton").className.replace("visible", "invisible");
        }
    }

    //If searchIndex is at or below 0, hide left search button
    if(searchIndex <= 0) {
        if(document.getElementById("leftSearchButton").classList.contains("visible")) {
            document.getElementById("leftSearchButton").className = document.getElementById("leftSearchButton").className.replace("visible", "invisible");
        }
    }

    //If rank is not on last page and there's something to search, show right search button
    if(globalRankRow < allStatsArray.length-10 && searchArray.length > 1) {
        if (document.getElementById("rightSearchButton").classList.contains("invisible")) {
            document.getElementById("rightSearchButton").className = document.getElementById("rightSearchButton").className.replace("invisible", "visible");
        }
    }
});

//endSearch() function - Used to clear the search variables/reset buttons
function endSearch() {

    //If right button is visible, hide it
    if(document.getElementById("rightSearchButton").classList.contains("visible")) {
        document.getElementById("rightSearchButton").className = document.getElementById("rightSearchButton").className.replace("visible", "invisible");
    }

    //If left button is visible, hide it
    if(document.getElementById("leftSearchButton").classList.contains("visible")) {
        document.getElementById("leftSearchButton").className = document.getElementById("leftSearchButton").className.replace("visible", "invisible");
    }
    searchArray = []; //Reset search array
    searchIndex = 0; //Reset search index
    document.getElementById("search").value = ""; //Reset search form value
}