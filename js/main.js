/*----- constants -----*/ 
const chips = {     //represent each chip
    one : {
        value : 1,    
    },
    two : {
        value : 50,
        location : document.getElementById(`two`),
    },
    three : {
        value : 100,
        location : document.getElementById('three'),
    },
    four : {
        value : 500,
        location : document.getElementById(`four`),
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
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['A','02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K'];
const types = ['spades', 'clubs', 'diamonds', 'hearts'];

const mainPage = document.querySelector('main');
const betBtn = document.getElementById('bet-buttons');
const playBtn = document.getElementById('play-buttons');
const resultPage = document.getElementById('result-page');
const result = document.querySelector('h1');
const soundEffect = document.getElementById(`sound-effect`)
const betSound = document.getElementById(`bet-sound`);
const winnerSound = document.getElementById(`winner-sound`);
const loserSound = document.getElementById(`loser-sound`);

/*----- app's state (variables) -----*/ 
let bust;
let blackJack;
let cards;
let bet;
let bank;
let middleArea;

/*----- event listeners -----*/ 
//click start button to initial game.
document.getElementById("start-button").addEventListener('click', function(){
    init();
    render();
});
//click to bet and assign initial cards, if black jack then go to result page.
betBtn.addEventListener('click', function(evt) {
    let chip = evt.target.id;
    if(chip === betBtn.id) {
        return;
    };
    bet = chips[chip].value;
    bank = bank - bet;
    middleArea = `play`;  
    assignCard(player.currentCards);
    assignCard(dealer.currentCards);
    assignCard(player.currentCards);
    assignCard(dealer.currentCards);
    checkPoints(player.currentCards);
    checkPoints(dealer.currentCards);
    render();
    if(blackJack === true){
        compareBoth();
    }
});
//click to hit for cards, if black jack or bust then go to result page --- player turn.
document.querySelector('#play-buttons button:first-child').addEventListener('click', function() {
    assignCard(player.currentCards);
    checkPoints(player.currentCards);
    render();
    if(bust === true || blackJack === true) {
        compareBoth();
    }
});
//click to double the bet, then go to dealer turn.
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
//click to resset values and go to next round
document.querySelector('#result-page button:last-child').addEventListener('click', function() {
    if((cards.length) < 50) {
        prepareCards();
    };
    resetSomeValues();
    middleArea = `bet`;
    render();
});
//click to reinitial game to start over
document.querySelector('#result-page button:nth-child(3)').addEventListener('click', function() {
    init();
    render();
});
//click to enable or disable sound effect
soundEffect.addEventListener(`click`, function() {
    if(soundEffect.hasAttribute(`checked`)){
        soundEffect.removeAttribute(`checked`);
    }else{
        soundEffect.setAttribute(`checked`, true);
    }
});

/*----- functions -----*/
//create and shuffle cards, including two decks
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
    middleArea = `bet`;
    bank = 1000;
    prepareCards();
    resetSomeValues();
}
//reset values for a new round
function resetSomeValues() {
    player.currentCards = [];
    dealer.currentCards = [];
    player.cardsDisplayed = 0;
    dealer.cardsDisplayed = 0;
    player.turn = true;
    player.winner = false;
    dealer.winner = false;
    bust = false;
    blackJack = false;
    bet = 0; 
}
//dealer turn, dealer get cards as long as points are lower than 16, then compare results.
function dealerTurn() {
    player.turn = false;
    while(calculateTotal(dealer.currentCards) < 16) {
        assignCard(dealer.currentCards);
        checkPoints(dealer.currentCards);
        render();
    }
    compareBoth();
}
//compare result
function compareBoth() {
    middleArea = `last`;
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
//check points, if anyone get black jack or bust, change boolean value
function checkPoints(totalPoint) {
    if(calculateTotal(totalPoint) === 21){
        blackJack = true;
    }else if(calculateTotal(totalPoint) > 21) {
        bust = true;
    }
}
//calculate total number, 'A' will be 11 as long as it does not bust.
function calculateTotal(cardArray) {
    let sum = 0;
    for(let i = 0; i < cardArray.length; i++) {
        sum = sum + cardArray[i];
    }
    if(cardArray.includes(1)){
        if(11 >= sum){
            sum = sum + 10;
        }
    }
    return sum;
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
//get random index number in card array
function getRandomIndex() {
    return Math.floor(Math.random() * (cards.length - 1));
}
//render to update
function render() {
    document.querySelector('#bet-amount span').textContent = bet;
    document.querySelector('#bank-amount span').textContent = bank;
    document.querySelector('#player-total span').textContent = calculateTotal(player.currentCards);
    document.querySelector('#remaining-cards span').textContent = cards.length;
    displayDealerCards();
    displayPlayerCards();
    if(player.turn === true) {
        document.querySelector('#dealer-total span').textContent = 0;   //dealer points will be 0 when it is player turn
    }else{                                                              //dealer first card will be uncovered when it is dealer turn
        document.querySelector('#dealer-total span').textContent = parseInt(calculateTotal(dealer.currentCards));
        document.querySelector(`#dealer-cell div:first-child`).classList.remove(`red`);
        document.querySelector('#dealer-cell div:first-child').setAttribute('background-image', `images/${types[0]}/${types[0]}-${suits[0]}${ranks[dealer.currentCards[0]]}.svg`);
        document.querySelector(`#dealer-cell div:first-child`).classList.add(`${suits[0]}${ranks[dealer.currentCards[0]-1]}`);
    }
    switch(middleArea) {        //switch the middle cell between different button pages
        case `bet`:
            removeResults();
            hideEl(document.getElementById('start-page'));
            hideEl(playBtn);
            hideEl(resultPage);
            showEl(mainPage);
            showEl(betBtn);
            disableChips();
            break;
        case `play`:
            playSound(betSound);
            hideEl(betBtn);
            showEl(playBtn);
            disableDouble();
            break;
        case `last`:
            hideEl(betBtn);
            hideEl(playBtn);
            updateResult();
            setTimeout(() => {
                showEl(resultPage);  
                disableNextRound();
            }, 600);
            break;
    }
}
//display player's cards, using random number to have different color and suits for each card
function displayPlayerCards() {
    let arrayP = player.currentCards;
    while(player.cardsDisplayed < arrayP.length){
        let pSuitIdx = Math.floor(Math.random() * 4);
        let pNewImg = document.createElement('div');
        let pCardNum= arrayP[player.cardsDisplayed];
        let pImgUrl = `images/${types[pSuitIdx]}/${types[pSuitIdx]}-${suits[pSuitIdx]}${ranks[pCardNum-1]}.svg`;
        if(pCardNum === 10){
            pCardNum = Math.floor(Math.random() * 4) + 10;
        }
        document.querySelector(`#player-cell`).appendChild(pNewImg);
        document.querySelector(`#player-cell div:last-child`).setAttribute(`background-image`, pImgUrl);
        document.querySelector(`#player-cell div:last-child`).classList.add(`card`);
        document.querySelector(`#player-cell div:last-child`).classList.add(`${suits[pSuitIdx]}${ranks[pCardNum-1]}`);
        document.querySelector(`#player-cell div:last-child`).classList.add(`cardsEffect`);
        player.cardsDisplayed++;
    }
}
//display dealer's cards, using random number to have different color and suits for each card, the first card for dealer will be turned over
function displayDealerCards() {
    let arrayD = dealer.currentCards;
    while(dealer.cardsDisplayed < arrayD.length){
        let dSuitIdx = Math.floor(Math.random() * 4);
        let dNewImg = document.createElement('div');
        let dCardNum= arrayD[dealer.cardsDisplayed];
        let dImgUrl = `images/${types[dSuitIdx]}/${types[dSuitIdx]}-${suits[dSuitIdx]}${ranks[dCardNum-1]}.svg`;
        if(dCardNum === 10){
            dCardNum = Math.floor(Math.random() * 4) + 10;
        }
        document.querySelector(`#dealer-cell`).appendChild(dNewImg);
        if(dealer.cardsDisplayed === 0){
            document.querySelector('#dealer-cell div:last-child').setAttribute(`background-image`, 'images/backs/red.svg');
            document.querySelector(`#dealer-cell div:last-child`).classList.add(`card`);
            document.querySelector(`#dealer-cell div:last-child`).classList.add(`red`);
        }else{
            document.querySelector(`#dealer-cell div:last-child`).setAttribute(`background-image`, dImgUrl);
            document.querySelector(`#dealer-cell div:last-child`).classList.add(`card`);
            document.querySelector(`#dealer-cell div:last-child`).classList.add(`${suits[dSuitIdx]}${ranks[dCardNum-1]}`);
            document.querySelector(`#dealer-cell div:last-child`).classList.add(`cardsEffect`);
        }
        dealer.cardsDisplayed++;
    }    
}
//update result message and change background image css
function updateResult() {
    mainPage.style.backgroundImage = `radial-gradient(closest-side, rgb(64, 125, 87), rgb(42, 88, 72), rgb(31, 66, 53), rgb(24, 51, 41))`;
    if(player.winner === true){
        result.textContent = `😍 🥳 Player Win`;
        playSound(winnerSound);
    }else if(dealer.winner === true){
        result.textContent = `💸💸💸 Dealer Win 💸💸💸`;
        playSound(loserSound);
    }else{
        result.textContent = `🤔 Tie!!`;
    }
    if(calculateTotal(player.currentCards) === 21 || calculateTotal(dealer.currentCards) === 21){
        showEl(document.querySelector('h3'));
    }                          
}
//before next round to start, remove black jack message, remove background image and cards.
function removeResults() {
    hideEl(document.querySelector('h3'));
    mainPage.style.backgroundImage = ``;
    let playerEl = document.querySelector('#player-cell');
    let dealerEl = document.querySelector('#dealer-cell');
    while(playerEl.firstChild){
        playerEl.removeChild(playerEl.firstChild);
    }
    while(dealerEl.firstChild){
        dealerEl.removeChild(dealerEl.firstChild);
    }
}
//disable chips images according to remaining bank amount
function disableChips() {
    if(bank < 50) {
        chips.two.location.classList.add(`noHover`);
        chips.three.location.classList.add(`noHover`);
        chips.four.location.classList.add(`noHover`);
    }else if(bank < 100){
        chips.two.location.classList.remove(`noHover`);
        chips.three.location.classList.add(`noHover`);
        chips.four.location.classList.add(`noHover`);
    }else if(bank < 500){
        chips.two.location.classList.remove(`noHover`);
        chips.three.location.classList.remove(`noHover`);
        chips.four.location.classList.add(`noHover`);
    }else{
        chips.two.location.classList.remove(`noHover`);
        chips.three.location.classList.remove(`noHover`);
        chips.four.location.classList.remove(`noHover`);
    }
}
//disable double button if not enough bank amount
function disableDouble() {
    if(bet > bank){
        document.querySelector('#play-buttons button:nth-child(2)').setAttribute(`disabled`, `true`);
        document.querySelector('#play-buttons button:nth-child(2)').classList.add(`noHover`);
    }else{
        document.querySelector('#play-buttons button:nth-child(2)').removeAttribute(`disabled`);
        document.querySelector('#play-buttons button:nth-child(2)').classList.remove(`noHover`);
    }
}//disable next round button if not enough bank amount for next round
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
//play sound effect
function playSound(url) {
    if(soundEffect.hasAttribute(`checked`)){
        let sound = url;
        sound.play();
    }
}