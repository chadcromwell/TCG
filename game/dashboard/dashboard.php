<!--
* Author: Chad Cromwell
* Date: 2019-04-10
* Description: A dashboard that displays the user's statistics with a bubble graph in relation to filters such as all, date, month, year, and day of the week
*              The six statistics available are: games won, games lost, games played, win rate, average score per game, and time played.
*              Games won is what is initially displayed.
*
*            - Uses Bootstrap.js framework for responsive design
*            - Uses chart.js framework for charting
 -->

<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/html" style="height: 100%">
<head>
    <meta charset=UTF-8"> <!--UTF-8 charset-->
    <meta name ="viewport" content="width=device-width, initial-scale=1"> <!--Default to mobile-->
    <title>Dashboard</title>
    <link rel="stylesheet" href="../css/bootstrap/bootstrap.min.css"> <!--Bootstrap css-->
    <script src="../js/jquery/jquery.min.js"></script>
    <script src="../js/popper/popper.min.js"></script>
    <script src="../js/moment/moment.js"></script>
    <script src="../js/bootstrap/bootstrap.min.js"></script> <!--Bootstrap js--->
    <script src="../js/chart/Chart.js"></script>
    <link href="../css/dashboard/dashboard.css" rel="stylesheet"> <!--CSS-->
</head>
<?php
session_start(); //Start session (cookies)
include '../../lib/dbConnection.php'; //Include db connection to connect to db
$userId = $_SESSION['userId']; //Assign userId from session to $userId
?>
<body>
<div class="wrapper">
<!--Header-->
<div class="container-fluid">
    <div class="row">
        <div class="col-12 text-center">
            <p class="display-1" style="font-size: 6vw;">
                Dashboard
            </p>
        </div>
    </div>
</div>
<!--Jumbotron-->
<div class="container-fluid jumbotron py-1">
    <!--Date picker-->
    <div class="row">
        <div class="dropdown mt-1">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="timeFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Time: All
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" onclick="filterAll()" style="font-size: 1vh">All</a>
                <a class="dropdown-item" onclick="filterToday()" style="font-size: 1vh">Today</a>
                <a class="dropdown-item" onclick="filterYesterday()" style="font-size: 1vh">Yesterday</a>
                <a class="dropdown-item" onclick="filterWeek()" style="font-size: 1vh">Week</a>
                <a class="dropdown-item" onclick="filterMonth()" style="font-size: 1vh">Month</a>
            </div>
        </div>
        <div class="col-12 col-lg-8 col-xl-6 mt-1 mx-auto input-group">

            <!--From date-->
            <div class="input-group-prepend">
                <span class="input-group-text" style="font-size: 1vh">From</span> <!--"From" label-->
            </div>
            <input type="date" aria-label="From" class="form-control" placeholder="YYYY-MM-DD" id="fromDate" style="font-size: 1vh"> <!--From form-->

            <div class="mx-3"></div> <!--Spacer-->

            <!--To date-->
            <div class="input-group-prepend">
                <span class="input-group-text" style="font-size: 1vh">To</span> <!--"To" label-->
            </div>
            <input type="date" aria-label="To" class="form-control" placeholder="YYYY-MM-DD" id="toDate" style="font-size: 1vh"> <!--To form-->
        </div>
    </div>

    <div class="row">
        <!--Center graph-->
        <div class="col-12 text-center">
            <canvas id="graph" width="100%" height="35%"></canvas>
        </div>
    </div>

    <div class="row" id="statButtons">
        <!--Stat buttons-->
        <button type="button" class="col-4 col-md-2 btn btn-outline-secondary btn-lg active" onclick="gamesWon()" style="font-size: 2vh">
            <h1 id="Games Won Button">150</h1>
            <p>Games won</p>
        </button>
        <button type="button" class="col-4 col-md-2 btn btn-outline-secondary btn-lg" onclick="gamesLost()" style="font-size: 2vh">
            <h1 id="Games Lost Button">100</h1>
            <p>Games lost</p>
        </button>
        <button type="button" class="col-4 col-md-2 btn btn-outline-secondary btn-lg" onclick="gamesPlayed()" style="font-size: 2vh">
            <h1 id="Games Played Button">250</h1>
            <p>Games played</p>
        </button>
        <button type="button" class="col-4 col-md-2 btn btn-outline-secondary btn-lg" onclick="winRate()" style="font-size: 2vh">
            <h1 id="Win Rate Button">100%</h1>
            <p>Win rate</p>
        </button>
        <button type="button" class="col-4 col-md-2 btn btn-outline-secondary btn-lg" onclick="averageScore()" style="font-size: 2vh">
            <h1 id="Average Score Button">120</h1>
            <p>Average score/game</p>
        </button>
        <button type="button" class="col-4 col-md-2 btn btn-outline-secondary btn-lg" onclick="timePlayed()" style="font-size: 2vh">
            <h1 id="Time Played Button">1d 2h 21m</h1>
            <p>Time played</p>
        </button>
    </div>
</div>
</div>
<script src="../js/dashboard/dashboard.js"></script> <!--leaderboard JavaScript file-->
</body>
</html>