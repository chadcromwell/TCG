<?php
/*
* Author: Chad Cromwell
* Date: 2019-04-20
* Description: Back-end PHP for getCollection.php. Queries database to retrieve cards and user card ownership information
*              It then sends the results to collection.php as an encoded JSON object (array) via AJAX.
*            - Database queries utilize user_id stored in cookies on device. In order for the user to view their cards, they must be logged in. If userId from cookies is empty, it will send a JSON response of "logIn: F"
*            - Statement preparation is used to prevent SQL injection attacks.
*            - Make 4 queries:
*                   Avatar cards
*                               From avatar_card table: card_id, avatar_max_hp, avatar_atk, avatar_def, avatar_size_id, avatar_class_id, avatar_element_id, avatar_range, card_type,id
*                               From card_data table: card_strength, card_rarity_id, card_illustration_path
*                               From card_data_lang: card_name
*
*                               The query is formatted into an array of the form: [id, typeId, name, description, strength, rarity, illustrationPath, hp, attack, defense, size, class, element, range]
*
*                   Magic cards
*                               From magic_card table: card_id, effect, target_player, target_card_type, effect_value, effect_interval, card_type_id, target_avatar_class, target_nums
*                               From card_data table: card_strength, card_rarity_id, card_illustration_path
*                               From card_data_lang: card_name, card_discription (note: spelling mistake in database! If database is updated, this will need to be updated as well!)
*
*                               The query is formatted into an array of the form: [id, typeId, name, description, strength, rarity, illustrationPath, effect, target, targetCardType, value, interval, class, targetNums, element]
*                   Trap cards
*                               From trap_card table: card_id, trigger_timing, seq, effect, effect_target, effect_value, effect_interval, card_type_id
*                               From card_data table: card_strength, card_rarity_id, card_illustration_path
*                               From card_data_lang: card_name, card_discription (note: spelling mistake in database! If database is updated, this will need to be updated as well!)
*
*                               The query is formatted into an array of the form: [id, typeId, name, description, strength, rarity, illustrationPath, timing, seq, effect, target, value,  interval, element, class]
*
*                   User cards
*                               From user_cards: card_id, card_type_id, card_level
*
*                               This query is formatted into an array of the form: [id, typeId, level];
*
*
*                   All four card arrays are then added to an array in the form [userCardArray, avatarCardArray, magicCardArray, trapCardArray]
*                   This multidimensional array is then encoded as a JSON object and sent to collection.js
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
    $avatarCardArray = array(); //Array of avatar cards
    $magicCardArray = array(); //Array of magic cards
    $trapCardArray = array(); //Array of trap cards
    $cardArray = array(); //Array of card data
    $userCardArray = array(); //Array for user stats
    $language = "EN"; //Get english names

//Query database for avatar cards---------------------------------------------------------------------------------------
//Prepare query to get avatar cards in order to prevent SQL injection attacks
    $stmt = $conn->prepare('SELECT ac.card_id, ac.avatar_max_hp, ac.avatar_atk, ac.avatar_def, ac.avatar_size_id, ac.avatar_class_id, ac.avatar_element_id, ac.avatar_range, ac.card_type_id, cd.card_strength, cd.card_rarity_id, cd.card_illustration_path, cdl.card_name, cdl.card_discription FROM avatar_card ac, card_data cd, card_data_lang cdl WHERE ac.card_id=cd.card_id AND cd.card_id=cdl.card_id AND cd.card_type_id=ac.card_type_id AND ac.card_type_id=cdl.card_type_id AND cdl.language_id=? ORDER BY ac.card_id ASC'); //Prepare the query statement
    $stmt->bind_param('s', $language); //Bind the $userId parameter to the query statement
    $stmt->execute(); //Query database
    $result = $stmt->get_result(); //Assign query result to $result

    $i = 0; //To keep track of array element

//If the result has rows
    if ($result->num_rows > 0) {
        //Iterate through all rows in each column
        while ($row = $result->fetch_assoc()) {
            $avatarCardId = $row["card_id"];
            $avatarMaxHp = $row["avatar_max_hp"];
            $avatarAtk = $row["avatar_atk"];
            $avatarDef = $row["avatar_def"];
            $avatarSizeId = $row["avatar_size_id"];
            $avatarClassId = $row["avatar_class_id"];
            $avatarElementId = $row["avatar_element_id"];
            $avatarRange = $row["avatar_range"];
            $avatarTypeId = $row["card_type_id"];
            $cardStrength = $row["card_strength"];
            $cardRarityId = $row["card_rarity_id"];
            $cardIllustrationPath = $row["card_illustration_path"];
            $cardName = $row["card_name"];
            $cardDescription = $row["card_discription"];
            $avatarCardArray[$i] = ["id" => $avatarCardId, "typeId" => $avatarTypeId, "name" => $cardName, "description" => $cardDescription, "strength" => $cardStrength, "rarity" => $cardRarityId, "illustrationPath" => $cardIllustrationPath, "hp" => $avatarMaxHp, "attack" => $avatarAtk, "defense" => $avatarDef, "size" => $avatarSizeId, "class" => $avatarClassId, "element" => $avatarElementId, "range" => $avatarRange];
            $i++; //Increment $i so next array is placed in next element
        }
        $result->close(); //Close passed connection
    }

//Query database for magic cards---------------------------------------------------------------------------------------
//Prepare query to get magic cards in order to prevent SQL injection attacks
    $stmt = $conn->prepare('SELECT mc.card_id, mc.effect, mc.target_player, mc.target_card_type, mc.effect_value, mc.effect_interval, mc.card_type_id, mc.target_avatar_class, mc.target_nums, cd.card_strength, cd.card_rarity_id, cd.card_illustration_path, cdl.card_name, cdl.card_discription FROM magic_card mc, card_data cd, card_data_lang cdl WHERE mc.card_id=cd.card_id AND cd.card_id=cdl.card_id AND cd.card_type_id=mc.card_type_id AND mc.card_type_id=cdl.card_type_id AND cdl.language_id=? ORDER BY mc.card_id ASC'); //Prepare the query statement
    $stmt->bind_param('s', $language); //Bind the $userId parameter to the query statement
    $stmt->execute(); //Query database
    $result = $stmt->get_result(); //Assign query result to $result

    $i = 0; //To keep track of array element

//If the result has rows
    if ($result->num_rows > 0) {
        //Iterate through all rows in each column
        while ($row = $result->fetch_assoc()) {
            $magicCardId = $row["card_id"];
            $magicEffect = $row["effect"];
            $magicTargetPlayer = $row["target_player"];
            $magicTargetCardType = $row["target_card_type"];
            $magicEffectValue = $row["effect_value"];
            $magicEffectInterval = $row["effect_interval"];
            $magicCardTypeId = $row["card_type_id"];
            $magicTargetAvatarClass = $row["target_avatar_class"];
            $magicTargetNums = $row["target_nums"];
            $cardStrength = $row["card_strength"];
            $cardRarityId = $row["card_rarity_id"];
            $cardIllustrationPath = $row["card_illustration_path"];
            $cardName = $row["card_name"];
            $cardDescription = $row["card_discription"];
            $magicCardArray[$i] = ["id" => $magicCardId, "typeId" => $magicCardTypeId, "name" => $cardName, "description" => $cardDescription, "strength" => $cardStrength, "rarity" => $cardRarityId, "illustrationPath" => $cardIllustrationPath, "effect" => $magicEffect, "target" => $magicTargetPlayer, "targetCardType" => $magicTargetCardType, "value" => $magicEffectValue, "interval" => $magicEffectInterval, "class" => $magicTargetAvatarClass, "targetNums" => $magicTargetNums, "element" => ""];
            $i++; //Increment $i so next array is placed in next element
        }
        $result->close(); //Close passed connection
    }

//Query database for trap cards---------------------------------------------------------------------------------------
//Prepare query to get magic cards in order to prevent SQL injection attacks
    $stmt = $conn->prepare('SELECT tc.card_id, tc.trigger_timing, tc.seq, tc.effect, tc.effect_target, tc.effect_value, tc.effect_interval, tc.card_type_id, cd.card_strength, cd.card_rarity_id, cd.card_illustration_path, cdl.card_name, cdl.card_discription FROM trap_card tc, card_data cd, card_data_lang cdl WHERE tc.card_id=cd.card_id AND cd.card_id=cdl.card_id AND cd.card_type_id=tc.card_type_id AND tc.card_type_id=cdl.card_type_id AND cdl.language_id=? ORDER BY tc.card_id ASC'); //Prepare the query statement
    $stmt->bind_param('s', $language); //Bind the $userId parameter to the query statement
    $stmt->execute(); //Query database
    $result = $stmt->get_result(); //Assign query result to $result

    $i = 0; //To keep track of array element

//If the result has rows
    if ($result->num_rows > 0) {
        //Iterate through all rows in each column
        while ($row = $result->fetch_assoc()) {
            $trapCardId = $row["card_id"];
            $trapTriggerTiming = $row["trigger_timing"];
            $trapSeq = $row["seq"];
            $trapEffect = $row["effect"];
            $trapEffectTarget = $row["effect_target"];
            $trapEffectValue = $row["effect_value"];
            $trapEffectInterval = $row["effect_interval"];
            $trapCardTypeId = $row["card_type_id"];
            $cardStrength = $row["card_strength"];
            $cardRarityId = $row["card_rarity_id"];
            $cardIllustrationPath = $row["card_illustration_path"];
            $cardName = $row["card_name"];
            $cardDescription = $row["card_discription"];
            $trapCardArray[$i] = ["id" => $trapCardId, "typeId" => $trapCardTypeId, "name" => $cardName, "description" => $cardDescription, "strength" => $cardStrength, "rarity" => $cardRarityId, "illustrationPath" => $cardIllustrationPath, "timing" => $trapTriggerTiming, "seq" => $trapSeq, "effect" => $trapEffect, "target" => $trapEffectTarget, "value" => $trapEffectValue, "interval" => $trapEffectInterval, "element" => "", "class" => ""];
            $i++; //Increment $i so next array is placed in next element
        }
        $result->close(); //Close passed connection
    }

//Query database for user's cards---------------------------------------------------------------------------------------
//Prepare query to get user's cards in order to prevent SQL injection attacks - Select the current user's cards and card types from user_cards table
    $stmt = $conn->prepare('SELECT uc.card_id, uc.card_type_id, uc.card_level  FROM user_cards uc WHERE uc.user_id=user_id AND user_id = ? ORDER BY uc.card_id ASC'); //Prepare the query statement
    $stmt->bind_param('s', $userId); //Bind the $userId parameter to the query statement
    $stmt->execute(); //Query database
    $result = $stmt->get_result(); //Assign query result to $result

    $i = 0; //To keep track of array element

//If the result has rows
    if ($result->num_rows > 0) {
        //Iterate through all rows in each column
        while ($row = $result->fetch_assoc()) {
            $cardId = $row["card_id"];
            $cardTypeId = $row["card_type_id"];
            $cardLevel = $row["card_level"];
            $userCardArray[$i] = ["id" => $cardId, "typeId" => $cardTypeId, "level" => $cardLevel];
            $i++; //Increment $i so next array is placed in next element
        }
        $result->close(); //Close passed connection
    }

    closeConn($conn); //Close the database connection

    $jsonArray = array("userCardArray" => $userCardArray, "avatarCardArray" => $avatarCardArray, "magicCardArray" => $magicCardArray, "trapCardArray" => $trapCardArray); //Create multidimensional array to be encoded as JSON object
    $jsonResponse = json_encode($jsonArray); //Encode $jsonArray as JSON object to be passed to collection.php

    header("Content-Type: application/json; charset=UTF-8"); //Set JSON header
    echo $jsonResponse; //Echo response to collection.php
}
//Else, the user is not logged in, respond with "logIn: F"
else {
    echo json_encode(array("logIn" => "F"));
}
?>
