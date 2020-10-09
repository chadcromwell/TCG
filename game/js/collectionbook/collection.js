/*---------------------------------------------------------------
* Author: Chad Cromwell
* Date: 2019-04-20
* Description: JavaScript for collection.php. Provides functionality for AJAX/JSON communication with mySQL database.
*               - Updates/populates collection book cards, card data, buttons, filters, and more with data pulled from the database
*
* Functions: -  - pageLeft() function - Flips page to the left. Updates all cards on the screen and arrows accordingly.
                - pageRight() function - Flips page to the right. Updates all cards on the screen and arrows accordingly.
                - hasCard(card) function - Accepts a card and compares it with the cards the user owns and returns true if they have it and false if they do not
                - updateContextFilters(string) function - Accepts a string (context filter group such as avatarFilters) shows them and hides all other context filters
                - resetFilter() function - Resets all function variables to default "all"
                - resetPageButtons() function - Makes left buttons invisible and right visible, used when new card filter is applied (first page)
                - filterAll() function - Sets card filter to show all
                - filterAvatar() function - Follows same logic as filterAll() except for avatar cards
                - filterMagic() function - Follows same logic as filterAll() except for magic cards
                - filterTrap() function - Follows same logic as filterAll() except for trap cards
                - filterAllRarity() function - Shows all rarities
                - filterAllCommon() function - Follows same logic as filterAllRarity() - Shows all common rarities
                - filterAllUnCommon() function - Follows same logic as filterAllRarity() - Shows all uncommon rarities
                - filterAllRare() function - Follows same logic as filterAllRarity() - Shows all rare rarities
                - filterAllSuperRare() function - Follows same logic as filterAllRarity() - Shows all super rare rarities
                - filterAquatic() function - Follows same logic as above - Shows aquatic cards
                - filterBug() function - Follows same logic as above - Shows bug cards
                - filterDragon() function - Follows same logic as above - Shows dragon cards
                - filterFlying() function - Follows same logic as above - Shows flying cards
                - filterHumanoid() function - Follows same logic as above - Shows human cards
                - filterMagical() function - Follows same logic as above - Shows magical cards
                - filterMonster() function - Follows same logic as above - Shows monster cards
                - filterAllElement() function - Follows same logic as above but for card elements - Shows all card elements
                - filterDark() function - Follows same logic as above but for card elements - Shows all dark cards
                - filterFire() function - Follows same logic as above but for card elements - Shows all fire cards
                - filterGround() function - Follows same logic as above but for card elements - Shows all ground cards
                - filterLight() function - Follows same logic as above but for card elements - Shows all light cards
                - filterNone() function - Follows same logic as above but for card elements - Shows all none cards
                - filterThunder() function - Follows same logic as above but for card elements - Shows all thunder cards
                - filterWater() function - Follows same logic as above but for card elements - Shows all water cards
                - filterWind() function - Follows same logic as above but for card elements - Shows all wind cards
                - filterAllSize() function - Follows same logic as above but for card size - Shows all sized cards
                - filterSize0() function - Follows same logic as above but for card size - Shows all size 0 cards
                - filterSize1() function - Follows same logic as above but for card size - Shows all size 1 cards
                - filterSize2() function - Follows same logic as above but for card size - Shows all size 2 cards
                - filterSize3() function - Follows same logic as above but for card size - Shows all size 3 cards
                - filterAvatarRarity() function - Follows same logic as above but for avatar cards
                - filterAvatarCommon() function - Follows same logic as above - Shows all common rarities
                - filterAvatarUncommon() function - Follows same logic as above - Shows all uncommon rarities
                - filterAvatarRare() function - Follows same logic as above - Shows all rare rarities
                - filterAvatarSuperRare() function - Follows same logic as above - Shows all super rare rarities
                - filterMagicAllEffect() function - Follows the same logic as above but for magic cards
                - filterMagicAttack() function - Follows the same logic as above but for magic cards
                - filterMagicMultiplyAttack() function - Follows the same logic as above but for magic cards
                - filterMagicBlackHole() function - Follows the same logic as above but for magic cards
                - filterMagicDefense() function - Follows the same logic as above but for magic cards
                - filterMagicMultiplyDefense() function - Follows the same logic as above but for magic cards
                - filterMagicDestroy() function - Follows the same logic as above but for magic cards
                - filterMagicInterfere() function - Follows the same logic as above but for magic cards
                - filterMagicRemoveInterfere() function - Follows the same logic as above but for magic cards
                - filterMagicRange() function - Follows the same logic as above but for magic cards
                - filterMagicSize() function - Follows the same logic as above but for magic cards
                - filterMagicRestore() function - Follows the same logic as above but for magic cards
                - filterMagicAllTarget() function - Follows the same logic as above but for magic card targets
                - filterMagicSelf() function - Follows the same logic as above but for magic card targets
                - filterMagicEnemy() function - Follows the same logic as above but for magic card targets
                - filterMagicRarity() function - Follows the same logic as above but for magic card rarities
                - filterMagicRarity() function - Follows the same logic as above but for magic card rarities
                - filterMagicCommon() function - Follows the same logic as above but for magic card rarities
                - filterMagicUncommon() function - Follows the same logic as above but for magic card rarities
                - filterMagicRare() function - Follows the same logic as above but for magic card rarities
                - filterMagicSuperRare() function - Follows the same logic as above but for magic card rarities
                - filterTrapAllTarget() function - Follows the same logic as above but for trap card targets
                - filterTrapSelf() function - Follows the same logic as above but for trap card targets
                - filterTrapEnemy() function - Follows the same logic as above but for trap card targets
                - filterTrapRarity() function - Follows the same logic as above but for trap card rarities
                - filterTrapCommon() function - Follows the same logic as above but for trap card rarities
                - filterTrapUncommon() function - Follows the same logic as above but for trap card rarities
                - filterTrapRare() function - Follows the same logic as above but for trap card rarities
                - filterTrapSuperRare() function - Follows the same logic as above but for trap card rarities
                - populateCards(filters) function - Accepts a filter object, iterates through all cards and checks them against filters, if matched then place in currentCards array then update innerHTML src of cards
                - showCards() function - Iterates through all bootstrap cards and shows them if they are hidden
                - hideCards() function - Iterates through all bootstrap cards and hides them if they are shown
                - Form eventListener - Captures search form submission and assigns it to searchString, prevents default refresh, updates filters and calls relevant functions
---------------------------------------------------------------*/

