/* -----------------variables----------------------*/
const chips = {     //represent each chip
    one : 1,
    two : 50,
    three : 100,
    four : 500
};
var suits = ['s', 'c', 'd', 'h'];
var ranks = ['A','02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K'];
var types = ['spades', 'clubs', 'diamonds', 'hearts'];

const startPage = document.getElementById('start-page');
const mainPage = document.querySelector('main');
const betBtn = document.getElementById('bet-buttons');
const playBtn = document.getElementById('play-buttons');
const lastPage = document.getElementById('last-page');
const result = document.querySelector('h1');

const player = {    //player
    cards : [],
    bank : 1000,
    represent : `player`,
    cardsDisplayed : null,
}
const dealer = {    //dealer
    cards : [],
    represent : `dealer`,
    cardsDisplayed : null,
}
const msgZone = {
    remainingCards : document.querySelector('#remaining-cards span'),
    dealerNum : document.querySelector('#dealer-total span'),
    betNum : document.querySelector('#bet-amount span'),
    playerNum : document.querySelector('#player-total span'),
    bankNum : document.querySelector('#bank-amount span'),
}

let shuffleTimes = 100;
let bust;
let cards;
let amount; // represent amount of the bet
let page;

/*------------------event listeners---------------------*/
//click start button for next page to start game
document.getElementById("start-button").addEventListener('click', function(){
    init();
    page = `bet`;
    render();
});
//click to lay bet, update msg zone for amount and bank
betBtn.addEventListener('click', function(evt) {
    let chip = evt.target.id;
    amount = chips[chip];
    player.bank = player.bank - amount;
    assignCard(player.represent);
    assignCard(player.represent);
    assignCard(dealer.represent);
    assignCard(dealer.represent);
    page = `play`;  
    render();
});
//click to hit --- player turn
document.querySelector('#play-buttons button:first-child').addEventListener('click', function() {
    assignCard(player.represent);
    render();
});
//click to double
document.querySelector('#play-buttons button:nth-child(2)').addEventListener('click', function() {
    player.bank = player.bank - amount;
    amount = amount * 2;
    // page = `last`;
    // render();
    dealerTurn();
});
//click to stand -- dealer turn
document.querySelector('#play-buttons button:last-child').addEventListener('click', function() {
    // page = `last`;
    // render();
    dealerTurn();
});
//click to next round
document.querySelector('#last-page button:last-child').addEventListener('click', nextRound);
//click to start over
document.querySelector('#last-page button:nth-child(2)').addEventListener('click', startOver);

