/*----- constants -----*/ 
const chips = {     //represent each chip value
    one : {
        value : 1,    
    },
    two : {
        value : 50,
        selector : document.getElementById(`two`),
    },
    three : {
        value : 100,
        selector : document.getElementById('three'),
    },
    four : {
        value : 500,
        selector : document.getElementById(`four`),
    }
}
const player = {    
    currentCards : [],
    cardsDisplayed : null,
    turn : false,
    winner : false,
}
const dealer = {  
    currentCards : [],
    cardsDisplayed : null,
    winner : false,
}
const msgZone = {
    remainingCards : document.querySelector('#remaining-cards span'),
    dealerNum : document.querySelector('#dealer-total span'),
    betNum : document.querySelector('#bet-amount span'),
    playerNum : document.querySelector('#player-total span'),
    bankNum : document.querySelector('#bank-amount span'),
}
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['A','02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K'];
const types = ['spades', 'clubs', 'diamonds', 'hearts'];

const mainPage = document.querySelector('main');
const betBtn = document.getElementById('bet-buttons');
const playBtn = document.getElementById('play-buttons');
const resultPage = document.getElementById('result-page');
const result = document.querySelector('h1');

/*----- app's state (variables) -----*/ 
let shuffleTimes;
let bust;
let cards;
let bet;
let bank;
let page;

/*----- event listeners -----*/ 
//click start button for to initial game.
document.getElementById("start-button").addEventListener('click', function(){
    init();
    page = `bet`;
    render();
});
//click to bet, update msg zone.
betBtn.addEventListener('click', function(evt) {
    let chip = evt.target.id;
    bet = chips[chip].value;
    bank = bank - bet;
    page = `play`;  
    assignCard(player.currentCards);
    assignCard(dealer.currentCards);
    assignCard(player.currentCards);
    assignCard(dealer.currentCards);
    checkBust(player.currentCards);
    checkBust(dealer.currentCards);
    render();
});
//click to hit --- player turn.
document.querySelector('#play-buttons button:first-child').addEventListener('click', function() {
    assignCard(player.currentCards);
    checkBust(player.currentCards);
    render();
});
//click to double the bet, if player bust or stand, then forward to dealer turn.
document.querySelector('#play-buttons button:nth-child(2)').addEventListener('click', function() {
    bank = bank - bet;
    bet = bet * 2;
    render();
    dealerTurn();
});
//click to stand , then dealer turn.
document.querySelector('#play-buttons button:last-child').addEventListener('click', function() {
    dealerTurn();
});
//click to next round
document.querySelector('#result-page button:last-child').addEventListener('click', nextRound);
//click to start over
document.querySelector('#result-page button:nth-child(3)').addEventListener('click', startOver);