let avatarCardArray; //Holds avatar card information
let magicCardArray; //Holds magic card information
let trapCardArray; //Holds trap card information
let userCardArray; //Holds user card information
let currentCards; //Holds the current cards to be displayed
let allCards = []; //Holds all cards
let filter = {type: "all", class: "all", element: "all", size: "all", rarity: "all", effect: "all", target: "all", search: ""}; //Array of filters
let defaultFilter = {type: "all", class: "all", element: "all", size: "all", rarity: "all", effect: "all", target: "all", search: ""}; //Default filter, used for resetting filter
let pageIndex = 0; //Page index for browsing collection
let curFilter = "";

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
            //Else, the user is logged in and may proceed
            else {
                avatarCardArray = response["avatarCardArray"]; //Assign avatar card array
                magicCardArray = response["magicCardArray"]; //Assign magic card array
                trapCardArray = response["trapCardArray"]; //Assign trap card array
                userCardArray = response["userCardArray"]; //Assign user card array

                let id = avatarCardArray[0].id; //Assign intiial id
                let typeId = avatarCardArray[0].typeId; //Assign initial typeId

                //Iterate through all avatar cards, get rid of duplicates
                for (let i = 1; i < avatarCardArray.length; i++) {
                    //If current card id and typeId match initial ones
                    if (avatarCardArray[i].id === id && avatarCardArray[i].typeId === typeId) {
                        avatarCardArray.splice(i - 1, 1); //Remove duplicate
                    }
                    id = avatarCardArray[i].id; //Update id
                    typeId = avatarCardArray[i].typeId; //Update typeId
                }

                id = magicCardArray[0].id; //Assign initial id
                typeId = magicCardArray[0].typeId; //Assign initial typeId

                //Iterate through all magic cards, get rid of duplicates
                for (let i = 1; i < magicCardArray.length; i++) {
                    //If current card id and typeId match initial ones
                    if (magicCardArray[i].id === id && magicCardArray[i].typeId === typeId) {
                        magicCardArray.splice(i - 1, 1); //Remove duplicate
                    }
                    id = magicCardArray[i].id; //Update id
                    typeId = magicCardArray[i].typeId; //Update typeId
                }

                id = trapCardArray[0].id; //Assign initial id
                typeId = trapCardArray[0].typeId; //Assign initial typeId

                //Iterate through all trap cards, get rid of duplicates
                for (let i = 1; i < trapCardArray.length; i++) {
                    //If current card id and typeId match initial ones
                    if (trapCardArray[i].id === id && trapCardArray[i].typeId === typeId) {
                        trapCardArray.splice(i - 1, 1); //Remove duplicate
                    }
                    id = trapCardArray[i].id; //Update id
                    typeId = trapCardArray[i].typeId; //Update typeId
                }

                //Create new array consisting of all cards, grouped by class and ascending by card number
                Array.prototype.push.apply(allCards, avatarCardArray);
                Array.prototype.push.apply(allCards, magicCardArray);
                Array.prototype.push.apply(allCards, trapCardArray);

                //Initialize temporary arrays for sorting of userCardArray
                let userAvatarArray = []; //Hold user's avatar card info
                let userMagicArray = []; //Hold user's magic card info
                let userTrapArray = []; //Hold user's trap card info
                let index = 0; //Hold current index for combining user arrays into userCardArray
                let index1 = 0; //Hold current index for avatarTempArray
                let index2 = 0; //Hold current index for magicTempArray
                let index3 = 0; //Hold current index for trapTempArray

                //Iterate through all user cards to sort
                for (let i = 0; i < userCardArray.length; i++) {
                    //If the current element is an avatar card
                    if (userCardArray[i].typeId === "A") {
                        userAvatarArray[index1] = userCardArray[i]; //Add it to the userAvatarArray
                        index1++; //Increment index1
                    }

                    //If the current element is a magic card
                    if (userCardArray[i].typeId === "M") {
                        userMagicArray[index2] = userCardArray[i]; //Add it to the userMagicArray
                        index2++; //Increment index2
                    }

                    //If the current element is a trap card
                    if (userCardArray[i].typeId === "T") {
                        userTrapArray[index3] = userCardArray[i]; //Add it to the userTrapArray
                        index3++; //Increment index3
                    }
                }

                //Iterate through userAvatarArray and put in userCardArray
                for (let i = 0; i < userAvatarArray.length; i++) {
                    userCardArray[index] = userAvatarArray[i]; //Place in userCardArray
                    index++; //Increment index
                }
                //Iterate through userMagicArray and put in userCardArray
                for (let i = 0; i < userMagicArray.length; i++) {
                    userCardArray[index] = userMagicArray[i]; //Place in userCardArray
                    index++; //Increment index
                }
                //Iterate through userTrapArray and put in userCardArray
                for (let i = 0; i < userTrapArray.length; i++) {
                    userCardArray[index] = userTrapArray[i]; //Place in userCardArray
                    index++; //Increment index
                }
                filterAll(); //Set card filter to all
            }
        }
        else {
            console.log("Failed"); //For debugging
        }
    }
};

//Send as GET to getCollection.php
xmlhttp.open("GET", "../../lib/collectionbook/getCollection.php", true); //Asynchronously open xmlhttp to getDashboard.php
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); //Set the request header
xmlhttp.send(); //Send JSON object

