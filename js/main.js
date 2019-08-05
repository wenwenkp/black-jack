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

const betBtn = document.getElementById('bet-buttons');
const playBtn = document.getElementById('play-buttons');
const lastPage = document.getElementById('last-page');
const result = document.querySelector('h1');

const player = {    //player
    cards : [],
    bank : 1000,
    represent : `player`
}
const dealer = {    //dealer
    cards : [],
    represent : `dealer`
}
const msgZone = {
    remainingCards : document.querySelector('#remaining-cards span'),
    dealerNum : document.querySelector('#dealer-total span'),
    betNum : document.querySelector('#bet-amount span'),
    playerNum : document.querySelector('#player-total span'),
    bankNum : document.querySelector('#bank-amount span'),
}

let bust;
let cards;
let shuffleTimes = 100;
let amount; // represent amount of the bet

/*------------------event listeners---------------------*/
//click start button for next page to start game
document.getElementById("start-button").addEventListener('click', function(){
    hideEl(document.getElementById('start-page'));
    prepareCards();
    init();
    render();
    showEl(document.querySelector('main'));
});
//click to lay bet, update msg zone for amount and bank
betBtn.addEventListener('click', function(evt) {
    let chip = evt.target.id;
    amount = chips[chip];
    player.bank = player.bank - amount;
    hideEl(betBtn);
    showEl(playBtn);
    assignCard(player.represent);
    assignCard(player.represent);
    assignCard(dealer.represent);
    assignCard(dealer.represent);
    disableDouble();    
    render();
});
//click to hit --- player turn
document.querySelector('#play-buttons button:first-child').addEventListener('click', function() {
    assignCard(player.represent);
    render();
});
//click to double
document.querySelector('#play-buttons button:nth-child(2)').addEventListener('click', function() {
    amount = parseInt(msgZone.betNum.textContent) * 2;
    player.bank = player.bank - parseInt(msgZone.betNum.textContent);
    render();
    dealerTurn();
});
//click to stand -- dealer turn
document.querySelector('#play-buttons button:last-child').addEventListener('click', dealerTurn);
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
    player.cards = [];
    dealer.cards = [];
    bust = false;
    amount = 0; 
    msgZone.dealerNum.textContent = 0;
    msgZone.playerNum.textContent = 0;
    render();
}
//render
function render() {
    msgZone.betNum.textContent = amount;
    msgZone.bankNum.textContent = player.bank;
    msgZone.playerNum.textContent = calculateTotal(player.cards);
    msgZone.remainingCards.textContent = cards.length;
}
//dealer turn
function dealerTurn() {
    hideEl(playBtn);
    if(bust === false){
        while(calculateTotal(dealer.cards) < 15) {
            assignCard(dealer.represent);
        }
    }
    compareBoth();
    document.querySelector('#dealer-cell div:first-child').setAttribute('url', `images/${types[0]}/${types[0]}-${suits[0]}0${1}.jpg`);
    showEl(lastPage);
    checkBank();
}
//compare result or bust is true
function compareBoth() {
    let playerSum = calculateTotal(player.cards);
    let dealerSum = calculateTotal(dealer.cards);
    msgZone.dealerNum.textContent = parseInt(dealerSum);
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
    render();
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
    let i = Math.floor(Math.random() * 4);
    let cardNum= array[array.length - 1];
    if(cardNum === 10){
        cardNum = Math.floor(Math.random() * 4) + 10;
    }

    let imgUrl = `images/${types[i]}/${types[i]}-${suits[i]}${ranks[cardNum-1]}.svg`;
    let newImg = document.createElement('div');
    document.querySelector(`#${receiver}-cell`).appendChild(newImg);
    if(receiver === `player`){
        document.querySelector(`#${receiver}-cell div:last-child`).setAttribute(`background-image`, imgUrl);
        document.querySelector(`#${receiver}-cell div:last-child`).classList.add(`card`);
        document.querySelector(`#${receiver}-cell div:last-child`).classList.add(`${suits[i]}${ranks[cardNum-1]}`);
    }else{
        if(array.length === 1){
            document.querySelector('#dealer-cell div:last-child').setAttribute(`background-image`, 'images/backs/red.svg');
            document.querySelector(`#${receiver}-cell div:last-child`).classList.add(`card`);
            document.querySelector(`#${receiver}-cell div:last-child`).classList.add(`red`);
        }else{
            document.querySelector(`#${receiver}-cell div:last-child`).setAttribute(`background-image`, imgUrl);
            document.querySelector(`#${receiver}-cell div:last-child`).classList.add(`card`);
            document.querySelector(`#${receiver}-cell div:last-child`).classList.add(`${suits[i]}${ranks[cardNum-1]}`);
        }
    }
    // -------------------------
    render();
}
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
    hideEl(lastPage);
    init();
    if((cards.length) < 50) prepareCards();
    render();
    showEl(betBtn);
}
//start over
function startOver() {
    removeCards();
    hideEl(lastPage);
    init();
    player.bank = 1000;
    render();
    checkBank();
    showEl(betBtn);
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
function checkBank() {
    if(player.bank <= 0){
        document.querySelector('#last-page button:last-child').setAttribute(`disabled`, `true`);
    } else if(player.bank < 50) {
        document.getElementById(`two`).setAttribute(`disabled`, `true`);
        document.getElementById('three').setAttribute(`disabled`, `true`);
        document.getElementById(`four`).setAttribute(`disabled`, `true`);
    }else if(player.bank < 100){
        document.getElementById('three').setAttribute(`disabled`, `true`);
        document.getElementById(`four`).setAttribute(`disabled`, `true`);
    }else if(player.bank < 500){
        document.getElementById(`four`).setAttribute(`disabled`, `true`);
    }else{
        document.querySelector('#last-page button:last-child').removeAttribute(`disabled`);
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
//   }
// }
