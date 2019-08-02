/* -----------------constants----------------------*/
const msgZone = {       //each cell in msg zone
    remainingNum : document.querySelector('#remaining-cards span'),
    dealerNum : document.querySelector('#dealer-total span'),
    betNum : document.querySelector('#bet-amount span'),
    playerNum : document.querySelector('#player-total span'),
    bankNum : document.querySelector('#bank-amount span'),
};

const chips = {     //represent each chip
    one : {
        val : 1,
        position : document.getElementById('one'),
    },
    two : {
        val : 50,
        position : document.getElementById('fifty'),
    },
    three : {
        val : 100,
        position : document.getElementById('one-hundred'),
    },
    four : {
        val : 500,
        position : document.getElementById('five-hundred'),
    }
};


const startPage = document.getElementById('start-page');
const startBtn = document.getElementById("start-button");
const mainPage = document.querySelector('main');
const betBtn = document.getElementById('bet-buttons');

/*---------------------------variables----------------*/
const player = {    //player
    bust : false,
    cards : [],
    points : 0,
    bank : 1000,
    blackJack : false,
}
const dealer = {    //dealer
    bust : false,
    cards : [],
    points : 0,
    blackJack : false,
}

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
});
//click to lay bet
betBtn.addEventListener('click', function(evt) {
    let chip = evt.target.id;
    amount = chips[chip].val;
    player.bank = player.bank - amount;

    msgZone.betNum.textContent = amount + parseInt(msgZone.betNum.textContent);
    msgZone.bankNum.textContent = player.bank;
});


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
    msgZone.bankNum.textContent = player.bank;
    msgZone.betNum.textContent = amount;
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
