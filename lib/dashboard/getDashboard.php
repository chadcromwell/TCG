<?php
/*
* Author: Chad Cromwell
* Date: 2019-04-10
* Description: Back-end PHP for dashboard.php. Queries database to retrieve stats for user: winner id, host id, host gained score, guest gained score, battle start time,  battle elapse seconds
*              It then sends the results to dashboard.php as an encoded JSON object (array) via AJAX.
*            - Database queries utilize user_id stored in cookies on device. In order for the user to view their stats, they must be logged in.
*            - Statement preparation is used to prevent SQL injection attacks.
*
* Functions: - setStats(mysqli_result $result, array $array) function - Accepts mysql result and an array (pass by reference),
*              iterates through all columns, placing respecting rows (stats) into the passed array
*
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

    //Variables-------------------------------------------------------
    $userStatArray = array(); //Array for user stats

    //Query database for user's stats---------------------------------------------------------------------------------------
    //Prepare query to get user's stats in order to prevent SQL injection attacks - Select the current user's nickname, user score, user play counter, win counter, user rank from users_game_rank and users_game_info tables
    $stmt = $conn->prepare('SELECT bcl.winner_id, bcl.host_id, bcl.guest_id, bcl.battle_start_time, bcl.battle_elapse_seconds, bcl.host_gained_score, bcl.guest_gained_score FROM users_game_info ugi, battle_channel_log bcl WHERE (ugi.user_id=bcl.host_id OR ugi.user_id=bcl.guest_id) AND bcl.winner_id IS NOT NULL AND ugi.user_id = ?'); //Prepare the query statement
    $stmt->bind_param('s', $userId); //Bind the $userId parameter to the query statement
    $stmt->execute(); //Query database
    $userResult = $stmt->get_result(); //Assign query result to $userResult

    setStats($userResult, $userStatArray, $userId); //Call setStats() on $userStatArray with $userResult mysql result

    closeConn($conn); //Close the database connection

    $jsonArray = array("userStatArray" => $userStatArray); //Create multidimensional array to be encoded as JSON object
    $jsonResponse = json_encode($jsonArray); //Encode $jsonArray as JSON object to be passed to leaderboard.php

    header("Content-Type: application/json; charset=UTF-8"); //Set JSON header
    echo $jsonResponse; //Echo response to dashboard.php

}
//Else, the user is not logged in, respond with "logIn: F"
else {
    echo json_encode(array("logIn" => "F"));
}
//setStats(mysqli_result $result, array $array) function - Accepts mysql result and an array (pass by reference), iterates through all columns, placing respecting rows (stats) into the passed array
    function setStats(mysqli_result $result, array &$array, $id)
    {
        $userId = $id;
        $i = 0; //To keep track of array element
        $totalGamesPlayed = 0;
        $totalGamesWon = 0;
        $totalGamesLost = 0;
        $totalElapsedTimeSeconds = 0;
        $totalScore = 0;

        //If the result has rows
        if ($result->num_rows > 0) {
            //Iterate through all rows in each column
            while ($row = $result->fetch_assoc()) {
                $totalGamesPlayed++;
                //If the user is the winner
                if (strcasecmp($row["winner_id"], $userId) == 0) {
                    $won = true; //Set boolean to true
                    $totalGamesWon++; //Increment totalGamesWon
                }
                //Else, they lost
                else {
                    $won = false; //Set boolean to false
                    $totalGamesLost++; //Increment totalGamesLost
                }
                //If the user was the host of the match
                if (strcasecmp($row["host_id"], $userId) == 0) {
                    $score = $row["host_gained_score"];
                }
                //Else, the user was the guest of the match
                else {
                    $score = $row["guest_gained_score"];
                }
                $startTime = $row["battle_start_time"];
                $elapsedTimeSeconds = $row["battle_elapse_seconds"];
                $totalElapsedTimeSeconds += $elapsedTimeSeconds;

                $totalScore += $score;
                $array[$i] = ["result" => $won,
                                "score" => $score,
                                "elapsedTime" => $elapsedTimeSeconds,
                                "date" => $startTime]; //Insert stats into array as array (multidimensional)

                $i++; //Increment $i so next array is placed in next element
            }
            $result->close(); //Close passed connection
        }
    }
?>