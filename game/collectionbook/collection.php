<!--
* Author: Chad Cromwell
* Date: 2019-04-20
* Description: A card collection book that displays the cards a user owns, as well as the one's they've yet to collect
*              The user may navigate through pages of cards of 2 rows of 4 cards each.
*              The user may filter the type of cards show, such as "avatar," "magic," and "trap."
*              The user may filter their results further by the contextual filter on the bottom of the display.
*              If "Avatar" filter is selected, the context filter will give the user the option to select class types, element types, and sizes.
*              If "Magic" filter is selected, the context filter will give the user the option to select the target type (self or enemy).
*              If "Trap" filter is selected, the context filter will give the user the option to select the target type (self, enemy, or both).
*              The user may search through their card collection by name for a specific card.
*
*            - Uses Bootstrap.js framework for responsive design
 -->

<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset=UTF-8"> <!--UTF-8 charset-->
    <meta name ="viewport" content="width=device-width, initial-scale=1"> <!--Default to mobile-->
    <title>Card Collection Book</title>
    <link rel="stylesheet" href="../css/bootstrap/bootstrap.min.css"> <!--Bootstrap css-->
    <script src="../js/jquery/jquery.min.js"></script>
    <script src="../js/popper/popper.min.js"></script>
    <script src="../js/bootstrap/bootstrap.min.js"></script> <!--Bootstrap js--->
    <link href="../css/collectionbook/collection.css" rel="stylesheet"> <!--CSS-->
</head>
<?php
session_start(); //Start session (cookies)
include '../../lib/dbConnection.php'; //Include db connection to connect to db
$userId = $_SESSION['userId']; //Assign userId from session to $userId
?>
<body>
<div id="wrap">
<!--Header-->
<div class="container-fluid">
    <div class="row">
        <div class="col-12 text-center">
            <p class="display-1" style="font-size: 6vw">
                Card Collection Book
            </p>
        </div>
    </div>