/*----- functions -----*/
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
// initial the game, assign default initial values.
function init() {
    bank = 1000;
    shuffleTimes = 100;
    prepareCards();
    resetSomeValues();
    render();
}
//reset values for next round
function resetSomeValues() {
    player.currentCards = [];
    dealer.currentCards = [];
    player.cardsDisplayed = 0;
    dealer.cardsDisplayed = 0;
    player.turn = true;
    player.winner = false;
    dealer.winner = false;
    bust = false;
    bet = 0; 
}
//dealer turn, then compare result once dealer turn done or dealer bust.
function dealerTurn() {
    player.turn = false;
    if(bust === false){
        while(calculateTotal(dealer.currentCards) < 16) {
            assignCard(dealer.currentCards);
            checkBust(dealer.currentCards);
            render();
        }
    }
    compareBoth();
}
//compare result and update result message zone
function compareBoth() {
    page = `last`;
    player.turn = false;
    if(calculateTotal(player.currentCards) > calculateTotal(dealer.currentCards)) {
        if(bust === false){
            bank = bank + 2 * bet;
            player.winner = true;
        }else{
            dealer.winner = true;
        }
    }else if(calculateTotal(player.currentCards) < calculateTotal(dealer.currentCards)) {  
        if(bust === false){
            dealer.winner = true;
        }else{
            bank = bank + 2 * bet;
            player.winner = true;
        }
    }else{
        bank = bank + bet;
    }
    render();
}
//get cards
function assignCard(someone) {
    let array = someone;
    let temp = cards.splice(getRandomIndex(), 1);
    array[array.length] = temp.pop();
}
//next round
function nextRound() {
    if((cards.length) < 50) prepareCards();
    resetSomeValues();
    page = `bet`;
    render();
}
//start over
function startOver() {
    init();
    page = `bet`;
    render();
}
//check bust, if anyone get 21 or bust, will compare results.
function checkBust(array) {
    if(calculateTotal(array) === 21){
        page = `last`;
        compareBoth();
    }else if(calculateTotal(array) > 21) {
        bust = true;
        compareBoth();
    }
}
//calculate total number, 'A' will be 11 as long as it does not bust.
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
//get random index number in card array
function getRandomIndex() {
    return Math.floor(Math.random() * (cards.length - 1));
}
//render to update
function render() {
    msgZone.betNum.textContent = bet;
    msgZone.bankNum.textContent = bank;
    msgZone.playerNum.textContent = calculateTotal(player.currentCards);
    msgZone.remainingCards.textContent = cards.length;
    displayDealerCards();
    displayPlayerCards();
    if(player.turn === true) {
        msgZone.dealerNum.textContent = 0;
    }else{
        msgZone.dealerNum.textContent = parseInt(calculateTotal(dealer.currentCards));
        document.querySelector(`#dealer-cell div:first-child`).classList.remove(`red`);
        document.querySelector('#dealer-cell div:first-child').setAttribute('background-image', `images/${types[0]}/${types[0]}-${suits[0]}${ranks[dealer.currentCards[0]]}.svg`);
        document.querySelector(`#dealer-cell div:first-child`).classList.add(`${suits[0]}${ranks[dealer.currentCards[0]-1]}`);
    }
    switch(page) {
        case `bet`:
            removeResults();
            hideEl(document.getElementById('start-page'));
            showEl(mainPage);
            showEl(betBtn);
            hideEl(playBtn);
            hideEl(resultPage);
            disableChips();
            break;
        case `play`:
            hideEl(betBtn);
            showEl(playBtn);
            disableDouble();
            break;
        case `last`:
            hideEl(betBtn);
            hideEl(playBtn);
            updateResult();
            showEl(resultPage);
            disableNextRound();
            break;
    }
}
function displayPlayerCards() {
    let array = player.currentCards;
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
        document.querySelector(`#player-cell div:last-child`).classList.add(`cardsEffect`);
        player.cardsDisplayed++;
    }
}
function displayDealerCards() {
    let array = dealer.currentCards;
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
            document.querySelector(`#dealer-cell div:last-child`).classList.add(`cardsEffect`);
        }
        dealer.cardsDisplayed++;
    }    
}
//update result message and change background image
function updateResult() {
    hideEl(document.querySelector('h3'));
    mainPage.style.backgroundImage = `radial-gradient(closest-side, rgb(64, 125, 87), rgb(42, 88, 72), rgb(31, 66, 53), rgb(24, 51, 41))`;
    if(player.winner === true){
        result.textContent = `😍 🥳 Player Win`;
    }else if(dealer.winner === true){
        result.textContent = `💸💸💸 Dealer Win 💸💸💸`;
    }else{
        result.textContent = `🤔 Tie!!`;
    }
    if(calculateTotal(player.currentCards) === 21 || calculateTotal(dealer.currentCards) === 21){
        showEl(document.querySelector('h3'));
    }                          
}
//remove all currentCards
function removeResults() {
    mainPage.style.backgroundImage = ``;
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
    if(bank < 50) {
        chips.two.selector.setAttribute(`disabled`, `true`);
        chips.three.selector.setAttribute(`disabled`, `true`);
        chips.four.selector.setAttribute(`disabled`, `true`);
        chips.two.selector.classList.add(`noHover`);
        chips.three.selector.classList.add(`noHover`);
        chips.four.selector.classList.add(`noHover`);
    }else if(bank < 100){
        chips.two.selector.removeAttribute(`disabled`);
        chips.three.selector.setAttribute(`disabled`, `true`);
        chips.four.selector.setAttribute(`disabled`, `true`);
        chips.two.selector.classList.remove(`noHover`);
        chips.three.selector.classList.add(`noHover`);
        chips.four.selector.classList.add(`noHover`);
    }else if(bank < 500){
        chips.two.selector.removeAttribute(`disabled`);
        chips.three.selector.removeAttribute(`disabled`);
        chips.four.selector.setAttribute(`disabled`, `true`);
        chips.two.selector.classList.remove(`noHover`);
        chips.three.selector.classList.remove(`noHover`);
        chips.four.selector.classList.add(`noHover`);
    }else{
        chips.two.selector.removeAttribute(`disabled`);
        chips.three.selector.removeAttribute(`disabled`);
        chips.four.selector.removeAttribute(`disabled`);
        chips.two.selector.classList.remove(`noHover`);
        chips.three.selector.classList.remove(`noHover`);
        chips.four.selector.classList.remove(`noHover`);
    }
}
//validation for double button, disable if not enough bank amount
function disableDouble() {
    if(bet > bank){
        document.querySelector('#play-buttons button:nth-child(2)').setAttribute(`disabled`, `true`);
        document.querySelector('#play-buttons button:nth-child(2)').classList.add(`noHover`);
    }else{
        document.querySelector('#play-buttons button:nth-child(2)').removeAttribute(`disabled`);
        document.querySelector('#play-buttons button:nth-child(2)').classList.remove(`noHover`);
    }
}//validation for next round, disable if no bank amount left for next round
function disableNextRound() {
    if(bank <= 0){
        document.querySelector('#result-page button:last-child').setAttribute(`disabled`, `true`);
        document.querySelector('#result-page button:last-child').classList.add(`noHover`);
    }else{
        document.querySelector('#result-page button:last-child').removeAttribute(`disabled`);
        document.querySelector('#result-page button:last-child').classList.remove(`noHover`);
    }
}
// hide and show elements
function hideEl(element){
    element.classList.add('disappear-class');
}
function showEl(element) {
    element.classList.remove('disappear-class');
}