//Page Arrows-----------------------------------------------------------------------------------------------------
//pageLeft() function - Flips page to the left. Updates all cards on the screen and arrows accordingly.
function pageLeft() {

    //If not at the first page yet, turn page left
    if(pageIndex !== 0) {

        //Make page right button visible
        if(document.getElementById("pageRight").classList.contains("invisible")) {
            document.getElementById("pageRight").className = document.getElementById("pageRight").className.replace("invisible", "visible");
        }

        //If on the the last page of cards
        if(pageIndex >= currentCards.length-8) {

            //Iterate through all cards
            for(let i = 0; i < 8; i++) {
                //If card is being hidden, show it
                if(document.getElementById("card"+(i+1)).className.includes("d-none")) {
                    document.getElementById("card"+(i+1)).className = document.getElementById("card"+(i+1)).className.replace("d-none", "d-block"); //Show it
                }
            }
        }

        pageIndex -= 8; //Update index

        //Iterate through all bootstrap cards
        for(let i = 0; i < 8; i++) {
            document.getElementById("card"+(i+1)+"Image").src = "../../lib/" + currentCards[pageIndex+i].illustrationPath; //Update image

            //If the user has the card set opacity to 1.0
            if(hasCard(currentCards[pageIndex+i])) {
                document.getElementById("card"+(i+1)+"Image").style.opacity = "1.0";
            }

            //Else, they do not have the card, set opacity to 0.5
            else {
                document.getElementById("card"+(i+1)+"Image").style.opacity = "0.5";
            }

            //If the current card is an avatar card
            if(currentCards[pageIndex+i].typeId === "A") {
                //Show relevant text
                document.getElementById("card" + (i + 1) + "Class").className = document.getElementById("card" + (i + 1) + "Class").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Element").className = document.getElementById("card" + (i + 1) + "Element").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Size").className = document.getElementById("card" + (i + 1) + "Size").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Range").className = document.getElementById("card" + (i + 1) + "Range").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Attack").className = document.getElementById("card" + (i + 1) + "Attack").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Defense").className = document.getElementById("card" + (i + 1) + "Defense").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Hp").className = document.getElementById("card" + (i + 1) + "Hp").className.replace("d-none", "d-block");

                //Hide irrelevant text
                document.getElementById("card" + (i + 1) + "Interval").className = document.getElementById("card" + (i + 1) + "Interval").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "TypeId").className = document.getElementById("card" + (i + 1) + "TypeId").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Description").className = document.getElementById("card" + (i + 1) + "Description").className.replace("d-block", "d-none");

                //Update text
                document.getElementById("card" + (i + 1) + "Title").innerHTML = currentCards[pageIndex+i].name;
                document.getElementById("card" + (i + 1) + "Class").innerHTML = currentCards[pageIndex+i].class;
                document.getElementById("card" + (i + 1) + "Element").innerHTML = currentCards[pageIndex+i].element;
                document.getElementById("card" + (i + 1) + "Size").innerHTML = currentCards[pageIndex+i].size;
                document.getElementById("card" + (i + 1) + "Range").innerHTML = currentCards[pageIndex+i].range;
                document.getElementById("card" + (i + 1) + "Attack").innerHTML = currentCards[pageIndex+i].attack;
                document.getElementById("card" + (i + 1) + "Defense").innerHTML = currentCards[pageIndex+i].defense;
                document.getElementById("card" + (i + 1) + "Hp").innerHTML = currentCards[pageIndex+i].hp;
                document.getElementById("card" + (i + 1) + "Description").innerHTML = currentCards[pageIndex+i].description;
            }

            //If the current card is a magic card
            if(currentCards[pageIndex+i].typeId === "M") {
                //Show relevant text
                document.getElementById("card" + (i + 1) + "Interval").className = document.getElementById("card" + (i + 1) + "Interval").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "TypeId").className = document.getElementById("card" + (i + 1) + "TypeId").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Description").className = document.getElementById("card" + (i + 1) + "Description").className.replace("d-none", "d-block");

                //Hide irrelevant text
                document.getElementById("card" + (i + 1) + "Class").className = document.getElementById("card" + (i + 1) + "Class").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Element").className = document.getElementById("card" + (i + 1) + "Element").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Size").className = document.getElementById("card" + (i + 1) + "Size").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Range").className = document.getElementById("card" + (i + 1) + "Range").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Attack").className = document.getElementById("card" + (i + 1) + "Attack").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Defense").className = document.getElementById("card" + (i + 1) + "Defense").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Hp").className = document.getElementById("card" + (i + 1) + "Hp").className.replace("d-block", "d-none");

                //Update text
                document.getElementById("card" + (i + 1) + "Title").innerHTML = currentCards[pageIndex+i].name;
                document.getElementById("card" + (i + 1) + "Interval").innerHTML = currentCards[pageIndex+i].interval;
                document.getElementById("card" + (i + 1) + "TypeId").innerHTML = currentCards[pageIndex+i].typeId;
                document.getElementById("card" + (i + 1) + "Description").innerHTML = currentCards[pageIndex+i].description;
            }

            //If the current card is a trap card
            if(currentCards[pageIndex+i].typeId === "T") {
                //Show relevant text
                document.getElementById("card" + (i + 1) + "Interval").className = document.getElementById("card" + (i + 1) + "Interval").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "TypeId").className = document.getElementById("card" + (i + 1) + "TypeId").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Description").className = document.getElementById("card" + (i + 1) + "Description").className.replace("d-none", "d-block");

                //Hide irrelevant text
                document.getElementById("card" + (i + 1) + "Class").className = document.getElementById("card" + (i + 1) + "Class").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Element").className = document.getElementById("card" + (i + 1) + "Element").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Size").className = document.getElementById("card" + (i + 1) + "Size").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Range").className = document.getElementById("card" + (i + 1) + "Range").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Attack").className = document.getElementById("card" + (i + 1) + "Attack").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Defense").className = document.getElementById("card" + (i + 1) + "Defense").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Hp").className = document.getElementById("card" + (i + 1) + "Hp").className.replace("d-block", "d-none");

                //Update text
                document.getElementById("card" + (i + 1) + "Title").innerHTML = currentCards[pageIndex+i].name;
                document.getElementById("card" + (i + 1) + "Interval").innerHTML = currentCards[pageIndex+i].value;
                document.getElementById("card" + (i + 1) + "TypeId").innerHTML = currentCards[pageIndex+i].typeId;
                document.getElementById("card" + (i + 1) + "Description").innerHTML = currentCards[pageIndex+i].description;
            }
        }
    }

    //If at first page
    if(pageIndex === 0) {
        //If the left button is visible, hide it
        if(document.getElementById("pageLeft").classList.contains("visible")) {
            document.getElementById("pageLeft").className = document.getElementById("pageLeft").className.replace("visible", "invisible");
        }
    }
}

//pageRight() function - Flips page to the right. Updates all cards on the screen and arrows accordingly.
function pageRight() {
    //If not at the end of book
    if(pageIndex < currentCards.length-8) {
        pageIndex += 8; //Increase index
        let bCards = 8; //Number of bootstrap cards to display

        //If iterating 8 from pageIndex goes OOB of currentCards (turning to the last page)
        if(pageIndex+8 >= currentCards.length) {
            bCards = currentCards.length-pageIndex; //Assign max elements left to bCards so it doesn't iterate OOB
            document.getElementById("pageRight").className = document.getElementById("pageRight").className.replace("visible", "invisible"); //Make page right button invisible
        }

        //Iterate through currentCards and update the displayed cards
        for(let i = 0; i < bCards; i++) {
            document.getElementById("card"+(i+1)+"Image").src = "../../lib/" + currentCards[pageIndex+i].illustrationPath; //Update card image
            //If the user has the card set opacity to 1.0
            if(hasCard(currentCards[pageIndex+i])) {
                document.getElementById("card"+(i+1)+"Image").style.opacity = "1.0";
            }
            //Else, they do not have the card, set opacity to 0.5
            else {
                document.getElementById("card"+(i+1)+"Image").style.opacity = "0.5";
            }

            //If the current card is an avatar card
            if(currentCards[pageIndex+i].typeId === "A") {
                //Show relevant text
                document.getElementById("card" + (i + 1) + "Class").className = document.getElementById("card" + (i + 1) + "Class").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Element").className = document.getElementById("card" + (i + 1) + "Element").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Size").className = document.getElementById("card" + (i + 1) + "Size").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Range").className = document.getElementById("card" + (i + 1) + "Range").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Attack").className = document.getElementById("card" + (i + 1) + "Attack").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Defense").className = document.getElementById("card" + (i + 1) + "Defense").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Hp").className = document.getElementById("card" + (i + 1) + "Hp").className.replace("d-none", "d-block");

                //Hide irrelevant text
                document.getElementById("card" + (i + 1) + "Interval").className = document.getElementById("card" + (i + 1) + "Interval").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "TypeId").className = document.getElementById("card" + (i + 1) + "TypeId").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Description").className = document.getElementById("card" + (i + 1) + "Description").className.replace("d-block", "d-none");

                //Update text
                document.getElementById("card" + (i + 1) + "Title").innerHTML = currentCards[pageIndex+i].name;
                document.getElementById("card" + (i + 1) + "Class").innerHTML = currentCards[pageIndex+i].class;
                document.getElementById("card" + (i + 1) + "Element").innerHTML = currentCards[pageIndex+i].element;
                document.getElementById("card" + (i + 1) + "Size").innerHTML = currentCards[pageIndex+i].size;
                document.getElementById("card" + (i + 1) + "Range").innerHTML = currentCards[pageIndex+i].range;
                document.getElementById("card" + (i + 1) + "Attack").innerHTML = currentCards[pageIndex+i].attack;
                document.getElementById("card" + (i + 1) + "Defense").innerHTML = currentCards[pageIndex+i].defense;
                document.getElementById("card" + (i + 1) + "Hp").innerHTML = currentCards[pageIndex+i].hp;
                document.getElementById("card" + (i + 1) + "Description").innerHTML = currentCards[pageIndex+i].description;
            }

            //If the current card is a magic card
            if(currentCards[pageIndex+i].typeId === "M") {
                //Show relevant text
                document.getElementById("card" + (i + 1) + "Interval").className = document.getElementById("card" + (i + 1) + "Interval").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "TypeId").className = document.getElementById("card" + (i + 1) + "TypeId").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Description").className = document.getElementById("card" + (i + 1) + "Description").className.replace("d-none", "d-block");

                //Hide irrelevant text
                document.getElementById("card" + (i + 1) + "Class").className = document.getElementById("card" + (i + 1) + "Class").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Element").className = document.getElementById("card" + (i + 1) + "Element").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Size").className = document.getElementById("card" + (i + 1) + "Size").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Range").className = document.getElementById("card" + (i + 1) + "Range").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Attack").className = document.getElementById("card" + (i + 1) + "Attack").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Defense").className = document.getElementById("card" + (i + 1) + "Defense").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Hp").className = document.getElementById("card" + (i + 1) + "Hp").className.replace("d-block", "d-none");

                //Update text
                document.getElementById("card" + (i + 1) + "Title").innerHTML = currentCards[pageIndex+i].name;
                document.getElementById("card" + (i + 1) + "Interval").innerHTML = currentCards[pageIndex+i].interval;
                document.getElementById("card" + (i + 1) + "TypeId").innerHTML = currentCards[pageIndex+i].typeId;
                document.getElementById("card" + (i + 1) + "Description").innerHTML = currentCards[pageIndex+i].description;
            }

            //If the current card is a trap card
            if(currentCards[pageIndex+i].typeId === "T") {
                //Show relevant text
                document.getElementById("card" + (i + 1) + "Interval").className = document.getElementById("card" + (i + 1) + "Interval").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "TypeId").className = document.getElementById("card" + (i + 1) + "TypeId").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Description").className = document.getElementById("card" + (i + 1) + "Description").className.replace("d-none", "d-block");

                //Hide irrelevant text
                document.getElementById("card" + (i + 1) + "Class").className = document.getElementById("card" + (i + 1) + "Class").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Element").className = document.getElementById("card" + (i + 1) + "Element").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Size").className = document.getElementById("card" + (i + 1) + "Size").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Range").className = document.getElementById("card" + (i + 1) + "Range").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Attack").className = document.getElementById("card" + (i + 1) + "Attack").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Defense").className = document.getElementById("card" + (i + 1) + "Defense").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Hp").className = document.getElementById("card" + (i + 1) + "Hp").className.replace("d-block", "d-none");

                //Update text
                document.getElementById("card" + (i + 1) + "Title").innerHTML = currentCards[pageIndex+i].name;
                document.getElementById("card" + (i + 1) + "Interval").innerHTML = currentCards[pageIndex+i].value;
                document.getElementById("card" + (i + 1) + "TypeId").innerHTML = currentCards[pageIndex+i].typeId;
                document.getElementById("card" + (i + 1) + "Description").innerHTML = currentCards[pageIndex+i].description;
            }
        }

        //If there are not 8 cards to display for bootstrap
        if(bCards!== 8) {
            //Iterate through the leftover cards
            for(let i = bCards+1; i <= 8; i++) {
                //If the card is being shown, hide it
                if(document.getElementById("card"+(i)).className.includes("d-block")) {
                    document.getElementById("card"+(i)).className = document.getElementById("card"+(i)).className.replace("d-block", "d-none"); //Hide it
                }
            }
        }
    }
    //If not on the first page
    if(pageIndex > 0) {
        //If the left button is invisible, show it
        if(document.getElementById("pageLeft").classList.contains("invisible")) {
            document.getElementById("pageLeft").className = document.getElementById("pageLeft").className.replace("invisible", "visible");
        }
    }
}

