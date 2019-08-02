
/*------------variables-----------*/
let playerCards = [];    //an array for player's current cards
let dealerCards = [];    //an array for dealer's current cards
let randomIndex;         //an random index for cards array
let bank;                //hold player current fund total
let amount;              //the amount player wager
let choice;              //to store player choice
let bust = false;                //true if bust
let endingDecision;

/*-----------const variables-----*/
var cards;   //an array for all the cards


/*-----------functions----------*/
//create cards for the game at the beginning, total 104
function createGame() {
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
    shuffleCards();
    bank = 100;
}
//randomly switch array elements position 100 times by default
function shuffleCards() {
    let shuffleTimes = 100;
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
function layBet() {
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
    if(calculateTotal(array) > 21) {
        bust = true;
        return true;
    }else{
        return false;
    }
}

//player turn
function playerPlay() {
    let steps = 1;
    let playerTurn = true;
    while(playerTurn) {
        if(steps === 1) {
            steps++;
            choice = prompt('input hit, double, stand');
        }else {
            choice = prompt('input hit, stand');
        }

        if(choice === 'hit') {
            getCard(playerCards);
            console.log(playerCards);
            if(checkBust(playerCards)) {
                playerTurn = false;
                break;
            }
        }else{
            if(choice === 'double'){
                bank = bank - amount;
                amount = amount * 2;
                getCard(playerCards);
                console.log(playerCards);
                if(checkBust(playerCards)) {
                    playerTurn = false;
                    break;
                }
            };
            playerTurn = false;
        }
    }
}
//dealer turn
function dealerPlay() {
    let dealerTurn = true;
    if(checkBust(playerCards)) dealerTurn = false;
    while(dealerTurn) {
        if(calculateTotal(dealerCards) < 15){
            getCard(dealerCards);
            if(checkBust(dealerCards)){
                dealerTurn = false;
                break;
            };
        }
        else{
            dealerTurn = false;
            return;
        }
    }
}

//compare result
function compareBoth() {
    let playerSum = calculateTotal(playerCards);
    let dealerSum = calculateTotal(dealerCards);
    console.log('player total: '+playerSum);
    console.log('dealer total: '+ dealerSum);

    if(playerSum > 21){
        console.log(`Dealer Win.`);
        amount = 0;
        console.log('bank is: '+bank + ', amount is :' + amount);
        return;
    }else if(dealerSum > 21){
        console.log(`Player Win.`);
        amount = amount * 2;
        bank = bank + amount;
        amount = 0;
        console.log('bank is: '+bank + ', amount is :' + amount);
        return;
    }else{
        if(playerSum > dealerSum) {
            console.log(`Player Win.`);
            amount = amount * 2;
            bank = bank + amount;
            amount = 0;
            console.log('bank is: '+bank + ', amount is :' + amount);
            return;
        }else if(playerSum < dealerSum) {
            console.log(`Dealer Win.`);
            amount = 0;
            console.log('bank is: '+bank + ', amount is :' + amount);
            return;
        }else{
            console.log(`Tie.`);
            bank = bank + amount;
            amount = 0;
            consofle.log('bank is: '+bank + ', amount is :' + amount);
            return;
        }
    };
}

//end
function nextRound() {
    if(bank === 0) {
        endingDecision = prompt('no to exit, again to start over');
    }else {
        endingDecision = prompt('yes for next round, no to exit, again to start over, replay will be disable if fund = 0');
    };
    if(endingDecision === 'again') {
        createGame();
    };
}

//call to start game
function startGame() {
    //player to lay
    layBet();
    console.log('bank:'+bank+' amount: '+ amount);
    //empty player and dealer cards
    playerCards = [];
    dealerCards = [];
    //player to get initial cards
    getCard(playerCards);
    getCard(playerCards);
    console.log('player cards '+playerCards);
    console.log('cards length: '+cards.length);
    //dealer get cards
    getCard(dealerCards);
    getCard(dealerCards);
    console.log('cards length: '+cards.length);
}

//--------------------------------------test

//create cards and shuffle cards,assign initial fund
createGame();
console.log('origin:' +cards);
console.log('cards after shuffle: '+cards);
console.log('cards length: '+cards.length);
console.log('--------------------game been created---------');

//game start
do{
    startGame();
    console.log('--------------------game start---------');

    //playing
            //player turn
            playerPlay();
            console.log('after playerplay');
            console.log('remaining cards: '+cards);
            console.log('player cards :'+playerCards);
            console.log('remaining fund ' +bank);
            console.log('bet amount:' +amount);
            console.log('--------------------player turn done---------');
                    
                    //dealer turn
                    if(bust === false){
                        dealerPlay();
                        console.log('after dealerplay');
                        console.log('remaining cards: ' + cards);
                        console.log('player cards :'+playerCards);
                        console.log('dealer cards:' +dealerCards);
                        console.log('--------------------dealer turn done---------');
                    };
    console.log('---------------------game done---------');
    //compare
    compareBoth();
    console.log('--------------------compare done---------');


    //end
    console.log('--------------------next round??---------');
    nextRound();
}while(endingDecision !== 'no');