/*--------------------------functions-------------------*/
//create game
function prepareCards() {
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
}
// initial the game
function init() {
    prepareCards();
    player.bank = 1000;
    newRound();
    render();
}
//function new round
function newRound() {
    player.cards = [];
    dealer.cards = [];
    player.cardsDisplayed = 0;
    dealer.cardsDisplayed = 0;
    bust = false;
    amount = 0; 
}
//render
function render() {
    msgZone.betNum.textContent = amount;
    msgZone.bankNum.textContent = player.bank;
    msgZone.playerNum.textContent = calculateTotal(player.cards);
    msgZone.remainingCards.textContent = cards.length;
    displayPlayerCards();
    displayDealerCards();
    switch(page) {
        case `bet`:
            hideEl(startPage);
            showEl(mainPage);
            showEl(betBtn);
            hideEl(playBtn);
            hideEl(lastPage);
            msgZone.dealerNum.textContent = 0;
            msgZone.playerNum.textContent = 0;
            disableChips();
            break;
        case `play`:
            showEl(mainPage);
            hideEl(betBtn);
            showEl(playBtn);
            hideEl(lastPage);
            disableDouble();
            break;
        case `last`:
            msgZone.dealerNum.textContent = parseInt(calculateTotal(dealer.cards));
            document.querySelector(`#dealer-cell div:first-child`).classList.remove(`red`);
            document.querySelector('#dealer-cell div:first-child').setAttribute('background-image', `images/${types[0]}/${types[0]}-${suits[0]}${ranks[dealer.cards[0]]}.svg`);
            document.querySelector(`#dealer-cell div:first-child`).classList.add(`${suits[0]}${ranks[dealer.cards[0]-1]}`);
            showEl(mainPage);
            hideEl(betBtn);
            hideEl(playBtn);
            showEl(lastPage);
            disableNextRound();
            break;
    }
}
//dealer turn
function dealerTurn() {
    page = `last`;
    render();
    // hideEl(playBtn);
    if(bust === false){
        while(calculateTotal(dealer.cards) < 15) {
            assignCard(dealer.represent);
            render();
        }
    }
    compareBoth();
    render();
}
//compare result or bust is true
function compareBoth() {
    let playerSum = calculateTotal(player.cards);
    let dealerSum = calculateTotal(dealer.cards);
    if(playerSum > dealerSum) {
        if(bust === false){
            playerWin();
        }else{
            dealerWin();
        }
    }else if(playerSum < dealerSum) {  
        if(bust === false){
            dealerWin();
        }else{
            playerWin();
        }
    }else{
        player.bank = player.bank + amount;
        amount = 0;
        result.textContent = `Tie!!`;
    }
}
// winner
function playerWin() {
    player.bank = player.bank + 2 * parseInt(msgZone.betNum.textContent);
    amount = 0;
    result.textContent = `Player Win`;
}
function dealerWin() {
    amount = 0;
    result.textContent = `Dealer Win`;
}
function assignCard(receiver) {
    let array;
    if(receiver === 'player'){
        array = player.cards;
    }else{
        array = dealer.cards;
    };
    let temp = cards.splice(getRandomIndex(), 1);
    array[array.length] = temp.pop();
    checkBust(array);
    // ---------------------------
    // let i = Math.floor(Math.random() * 4);
    // let cardNum= array[array.length - 1];
    // if(cardNum === 10){
    //     cardNum = Math.floor(Math.random() * 4) + 10;
    // }




    // let imgUrl = `images/${types[i]}/${types[i]}-${suits[i]}${ranks[cardNum-1]}.svg`;
    // let newImg = document.createElement('div');
    // document.querySelector(`#${receiver}-cell`).appendChild(newImg);
    // if(receiver === `player`){
    //     document.querySelector(`#${receiver}-cell div:last-child`).setAttribute(`background-image`, imgUrl);
    //     document.querySelector(`#${receiver}-cell div:last-child`).classList.add(`card`);
    //     document.querySelector(`#${receiver}-cell div:last-child`).classList.add(`${suits[i]}${ranks[cardNum-1]}`);
    // }else{
    //     if(array.length === 1){
    //         document.querySelector('#dealer-cell div:last-child').setAttribute(`background-image`, 'images/backs/red.svg');
    //         document.querySelector(`#${receiver}-cell div:last-child`).classList.add(`card`);
    //         document.querySelector(`#${receiver}-cell div:last-child`).classList.add(`red`);
    //     }else{
    //         document.querySelector(`#${receiver}-cell div:last-child`).setAttribute(`background-image`, imgUrl);
    //         document.querySelector(`#${receiver}-cell div:last-child`).classList.add(`card`);
    //         document.querySelector(`#${receiver}-cell div:last-child`).classList.add(`${suits[i]}${ranks[cardNum-1]}`);
    //     }
    // }
    // -------------------------
}
function displayPlayerCards() {
    let arrayP = player.cards;

    while(player.cardsDisplayed < arrayP.length){
        let i = Math.floor(Math.random() * 4);
        let cardNum= arrayP[player.cardsDisplayed];
        if(cardNum === 10){
            cardNum = Math.floor(Math.random() * 4) + 10;
        }
        let imgUrl = `images/${types[i]}/${types[i]}-${suits[i]}${ranks[cardNum-1]}.svg`;
        let newImg = document.createElement('div');
        document.querySelector(`#player-cell`).appendChild(newImg);
        document.querySelector(`#player-cell div:last-child`).setAttribute(`background-image`, imgUrl);
        document.querySelector(`#player-cell div:last-child`).classList.add(`card`);
        document.querySelector(`#player-cell div:last-child`).classList.add(`${suits[i]}${ranks[cardNum-1]}`);
        player.cardsDisplayed++;
    }
}
function displayDealerCards() {
    let arrayD = dealer.cards;

    while(dealer.cardsDisplayed < arrayD.length){
        let i = Math.floor(Math.random() * 4);
        let cardNum= arrayD[dealer.cardsDisplayed];
        if(cardNum === 10){
            cardNum = Math.floor(Math.random() * 4) + 10;
        }
        let imgUrl = `images/${types[i]}/${types[i]}-${suits[i]}${ranks[cardNum-1]}.svg`;
        let newImg = document.createElement('div');
        document.querySelector(`#dealer-cell`).appendChild(newImg);
        if(dealer.cardsDisplayed === 0){
            document.querySelector('#dealer-cell div:last-child').setAttribute(`background-image`, 'images/backs/red.svg');
            document.querySelector(`#dealer-cell div:last-child`).classList.add(`card`);
            document.querySelector(`#dealer-cell div:last-child`).classList.add(`red`);
        }else{
            document.querySelector(`#dealer-cell div:last-child`).setAttribute(`background-image`, imgUrl);
            document.querySelector(`#dealer-cell div:last-child`).classList.add(`card`);
            document.querySelector(`#dealer-cell div:last-child`).classList.add(`${suits[i]}${ranks[cardNum-1]}`);
        }
        dealer.cardsDisplayed++;
    }
}
//remove all cards
function removeCards() {
    let elementP = document.querySelector('#player-cell');
    let elementD = document.querySelector('#dealer-cell');
    while(elementP.firstChild){
        elementP.removeChild(elementP.firstChild);
    }
    while(elementD.firstChild){
        elementD.removeChild(elementD.firstChild);
    }
}
//next round
function nextRound() {
    removeCards();
    newRound();
    if((cards.length) < 50) prepareCards();
    page = `bet`;
    render();
}
//start over
function startOver() {
    removeCards();
    page = `bet`;
    init();
    render();
}
//check bust
function checkBust(array) {
    if(calculateTotal(array) > 21) {
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
//disable chips images according to remaining bank amount
function disableChips() {
    if(player.bank < 50) {
        document.getElementById(`two`).setAttribute(`disabled`, `true`);
        document.getElementById('three').setAttribute(`disabled`, `true`);
        document.getElementById(`four`).setAttribute(`disabled`, `true`);
    }else if(player.bank < 100){
        document.getElementById(`two`).removeAttribute(`disabled`);
        document.getElementById('three').setAttribute(`disabled`, `true`);
        document.getElementById(`four`).setAttribute(`disabled`, `true`);
    }else if(player.bank < 500){
        document.getElementById(`two`).removeAttribute(`disabled`);
        document.getElementById('three').removeAttribute(`disabled`);
        document.getElementById(`four`).setAttribute(`disabled`, `true`);
    }else{
        document.getElementById(`two`).removeAttribute(`disabled`);
        document.getElementById('three').removeAttribute(`disabled`);
        document.getElementById(`four`).removeAttribute(`disabled`);
    }
}
//validation for double button
function disableDouble() {
    if(amount > player.bank){
        document.querySelector('#play-buttons button:nth-child(2)').setAttribute(`disabled`, `true`);
    }else{
        document.querySelector('#play-buttons button:nth-child(2)').removeAttribute(`disabled`);
    }
}//validation for next round
function disableNextRound() {
    if(player.bank <= 0){
        document.querySelector('#last-page button:last-child').setAttribute(`disabled`, `true`);
    }else{
        document.querySelector('#last-page button:last-child').removeAttribute(`disabled`);
    }
}
// hide and show elements
function hideEl(element){
    element.classList.add('disappear-class');
}
function showEl(element) {
    element.classList.remove('disappear-class');
}
//to delay next move
// function sleep(numberMillis){
//   var now = new Date();
//   var exitTime = now.getTime() + numberMillis;
//   while(true) {
//     now = new Date();
//     if(now.getTime() > exitTime) return;
//}