//hasCard(card) function - Accepts a card and compares it with the cards the user owns and returns true if they have it and false if they do not
function hasCard(card) {
    //Iterate through all cards
    for(let i = 0; i < userCardArray.length; i++) {
        //If cards match
        if(userCardArray[i].id === card.id && userCardArray[i].typeId === card.typeId) {
            return true; //Return true, the user has the card
        }
    }
    return false; //Return false, the user does not have the card
}

//updateContextFilters(string) function - Accepts a string (context filter group such as avatarFilters) shows them and hides all other context filters
function updateContextFilters(string) {

    pageIndex = 0; //Reset page index

    //Iterate through all bootstrap cards
    for(let i = 0; i < 8; i++) {
        //If bootstrap card is hidden, show it
        if(document.getElementById("card"+(i+1)).className.includes("d-none")) {
            document.getElementById("card"+(i+1)).className = document.getElementById("card"+(i+1)).className.replace("d-none", "d-block"); //Show it
        }
    }

    //If the current filter doesn't match the passed string, update the context filters accordingly
    if(curFilter !== string) {
        let contextFiltersArray = document.getElementById("contextFilters").children; //Get the children of contextFilters

        //Iterate through all context filters
        for (let i = 0; i < contextFiltersArray.length; i++) {

            //If current element id matches passed string
            if (contextFiltersArray[i].id === string) {

                //If current context filter is being displayed, hide it
                if (contextFiltersArray[i].className.includes("-inline")) {
                    contextFiltersArray[i].className = contextFiltersArray[i].className.replace("-inline", "-none"); //Hide it
                }

                //If current context filter is not being displayed, show it
                else {
                    contextFiltersArray[i].className = contextFiltersArray[i].className.replace("-none", "-inline"); //Show it
                }
            }

            //If the current context is for search, hide all context buttons
            else if(string === "search") {
                //Hide all context filters that are currently being shown
                if (contextFiltersArray[i].className.includes("-inline")) {
                    contextFiltersArray[i].className = contextFiltersArray[i].className.replace("-inline", "-none"); //Hide it
                }
            }

            //Else, hide element
            else {
                //If current context filter is being displayed
                if (contextFiltersArray[i].className.includes("-inline")) {
                    contextFiltersArray[i].className = contextFiltersArray[i].className.replace("-inline", "-none"); //Hide it
                }
            }

        }
    }
}

//resetFilter() function - Resets all function variables to default "all"
function resetFilter() {
    filter.type = defaultFilter.type;
    filter.class = defaultFilter.class;
    filter.element = defaultFilter.element;
    filter.size = defaultFilter.size;
    filter.rarity = defaultFilter.rarity;
    filter.effect = defaultFilter.effect;
    filter.target = defaultFilter.target;
    filter.search = defaultFilter.search;
}

//resetPageButtons() function - Makes left buttons invisible and right visible, used when new card filter is applied (first page)
function resetPageButtons() {
    //If there are more than 8 cards, make left button invisible and right button visible
    if(currentCards.length > 8) {
        //If the right button is invisible. show it
        if (document.getElementById("pageRight").classList.contains("invisible")) {
            document.getElementById("pageRight").className = document.getElementById("pageRight").className.replace("invisible", "visible");
        }

        //If the left button is visible, hide it
        if (document.getElementById("pageLeft").classList.contains("visible")) {
            document.getElementById("pageLeft").className = document.getElementById("pageLeft").className.replace("visible", "invisible");
        }
    }
    //Else, no need to show buttons, hide left and right buttons
    else {
        //If the right button is invisible. hide it
        if (document.getElementById("pageRight").classList.contains("visible")) {
            document.getElementById("pageRight").className = document.getElementById("pageRight").className.replace("visible", "invisible");
        }

        //If the left button is visible, hide it
        if (document.getElementById("pageLeft").classList.contains("visible")) {
            document.getElementById("pageLeft").className = document.getElementById("pageLeft").className.replace("visible", "invisible");
        }
    }
}

//resetSearchForm() function - If swapping from search context, resets the search form to display "Search" placeholder again
function resetSearchForm() {
    if(filter.type === "search") {
        document.getElementById("search").value = "";
        document.getElementById("search").placeholder = "Search All cards";
    }
}

