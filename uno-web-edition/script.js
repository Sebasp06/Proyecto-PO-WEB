let deck = [];
let discardPile = [];
let actualColor = "";
let numOfPlayers = 2;
let canDrawCard = true;
let currentIndex = 0;
let direction = -1;
let players = [];
tableDeckInnerHTML = "";
const colors = ['red','green','blue','yellow'];
const specialCards = ['jump','reverse','draw-2','draw-4','change-color'];
const musica=document.getElementById('musica');
const botonMusica= document.getElementById('botonMusica')


class Player{
    constructor(){
        this.id = "";
        this.name = "";
        this.cards = [];
        this.points = 0;
        this.saidUNO = false;
        this.isHuman = false;
    }
}

class Card{
    
    constructor (id,color,type,value){
        this.id = id;
        this.color = color;
        this.type = type;
        this.value = value
    }
}

let player0 = new Player();
let player1 = new Player();
let player2 = new Player();
let player3 = new Player();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function shuffleCards(){
    for(let i = 0; i < deck.length; i++){
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i],deck[j]] = [deck[j],deck[i]];
    }
}

function canPlayCard(cardID){}

function playBot(){
    let cardCanBePlayed = false;
    console.log(`currentIndex = ${currentIndex}`);
    
    for(let i = 0; i < players[currentIndex].cards.length; i++){
        if(playRivalCard(players[currentIndex].cards[i])){
            cardCanBePlayed = true;
            break;
        }
    }
    if(!cardCanBePlayed){
        drawRivalCard(`player-deck-${currentIndex}`);
        playRivalCard(players[currentIndex].cards[players[currentIndex].cards.length - 1]);
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function playBots() {
    while (currentIndex !== 0) {
        await sleep(3000);
        playBot();
        
    }
}
function initializeDeck(){
    for(let color = 0; color < 4; color ++){
        deck.push(new Card(colors[color] + '-0-1',colors[color],'number',0));
        deck.push(new Card(colors[color] + '-jump-1',colors[color],'jump',null));
        deck.push(new Card(colors[color] + '-reverse-1',colors[color],'reverse',null));
        deck.push(new Card(`${colors[color]}-draw2-1`,colors[color],'draw',2));
        deck.push(new Card(`black-draw4-${color + 1}`,'black','draw',4));
        deck.push(new Card(`black-changecolor-${color + 1}`,'black','change-color',null));
        for(let number = 1; number < 10; number++){
            deck.push(new Card(`${colors[color]}-${number.toString()}-1`,colors[color],'number',number));
            deck.push(new Card(`${colors[color]}-${number.toString()}-2`,colors[color],'number',number));
        }
    }
    shuffleCards();
    console.log(deck);   
}

function setColor(color){
    const tableDeck = document.getElementById("table-deck");
    actualColor = color;
    const newImage = `draw4${color}.svg`;
    const newHTML = tableDeckInnerHTML.replace("draw4.svg", newImage);
    tableDeck.innerHTML = newHTML;
    tableDeck.classList.toggle("circle-container");
}

function checkCards(){
    for(let i = 0; i < player0.length; i++){
        if(player0.cards[i].type === discardPile[discardPile.length - 1].type || player0.cards[i].color === discardPile[discardPile.length - 1].color ||
            player0.cards[i].value === discardPile[discardPile.length - 1].value){
            return true;
        }
    }
    return false;
}

function playRivalCard(cardID){
    cardIDHTML = document.getElementById(cardID.id);
    
    const tableDeck = document.getElementById("table-deck");
    const cardInfo = cardID.id.split("-");
    console.log(cardInfo);
    
    
    const pileDeck = discardPile.length - 1;
    let canBePlayed = false;
    let atributte = "";
    let value = 0;
    
    if(cardInfo[0] === actualColor && cardInfo[1] === "draw2"){
        canBePlayed = true;
        atributte = "draw2";
        value = 2;
        const cardColor = cardID.color;
        const cardid = cardID.id;    
        cardIDHTML.innerHTML= `
            <li class="card card-deck ${cardColor} ${cardid}" id="${cardid}">
                <p class="top-number number edge">+2</p>
                <img src="assets/images/draw2.svg" alt="carta salto" class="reverse-img">
                <p class="bottom-number number edge">+2</p>
            </li>`;

    }else if(cardInfo[0] === actualColor && cardInfo[1] === "reverse"){
        canBePlayed = true;
        atributte = "reverse";
        value = null;
        const cardColor = cardID.color;
        const cardid = cardID.id;
        cardIDHTML.innerHTML = `
            <li class="card card-deck ${cardColor} ${cardid}" id="${cardid}">
                <img src="assets/images/block.svg" alt="carta reversa" class="jump-img-top">
                <img src="assets/images/block.svg" alt="carta reversa" class="jump-img">
                <img src="assets/images/block.svg" alt="carta reversa" class="jump-img-bottom">
            </li>
        `;
    }else if(cardInfo[0] === actualColor && cardInfo[1] === "jump"){
        canBePlayed = true;
        atributte = "jump";
        value = null;
        const cardColor = cardID.color;
        const cardid = cardID.id;
        cardIDHTML.innerHTML = `
            <li class="card card-deck ${cardColor} ${cardid}" id="${cardid}">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img-top">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img-bottom">
            </li>
        
        
        `;
        
    }else if(cardInfo[0] === "black" && cardInfo[1] === "changecolor"){
        canBePlayed = true;
        atributte = "changecolor";
        value = null;
        discardPile.push(new Card(cardID.id,cardInfo[0],atributte,value));
        const cardColor = cardID.color;
        const cardid = cardID.id;
        let color = colors[getRandomInt(colors.length)];

        if(color === "blue"){
            actualColor = "blue";
            cardIDHTML.innerHTML = `
            <li class="card card-deck ${cardColor} ${cardid}" id="${cardid}">
                <img src="assets/images/colorblue.svg" alt="carta +4" class="reverse-img">
            </li>`;
        }else if(color === "green"){
            actualColor = "green"
            cardIDHTML.innerHTML = `
            <li class="card card-deck ${cardColor} ${cardid}" id="${cardid}">
                <img src="assets/images/colorgreen.svg" alt="carta +4" class="reverse-img">
            </li>`;
        }else if(color === "red"){
            actualColor = "red";
            cardIDHTML.innerHTML = `
            <li class="card card-deck ${cardColor} ${cardid}" id="${cardid}">
                <img src="assets/images/colorred.svg" alt="carta +4" class="reverse-img">
            </li>`;
        }else{
            actualColor = "yellow"
            cardIDHTML.innerHTML = `
            <li class="card card-deck ${cardColor} ${cardid}" id="${cardid}">
                <img src="assets/images/coloryellow.svg" alt="carta +4" class="reverse-img">
            </li>`;
        }

    }else if(cardInfo[0] === "black" && cardInfo[1] === "draw4"){
        canBePlayed = true;
        atributte = "draw4";
        value = 4;
        discardPile.push(new Card(cardID.id,cardInfo[0],atributte,value));
        const cardColor = cardID.color;
        const cardid = cardID.id;
        let color = colors[getRandomInt(colors.length)];
        if(color === "blue"){
            actualColor = "blue";
            cardIDHTML.innerHTML = `
            <li class="card card-deck ${cardColor} ${cardid}" id="${cardid}">
                <p class="top-number number edge">+4</p>
                <img src="assets/images/draw4blue.svg" alt="carta +4" class="reverse-img">
                <p class="bottom-number number edge">+4</p>
            </li>`;
        }else if(color === "green"){
            actualColor = "green"
            cardIDHTML.innerHTML = `
            <li class="card card-deck ${cardColor} ${cardid}" id="${cardid}">
                <p class="top-number number edge">+4</p>
                <img src="assets/images/draw4green.svg" alt="carta +4" class="reverse-img">
                <p class="bottom-number number edge">+4</p>
            </li>`;
        }else if(color === "red"){
            actualColor = "red";
            cardIDHTML.innerHTML = `
            <li class="card card-deck ${cardColor} ${cardid}" id="${cardid}">
                <p class="top-number number edge">+4</p>
                <img src="assets/images/draw4red.svg" alt="carta +4" class="reverse-img">
                <p class="bottom-number number edge">+4</p>
            </li>`;
        }else{
            actualColor = "yellow"
            cardIDHTML.innerHTML = `
            <li class="card card-deck ${cardColor} ${cardid}" id="${cardid}">
                <p class="top-number number edge">+4</p>
                <img src="assets/images/draw4yellow.svg" alt="carta +4" class="reverse-img">
                <p class="bottom-number number edge">+4</p>
            </li>`;
        }
        
    }else if(cardInfo[0] === actualColor){
        canBePlayed = true;
        atributte = "number";
        value = parseInt(cardInfo[1]);
        const cardColor = cardID.color;
        const cardid = cardID.id;
        const cardNumber = cardID.value;
    
            cardIDHTML.innerHTML = `
            <li class="card card-deck card-player ${cardColor} ${cardid}" id="${cardid}">
                <p class="top-number number edge">${cardNumber}</p>
                <p class="mid-number number">${cardNumber}</p>
                <p class="bottom-number number edge">${cardNumber}</p>
            </li>`;
    }else if((cardInfo[1] !== "changecolor" && cardInfo[1] !== "jump" && cardInfo[1] !== "reverse" && cardInfo[1] !== "draw2" && cardInfo[1] !== "draw4") && cardInfo[1] == discardPile[pileDeck].value){
        canBePlayed = true;
        atributte = "number";
        value = parseInt(cardInfo[1]);
        const cardColor = cardID.color;
        const cardid = cardID.id;
        const cardNumber = cardID.value;
            cardIDHTML.innerHTML = `
            <li class="card card-deck card-player ${cardColor} ${cardid}" id="${cardid}">
                <p class="top-number number edge">${cardNumber}</p>
                <p class="mid-number number">${cardNumber}</p>
                <p class="bottom-number number edge">${cardNumber}</p>
            </li>`;
    }

    if(canBePlayed){
        players[currentIndex].cards = players[currentIndex].cards.filter(card => card.id !== cardID.id);

        discardPile.push(new Card(cardID.id,cardInfo[0],atributte,value));
        tableDeck.innerHTML = `
        
            ${cardIDHTML.innerHTML}
            <li class="card card-table-deck card-hidden cards-left" onclick="drawCard()">
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>
        
        `;
        console.log(tableDeck.innerHTML);
        
        if(direction === -1 && currentIndex === 0){
            currentIndex = players.length - 1
        }else if(direction === -1){
            currentIndex -= 1
        }else if(direction === 1){
            currentIndex = (currentIndex + 1) % players.length;
        }
        
        
        if(cardInfo[0] !== "black") actualColor = cardInfo[0];
        
        console.log(actualColor);
        cardIDHTML.remove();
        console.log(discardPile);
        return true;
        
    }
    return false;
}

function specialCardsEffectRivals(Card){
    if(Card.id.includes("jump")){
        console.log("Jump card played");
    }
    else if(Card.id.includes("reverse")){
        console.log("Reverse card played");
    }
    else if(Card.id.includes("draw2")){
        console.log("Draw card played");
        moreCardPlayers(2);
    }
    else if(Card.type.includes("changecolor") && Card.value === null){
        console.log("Change color card played");
    }
    else if(Card.type.includes("draw4") && Card.value === 4){
        console.log("Draw 4 card played");
        moreCardPlayers(4);
    }      
}

function moreCardPlayers(index){
    for (let i = 0; i < index; i++){
        drawCard();
    }
}

function playCard(cardID){
    const tableDeck = document.getElementById("table-deck");
    const cardInfo = cardID.id.split("-");
    console.log("currentIndex = "+currentIndex);
    
    if(currentIndex !== 0){
        alert("No es tu turno");
        return;
    }
    const pileDeck = discardPile.length - 1;
    let canBePlayed = false;
    let atributte = "";
    let value = 0;
    
    if(cardInfo[0] === actualColor && cardInfo[1] === "draw2"){
        canBePlayed = true;
        atributte = "draw2";
        value = 2;

    }else if(cardInfo[0] === actualColor && cardInfo[1] === "reverse"){
        canBePlayed = true;
        atributte = "reverse";
        value = null;
    }else if(cardInfo[0] === actualColor && cardInfo[1] === "jump"){
        canBePlayed = true;
        atributte = "jump";
        value = null;
    }else if(cardInfo[0] === "black" && cardInfo[1] === "changecolor"){
        canBePlayed = true;
        atributte = "changecolor";
        value = null;
        discardPile.push(new Card(cardID.id,cardInfo[0],atributte,value));
        cardID.classList.remove("card-player");
        specialCardsEffect(new Card(cardID.id,cardInfo[0],atributte,value));
        tableDeck.innerHTML = `
        
            ${cardID.outerHTML}
            <li class="card card-hidden cards-left" onclick="drawCard()">
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>
        
        `;
        cardID.remove();
        tableDeckInnerHTML = tableDeck.innerHTML;
        tableDeck.innerHTML = `
        <li>
            <svg width="200" height="200" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path style="cursor: pointer;" d="M62 32C62 48.5685 48.5685 62 32 62" stroke="#FF0000" stroke-width="2" onclick="setColor('red')"/>
                <path style="cursor: pointer;" d="M62 31C62 14.4315 48.5685 1 32 1" stroke="#84C03F" stroke-width="2" onclick="setColor('green')"/>
                <path style="cursor: pointer;" d="M1 31C1 14.4315 14.4315 1 31 1" stroke="#FFD237" stroke-width="2" onclick="setColor('yellow')"/>
                <path style="cursor: pointer;" d="M1 32C1 48.5685 14.4315 62 31 62" stroke="#0A78B9" stroke-width="2" onclick="setColor('blue')"/>
            </svg>
        </li>`;
        tableDeck.classList.toggle("circle-container");
        return true;

    }else if(cardInfo[0] === "black" && cardInfo[1] === "draw4"){
        canBePlayed = true;
        atributte = "draw4";
        value = 4;
        discardPile.push(new Card(cardID.id,cardInfo[0],atributte,value));
        cardID.classList.remove("card-player");
        specialCardsEffect(new Card(cardID.id,cardInfo[0],atributte,value));
        tableDeck.innerHTML = `
        
            ${cardID.outerHTML}
            <li class="card card-hidden cards-left" onclick="drawCard()">
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>
        
        `;
        cardID.remove();
        tableDeckInnerHTML = tableDeck.innerHTML;
        tableDeck.innerHTML = `
        <li>
            <svg width="200" height="200" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path style="cursor: pointer;" d="M62 32C62 48.5685 48.5685 62 32 62" stroke="#FF0000" stroke-width="2" onclick="setColor('red')"/>
                <path style="cursor: pointer;" d="M62 31C62 14.4315 48.5685 1 32 1" stroke="#84C03F" stroke-width="2" onclick="setColor('green')"/>
                <path style="cursor: pointer;" d="M1 31C1 14.4315 14.4315 1 31 1" stroke="#FFD237" stroke-width="2" onclick="setColor('yellow')"/>
                <path style="cursor: pointer;" d="M1 32C1 48.5685 14.4315 62 31 62" stroke="#0A78B9" stroke-width="2" onclick="setColor('blue')"/>
            </svg>
        </li>`;
        tableDeck.classList.toggle("circle-container");
        return true;
    }else if(cardInfo[0] === actualColor){
        canBePlayed = true;
        atributte = "number";
        value = parseInt(cardInfo[1]);
    }else if((cardInfo[1] !== "changecolor" && cardInfo[1] !== "jump" && cardInfo[1] !== "reverse" && cardInfo[1] !== "draw2" && cardInfo[1] !== "draw4") && cardInfo[1] == discardPile[pileDeck].value){
        canBePlayed = true;
        atributte = "number";
        value = parseInt(cardInfo[1]);
    }

    if (canBePlayed) {

    player0.cards = player0.cards.filter(card => card.id !== cardID.id);

    
    cardID.classList.add("card-animate-play");

    setTimeout(() => {
        
        const played = new Card(cardID.id, cardInfo[0], atributte, value);
        discardPile.push(played);
        specialCardsEffect(played);
        cardID.classList.remove("card-animate-play", "card-player");
        tableDeck.innerHTML = `
        ${cardID.outerHTML}
        <li class="card card-hidden cards-left" onclick="drawCard()">
            <img src="assets/images/Uno-Logo-2020.svg">
        </li>
        `;

    const playedCard = tableDeck.firstElementChild;
    playedCard.classList.add("card-animate-arrive");

    actualColor = cardInfo[0];
    console.log(actualColor);

    cardID.remove();

    if (direction === -1 && currentIndex === 0) {
        currentIndex = players.length - 1;
    } else if (direction === -1) {
        currentIndex -= 1;
    } else if (direction === 1) {
        currentIndex = (currentIndex + 1) % players.length;
    }

    
    if ((direction === 1 && currentIndex === 1) ||
        (direction === -1 && currentIndex === players.length - 1)) {
        playBots();
    }

    
    }, 300);
}

    return false;
    
}

function specialCardsEffect(Card){
    if(Card.id.includes("jump")){
        console.log("Jump card played");
    }
    else if(Card.id.includes("reverse")){
        console.log("Reverse card played");
    }
    else if(Card.id.includes("draw2")){
        moreCardsRivals(2);
    }
    else if(Card.type.includes("changecolor") && Card.value === null){
        console.log("Change color card played");
    }
    else if(Card.type.includes("draw4") && Card.value === 4){
        moreCardsRivals(4);
    }      
}

function moreCardsRivals(index){
    for (let i = 0; i < index; i++){
        drawRivalCard(`player-deck-${currentIndex+1}`);
    }
}

function setDeckCard(){
    const tableDeck = document.getElementById("table-deck");
    tableDeck.innerHTML = ``;
    let index = getRandomInt(deck.length); 
    const card = deck[index];    
        while(card && card.type !== 'number'){            
            index = getRandomInt(deck.length);
            const card = deck[index];
            if (card && card.value !== undefined && card.type === 'number'){
                const cardID = card.id;
                const cardColor = card.color;
                const cardNumber = card.value;
                
                tableDeck.innerHTML += `
                        <li class="card ${cardColor} ${cardID}" id="${cardID}">
                            <p class="top-number number edge">${cardNumber}</p>
                            <p class="mid-number number">${cardNumber}</p>
                            <p class="bottom-number number edge">${cardNumber}</p>
                        </li>
                        <li class="card card-hidden cards-left" onclick="drawCard()">
                            <img src="assets/images/Uno-Logo-2020.svg">
                        </li>
                `;

                deck.splice(index, 1);
                discardPile.push(card);
                actualColor = card.color;
                return;
            }
            
        }

        
        const cardID = card.id;
        const cardColor = card.color;
        const cardNumber = card.value;
                tableDeck.innerHTML += `
                    
                        <li class="card ${cardColor} ${cardID}" id="${cardID}">
                            <p class="top-number number edge">${cardNumber}</p>
                            <p class="mid-number number">${cardNumber}</p>
                            <p class="bottom-number number edge">${cardNumber}</p>
                        </li>
                        <li class="card card-table-deck card-hidden" onclick="drawCard()">
                            <img src="assets/images/Uno-Logo-2020.svg">
                        </li>
        `;
        discardPile.push(card);
        deck.splice(index, 1);
        actualColor = card.color;
}

function dealPlayerCards(){
    let playerDeck = document.getElementById('player-deck-0');
    playerDeck.innerHTML = ``;

    for (let numberOfCards = 0; numberOfCards < 7; numberOfCards++) {
        let index = getRandomInt(deck.length); 
        const card = deck[index];
        
        if (card && card.value !== undefined && card.type === 'number') {
            const cardColor = card.color;
            const cardID = card.id;
            const cardNumber = card.value;
    
            playerDeck.innerHTML += `
            <li class="card card-deck card-player ${cardColor} ${cardID}" id="${cardID}" onclick="playCard(this)">
                <p class="top-number number edge">${cardNumber}</p>
                <p class="mid-number number">${cardNumber}</p>
                <p class="bottom-number number edge">${cardNumber}</p>
            </li>`;
            player0.cards.push(card);
            
        } else if(card && card.type == 'jump' && card.value !== undefined){
            const cardColor = card.color;
            const cardID = card.id;
            playerDeck.innerHTML += `
            <li class="card card-deck card-player ${cardColor} ${cardID}" id="${cardID}" onclick="playCard(this)">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img-top">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img-bottom">
            </li>`;
            player0.cards.push(card);

        }else if(card && card.type === 'reverse' && card.value !== undefined){
            const cardColor = card.color;
            const cardID = card.id;
            playerDeck.innerHTML += `
            <li class="card card-deck card-player ${cardColor} ${cardID}" id="${cardID}" onclick="playCard(this)">
                <img src="assets/images/reverse.png" alt="carta salto" class="reverse-img-top">
                <img src="assets/images/reverse.png" alt="carta salto" class="reverse-img">
                <img src="assets/images/reverse.png" alt="carta salto" class="reverse-img-bottom">
            </li>`;
            player0.cards.push(card);
        }else if(card && card.type === 'draw' && card.value !== undefined && card.value === 4){
            const cardColor = card.color;
            const cardID = card.id;
            playerDeck.innerHTML += `
            <li class="card card-deck card-player ${cardColor} ${cardID}" id="${cardID}" onclick="playCard(this)">
                <p class="top-number number edge">+4</p>
                <img src="assets/images/draw4.svg" alt="carta salto" class="reverse-img">
                <p class="bottom-number number edge">+4</p>
            </li>`;
            player0.cards.push(card);
        }else if(card && card.type === 'draw' && card.value !== undefined && card.value === 2){
            const cardColor = card.color;
            const cardID = card.id;
            playerDeck.innerHTML += `
            <li class="card card-deck card-player ${cardColor} ${cardID}" id="${cardID}" onclick="playCard(this)">
                <p class="top-number number edge">+2</p>
                <img src="assets/images/draw2.svg" alt="carta salto" class="reverse-img">
                <p class="bottom-number number edge">+2</p>
            </li>`;
            player0.cards.push(card);
        }else if(card && card.type === 'change-color' && card.value !== undefined){
            const cardColor = card.color;
            const cardID = card.id;
            playerDeck.innerHTML += `
            <li class="card card-deck card-player ${cardColor} ${cardID}" id="${cardID}" onclick="playCard(this)"> 
                <img src="assets/images/color.svg" alt="carta salto" class="reverse-img">
            </li>`;
            player0.cards.push(card);
        }
        deck.splice(index, 1);
    }
    setDeckCard();
}

function dealRivalsCard(rivalID){
    const rivalDeck = document.getElementById(rivalID);
    let playerNum = parseInt(rivalID.split("-")[2]);
    rivalDeck.innerHTML = ``;
    for (let numberOfCards = 0; numberOfCards < 7; numberOfCards++) {
        let index = getRandomInt(deck.length); 
        const card = deck[index];
        
        if (card && card.value !== undefined && card.type === 'number') {
            const cardColor = card.color;
            const cardID = card.id;
            const cardNumber = card.value;
    
            rivalDeck.innerHTML += `
            <li class="card card-deck card-hidden ${cardID}" id="${cardID}">
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>`;
            players[playerNum].cards.push(card);
            
        } else if(card && card.type == 'jump' && card.value !== undefined){
            const cardColor = card.color;
            const cardID = card.id;
            rivalDeck.innerHTML += `
            <li class="card card-deck card-hidden ${cardID}" id="${cardID}">
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>`;
            players[playerNum].cards.push(card);

        }else if(card && card.type === 'reverse' && card.value !== undefined){
            const cardColor = card.color;
            const cardID = card.id;
            rivalDeck.innerHTML += `
            <li class="card card-deck card-hidden ${cardID}" id="${cardID}">
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>`;
            players[playerNum].cards.push(card);
        }else if(card && card.type === 'draw' && card.value !== undefined && card.value === 4){
            const cardColor = card.color;
            const cardID = card.id;
            rivalDeck.innerHTML += `
            <li class="card card-deck card-hidden ${cardID}" id="${cardID}">
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>`;
            players[playerNum].cards.push(card);
        }else if(card && card.type === 'draw' && card.value !== undefined && card.value === 2){
            const cardColor = card.color;
            const cardID = card.id;
            rivalDeck.innerHTML += `
            <li class="card card-deck card-hidden ${cardID}" id="${cardID}">
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>`;
            players[playerNum].cards.push(card);
        }else if(card && card.type === 'change-color' && card.value !== undefined){
            const cardColor = card.color;
            const cardID = card.id;
            rivalDeck.innerHTML += `
            <li class="card card-deck  card-hidden ${cardID}" id="${cardID}"> 
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>`;
            players[playerNum].cards.push(card);
        }
        deck.splice(index, 1);
    }
}

function unoScream(){
    const handCards = document.getElementById("player-deck-0");
    const amountOfCards = handCards.childElementCount;
    if(amountOfCards === 1){
        alert("¡UNO!"); 
    }
    else {
        drawCard();
        drawCard(); 
    }
}

function setSinglePlayerTable(){
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
    <section id="welcome-window" class="welcome-window">
        <div class= rival-three>
            <ul class="rival-deck deck" id="player-deck-1">
            </ul>
        </div>
        <div class= "middle">
            <ul class="table-deck deck" id="table-deck">
            </ul>
        </div>
        <div class= "player">
            <ul class="player-deck deck" id="player-deck-0">       
            </ul>
            <button class="uno-button" id="uno-button" onclick="unoScream()">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
            </button>
        </div>
    </section>
    `;
    let welcomeWindow = document.getElementById("welcome-window");
    welcomeWindow.style.backgroundColor = "#032546"
    initializeDeck();
    dealPlayerCards();
    player0.isHuman = true;
    player0.id = "player-deck-0";
    player0.name = "Jugador 1";
    player1.id = "player-deck-1";
    player1.name = "Rival 1";
    players.push(player0);
    players.push(player1);
    dealRivalsCard("player-deck-1");
    console.log(player0);
    
    
}

function setV3PlayerTable(){
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
    <section id="welcome-window" class="welcome-window">

    <div class="v3player-deck">
        <div class= "rival-one">
            <ul class="rival-deck deck" id="player-deck-1">
                
            </ul>
        </div>
        <div class= "middle">
        <ul class="table-deck deck" id="table-deck">
                <li class="card card-hidden"></li>
                <li class="card card-hidden"></li>
        </ul>
        <button class="uno-button" id="uno-button" onclick="unoScream()">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
        </button>
        </div>
        <div class= rival-two>
        <ul class="rival-deck deck" id="player-deck-2">
        </ul>
        </div>

        <div class= "player">
            
            <ul class="player-deck deck" id="player-deck-0">       
            </ul>
        </div>
        </div>
    </section>
    `;
    let welcomeWindow = document.getElementById("welcome-window");
    welcomeWindow.style.backgroundColor = "#032546"
    welcomeWindow.style.height = "700px";
    welcomeWindow.style.width = "1200px";
    initializeDeck();
    dealPlayerCards();
    player0.isHuman = true;
    player0.id = "player-deck-0";
    player0.name = "Jugador 1";
    player1.id = "player-deck-1";
    player1.name = "Rival 1";
    player2.id = "player-deck-2";
    player2.name = "Rival 2";
    players.push(player0);
    players.push(player1);
    players.push(player2);
    dealRivalsCard("player-deck-1");
    dealRivalsCard("player-deck-2");
}

function setV4PlayerTable(){
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
    <section id="welcome-window" class="welcome-window">

    <div class="v4player-deck">

        <div class= rival-one>
            <ul class="rival-deck deck" id="player-deck-1">
            </ul>
        </div>

        <div class= rival-three>
            <ul class="rival-deck deck" id="player-deck-2">
            </ul>
        </div>

        <div class= rival-two>
            <ul class="rival-deck deck" id="player-deck-3">
            </ul>
        </div>

        <div class= "middle">
            <ul class="table-deck deck" id="table-deck">
                <li class="card card-hidden"></li>
                <li class="card card-hidden"></li>
            </ul>
            <button class="uno-button" id="uno-button" onclick="unoScream()">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
        </button>
        </div>

        <div class= "player">
            <ul class="player-deck deck" id="player-deck-0">       
            </ul>
        </div>

    </div>
    </section>
    `;
    let welcomeWindow = document.getElementById("welcome-window");
    welcomeWindow.style.backgroundColor = "#032546"
    //welcomeWindow.style.height = "70px";
    //welcomeWindow.style.width = "1200px";
    initializeDeck();
    dealPlayerCards();
    player0.isHuman = true;
    player0.id = "player-deck-0";
    player0.name = "Jugador 1";
    player1.id = "player-deck-1";
    player1.name = "Rival 1";
    player2.id = "player-deck-2";
    player2.name = "Rival 2";
    player3.id = "player-deck-3";
    player3.name = "Rival 3";
    players.push(player0);
    players.push(player1);
    players.push(player2);
    players.push(player3);
    dealRivalsCard("player-deck-1");
    dealRivalsCard("player-deck-2");
    dealRivalsCard("player-deck-3");
    console.log(player0);
    
}

function gamingModeSelection() {
    deck = [];
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
    <div id="gaming-mode" class="selection-window">
        <h2>Modo de juego</h2>
        <div id="gaming-mode-selection" class="selection-card-container">
            <div id="single-player" class="selection-card" onclick="setSinglePlayerTable()">
                <img src="assets/images/singleplayericon.svg" alt="Logo singleplayer">
                <h3>Single player</h3>
                <p>Juega local</p>
            </div>
            <div id="multi-player" class="selection-card" onclick="multiplayerSelection()">
                <img src="assets/images/multiplayericon.svg" alt="logo multiplayer">
                <h3>Multi-player</h3>
                <p>2-4 Jugadorres</p>
            </div>
        </div>
    </div>
    `;
}

function multiplayerSelection() {
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
    <div id="gaming-mode" class="selection-windowPlayer">
        <h2>Modo de juego</h2>
        <div id="gaming-mode-selection" class="selection-card-containerPlayer">
            <div id="threeplayers-player" class="selection-card" onclick="setV3PlayerTable()">
                <img src="assets/images/singleplayericon.svg" alt="Logo singleplayer">
                <h3>Juega contra:</h3>
                <p>2 jugadores</p>
            </div>
            <div id="multi-player" class="selection-card" onclick="setV4PlayerTable()">
                <img src="assets/images/multiplayericon.svg" alt="logo multiplayer">
                <h3>Juega contra:</h3>
                <p>3 jugadores</p>
            </div>
            <div id="multi-player" class="selection-card" onclick="setV3PlayerTable()">
                <img src="assets/images/multiplayericon.svg" alt="logo multiplayer">
                <h3>Juega contra:</h3>
                <p>Otras personas en linea</p>
            </div>
        </div>
    </div>
    `;
}

function returnHome() {
    deck = [];
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
            <div id="welcome-window" class="welcome-window">
                <strong>BIENVENIDO A</strong>
                <img src="assets/images/UNO-Logopng.png" alt="Logo UNO" class="start-img" onclick="gamingModeSelection()"></img>
                <p class="press">Presiona para continuar</p>
                <p class="slogan">¡El clásico que nunca pasa de moda!</p>
                <p class="team">Grupo 2: Sebastián Pérez, Lisa García y Ana García</p>
            </div>
    `;
}

function viewRules() {
    deck = [];
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
            <div id="welcome-window" class="welcome-window">
                <strong>Reglas</strong>
                <p class="press">Proximamente!</p>
            </div>
    `;
}

function drawCard(){
    if(!canDrawCard){
            alert("Ya has robado una carta, no puedes robar más");
            return
    }
    const drawPlayer = document.getElementById("player-deck-0");
    let drawCard = new Card("","","",null);
    console.log(deck.length);
    
    if(deck.length !== 0){
        drawCard = deck[0];
        player0.cards.push(drawCard);
        console.log(drawCard);
        deck.splice(0,1);
    }else{
        return;
    }
    
    
    if(drawCard && drawCard.value !== undefined && drawCard.type === "number"){     
            const cardID = drawCard.id;
            const cardColor = drawCard.color;
            const cardNumber = drawCard.value;

            drawPlayer.innerHTML +=`
            <li class="card card-deck card-player ${cardColor} ${cardID}" id="${cardID}" onclick="playCard(this)">
                <p class="top-number number edge">${cardNumber}</p>
                <p class="mid-number number">${cardNumber}</p>
                <p class="bottom-number number edge">${cardNumber}</p>
            </li>
            `;
    }else if(drawCard && drawCard.value !== undefined && drawCard.type === "reverse"){
            const cardID = drawCard.id;
            const cardColor = drawCard.color;
            drawPlayer.innerHTML += `
            <li class="card card-deck card-player ${cardColor} ${cardID}" id="${cardID}" onclick="playCard(this)">
                <img src="assets/images/reverse.png" alt="carta salto" class="reverse-img-top">
                <img src="assets/images/reverse.png" alt="carta salto" class="reverse-img">
                <img src="assets/images/reverse.png" alt="carta salto" class="reverse-img-bottom">
            </li>`;
    }else if(drawCard && drawCard.type == 'jump' && drawCard.value !== undefined){
            const cardID = drawCard.id;
            const cardColor = drawCard.color;
            drawPlayer.innerHTML += `
            <li class="card card-deck card-player ${cardColor} ${cardID}" id="${cardID}" onclick="playCard(this)">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img-top">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img-bottom">
            </li>
            `
    }else if(drawCard && drawCard.type === 'draw' && drawCard.value !== undefined && drawCard.value === 4){
            const cardID = drawCard.id;
            const cardColor = drawCard.color;
            drawPlayer.innerHTML += `
            <li class="card card-deck card-player ${cardColor} ${cardID}" id="${cardID}" onclick="playCard(this)">
                <p class="top-number number edge">+4</p>
                <img src="assets/images/draw4.svg" alt="carta salto" class="reverse-img">
                <p class="bottom-number number edge">+4</p>
            </li>`;
    }else if(drawCard && drawCard.type === 'draw' && drawCard.value !== undefined && drawCard.value === 2){
            const cardColor = drawCard.color;
            const cardID = drawCard.id;
            drawPlayer.innerHTML += `
            <li class="card card-deck card-player ${cardColor} ${cardID}" id="${cardID}" onclick="playCard(this)">
                <p class="top-number number edge">+2</p>
                <img src="assets/images/draw2.svg" alt="carta salto" class="reverse-img">
                <p class="bottom-number number edge">+2</p>
            </li>`;
    }else if(drawCard && drawCard.type === 'change-color' && drawCard.value !== undefined){
            const cardColor = drawCard.color;
            const cardID = drawCard.id;
            drawPlayer.innerHTML += `
            <li class="card card-deck card-player ${cardColor} ${cardID}" id="${cardID}" onclick="playCard(this)"> 
                <img src="assets/images/color.svg" alt="carta salto" class="reverse-img">
            </li>`;
    }
    canDrawCard = true;
    if(!canPlayCard() && direction === 1){
        currentIndex = (currentIndex + 1) % players.length;
    }else if(!canPlayCard() && direction === -1){
        if(currentIndex === 0){
            currentIndex = players.length - 1;
        }else{
            currentIndex -= 1;
        }
    }
}


function drawRivalCard(rivalID){
    const drawPlayer = document.getElementById(rivalID);
    let drawCard = new Card("","","",null);
    console.log(deck.length);
    
    if(deck.length !== 0){
        drawCard = deck[0];
        players[currentIndex].cards.push(drawCard);
        console.log(drawCard);
        deck.splice(0,1);
    }else{
        return;
    }
    
    if(drawCard && drawCard.value !== undefined && drawCard.type === "number"){
            const cardID = drawCard.id;
            const cardColor = drawCard.color;
            const cardNumber = drawCard.value;

            drawPlayer.innerHTML +=`
            <li class="card card-deck card-hidden ${cardID}" id="${cardID}" >
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>
            `;
    }else if(drawCard && drawCard.value !== undefined && drawCard.type === "reverse"){
            const cardID = drawCard.id;
            const cardColor = drawCard.color;
            drawPlayer.innerHTML += `
            <li class="card card-deck card-hidden ${cardID}" id="${cardID}" >
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>`;
    }else if(drawCard && drawCard.type == 'jump' && drawCard.value !== undefined){
            const cardID = drawCard.id;
            const cardColor = drawCard.color;
            drawPlayer.innerHTML += `
            <li class="card card-deck card-hidden ${cardID}" id="${cardID}" >
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>
            `
    }else if(drawCard && drawCard.type === 'draw' && drawCard.value !== undefined && drawCard.value === 4){
            const cardID = drawCard.id;
            const cardColor = drawCard.color;
            drawPlayer.innerHTML += `
            <li class="card card-deck card-hidden  ${cardID}" id="${cardID}" >
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>`;
    }else if(drawCard && drawCard.type === 'draw' && drawCard.value !== undefined && drawCard.value === 2){
            const cardColor = drawCard.color;
            const cardID = drawCard.id;
            drawPlayer.innerHTML += `
            <li class="card card-deck card-hidden ${cardID}" id="${cardID}" >
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>`;
    }else if(drawCard && drawCard.type === 'change-color' && drawCard.value !== undefined){
            const cardColor = drawCard.color;
            const cardID = drawCard.id;
            drawPlayer.innerHTML += `
            <li class="card card-deck card-hidden ${cardID}" id="${cardID}" > 
                <img src="assets/images/Uno-Logo-2020.svg">
            </li>`;
    }
    
    
}

function cambiarPlayPause(){
    if (musica.paused){
        musica.muted=false;
        musica.play();
        musica.volume= 0.2;
    }
    else{
        musica.pause();
    }
}

