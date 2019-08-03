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
    sign : `player`
}
const dealer = {    //dealer
    cards : [],
    dealerNum : document.querySelector('#dealer-total span'),
    sign : `dealer`
}
let bust = false;
var cards;
let shuffleTimes = 100;
let amount = 0; // represent amount of the bet

/*------------------event listeners---------------------*/
startBtn.addEventListener('click', function(){
    fadeOut(startBtn);
    sleep(2000);
    fadeOut(startPage);
    fadeIn(mainPage);
    hideEl(startPage);
});
//click start button for next page to start game
// startBtn.addEventListener('click', function() {
//     startBtn.style.opacity = 1;
//     startPage.style.transition = 1;

//     startBtn.style.opacity = 1;

//     hideEl(startPage);
//     sleep(300);
//     showEl(mainPage);
//     console.log(`done startbutton------------------`);
// });
//click to lay bet, update msg zone for amount and bank
betBtn.addEventListener('click', function(evt) {

    let chip = evt.target.id;
    amount = chips[chip];
    player.bank = player.bank - amount;
    player.betNum.textContent = amount + parseInt(player.betNum.textContent);
    player.bankNum.textContent = player.bank;
    console.log(`player lay amount ${amount}.`);

    sleep(1000);
    hideEl(betBtn);
    sleep(1000);
    showEl(playBtn);
    assignPlayerCard();
    assignPlayerCard();
    player.playerNum.textContent = calculateTotal(player.cards);
    console.log(`player's cards: ${player.cards}`);
    assignDealerCard();
    assignDealerCard();
    console.log(`dealer's cards: ${dealer.cards}`);
    console.log(`done bet button----------------------`);
});
//click to hit --- player turn
hitBtn.addEventListener('click', function() {
    assignPlayerCard();
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
// function assignPlayerCard(array) {
//     let temp = cards.splice(getRandomIndex(), 1);
//     array[array.length] = temp.pop();
//     remainingNum.textContent = cards.length;
// }
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
            assignDealerCard();
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
    removeCards(player.sign);
    removeCards(dealer.sign);
}
//start over
function startOver() {
    sleep(300);
    player.cards = [];
    dealer.cards = [];
    init();
    hideEl(lastPage);
    showEl(betBtn);
    removeCards(player.sign);
    removeCards(dealer.sign);
}
// get card pic
function assignPlayerCard() {
    let array = player.cards;
    let temp = cards.splice(getRandomIndex(), 1);
    array[array.length] = temp.pop();
    remainingNum.textContent = cards.length;
    let cardNum= array[array.length - 1];
    let imgUrl;
    if(cardNum === 10){
        cardNum = Math.floor(Math.random() * 4) + 10;
    }
    imgUrl = `image/${cardNum}.jpg`;
    let newImg = document.createElement('img');
    document.querySelector('#player-cell').appendChild(newImg);
    document.querySelector('#player-cell img:last-child').setAttribute(`src`, imgUrl);
}
function assignDealerCard() {
    let array = dealer.cards;
    let temp = cards.splice(getRandomIndex(), 1);
    array[array.length] = temp.pop();
    remainingNum.textContent = cards.length;

    let imgUrl;
    let cardNum = array[array.length - 1];
    if(array.length === 1){
        cardNum = `back`;
    }
    if(cardNum === 10){
        cardNum = Math.floor(Math.random() * 4) + 10;
    }
    imgUrl = `image/${cardNum}.jpg`;
    let newImg = document.createElement('img');
    document.querySelector('#dealer-cell').appendChild(newImg);
    document.querySelector('#dealer-cell img:last-child').setAttribute(`src`, imgUrl);
    if(cardNum === `back`){
        document.querySelector('#dealer-cell img:last-child').setAttribute(`class`, 'show-back');
    }
}
function removeCards(target) {
    let element;
    if(target === `player`) {
        element = document.querySelector('#player-cell');
    }else{
        element = document.querySelector('#dealer-cell');
    };
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
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

function fadeIn(el){
    el.classList.add('fade-in');
    el.classList.remove('fade-out');  
}
  
function fadeOut(el){
    el.classList.add('fade-out');
    el.classList.remove('fade-in');
}