//Card Type Filters-----------------------------------------------------------------------------------------------------
//filterAll() function - Sets card filter to show all
function filterAll() {
    resetSearchForm(); //If switching from search context, refresh the placeholder in the search
    document.getElementById("typeFilter").innerHTML = "Card Type: All"; //Update html
    resetFilter(); //Reset filter
    updateContextFilters("allFilters"); //Update context filters
    populateCards(); //Populate the cards
    document.getElementById("pageTitle").innerHTML = "All Cards"; //Update page title
    document.getElementById("allRarityFilter").innerHTML = "Rarity: All"; //Update context filter html
    curFilter = "allFilters"; //Set current filter
}

//filterAvatar() function - Follows same logic as filterAll() except for avatar cards
function filterAvatar() {
    resetSearchForm(); //If switching from search context, refresh the placeholder in the search
    document.getElementById("typeFilter").innerHTML = "Card Type: Avatar";
    resetFilter();
    filter.type = "avatar";
    updateContextFilters("avatarFilters");
    populateCards();
    document.getElementById("pageTitle").innerHTML = "Avatar Cards";
    curFilter = "avatarFilters";
}

//filterMagic() function - Follows same logic as filterAll() except for magic cards
function filterMagic() {
    resetSearchForm(); //If switching from search context, refresh the placeholder in the search
    document.getElementById("typeFilter").innerHTML = "Card Type: Magic";
    resetFilter();
    filter.type = "magic";
    updateContextFilters("magicFilters");
    populateCards();
    document.getElementById("pageTitle").innerHTML = "Magic Cards";
    curFilter = "magicFilters";
}

//filterTrap() function - Follows same logic as filterAll() except for trap cards
function filterTrap() {
    resetSearchForm(); //If switching from search context, refresh the placeholder in the search
    document.getElementById("typeFilter").innerHTML = "Card Type: Trap";
    resetFilter();
    filter.type = "trap";
    updateContextFilters("trapFilters");
    populateCards();
    document.getElementById("pageTitle").innerHTML = "Trap Cards";
    curFilter = "trapFilters";
}

//Card Rarity Filters---------------------------------------------------------------------------------------------------

//filterAllRarity() function - Shows all rarities
function filterAllRarity() {
    document.getElementById("allRarityFilter").innerHTML = "Rarity: All"; //Update html
    filter.rarity = "all"; //Set rarity to all
    populateCards(); //Populate cards
}

//filterAllCommon() function - Follows same logic as filterAllRarity() - Shows all common rarities
function filterAllCommon() {
    document.getElementById("allRarityFilter").innerHTML = "Rarity: Common";
    filter.rarity = "C";
    populateCards();
}

//filterAllUnCommon() function - Follows same logic as filterAllRarity() - Shows all uncommon rarities
function filterAllUncommon() {
    document.getElementById("allRarityFilter").innerHTML = "Rarity: Uncommon";
    filter.rarity = "UC";
    populateCards();
}

//filterAllRare() function - Follows same logic as filterAllRarity() - Shows all rare rarities
function filterAllRare() {
    document.getElementById("allRarityFilter").innerHTML = "Rarity: Rare";
    filter.rarity = "R";
    populateCards();
}

//filterAllSuperRare() function - Follows same logic as filterAllRarity() - Shows all super rare rarities
function filterAllSuperRare() {
    document.getElementById("allRarityFilter").innerHTML = "Rarity: Super Rare";
    filter.rarity = "SR";
    populateCards();
}
//----------------------------------------------------------------------------------------------------------------------

//--------------------------------------------Context Filters-----------------------------------------------------------//

//Avatar filters--------------------------------------------------------------------------------------------------------//
//Card Class Filters----------------------------------------------------------------------------------------------------
//filterAllClass() function - Shows all classes
function filterAllClass() {
    document.getElementById("classFilter").innerHTML = "Class: All"; //Update html
    filter.class = "all"; //Set class to all
    populateCards(); //Populate cards
}

//filterAquatic() function - Follows same logic as above - Shows aquatic cards
function filterAquatic() {
    document.getElementById("classFilter").innerHTML = "Class: Aquatic";
    filter.class = "Aquatic";
    populateCards();
}

//filterBug() function - Follows same logic as above - Shows bug cards
function filterBug() {
    document.getElementById("classFilter").innerHTML = "Class: Bug";
    filter.class = "Bug";
    populateCards();
}

//filterDragon() function - Follows same logic as above - Shows dragon cards
function filterDragon() {
    document.getElementById("classFilter").innerHTML = "Class: Dragon";
    filter.class = "Dragon";
    populateCards();
}

//filterFlying() function - Follows same logic as above - Shows flying cards
function filterFlying() {
    document.getElementById("classFilter").innerHTML = "Class: Flying";
    filter.class = "Flying";
    populateCards();
}

//filterHumanoid() function - Follows same logic as above - Shows human cards
function filterHumanoid() {
    document.getElementById("classFilter").innerHTML = "Class: Humanoid";
    filter.class = "HumanLike";
    populateCards();
}

//filterMagical() function - Follows same logic as above - Shows magical cards
function filterMagical() {
    document.getElementById("classFilter").innerHTML = "Class: Magical";
    filter.class = "Magical";
    populateCards();
}

//filterMonster() function - Follows same logic as above - Shows monster cards
function filterMonster() {
    document.getElementById("classFilter").innerHTML = "Class: Monster";
    filter.class = "Monster";
    populateCards();
}

//Card Element Filters--------------------------------------------------------------------------------------------------

//filterAllElement() function - Follows same logic as above but for card elements - Shows all card elements
function filterAllElement() {
    document.getElementById("elementFilter").innerHTML = "Element: All";
    filter.element = "all";
    populateCards();
}

//filterDark() function - Follows same logic as above but for card elements - Shows all dark cards
function filterDark() {
    document.getElementById("elementFilter").innerHTML = "Element: Dark";
    filter.element = "Dark";
    populateCards();
}

//filterFire() function - Follows same logic as above but for card elements - Shows all fire cards
function filterFire() {
    document.getElementById("elementFilter").innerHTML = "Element: Fire";
    filter.element = "Fire";
    populateCards();
}

//filterGround() function - Follows same logic as above but for card elements - Shows all ground cards
function filterGround() {
    document.getElementById("elementFilter").innerHTML = "Element: Ground";
    filter.element = "Ground";
    populateCards();
}

//filterLight() function - Follows same logic as above but for card elements - Shows all light cards
function filterLight() {
    document.getElementById("elementFilter").innerHTML = "Element: Light";
    filter.element = "Light";
    populateCards();
}

//filterNone() function - Follows same logic as above but for card elements - Shows all none cards
function filterNone() {
    document.getElementById("elementFilter").innerHTML = "Element: None";
    filter.element = "NoneElement";
    populateCards();
}

//filterThunder() function - Follows same logic as above but for card elements - Shows all thunder cards
function filterThunder() {
    document.getElementById("elementFilter").innerHTML = "Element: Thunder";
    filter.element = "Thunder";
    populateCards();
}

//filterWater() function - Follows same logic as above but for card elements - Shows all water cards
function filterWater() {
    document.getElementById("elementFilter").innerHTML = "Element: Water";
    filter.element = "Water";
    populateCards();
}

