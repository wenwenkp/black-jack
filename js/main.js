/* -----------------constants----------------------*/
const chips = {     //represent each chip
    one : 1,
    two : 50,
    three : 100,
    four : 500
};

const remainingNum = document.querySelector('#remaining-cards span');
const startPage = document.getElementById('start-page');
const startBtn = document.getElementById("start-button");
const mainPage = document.querySelector('main');
const betBtn = document.getElementById('bet-buttons');
const playBtn = document.getElementById('play-buttons');
const hitBtn = document.querySelector('#play-buttons button:first-child');
const doubleBtn = document.querySelector('#play-buttons button:nth-child(2)');
const standBtn = document.querySelector('#play-buttons button:last-child');
const lastPage = document.getElementById('last-page');
const result = document.querySelector('h1');
const startOverBtn = document.querySelector('#last-page button:nth-child(2)');
const nextBtn = document.querySelector('#last-page button:last-child');

/*---------------------------variables----------------*/
const player = {    //player
    cards : [],
    bank : null,
    bankNum : document.querySelector('#bank-amount span'),
    playerNum : document.querySelector('#player-total span'),
    betNum : document.querySelector('#bet-amount span'),
}
const dealer = {    //dealer
    cards : [],
    dealerNum : document.querySelector('#dealer-total span'),
}
let bust = false;
var cards;
let shuffleTimes = 100;
let amount = 0; // represent amount of the bet


/*------------------event listeners---------------------*/
//click start button for next page to start game
startBtn.addEventListener('click', function() {
    //disappear start page
    //display game page 
    startPage.style.transition = '0.8s';
    startBtn.style.opacity = 0;
    setTimeout(hideEl(startPage), 800);
    setTimeout(showEl(mainPage), 800);
    console.log(`done startbutton------------------`);
});
//click to lay bet, update msg zone for amount and bank
betBtn.addEventListener('click', function(evt) {
    let chip = evt.target.id;
    amount = chips[chip];
    player.bank = player.bank - amount;
    player.betNum.textContent = amount + parseInt(player.betNum.textContent);
    player.bankNum.textContent = player.bank;
    console.log(`player lay amount ${amount}.`);

    sleep(800);
    hideEl(betBtn);
    showEl(playBtn);
    getCard(player.cards);
    getCard(player.cards);
    player.playerNum.textContent = calculateTotal(player.cards);
    console.log(`player's cards: ${player.cards}`);
    getCard(dealer.cards);
    getCard(dealer.cards);
    console.log(`done bet button----------------------`);
});
//click to hit --- player turn
hitBtn.addEventListener('click', function() {
    getCard(player.cards);
    player.playerNum.textContent = calculateTotal(player.cards);
    console.log(player.cards);
    checkBust(player.cards);
});
//click to double
doubleBtn.addEventListener('click', function() {
    player.bank = player.bank - amount;
    player.bankNum.textContent = player.bank;
    amount = amount * 2;
    player.betNum.textContent = amount;
    console.log(`current bank is ${player.bank} and amount is ${amount}`);

    sleep(800);

});
//click to stand -- dealer turn
standBtn.addEventListener('click', dealerTurn);
//click to next round
nextBtn.addEventListener('click', nextRound);

//click to start over
startOverBtn.addEventListener('click', startOver);

/*--------------------------functions-------------------*/
init();

// initial the game
function init() {
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
    remainingNum.textContent = cards.length;
    console.log(`current cards: ${cards}`);
    player.bankNum.textContent = player.bank;
    player.betNum.textContent = amount;
    dealer.dealerNum.textContent = 0;
    player.playerNum.textContent = 0;
    console.log(`current amount ${amount} and bank ${player.bank}`);
    console.log(`done init--------------------------------`);
    bust = false;
    amount = 0; 
    player.bank = 1000;
}
//render
function render() {

}
// hide and show elements
function hideEl(element){
    element.classList.add('disappear-class');
}
function showEl(element) {
    element.classList.remove('disappear-class');
}
//randomly switch array elements position 100 times by default
function shuffleCards() {
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
//assign cards
function getCard(array) {
    let temp = cards.splice(getRandomIndex(), 1);
    array[array.length] = temp.pop();
    remainingNum.textContent = cards.length;
}
//check bust
function checkBust(array) {
    console.log(`checking bust...`);
    sleep(200);
    console.log(`done checking. You are safe ... for now!`);
    if(calculateTotal(array) > 21) {
        console.log(`You bust! And call dealer turn`);
        bust = true;
        dealerTurn();
    }
}
//calculate total number
function calculateTotal(array) {
    let sum = 0;
    for(let i = 0; i < array.length; i++) {
        sum = sum + array[i];
    }
    return sum;
}
//compare result or bust is true
function compareBoth() {
    let playerSum = calculateTotal(player.cards);
    let dealerSum = calculateTotal(dealer.cards);
    console.log('player total: '+playerSum);
    console.log('dealer total: '+ dealerSum);

    sleep(800);
    dealer.dealerNum.textContent = parseInt(dealerSum);

    if(playerSum > 21){  //dealer win
        console.log(`Dealer Win.`);
        amount = 0;
        player.betNum.textContent = amount;
        console.log('bank is: '+ player.bank + ', amount is :' + amount);
        //show ending
        result.textContent = `Dealer Win`;
    }else if(dealerSum > 21){   //player win
        console.log(`Player Win.`);
        amount = amount * 2;
        player.bank = player.bank + amount;
        amount = 0;
        player.betNum.textContent = amount;
        player.bankNum.textContent = player.bank;
        console.log('bank is: '+player.bank + ', amount is :' + amount);
        //show ending
        result.textContent = `Player Win`;
    }else{
        if(playerSum > dealerSum) { //player win
            console.log(`Player Win.`);
            amount = amount * 2;
            player.bank = player.bank + amount;
            amount = 0;
            player.betNum.textContent = amount;
            player.bankNum.textContent = player.bank;
            console.log('bank is: '+player.bank + ', amount is :' + amount);
            //show ending
            result.textContent = `Player Win`;
        }else if(playerSum < dealerSum) {   //dealer win
            console.log(`Dealer Win.`);
            amount = 0;
            player.betNum.textContent = amount;
            console.log('bank is: '+player.bank + ', amount is :' + amount);
            //show ending
            result.textContent = `Dealer Win`;

        }else{
            console.log(`Tie.`);
            player.bank = player.bank + amount;
            amount = 0;
            player.betNum.textContent = amount;
            player.bankNum.textContent = player.bank;
            console.log('bank is: '+player.bank + ', amount is :' + amount);
            //show ending
            result.textContent = `Tie!!`;
        }
    };
    console.log(`compare end`);
}
//dealer turn
function dealerTurn() {
    hideEl(playBtn);
    if(bust === false){
        while(calculateTotal(dealer.cards) < 15) {
            getCard(dealer.cards);
            checkBust(dealer.cards);
        }
    }
        compareBoth();
        console.log(`dealerturn end`);

        showEl(lastPage);
        sleep(800);
}
//next round
function nextRound() {
    sleep(300);
    player.cards = [];
    dealer.cards = [];
    dealer.dealerNum.textContent = 0;
    player.playerNum.textContent = 0;
    hideEl(lastPage);
    showEl(betBtn);
    bust = false;
}
//start over
function startOver() {
    sleep(300);
    player.cards = [];
    dealer.cards = [];
    init();
    hideEl(lastPage);
    showEl(betBtn);
}

//to delay next move
function sleep(numberMillis){
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while(true) {
    now = new Date();
    if(now.getTime() > exitTime) return;
  }
}

