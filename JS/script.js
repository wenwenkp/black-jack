//call init to initial game, create 52 numbers for 52 cards


/*------------variables-----------*/
let playerCards = [];    //an array for player's current cards
let dealerCards = [];    //an array for dealer's current cards
let shuffleTimes;        //store the times player wants to shuffle the cards
let randomIndex;         //an random index for cards array
let bank;                //hold player current fund total
let amount;              //the amount player wager
let choice;              //to store player choice
let player;              //represent player turn when true
let dealer;              //represent dealer turn when true
let playerSum;           //player total number
let dealerSum;           //dealer total number
let bust;                //true if bust

/*-----------const variables-----*/
var cards;   //an array for all the cards


/*-----------functions----------*/
//create cards for the game at the beginning, total 104
function createCards() {
    cards = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, //from A to K
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10
    ];
}
//shuffle cards whenever player wants
function shuffleCards() {
    for(; shuffleTimes > 0; shuffleTimes--){
        let idxOne = getRandomIndex();
        let idxTwo = getRandomIndex();
        let temp = cards[idxOne];
        cards[idxOne] = cards[idxTwo];
        cards[idxTwo] = temp;
    }
}
//assign card to dealer or player card array
function getCard(array) {
        let temp = cards.splice(getRandomIndex(), 1);
        array[array.length] = temp.pop();
}
//get random index number in current card array
function getRandomIndex() {
         return Math.floor(Math.random() * (cards.length - 1));
}
//function to lay a bet
function wager() {
    amount = prompt('How much would you like to lay please?');
    bank = bank - amount;
}
//calculate total number
function calculateTotal(array) {
    let sum = 0;
    array.forEach(element => {
        sum = element + sum;
    });
    return sum;
}
//check bust
function checkBust(array) {
    if(player === true && dealer === false)
        playerSum = calculateTotal(array);
    else if(player === false && dealer === true)
        dealerSum = calculateTotal(array);

    if(playerSum > 21) {
        return true;
    }else{
        return false;
    }
}
//game process
function playerPlay() {
    let steps = 1;
    player = true;
    dealer = false;
    while(!checkBust(playerCards)) {
        if(steps === 1) {
            steps++;
            choice = prompt('input 1 for hit, 2 for stand, 3 for double');
        }else {
            choice = prompt('input 1 for hit, 2 for stand');
        }

        if(choice === 'hit') {
            getCard(playerCards);
            if(checkBust(playerCards)) {
                player = false;
                dealer = true;
                return;
            }
        }else if(choice === 'stand') {
            player = false;
            dealer = true;
            return;
        }else if(choice === 'double'){
            bank = bank - amount;
            amount = amount * 2
            player = false;
            dealer = true;
            return;
        }else{
            alert('Invalid input! Please try again.');
        }
    }
}
//call to start game






//--------------------------------------test
//create cards
createCards();
console.log('origin:' +cards);
//shuffle cards
shuffleTimes = prompt(`how many times?`);
shuffleCards();
console.log('cards after shuffle: '+cards);
console.log('cards length: '+cards.length);
//player to get initial money
bank = 100;
//game start
//player to lay
wager();
console.log('bank:'+bank+' amount: '+ amount);
//player to get initial cards
getCard(playerCards);
getCard(playerCards);
console.log('player cards '+playerCards);
console.log('cards length: '+cards.length);
//dealer get cards
getCard(dealerCards);
getCard(dealerCards);
console.log('dealer cards '+dealerCards);
console.log('cards length: '+cards.length);
//player first turn
playerPlay();
console.log('after playerplay');
console.log(cards);
console.log(playerCards);
console.log(dealerCards);
console.log(bank);
console.log(amount);
console.log(playerSum);