//filterWind() function - Follows same logic as above but for card elements - Shows all wind cards
function filterWind() {
    document.getElementById("elementFilter").innerHTML = "Element: Wind";
    filter.element = "Wind";
    populateCards();
}

//Card Size Filters-----------------------------------------------------------------------------------------------------

//filterAllSize() function - Follows same logic as above but for card size - Shows all sized cards
function filterAllSize() {
    document.getElementById("sizeFilter").innerHTML = "Size: All";
    filter.size = "all";
    populateCards();
}

//filterSize0() function - Follows same logic as above but for card size - Shows all size 0 cards
function filterSize0() {
    document.getElementById("sizeFilter").innerHTML = "Size: 0";
    filter.size = "0";
    populateCards();
}

//filterSize1() function - Follows same logic as above but for card size - Shows all size 1 cards
function filterSize1() {
    document.getElementById("sizeFilter").innerHTML = "Size: 1";
    filter.size = "1";
    populateCards();
}

//filterSize2() function - Follows same logic as above but for card size - Shows all size 2 cards
function filterSize2() {
    document.getElementById("sizeFilter").innerHTML = "Size: 2";
    filter.size = "2";
    populateCards();
}

//filterSize3() function - Follows same logic as above but for card size - Shows all size 3 cards
function filterSize3() {
    document.getElementById("sizeFilter").innerHTML = "Size: 3";
    filter.size = "3";
    populateCards();
}

//Card Rarity Filters---------------------------------------------------------------------------------------------------
//filterAvatarRarity() function - Follows same logic as above but for avatar cards
function filterAvatarRarity() {
    document.getElementById("avatarRarityFilter").innerHTML = "Rarity: All";
    filter.rarity = "all";
    populateCards();
}

//filterAvatarCommon() function - Follows same logic as above - Shows all common rarities
function filterAvatarCommon() {
    document.getElementById("avatarRarityFilter").innerHTML = "Rarity: Common";
    filter.rarity = "C";
    populateCards();
}

//filterAvatarUncommon() function - Follows same logic as above - Shows all uncommon rarities
function filterAvatarUncommon() {
    document.getElementById("avatarRarityFilter").innerHTML = "Rarity: Uncommon";
    filter.rarity = "UC";
    populateCards();
}

//filterAvatarRare() function - Follows same logic as above - Shows all rare rarities
function filterAvatarRare() {
    document.getElementById("avatarRarityFilter").innerHTML = "Rarity: Rare";
    filter.rarity = "R";
    populateCards();
}

//filterAvatarSuperRare() function - Follows same logic as above - Shows all super rare rarities
function filterAvatarSuperRare() {
    document.getElementById("avatarRarityFilter").innerHTML = "Rarity: Super Rare";
    filter.rarity = "SR";
    populateCards();
}
//----------------------------------------------------------------------------------------------------------------------



//Magic Filters-------------------------------------------------------------------------------------------------------//
//Effect Filters--------------------------------------------------------------------------------------------------------

//filterMagicAllEffect() function - Follows the same logic as above but for magic cards
function filterMagicAllEffect() {
    document.getElementById("effectFilter").innerHTML = "Effect: All";
    filter.effect = "all";
    populateCards();
}

//filterMagicAttack() function - Follows the same logic as above but for magic cards
function filterMagicAttack() {
    document.getElementById("effectFilter").innerHTML = "Effect: Attack";
    filter.effect = "plusAtk";
    populateCards();
}

//filterMagicMultiplyAttack() function - Follows the same logic as above but for magic cards
function filterMagicMultiplyAttack() {
    document.getElementById("effectFilter").innerHTML = "Effect: Multiply Attack";
    filter.effect = "multiplyAtk";
    populateCards();
}

//filterMagicBlackHole() function - Follows the same logic as above but for magic cards
function filterMagicBlackHole() {
    document.getElementById("effectFilter").innerHTML = "Effect: Black Hole";
    filter.effect = "blackHole";
    populateCards();
}

//filterMagicDefense() function - Follows the same logic as above but for magic cards
function filterMagicDefense() {
    document.getElementById("effectFilter").innerHTML = "Effect: Defense";
    filter.effect = "plusDef";
    populateCards();
}

//filterMagicMultiplyDefense() function - Follows the same logic as above but for magic cards
function filterMagicMultiplyDefense() {
    document.getElementById("effectFilter").innerHTML = "Effect: Multiply Defense";
    filter.effect = "multiplyDef";
    populateCards();
}

//filterMagicDestroy() function - Follows the same logic as above but for magic cards
function filterMagicDestroy() {
    document.getElementById("effectFilter").innerHTML = "Effect: Destroy";
    filter.effect = "destory"; //TODO spelling mistake in magic_card table of database!
    populateCards();
}

//filterMagicInterfere() function - Follows the same logic as above but for magic cards
function filterMagicInterfere() {
    document.getElementById("effectFilter").innerHTML = "Effect: Interfere";
    filter.effect = "plusInterfere";
    populateCards();
}

//filterMagicRemoveInterfere() function - Follows the same logic as above but for magic cards
function filterMagicRemoveInterfere() {
    document.getElementById("effectFilter").innerHTML = "Effect: Remove Interfere";
    filter.effect = "removeInterfere";
    populateCards();
}

//filterMagicRange() function - Follows the same logic as above but for magic cards
function filterMagicRange() {
    document.getElementById("effectFilter").innerHTML = "Effect: Range";
    filter.effect = "plusRng";
    populateCards();
}

//filterMagicSize() function - Follows the same logic as above but for magic cards
function filterMagicSize() {
    document.getElementById("effectFilter").innerHTML = "Effect: Size";
    filter.effect = "plusSize";
    populateCards();
}

//filterMagicRestore() function - Follows the same logic as above but for magic cards
function filterMagicRestore() {
    document.getElementById("effectFilter").innerHTML = "Effect: Restore";
    filter.effect = "restore";
    populateCards();
}

//Target Filters--------------------------------------------------------------------------------------------------------

//filterMagicAllTarget() function - Follows the same logic as above but for magic card targets
function filterMagicAllTarget() {
    document.getElementById("magicTargetFilter").innerHTML = "Target: All";
    filter.target = "all";
    populateCards();
}

//filterMagicSelf() function - Follows the same logic as above but for magic card targets
function filterMagicSelf() {
    document.getElementById("magicTargetFilter").innerHTML = "Target: Self";
    filter.target = "self";
    populateCards();
}

//filterMagicEnemy() function - Follows the same logic as above but for magic card targets
function filterMagicEnemy() {
    document.getElementById("magicTargetFilter").innerHTML = "Target: Enemy";
    filter.target = "enemy";
    populateCards();
}

//Card Rarity Filters---------------------------------------------------------------------------------------------------

//filterMagicRarity() function - Follows the same logic as above but for magic card rarities
function filterMagicRarity() {
    document.getElementById("magicRarityFilter").innerHTML = "Rarity: All";
    filter.rarity = "all";
    populateCards();
}

//filterMagicCommon() function - Follows the same logic as above but for magic card rarities
function filterMagicCommon() {
    document.getElementById("magicRarityFilter").innerHTML = "Rarity: Common";
    filter.rarity = "C";
    populateCards();
}

//filterMagicUncommon() function - Follows the same logic as above but for magic card rarities
function filterMagicUncommon() {
    document.getElementById("magicRarityFilter").innerHTML = "Rarity: Uncommon";
    filter.rarity = "UC";
    populateCards();
}

