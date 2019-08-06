/* -----------------variables----------------------*/
const chips = {     //represent each chip
    one : 1,
    two : 50,
    three : 100,
    four : 500
};
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['A','02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K'];
const types = ['spades', 'clubs', 'diamonds', 'hearts'];

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
    turn : false,
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
    amount = chips[evt.target.id];
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
    render();
    dealerTurn();
});
//click to stand -- dealer turn
document.querySelector('#play-buttons button:last-child').addEventListener('click', function() {
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
    player.turn = true;
    bust = false;
    amount = 0; 
}
//dealer turn
function dealerTurn() {
    player.turn = false;
    if(bust === false){
        while(calculateTotal(dealer.cards) < 15) {
            assignCard(dealer.represent);
            render();
        }
    }
    compareBoth();
}
//compare result or bust is true
function compareBoth() {
    page = `last`;
    player.turn = false;
    let playerSum = calculateTotal(player.cards);
    let dealerSum = calculateTotal(dealer.cards);
    if(playerSum > dealerSum) {
        if(bust === false){
            player.bank = player.bank + 2 * parseInt(msgZone.betNum.textContent);
            result.textContent = `Player Win`;
        }else{
            result.textContent = `Dealer Win`;

        }
    }else if(playerSum < dealerSum) {  
        if(bust === false){
            result.textContent = `Dealer Win`;
        }else{
            player.bank = player.bank + 2 * parseInt(msgZone.betNum.textContent);
            result.textContent = `Player Win`;
        }
    }else{
        player.bank = player.bank + amount;
        result.textContent = `Tie!!`;
    }
    render();
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
}
//next round
function nextRound() {
    if((cards.length) < 50) prepareCards();
    page = `bet`;
    newRound();
    render();
}
//start over
function startOver() {
    page = `bet`;
    init();
    render();
}
//check bust
function checkBust(array) {
    if(calculateTotal(array) > 21) {
        bust = true;
        compareBoth();
    }
}
//calculate total number
function calculateTotal(array) {
    let sum = 0;
    for(let i = 0; i < array.length; i++) {
        sum = sum + array[i];
    }
    if(array.includes(1)){
        if(11 >= sum){
            sum = sum + 10;
        }
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
//render
function render() {
    msgZone.betNum.textContent = amount;
    msgZone.bankNum.textContent = player.bank;
    msgZone.playerNum.textContent = calculateTotal(player.cards);
    msgZone.remainingCards.textContent = cards.length;
    displayDealerCards();
    displayPlayerCards();
    if(player.turn === true) {
        msgZone.dealerNum.textContent = 0;
    }else{
        msgZone.dealerNum.textContent = parseInt(calculateTotal(dealer.cards));
        document.querySelector(`#dealer-cell div:first-child`).classList.remove(`red`);
        document.querySelector('#dealer-cell div:first-child').setAttribute('background-image', `images/${types[0]}/${types[0]}-${suits[0]}${ranks[dealer.cards[0]]}.svg`);
        document.querySelector(`#dealer-cell div:first-child`).classList.add(`${suits[0]}${ranks[dealer.cards[0]-1]}`);
    }
    switch(page) {
        case `bet`:
            removeCards();
            hideEl(document.getElementById('start-page'));
            showEl(mainPage);
            showEl(betBtn);
            hideEl(playBtn);
            hideEl(lastPage);
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
            showEl(mainPage);
            hideEl(betBtn);
            hideEl(playBtn);
            showEl(lastPage);
            disableNextRound();
            break;
    }
}
function displayPlayerCards() {
    let array = player.cards;

    while(player.cardsDisplayed < array.length){
        let i = Math.floor(Math.random() * 4);
        let newImg = document.createElement('div');
        let cardNum= array[player.cardsDisplayed];
        let imgUrl = `images/${types[i]}/${types[i]}-${suits[i]}${ranks[cardNum-1]}.svg`;
        if(cardNum === 10){
            cardNum = Math.floor(Math.random() * 4) + 10;
        }
        document.querySelector(`#player-cell`).appendChild(newImg);
        document.querySelector(`#player-cell div:last-child`).setAttribute(`background-image`, imgUrl);
        document.querySelector(`#player-cell div:last-child`).classList.add(`card`);
        document.querySelector(`#player-cell div:last-child`).classList.add(`${suits[i]}${ranks[cardNum-1]}`);
        player.cardsDisplayed++;
    }
}
function displayDealerCards() {
    let array = dealer.cards;

    while(dealer.cardsDisplayed < array.length){
        let i = Math.floor(Math.random() * 4);
        let newImg = document.createElement('div');
        let cardNum= array[dealer.cardsDisplayed];
        let imgUrl = `images/${types[i]}/${types[i]}-${suits[i]}${ranks[cardNum-1]}.svg`;
        if(cardNum === 10){
            cardNum = Math.floor(Math.random() * 4) + 10;
        }
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