/* -----------------constants----------------------*/
const chips = {     //represent each chip
    one : 1,
    two : 50,
    three : 100,
    four : 500
};

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
startBtn.addEventListener('click', function(){
    hideEl(startPage);
    init();
    showEl(mainPage);
});

//click to lay bet, update msg zone for amount and bank
betBtn.addEventListener('click', function(evt) {
    let chip = evt.target.id;
    amount = chips[chip];
    player.bank = player.bank - amount;
    // msgZone.betNum.textContent = amount + parseInt(msgZone.betNum.textContent);
    // msgZone.bankNum.textContent = player.bank;
    hideEl(betBtn);
    showEl(playBtn);
    assignCard(player.represent);
    assignCard(player.represent);
    // msgZone.playerNum.textContent = calculateTotal(player.cards);
    assignCard(dealer.represent);
    assignCard(dealer.represent);
    render();

    console.log(dealer.cards);
});
//click to hit --- player turn
hitBtn.addEventListener('click', function() {
    assignCard(player.represent);
    // player.playerNum.textContent = calculateTotal(player.cards);
    render();
});
//click to double
doubleBtn.addEventListener('click', function() {
    amount = parseInt(msgZone.betNum.textContent) * 2;
    player.bank = player.bank - parseInt(msgZone.betNum.textContent);
    render();
});
//click to stand -- dealer turn
standBtn.addEventListener('click', dealerTurn);
//click to next round
nextBtn.addEventListener('click', nextRound);
//click to start over
startOverBtn.addEventListener('click', startOver);

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
    msgZone.remainingCards.textContent = cards.length;
}
// initial the game
function init() {
    prepareCards();
    bust = false;
    // msgZone.dealerNum.textContent = 0;
    // msgZone.playerNum.textContent = 0;
    amount = 0; 
    player.bank = 1000;
    // msgZone.betNum.textContent = amount;
    // msgZone.bankNum.textContent = player.bank;
    render();
}
//render
function render() {
    msgZone.betNum.textContent = amount;
    msgZone.bankNum.textContent = player.bank;
    msgZone.playerNum.textContent = calculateTotal(player.cards);
    msgZone.remainingCards.textContent = cards.length;
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
//compare result or bust is true
function compareBoth() {
    let playerSum = calculateTotal(player.cards);
    let dealerSum = calculateTotal(dealer.cards);
    console.log('player total: '+playerSum);
    console.log('dealer total: '+ dealerSum);

    sleep(800);
    msgZone.dealerNum.textContent = parseInt(dealerSum);

    // if(playerSum > 21){  //dealer win
    //     // console.log(`Dealer Win.`);
    //     amount = 0;
    //     player.betNum.textContent = amount;
    //     // console.log('bank is: '+ player.bank + ', amount is :' + amount);
    //     //show ending
    //     result.textContent = `Dealer Win`;
    // }else if(dealerSum > 21){   //player win
    //     // console.log(`Player Win.`);
    //     amount = amount * 2;
    //     player.bank = player.bank + amount;
    //     amount = 0;
    //     msgZone.betNum.textContent = amount;
    //     msgZone.bankNum.textContent = player.bank;
    //     // console.log('bank is: '+player.bank + ', amount is :' + amount);
    //     //show ending
    //     result.textContent = `Player Win`;
    // }else{
        if(playerSum > dealerSum) { //player win
            // console.log(`Player Win.`);
            if(bust === false){
                playerWin();
            }else{
                dealerWin();
            }

            // player.betNum.textContent = amount;
            // player.bankNum.textContent = player.bank;
            // console.log('bank is: '+player.bank + ', amount is :' + amount);
            //show ending

        }else if(playerSum < dealerSum) {   //dealer win
            // console.log(`Dealer Win.`);
            // amount = 0;
            // msgZone.betNum.textContent = amount;
            // console.log('bank is: '+player.bank + ', amount is :' + amount);
            //show ending
            if(bust === false){
                dealerWin();
            }else{
                playerWin();
            }
        }else{
            // console.log(`Tie.`);
            player.bank = player.bank + amount;
            amount = 0;
            // msgZone.betNum.textContent = amount;
            // msgZone.bankNum.textContent = player.bank;
            // console.log('bank is: '+player.bank + ', amount is :' + amount);
            //show ending
            result.textContent = `Tie!!`;
            render();
        }
    // };
    // if(playerSum > 21){  //dealer win
    //     console.log(`Dealer Win.`);
    //     amount = 0;
    //     player.betNum.textContent = amount;
    //     console.log('bank is: '+ player.bank + ', amount is :' + amount);
    //     //show ending
    //     result.textContent = `Dealer Win`;
    // }else if(dealerSum > 21){   //player win
    //     console.log(`Player Win.`);
    //     amount = amount * 2;
    //     player.bank = player.bank + amount;
    //     amount = 0;
    //     msgZone.betNum.textContent = amount;
    //     msgZone.bankNum.textContent = player.bank;
    //     console.log('bank is: '+player.bank + ', amount is :' + amount);
    //     //show ending
    //     result.textContent = `Player Win`;
    // }else{
    //     if(playerSum > dealerSum) { //player win
    //         console.log(`Player Win.`);
    //         amount = amount * 2;
    //         player.bank = player.bank + amount;
    //         amount = 0;
    //         player.betNum.textContent = amount;
    //         player.bankNum.textContent = player.bank;
    //         console.log('bank is: '+player.bank + ', amount is :' + amount);
    //         //show ending
    //         result.textContent = `Player Win`;
    //     }else if(playerSum < dealerSum) {   //dealer win
    //         console.log(`Dealer Win.`);
    //         amount = 0;
    //         msgZone.betNum.textContent = amount;
    //         console.log('bank is: '+player.bank + ', amount is :' + amount);
    //         //show ending
    //         result.textContent = `Dealer Win`;

    //     }else{
    //         console.log(`Tie.`);
    //         player.bank = player.bank + amount;
    //         amount = 0;
    //         msgZone.betNum.textContent = amount;
    //         msgZone.bankNum.textContent = player.bank;
    //         console.log('bank is: '+player.bank + ', amount is :' + amount);
    //         //show ending
    //         result.textContent = `Tie!!`;
    //     }
    // };
    console.log(`compare end`);
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
    console.log(`dealerturn end`);
    document.querySelector('#dealer-cell img:first-child').setAttribute('src', `image/${dealer.cards[0]}.jpg`);
    showEl(lastPage);
    sleep(800);
}
// winner
function playerWin() {
    amount = 2 * parseInt(msgZone.betNum.textContent);
    player.bank = player.bank + amount;
    render;
    result.textContent = `Player Win`;
    render();
}
function dealerWin() {
    amount = 0;
    result.textContent = `Dealer Win`;
    render();
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
    removeCards(player.represent);
    removeCards(dealer.represent);
    if((cards.length) < 50) prepareCards();
}
//start over
function startOver() {
    sleep(300);
    player.cards = [];
    dealer.cards = [];
    init();
    hideEl(lastPage);
    showEl(betBtn);
    removeCards(player.represent);
    removeCards(dealer.represent);
}
// get card pic
// function assignPlayerCard() {
//     let array = player.cards;
//     let temp = cards.splice(getRandomIndex(), 1);
//     array[array.length] = temp.pop();
//     remainingCards.textContent = cards.length;
//     let cardNum= array[array.length - 1];
//     let imgUrl;
//     if(cardNum === 10){
//         cardNum = Math.floor(Math.random() * 4) + 10;
//     }
//     imgUrl = `image/${cardNum}.jpg`;
//     let newImg = document.createElement('img');
//     document.querySelector('#player-cell').appendChild(newImg);
//     document.querySelector('#player-cell img:last-child').setAttribute(`src`, imgUrl);
// }
// function assignDealerCard() {
//     let array = dealer.cards;
//     let temp = cards.splice(getRandomIndex(), 1);
//     array[array.length] = temp.pop();
//     remainingCards.textContent = cards.length;

//     let imgUrl;
//     let cardNum = array[array.length - 1];
//     if(array.length === 1){
//         cardNum = `back`;
//     }
//     if(cardNum === 10){
//         cardNum = Math.floor(Math.random() * 4) + 10;
//     }
//     imgUrl = `image/${cardNum}.jpg`;
//     let newImg = document.createElement('img');
//     document.querySelector('#dealer-cell').appendChild(newImg);
//     document.querySelector('#dealer-cell img:last-child').setAttribute(`src`, imgUrl);
//     if(cardNum === `back`){
//         document.querySelector('#dealer-cell img:last-child').setAttribute(`class`, 'show-back');
//     }
// }
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
    // remainingCards.textContent = cards.length;
    let cardNum= array[array.length - 1];
    if(cardNum === 10){
        cardNum = Math.floor(Math.random() * 4) + 10;
    }
    let imgUrl = `image/${cardNum}.jpg`;
    let newImg = document.createElement('img');
    document.querySelector(`#${receiver}-cell`).appendChild(newImg);

    if(receiver === `player`){
        document.querySelector(`#${receiver}-cell img:last-child`).setAttribute(`src`, imgUrl);

    }else{
        console.log(`1`);
        if(array.length === 1){
            console.log(`2`);
            document.querySelector('#dealer-cell img:last-child').setAttribute(`src`, 'image/back.jpg');
            document.querySelector('#dealer-cell img:last-child').setAttribute(`class`, 'show-back');
        }else{
            console.log(`3`);
            document.querySelector(`#${receiver}-cell img:last-child`).setAttribute(`src`, imgUrl);
        }
    }
    render();
}
// function assignDealerCard() {
    // let array = dealer.cards;
    // let temp = cards.splice(getRandomIndex(), 1);
    // array[array.length] = temp.pop();
    // remainingCards.textContent = cards.length;

    // let imgUrl;
    // let cardNum = array[array.length - 1];
    // if(array.length === 1){
    //     cardNum = `back`;
    // }
    // if(cardNum === 10){
    //     cardNum = Math.floor(Math.random() * 4) + 10;
    // }
    // imgUrl = `image/${cardNum}.jpg`;
    // let newImg = document.createElement('img');
    // document.querySelector('#dealer-cell').appendChild(newImg);
    // document.querySelector('#dealer-cell img:last-child').setAttribute(`src`, imgUrl);
    // if(cardNum === `back`){
    //     document.querySelector('#dealer-cell img:last-child').setAttribute(`class`, 'show-back');
    // }
// }
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