//filterMagicRare() function - Follows the same logic as above but for magic card rarities
function filterMagicRare() {
    document.getElementById("magicRarityFilter").innerHTML = "Rarity: Rare";
    filter.rarity = "R";
    populateCards();
}

//filterMagicSuperRare() function - Follows the same logic as above but for magic card rarities
function filterMagicSuperRare() {
    document.getElementById("magicRarityFilter").innerHTML = "Rarity: Super Rare";
    filter.rarity = "SR";
    populateCards();
}
//----------------------------------------------------------------------------------------------------------------------


//Trap Filters--------------------------------------------------------------------------------------------------------//
//filterTrapAllTarget() function - Follows the same logic as above but for trap card targets
function filterTrapAllTarget() {
    document.getElementById("trapTargetFilter").innerHTML = "Target: All";
    filter.target = "all";
    populateCards();
}

//filterTrapSelf() function - Follows the same logic as above but for trap card targets
function filterTrapSelf() {
    document.getElementById("trapTargetFilter").innerHTML = "Target: Self";
    filter.target = "self";
    populateCards();
}

//filterTrapEnemy() function - Follows the same logic as above but for trap card targets
function filterTrapEnemy() {
    document.getElementById("trapTargetFilter").innerHTML = "Target: Enemy";
    filter.target = "enemy";
    populateCards();
}

//Card Rarity Filters---------------------------------------------------------------------------------------------------
//filterTrapRarity() function - Follows the same logic as above but for trap card rarities
function filterTrapRarity() {
    document.getElementById("trapRarityFilter").innerHTML = "Rarity: All";
    filter.rarity = "all";
    populateCards();
}

//filterTrapCommon() function - Follows the same logic as above but for trap card rarities
function filterTrapCommon() {
    document.getElementById("trapRarityFilter").innerHTML = "Rarity: Common";
    filter.rarity = "C";
    populateCards();
}

//filterTrapUncommon() function - Follows the same logic as above but for trap card rarities
function filterTrapUncommon() {
    document.getElementById("trapRarityFilter").innerHTML = "Rarity: Uncommon";
    filter.rarity = "UC";
    populateCards();
}

//filterTrapRare() function - Follows the same logic as above but for trap card rarities
function filterTrapRare() {
    document.getElementById("trapRarityFilter").innerHTML = "Rarity: Rare";
    filter.rarity = "R";
    populateCards();
}

//filterTrapSuperRare() function - Follows the same logic as above but for trap card rarities
function filterTrapSuperRare() {
    document.getElementById("trapRarityFilter").innerHTML = "Rarity: Super Rare";
    filter.rarity = "SR";
    populateCards();
}
//----------------------------------------------------------------------------------------------------------------------

