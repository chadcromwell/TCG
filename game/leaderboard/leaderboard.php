<!--
* Author: Chad Cromwell
* Date: 2019-04-01
* Description: A leaderboard that displays the top 10 players and the current users rank. The user may also view the
*              leaderboard in reference to their rank, displaying the 5 players above and below them. Shows rank, username, score,
*              wins, losses, and win rate.
*            - Uses Bootstrap framework for responsive design
 -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset=UTF-8"> <!--UTF-8 charset-->
    <meta name ="viewport" content="width=device-width, initial-scale=1"> <!--Default to mobile-->
    <title>Leader Board</title>
    <link rel="stylesheet" href="../css/bootstrap/bootstrap.min.css"> <!--Bootstrap css-->
    <script src="../js/jquery/jquery.min.js"></script>
    <script src="../js/popper/popper.min.js"></script>
    <script src="../js/bootstrap/bootstrap.min.js"></script> <!--Bootstrap js--->
    <link href="../css/leaderboard/leaderboard.css" rel="stylesheet"> <!--CSS-->
</head>
<?php
    session_start(); //Start session (cookies)
    include '../../lib/dbConnection.php'; //Include db connection to connect to db
    $userId = $_SESSION['userId']; //Assign userId from session to $userId
?>
<body>
<div class="wrap">
<!--Header-->
<div class="container-fluid">
    <div class="row">
        <div class="col-12 text-center">
            <p class="display-1"  style="font-size: 6vw">
                Leader Board
            </p>
        </div>
    </div>
</div>
<!--Jumbotron-->
<div class="container-fluid">
<div class="row jumbotron" style="padding: 1vh">
    <div class="col-12 text-center">
        <div class="row">
            <div class="col">
                <form id="searchForm">
                    <div class="form-inline float-right">
                        <input type="text" class="form-control" id="search" placeholder="Search">
                        <button type="submit" class="btn btn-outline-secondary">Search</button>
                    </div>
                </form>
                <button class="float-right btn btn-outline-secondary dropdown-toggle invisible" id="pastSearchesButton" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Past Searches
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="pastSearches">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button type="button" class="mr-4 px-5 my-1 float-right btn btn-outline-secondary btn-lg invisible" id="rightSearchButton" onclick="searchRight()">></button> <!--Right button-->
                <button type="button" class="mr-4 px-5 my-1 float-right btn btn-outline-secondary btn-lg invisible" id="leftSearchButton" onclick="searchLeft()"><</button> <!--Left button-->
            </div>
        </div>
        <table class="table table-hover">
            <!--Table head-->
            <thead class="thead-dark table-hover-light">
                <tr>
                    <th scope="col">Rank</th>
                    <th scope="col" onclick="sortNickname()"><div class="header" id="nicknameHeader">Nickname</div></th>
                    <th scope="col" onclick="sortScore()"><div class="header" id="scoreHeader">Score</div></th>
                    <th scope="col" onclick="sortWins()"><div class="header" id="winsHeader">Wins</div></th>
                    <th scope="col" onclick="sortLosses()"><div class="header" id="lossesHeader">Losses</div></th>
                    <th scope="col" onclick="sortWinRate()"><div class="header" id="winRateHeader">Win Rate</div></th>
                </tr>
            </thead>
            <!--Table body-->
            <tbody>
            <!--Row 1-->
            <tr id="row1">
                <th id="rank1" scope="row">1</th>
                <td id="nickname1"></td>
                <td id="score1"></td>
                <td id="wins1"></td>
                <td id="losses1"></td>
                <td id="winRate1"></td>
            </tr>
            <!--Row 2-->
            <tr id="row2">
                <th id="rank2" scope="row">2</th>
                <td id="nickname2"></td>
                <td id="score2"></td>
                <td id="wins2"></td>
                <td id="losses2"></td>
                <td id="winRate2"></td>
            </tr>
            <!--Row 3-->
            <tr id="row3">
                <th id="rank3" scope="row">3</th>
                <td id="nickname3"></td>
                <td id="score3"></td>
                <td id="wins3"></td>
                <td id="losses3"></td>
                <td id="winRate3"></td>
            </tr>
            <!--Row 4-->
            <tr id="row4">
                <th id="rank4" scope="row">4</th>
                <td id="nickname4"></td>
                <td id="score4"></td>
                <td id="wins4"></td>
                <td id="losses4"></td>
                <td id="winRate4"></td>
            </tr>
            <!--Row 5-->
            <tr id="row5">
                <th id="rank5" scope="row">5</th>
                <td id="nickname5"></td>
                <td id="score5"></td>
                <td id="wins5"></td>
                <td id="losses5"></td>
                <td id="winRate5"></td>
            </tr>
            <!--Row 6-->
            <tr id="row6">
                <th id="rank6" scope="row">6</th>
                <td id="nickname6"></td>
                <td id="score6"></td>
                <td id="wins6"></td>
                <td id="losses6"></td>
                <td id="winRate6"></td>
            </tr>
            <!--Row 7-->
            <tr id="row7">
                <th id="rank7" scope="row">7</th>
                <td id="nickname7"></td>
                <td id="score7"></td>
                <td id="wins7"></td>
                <td id="losses7"></td>
                <td id="winRate7"></td>
            </tr>
            <!--Row 8-->
            <tr id="row8">
                <th id="rank8" scope="row">8</th>
                <td id="nickname8"></td>
                <td id="score8"></td>
                <td id="wins8"></td>
                <td id="losses8"></td>
                <td id="winRate8"></td>
            </tr>
            <!--Row 9-->
            <tr id="row9">
                <th id="rank9" scope="row">9</th>
                <td id="nickname9"></td>
                <td id="score9"></td>
                <td id="wins9"></td>
                <td id="losses9"></td>
                <td id="winRate9"></td>
            </tr>
            <!--Row 10-->
            <tr id="row10">
                <th id="rank10" scope="row">10</th>
                <td id="nickname10"></td>
                <td id="score10"></td>
                <td id="wins10"></td>
                <td id="losses10"></td>
                <td id="winRate10"></td>
            </tr>
            <!--Row 11-->
            <tr id="row11" class="table-info">
                <th id="rank11" scope="row">11</th>
                <td id="nickname11"></td>
                <td id="score11"></td>
                <td id="wins11"></td>
                <td id="losses11"></td>
                <td id="winRate11"></td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--Buttons-->
    <div class="col-12 text-center"> <!--In full width container-->
        <button type="button" class="btn btn-outline-secondary btn-lg" onclick="updateTable('top10')">Top 10</button> <!--Top 10 button-->
        <button type="button" class="btn btn-outline-secondary btn-lg" onclick="updateTable('global10')">Global</button> <!--Global button-->
    </div>
    <div class="col-12 text-center">
        <button type="button" class="px-5 mt-1 btn btn-outline-secondary btn-lg invisible" id="leftButton" onclick="updateTable('pageLeft')"><</button> <!--Left button-->
        <button type="button" class="px-5 mt-1 btn btn-outline-secondary btn-lg visible" id="rightButton" onclick="updateTable('pageRight')">></button> <!--Right button-->
    </div>
</div>
</div>
</div>
<script src="../js/leaderboard/leaderboard.js"></script> <!--leaderboard JavaScript file-->
</body>
</html>