<?php
/*
* Author: Chad Cromwell
* Date: 2019-04-01
* Description: Back-end PHP for leaderboard.php. Queries database to retrieve stats for user, and all players.
*              It then sends the results to leaderboard.php as an encoded JSON object (array) via AJAX.
*            - Database queries utilize user_id stored in cookies on device. In order for the user to view their stats, they must be logged in.
*            - Statement preparation is used to prevent SQL injection attacks.
*
* Functions: - setStats(mysqli_result $result, array $array) function - Accepts mysql result and an array (pass by reference),
*              iterates through all columns, placing respecting rows (stats) into the passed array
*/

session_start(); //Start session (cookies)
include '../dbConnection.php'; //Include db connection to connect to db
$userId = $_SESSION['userId']; //Assign userId from session to $userId

//If the user is logged in
if($userId != "") {
    //Open database connection
    $conn = openConn();

    //Check if the connection failed
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error); //Give error
    }

    //Arrays to hold stats
    $userStatArray = array(); //Array for user stats
    $top10StatArray = array(); //Array for top 10 stats
    $globalStatArray = array(); //Array for players 5 above user
    $allStatsArray = array(); //Array to hold all stats

    //Query database for user's stats---------------------------------------------------------------------------------------
    //Prepare query to get user's stats in order to prevent SQL injection attacks - Select the current user's nickname, user score, user play counter, win counter, user rank from users_game_rank and users_game_info tables
    $stmt = $conn->prepare('SELECT ugi.user_nick, ugi.user_score, ugi.user_play_counter, ugi.user_win_counter, ugr.user_rank FROM users_game_rank ugr, users_game_info ugi WHERE ugi.user_id=ugr.user_id AND ugi.user_id = ?'); //Prepare the query statement
    $stmt->bind_param('s', $userId); //Bind the $userId parameter to the query statement
    $stmt->execute(); //Query database
    $userResult = $stmt->get_result(); //Assign query result to $userResult

    setStats($userResult, $userStatArray); //Call setStats() on $userStatArray with $userResult mysql result

    //Query database for all stats------------------------------------------------------------------------------------------
    //Prepare query to get all stats in order to prevent SQL injection attacks - Select nickname, score, play counter, win counter, rank from users_game_rank and users_game_info tables, ordered by ascending rank, limited to 11 (to include user) offset to include 5 ranks above user
    $stmt = $conn->prepare('SELECT ugi.user_nick, ugi.user_score, ugi.user_play_counter, ugi.user_win_counter, ugr.user_rank FROM users_game_rank ugr, users_game_info ugi WHERE ugi.user_id=ugr.user_id ORDER BY ugr.user_rank ASC'); //Prepare the query statement
    $stmt->execute(); //Query database
    $allResult = $stmt->get_result(); //Call setStats() on $globalStatArray with $globalResult mysql result

    setStats($allResult, $allStatsArray); //Pass $top10Result mysql result to setStats

    closeConn($conn); //Close the database connection

    $jsonArray = array("userStatArray" => $userStatArray, "allStatsArray" => $allStatsArray); //Create multidimensional array to be encoded as JSON object
    $jsonResponse = json_encode($jsonArray); //Encode $jsonArray as JSON object to be passed to leaderboard.php

    header("Content-Type: application/json; charset=UTF-8"); //Set JSON header
    echo $jsonResponse; //Echo response to leaderboard.php
}
//Else, the user is not logged in, respond with "logIn: F"
else {
    echo json_encode(array("logIn" => "F"));
}

//setStats(mysqli_result $result, array $array) function - Accepts mysql result and an array (pass by reference), iterates through all columns, placing respecting rows (stats) into the passed array
function setStats(mysqli_result $result, array &$array) {
    $i = 0; //To keep track of array element
    //If the result has rows
    if ($result->num_rows > 0) {
        //Iterate through all rows in each column
        while ($row = $result->fetch_assoc()) {
            $nick = $row["user_nick"]; //Assign nickname
            $score = $row["user_score"]; //Assign score
            $games = $row["user_play_counter"]; //Assign games
            $wins = $row["user_win_counter"]; //Assign wins
            $losses = $games - $wins; //Assign losses
            $rank = $row["user_rank"]; //Assign rank
            $winRate = 0; //Initialize $winRate as 0 to prevent division by zero later

            //If the user has played games, calculate real win rate
            if ($games > 0) {
                $winRate = round(($wins / $games) * 100, 2);//Calculate and assign winrate (total wins/games played) * 100 rounded to 2 decimal points
            }

            $array[$i] = ["rank" => $rank, "nick" => $nick, "score" => $score, "wins" => $wins, "losses" => $losses, "winRate" => $winRate]; //Insert stats into array as array (multidimensional)
            $i++; //Increment $i so next array is placed in next element
        }
        $result->close(); //Close passed connection
    }
}

?>