//populateCards(filters) function - Accepts a filter object, iterates through all cards and checks them against filters, if matched then place in currentCards array then update innerHTML src of cards
function populateCards() {
    currentCards = []; //Empty array

    //If Card Type Filter is All
    if(filter.type === "all") {
        //If Rarity is not set to All
        if(filter.rarity !== "all") {
            for (let i = 0; i < allCards.length; i++) {
                //If there's a match
                if (allCards[i].rarity === filter.rarity) {
                    currentCards.push(allCards[i]);
                }
            }
        }
        //Else, assign allCards to currentCards
        else {
            currentCards = allCards.slice(0);
        }
    }

    //If avatar filter, only avatar cards need to be considered
    else if(filter.type === "avatar") {
        currentCards = avatarCardArray.slice(0); //Put all cards in currentCards

        //Iterate through all currentCards in reverse to avoid skipping indices due to splicing out non-matching cards
        for(let i = currentCards.length-1; i >= 0; i--) {

            //If class is not all
            if(filter.class !== "all") {

                //If class does not match
                if(currentCards[i].class !== filter.class) {
                    currentCards.splice(i, 1); //Remove the card
                    continue; //Continue to next iteration
                }
            }

            //If element is not all
            if(filter.element !== "all") {

                //If element does not match
                if(currentCards[i].element !== filter.element) {
                    currentCards.splice(i, 1); //Remove the card
                    continue; //Continue to next iteration
                }
            }

            //If size is not all
            if(filter.size !== "all") {

                //If size does not match
                if(currentCards[i].size !== filter.size) {
                    currentCards.splice(i, 1); //Remove the card
                    continue; //Continue to next iteration
                }
            }

            //If rarity is not all
            if(filter.rarity !== "all") {

                //If rarity does not match
                if(currentCards[i].rarity !== filter.rarity) {
                    currentCards.splice(i, 1); //Remove the card
                }
            }
        }
    }

    //If magic filter, only magic cards need to be considered, follows the same logic as above used for avatar cards
    else if(filter.type === "magic") {
        currentCards = magicCardArray.slice(0); //Put all cards in currentCards
        for(let i = currentCards.length-1; i >= 0; i--) {
            if(filter.effect !== "all") {
                if(currentCards[i].effect !== filter.effect) {
                    currentCards.splice(i, 1);
                    continue;
                }
            }
            if(filter.target !== "all") {
                if(currentCards[i].target !== filter.target) {
                    currentCards.splice(i, 1);
                    continue;
                }
            }
            if(filter.rarity !== "all") {
                if(currentCards[i].rarity !== filter.rarity) {
                    currentCards.splice(i, 1);
                }
            }
        }
    }

    //If trap filter, only trap cards need to be considered, follows the same logic as above used for avatar cards
    else if(filter.type === "trap") {
        currentCards = trapCardArray.slice(0); //Put all cards in currentCards
        for(let i = currentCards.length-1; i >= 0; i--) {
            if(filter.target !== "all") {
                if(currentCards[i].target !== filter.target) {
                    currentCards.splice(i, 1);
                    continue;
                }
            }
            if(filter.rarity !== "all") {
                if(currentCards[i].rarity !== filter.rarity) {
                    currentCards.splice(i, 1);
                }
            }
        }
    }

    //If search filter, iterate through all cards and if there is a match, add to currentCard array
    else if(filter.type === "search") {

        //Iterate through all cards
        for(let i = 0; i < allCards.length; i++) {

            //If search string matches any part of a name, description, class, or element from all the cards, add it to the currentCards array
            if(allCards[i].name.toUpperCase().includes(searchString.toUpperCase()) || allCards[i].description.toUpperCase().includes(searchString.toUpperCase()) || allCards[i].class.toUpperCase().includes(searchString.toUpperCase()) || allCards[i].element.toUpperCase().includes(searchString.toUpperCase())) {
                currentCards.push(allCards[i]); //Add it to the currentCards array
            }
        }
    }

    let max = 8; //Max bootstrap cards to display

    //If there's less than 8 currentCards
    if(currentCards.length < 8 && currentCards.length !== 0) {
        showCards(); //Show all cards
        max = currentCards.length; //Update max bootstrap cards to display

        //Iterate through the leftover cards
        for(let i = max+1; i <= 8; i++) {
            //If the card is being shown, hide it
            if(document.getElementById("card"+(i)).className.includes("d-block")) {
                document.getElementById("card"+(i)).className = document.getElementById("card"+(i)).className.replace("d-block", "d-none"); //Hide it
            }
        }
    }

    //If there's no cards
    else if(currentCards.length === 0) {
        hideCards(); //Hide all bootstrap cards
    }

    //Else, show all bootstrap cards
    else {
        showCards(); //Show all bootstrap cards
    }

        pageIndex = 0; //Update page index, since there's less than 8 make it first page
    //If there are currentCards
    if(currentCards.length !== 0) {
        //Iterate through all bootstrap cards
        for (let i = 0; i < max; i++) {
            document.getElementById("card" + (i + 1) + "Image").src = "../../lib/" + currentCards[i].illustrationPath; //Update card image
            //If the user has the card set opacity to 1.0
            if (hasCard(currentCards[i])) {
                document.getElementById("card" + (i + 1) + "Image").style.opacity = "1.0";
            }
            //Else, they do not have the card, set opacity to 0.5
            else {
                document.getElementById("card" + (i + 1) + "Image").style.opacity = "0.5";
            }

            //If the current card is an avatar card
            if(currentCards[pageIndex+i].typeId === "A") {
                //Show relevant text
                document.getElementById("card" + (i + 1) + "Class").className = document.getElementById("card" + (i + 1) + "Class").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Element").className = document.getElementById("card" + (i + 1) + "Element").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Size").className = document.getElementById("card" + (i + 1) + "Size").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Range").className = document.getElementById("card" + (i + 1) + "Range").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Attack").className = document.getElementById("card" + (i + 1) + "Attack").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Defense").className = document.getElementById("card" + (i + 1) + "Defense").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Hp").className = document.getElementById("card" + (i + 1) + "Hp").className.replace("d-none", "d-block");

                //Hide irrelevant text
                document.getElementById("card" + (i + 1) + "Interval").className = document.getElementById("card" + (i + 1) + "Interval").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "TypeId").className = document.getElementById("card" + (i + 1) + "TypeId").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Description").className = document.getElementById("card" + (i + 1) + "Description").className.replace("d-block", "d-none");

                //Update text
                document.getElementById("card" + (i + 1) + "Title").innerHTML = currentCards[pageIndex+i].name;
                document.getElementById("card" + (i + 1) + "Class").innerHTML = currentCards[pageIndex+i].class;
                document.getElementById("card" + (i + 1) + "Element").innerHTML = currentCards[pageIndex+i].element;
                document.getElementById("card" + (i + 1) + "Size").innerHTML = currentCards[pageIndex+i].size;
                document.getElementById("card" + (i + 1) + "Range").innerHTML = currentCards[pageIndex+i].range;
                document.getElementById("card" + (i + 1) + "Attack").innerHTML = currentCards[pageIndex+i].attack;
                document.getElementById("card" + (i + 1) + "Defense").innerHTML = currentCards[pageIndex+i].defense;
                document.getElementById("card" + (i + 1) + "Hp").innerHTML = currentCards[pageIndex+i].hp;
                document.getElementById("card" + (i + 1) + "Description").innerHTML = currentCards[pageIndex+i].description;
            }

            //If the current card is a magic card
            if(currentCards[pageIndex+i].typeId === "M") {
                //Show relevant text
                document.getElementById("card" + (i + 1) + "Interval").className = document.getElementById("card" + (i + 1) + "Interval").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "TypeId").className = document.getElementById("card" + (i + 1) + "TypeId").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Description").className = document.getElementById("card" + (i + 1) + "Description").className.replace("d-none", "d-block");

                //Hide irrelevant text
                document.getElementById("card" + (i + 1) + "Class").className = document.getElementById("card" + (i + 1) + "Class").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Element").className = document.getElementById("card" + (i + 1) + "Element").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Size").className = document.getElementById("card" + (i + 1) + "Size").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Range").className = document.getElementById("card" + (i + 1) + "Range").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Attack").className = document.getElementById("card" + (i + 1) + "Attack").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Defense").className = document.getElementById("card" + (i + 1) + "Defense").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Hp").className = document.getElementById("card" + (i + 1) + "Hp").className.replace("d-block", "d-none");

                //Update text
                document.getElementById("card" + (i + 1) + "Title").innerHTML = currentCards[pageIndex+i].name;
                document.getElementById("card" + (i + 1) + "Interval").innerHTML = currentCards[pageIndex+i].interval;
                document.getElementById("card" + (i + 1) + "TypeId").innerHTML = currentCards[pageIndex+i].typeId;
                document.getElementById("card" + (i + 1) + "Description").innerHTML = currentCards[pageIndex+i].description;
            }

            //If the current card is a trap card
            if(currentCards[pageIndex+i].typeId === "T") {
                //Show relevant text
                document.getElementById("card" + (i + 1) + "Interval").className = document.getElementById("card" + (i + 1) + "Interval").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "TypeId").className = document.getElementById("card" + (i + 1) + "TypeId").className.replace("d-none", "d-block");
                document.getElementById("card" + (i + 1) + "Description").className = document.getElementById("card" + (i + 1) + "Description").className.replace("d-none", "d-block");

                //Hide irrelevant text
                document.getElementById("card" + (i + 1) + "Class").className = document.getElementById("card" + (i + 1) + "Class").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Element").className = document.getElementById("card" + (i + 1) + "Element").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Size").className = document.getElementById("card" + (i + 1) + "Size").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Range").className = document.getElementById("card" + (i + 1) + "Range").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Attack").className = document.getElementById("card" + (i + 1) + "Attack").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Defense").className = document.getElementById("card" + (i + 1) + "Defense").className.replace("d-block", "d-none");
                document.getElementById("card" + (i + 1) + "Hp").className = document.getElementById("card" + (i + 1) + "Hp").className.replace("d-block", "d-none");

                //Update text
                document.getElementById("card" + (i + 1) + "Title").innerHTML = currentCards[pageIndex+i].name;
                document.getElementById("card" + (i + 1) + "Interval").innerHTML = currentCards[pageIndex+i].value;
                document.getElementById("card" + (i + 1) + "TypeId").innerHTML = currentCards[pageIndex+i].typeId;
                document.getElementById("card" + (i + 1) + "Description").innerHTML = currentCards[pageIndex+i].description;
            }
        }
    }
    resetPageButtons();
}

//showCards() function - Iterates through all bootstrap cards and shows them if they are hidden
function showCards() {
    //Iterate through bootstrap cards
    for(let i = 0; i < 8; i++) {
        //If the card is not being shown
        if(document.getElementById("card"+(i+1)).className.includes("d-none")) {
            document.getElementById("card"+(i+1)).className = document.getElementById("card"+(i+1)).className.replace("d-none", "d-block"); //Show it
        }
    }
}

//hideCards() function - Iterates through all bootstrap cards and hides them if they are shown
function hideCards() {
    //Iterate through bootstrap cards
    for(let i = 0; i < 8; i++) {
        //If the card is not being shown
        if(document.getElementById("card"+(i+1)).className.includes("d-block")) {
            document.getElementById("card"+(i+1)).className = document.getElementById("card"+(i+1)).className.replace("d-block", "d-none"); //Show it
        }
    }
}

//Form eventListener - Captures search form submission and assigns it to searchString, prevents default refresh, updates filters and calls relevant functions
let searchString = ""; //Hold submitted string
document.getElementById("searchForm").addEventListener("submit", function(e) {
    searchString = document.getElementById("search").value; //Capture string
    e.preventDefault(); //Prevent default refresh
    resetFilter(); //Reset the filter
    updateContextFilters(); //Update the context filters
    filter.type = "search"; //Update filter type to search
    populateCards(); //Populate the cards
    curFilter = "search"; //Current filter is search
    document.getElementById("typeFilter").innerHTML = "Card Type: All"; //Update html of card type filter to "all"
});