</div>
<!--Jumbotron-->
<div class="container-fluid jumbotron" style="padding: 1vh">
    <div class="row">
        <div class="col-12 text-center">
            <h1 id="pageTitle" style="font-size: 3.75vw">
                All Cards
            </h1>
        </div>
    </div>

    <div class="row">
        <div class="col-4 dropdown">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="typeFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Card Type: All
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" onclick="filterAll()">All</a>
                <a class="dropdown-item" onclick="filterAvatar()">Avatar</a>
                <a class="dropdown-item" onclick="filterMagic()">Magic</a>
                <a class="dropdown-item" onclick="filterTrap()">Trap</a>
            </div>
        </div>
        <div class="col">
            <form id="searchForm">
                <div class="form-inline float-right">
                    <input type="text" class="form-control" id="search" placeholder="Search All Cards">
                    <button type="submit" class="btn btn-outline-secondary">Search</button>
                </div>
            </form>
        </div>
    </div>

    <div class="row mt-1">
        <div class="col-sm-5 col-md-6" id="contextFilters">
            <!--Contest filters for All cards-->
            <div class="dropdown d-none" id="allFilters">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="allRarityFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Rarity: All
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onclick="filterAllRarity()">All</a>
                    <a class="dropdown-item" onclick="filterAllCommon()">Commmon</a>
                    <a class="dropdown-item" onclick="filterAllUncommon()">Uncommon</a>
                    <a class="dropdown-item" onclick="filterAllRare()">Rare</a>
                    <a class="dropdown-item" onclick="filterAllSuperRare()">Super Rare</a>
                </div>
            </div>
            <!--Context filters for Avatar cards-->
            <div class="dropdown d-none" id="avatarFilters">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="classFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Class: All
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onclick="filterAllClass()">All</a>
                    <a class="dropdown-item" onclick="filterAquatic()">Aquatic</a>
                    <a class="dropdown-item" onclick="filterBug()">Bug</a>
                    <a class="dropdown-item" onclick="filterDragon()">Dragon</a>
                    <a class="dropdown-item" onclick="filterFlying()">Flying</a>
                    <a class="dropdown-item" onclick="filterHumanoid()">Humanoid</a>
                    <a class="dropdown-item" onclick="filterMagical()">Magical</a>
                    <a class="dropdown-item" onclick="filterMonster()">Monster</a>
                </div>
            </div>
            <div class="dropdown d-none" id="avatarFilters">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="elementFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Element: All
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onclick="filterAllElement()">All</a>
                    <a class="dropdown-item" onclick="filterDark()">Dark</a>
                    <a class="dropdown-item" onclick="filterFire()">Fire</a>
                    <a class="dropdown-item" onclick="filterGround()">Ground</a>
                    <a class="dropdown-item" onclick="filterLight()">Light</a>
                    <a class="dropdown-item" onclick="filterNone()">None</a>
                    <a class="dropdown-item" onclick="filterThunder()">Thunder</a>
                    <a class="dropdown-item" onclick="filterWater()">Water</a>
                    <a class="dropdown-item" onclick="filterWind()">Wind</a>
                </div>
            </div>
            <div class="dropdown d-none" id="avatarFilters">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="sizeFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Size: All
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onclick="filterAllSize()">All</a>
                    <a class="dropdown-item" onclick="filterSize0()">0</a>
                    <a class="dropdown-item" onclick="filterSize1()">1</a>
                    <a class="dropdown-item" onclick="filterSize2()">2</a>
                    <a class="dropdown-item" onclick="filterSize3()">3</a>
                </div>
            </div>
            <div class="dropdown d-none" id="avatarFilters">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="avatarRarityFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Rarity: All
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onclick="filterAvatarRarity()">All</a>
                    <a class="dropdown-item" onclick="filterAvatarCommon()">Commmon</a>
                    <a class="dropdown-item" onclick="filterAvatarUncommon()">Uncommon</a>
                    <a class="dropdown-item" onclick="filterAvatarRare()">Rare</a>
                    <a class="dropdown-item" onclick="filterAvatarSuperRare()">Super Rare</a>
                </div>
            </div>

            <!--Context filters for Magic cards-->
            <div class="dropdown d-none" id="magicFilters">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="effectFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Effect: All
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onclick="filterMagicAllEffect()">All</a>
                    <a class="dropdown-item" onclick="filterMagicAttack()">Attack</a>
                    <a class="dropdown-item" onclick="filterMagicMultiplyAttack()">Multiply Attack</a>
                    <a class="dropdown-item" onclick="filterMagicBlackHole()">Black Hole</a>
                    <a class="dropdown-item" onclick="filterMagicDefense()">Defense</a>
                    <a class="dropdown-item" onclick="filterMagicMultiplyDefense()">Multiply Defense</a>
                    <a class="dropdown-item" onclick="filterMagicDestroy()">Destroy</a>
                    <a class="dropdown-item" onclick="filterMagicInterfere()">Interfere</a>
                    <a class="dropdown-item" onclick="filterMagicRemoveInterfere()">Remove Interfere</a>
                    <a class="dropdown-item" onclick="filterMagicRange()">Range</a>
                    <a class="dropdown-item" onclick="filterMagicSize()">Size</a>
                    <a class="dropdown-item" onclick="filterMagicRestore()">Restore</a>
                </div>
            </div>
            <div class="dropdown d-none" id="magicFilters">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="magicTargetFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Target: All
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onclick="filterMagicAllTarget()">All</a>
                    <a class="dropdown-item" onclick="filterMagicSelf()">Self</a>
                    <a class="dropdown-item" onclick="filterMagicEnemy()">Enemy</a>
                </div>
            </div>
            <div class="dropdown d-none" id="magicFilters">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="magicRarityFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Rarity: All
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onclick="filterMagicRarity()">All</a>
                    <a class="dropdown-item" onclick="filterMagicCommon()">Commmon</a>
                    <a class="dropdown-item" onclick="filterMagicUncommon()">Uncommon</a>
                    <a class="dropdown-item" onclick="filterMagicRare()">Rare</a>
                    <a class="dropdown-item" onclick="filterMagicSuperRare()">Super Rare</a>
                </div>
            </div>

            <!--Context filters for Trap cards-->
            <div class="dropdown d-none" id="trapFilters">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="trapTargetFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Target: All
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onclick="filterTrapAllTarget()">All</a>
                    <a class="dropdown-item" onclick="filterTrapSelf()">Self</a>
                    <a class="dropdown-item" onclick="filterTrapEnemy()">Enemy</a>
                </div>
            </div>
            <div class="dropdown d-none" id="trapFilters">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="trapRarityFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Rarity: All
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onclick="filterTrapRarity()">All</a>
                    <a class="dropdown-item" onclick="filterTrapCommon()">Commmon</a>
                    <a class="dropdown-item" onclick="filterTrapUncommon()">Uncommon</a>
                    <a class="dropdown-item" onclick="filterTrapRare()">Rare</a>
                    <a class="dropdown-item" onclick="filterTrapSuperRare()">Super Rare</a>
                </div>
            </div>
        </div>
    </div>

    <div class="row mt-1" id="cards">
        <!--Cards-->
        <div class="card col-6 col-md-3 text-nowrap d-block" style="width: 18rem;" id="card1">
            <div class="card-img-caption">
                <div id="card1Title" class="d-block">Name</div>
                <div id="card1Class" class="d-block">Fire</div>
                <div id="card1Element" class="d-block">Monster</div>
                <div id="card1Size" class="d-block">3</div>
                <div id="card1Range" class="d-block">15</div>
                <div id="card1Attack" class="d-block">5</div>
                <div id="card1Defense" class="d-block">30</div>
                <div id="card1Hp" class="d-block">3</div>
                <div id="card1Interval" class="d-none">0</div>
                <div id="card1TypeId" class="d-none">0</div>
                <div id="card1Description" class="d-none text-wrap px-5"><p>Description</p></div>
                <img class="card-img-top" src="../../lib/image/cards/a/a001.jpg" alt="Card image cap" id="card1Image" style="opacity: 1.0">
            </div>
        </div>
        <div class="card col-6 col-md-3 text-nowrap d-block" style="width: 18rem;" id="card2">
            <div class="card-img-caption">
                <div id="card2Title" class="d-block">Name</div>
                <div id="card2Class" class="d-block">Fire</div>
                <div id="card2Element" class="d-block">Monster</div>
                <div id="card2Size" class="d-block">3</div>
                <div id="card2Range" class="d-block">15</div>
                <div id="card2Attack" class="d-block">5</div>
                <div id="card2Defense" class="d-block">30</div>
                <div id="card2Hp" class="d-block">3</div>
                <div id="card2Interval" class="d-none">0</div>
                <div id="card2TypeId" class="d-none">0</div>
                <div id="card2Description" class="d-none text-wrap px-5"><p>Description</p></div>
                <img class="card-img-top" src="../../lib/image/cards/a/a002.jpg" alt="Card image cap" id="card2Image" style="opacity: 1.0">
            </div>
        </div>
        <div class="card col-6 col-md-3 text-nowrap d-block" style="width: 18rem;" id="card3">
            <div class="card-img-caption">
                <div id="card3Title" class="d-block">Name</div>
                <div id="card3Class" class="d-block">Fire</div>
                <div id="card3Element" class="d-block">Monster</div>
                <div id="card3Size" class="d-block">3</div>
                <div id="card3Range" class="d-block">15</div>
                <div id="card3Attack" class="d-block">5</div>
                <div id="card3Defense" class="d-block">30</div>
                <div id="card3Hp" class="d-block">3</div>
                <div id="card3Interval" class="d-none">0</div>
                <div id="card3TypeId" class="d-none">0</div>
                <div id="card3Description" class="d-none text-wrap px-5"><p>Description</p></div>
                <img class="card-img-top" src="../../lib/image/cards/a/a003.jpg" alt="Card image cap" id="card3Image" style="opacity: 1.0">
            </div>
        </div>
        <div class="card col-6 col-md-3 text-nowrap d-block" style="width: 18rem;" id="card4">
            <div class="card-img-caption">
                <div id="card4Title" class="d-block">Name</div>
                <div id="card4Class" class="d-block">Fire</div>
                <div id="card4Element" class="d-block">Monster</div>
                <div id="card4Size" class="d-block">3</div>
                <div id="card4Range" class="d-block">15</div>
                <div id="card4Attack" class="d-block">5</div>
                <div id="card4Defense" class="d-block">30</div>
                <div id="card4Hp" class="d-block">3</div>
                <div id="card4Interval" class="d-none">0</div>
                <div id="card4TypeId" class="d-none">0</div>
                <div id="card4Description" class="d-none text-wrap px-5"><p>Description</p></div>
                <img class="card-img-top" src="../../lib/image/cards/a/a004.jpg" alt="Card image cap" id="card4Image" style="opacity: 1.0">
            </div>
        </div>
        <div class="card col-6 col-md-3 text-nowrap d-block" style="width: 18rem;" id="card5">
            <div class="card-img-caption">
                <div id="card5Title" class="d-block">Name</div>
                <div id="card5Class" class="d-block">Fire</div>
                <div id="card5Element" class="d-block">Monster</div>
                <div id="card5Size" class="d-block">3</div>
                <div id="card5Range" class="d-block">15</div>
                <div id="card5Attack" class="d-block">5</div>
                <div id="card5Defense" class="d-block">30</div>
                <div id="card5Hp" class="d-block">3</div>
                <div id="card5Interval" class="d-none">0</div>
                <div id="card5TypeId" class="d-none">0</div>
                <div id="card5Description" class="d-none text-wrap px-5"><p>Description</p></div>
                <img class="card-img-top" src="../../lib/image/cards/a/a005.jpg" alt="Card image cap" id="card5Image" style="opacity: 1.0">
            </div>
        </div>
        <div class="card col-6 col-md-3 text-nowrap d-block" style="width: 18rem;" id="card6">
            <div class="card-img-caption">
                <div id="card6Title" class="d-block">Name</div>
                <div id="card6Class" class="d-block">Fire</div>
                <div id="card6Element" class="d-block">Monster</div>
                <div id="card6Size" class="d-block">3</div>
                <div id="card6Range" class="d-block">15</div>
                <div id="card6Attack" class="d-block">5</div>
                <div id="card6Defense" class="d-block">30</div>
                <div id="card6Hp" class="d-block">3</div>
                <div id="card6Interval" class="d-none">0</div>
                <div id="card6TypeId" class="d-none">0</div>
                <div id="card6Description" class="d-none text-wrap px-5"><p>Description</p></div>
                <img class="card-img-top" src="../../lib/image/cards/a/a006.jpg" alt="Card image cap" id="card6Image" style="opacity: 1.0">
            </div>
        </div>
        <div class="card col-6 col-md-3 text-nowrap d-block" style="width: 18rem;" id="card7">
            <div class="card-img-caption">
                <div id="card7Title" class="d-block">Name</div>
                <div id="card7Class" class="d-block">Fire</div>
                <div id="card7Element" class="d-block">Monster</div>
                <div id="card7Size" class="d-block">3</div>
                <div id="card7Range" class="d-block">15</div>
                <div id="card7Attack" class="d-block">5</div>
                <div id="card7Defense" class="d-block">30</div>
                <div id="card7Hp" class="d-block">3</div>
                <div id="card7Interval" class="d-none">0</div>
                <div id="card7TypeId" class="d-none">0</div>
                <div id="card7Description" class="d-none text-wrap px-5">Description</div>
                <img class="card-img-top" src="../../lib/image/cards/a/a007.jpg" alt="Card image cap" id="card7Image" style="opacity: 1.0">
            </div>
        </div>
        <div class="card col-6 col-md-3 text-nowrap d-block" style="width: 18rem;" id="card8">
            <div class="card-img-caption">
                <div id="card8Title" class="d-block">Name</div>
                <div id="card8Class" class="d-block">Fire</div>
                <div id="card8Element" class="d-block">Monster</div>
                <div id="card8Size" class="d-block">3</div>
                <div id="card8Range" class="d-block">15</div>
                <div id="card8Attack" class="d-block">5</div>
                <div id="card8Defense" class="d-block">30</div>
                <div id="card8Hp" class="d-block">3</div>
                <div id="card8Interval" class="d-none">0</div>
                <div id="card8TypeId" class="d-none">0</div>
                <div id="card8Description" class="d-none text-wrap px-5">Description</div>
                <img class="card-img-top" src="../../lib/image/cards/a/a008.jpg" alt="Card image cap" id="card8Image" style="opacity: 1.0">
            </div>
        </div>
    </div>

    <div class="row justify-content-around mt-5">
        <button type="button" class="col-2 btn btn-outline-secondary invisible" onclick="pageLeft()" id="pageLeft">
            <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
        </button>
        <button type="button" class="col-2 btn btn-outline-secondary visible" onclick="pageRight()" id="pageRight">
            <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>>
        </button>
    </div>
</div>
</div>

<script src="../js/collectionbook/collection.js"></script> <!--leaderboard JavaScript file-->
</body>
</html>