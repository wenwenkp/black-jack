/*---------------------------variables----------------*/
let startPage = document.getElementById('start-page');
let startBtn = document.getElementById("start-button");
let gamePage = document.getElementById('game-page');
let remainingCards = document.getElementById('total-cards');
let dealerTotalNum = document.getElementById('dealer-total-number');
let betZone = document.getElementById('bet-number');
let playerTotalNum = document.getElementById('player-total-number');
let bankZone = document.getElementById('bank-number');

let playerCards = [];    //an array for player's current cards
let dealerCards = [];    //an array for dealer's current cards
let randomIndex;         //an random index for cards array
let bank;                //hold player current fund total
let amount;              //the amount player wager
let choice;              //to store player choice
let bust = false;                //true if bust
let endingDecision;

/*------------------after start page---------------------*/
//click start button for next page to start game

startBtn.addEventListener('click', function() {
    //disappear start page
    //display game page 
    startPage.style.transition = '0.8s';
    startBtn.style.opacity = 0;
    window.setTimeout(disappearPage, 800);
    //create cards and shuffle cards,assign initial fund
    createGame();
    console.log('origin:' +cards);
    console.log('cards after shuffle: '+cards);
    console.log('cards length: '+cards.length);
    console.log('--------------------game been created---------');
});
/*-----------------------game page----------------------*/
startGame();
    console.log('--------------------game start---------');


/*--------------------------functions-------------------*/
// disappear start page, display game page
function disappearPage(){
    startPage.classList.add('disappear-page');
    gamePage.classList.remove('disappear-page');
};
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
    remainingCards.textContent = cards.length;
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
//get random index number in current card array
function getRandomIndex() {
    return Math.floor(Math.random() * (cards.length - 1));
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
//function to lay a bet
function layBet() {
    // amount = prompt('How much would you like to lay please?');
    bank = bank - amount;
    betZone.textContent = amount;
}