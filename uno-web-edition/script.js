let deck = [];
let discardPile = [];
const colors = ['red','green','blue','yellow'];
const specialCards = ['jump','reverse','draw2'];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function shuffleCards(){
    for(let i = 0; i < deck.length; i++){
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i],deck[j]] = [deck[j],deck[i]];
    }
}

function initializeDeck(){
    

    for(let color = 0; color < 4; color ++){
        const card = {
            id: colors[color] + '-0',
            color: colors[color],
            type: 'number',
            value: 0
    
        };
        const cardJump = {
            id: colors[color] + '-jump',
            color: colors[color],
            type: 'jump',
            value: null
        };
        const cardReverse = {
            id: colors[color] + '-reverse',
            color: colors[color],
            type: 'reverse',
            value: null
        };
        deck.push(card);
        deck.push(cardJump);
        deck.push(cardReverse);
        for(let number = 1; number < 10; number++){

            const card = {
                id: colors[color] + '-' + number.toString(),
                color: colors[color],
                type: 'number',
                value: number
        
            };
            //preguntar a la profe respecto a esto
            /*
            const card2 = {
                id: colors[color] + '-' + number.toString(),
                color: colors[color],
                type: 'number',
                value: number
        
            };
            
            deck.push(card2);
            */
            deck.push(card);
        }
    }
    shuffleCards();
    console.log(deck);
    
}

function dealCards(){
    let playerDeck = document.getElementById('player-deck');
    playerDeck.innerHTML = ``;

    for (let numberOfCards = 0; numberOfCards < 7; numberOfCards++) {
        let index = getRandomInt(deck.length); 
        const card = deck[index];
        console.log(card);
        
        if (card && card.value !== undefined && card.type === 'number') {
            const cardColor = card.color;
            const cardID = card.id;
            const cardNumber = card.value;
    
            playerDeck.innerHTML += `
            <li class="card ${cardColor} ${cardID}" id="${cardID}">
                <p class="top-number number edge">${cardNumber}</p>
                <p class="mid-number number">${cardNumber}</p>
                <p class="bottom-number number edge">${cardNumber}</p>
            </li>`;
    
            deck.splice(index, 1); 
        } else if(card && card.type == 'jump' && card.value !== undefined){
            const cardColor = card.color;
            const cardID = card.id;
            playerDeck.innerHTML += `
            <li class="card ${cardColor} ${cardID}" id="${cardID}">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img-top">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img-bottom">
            </li>`;

        }else if(card && card.type == 'reverse' && card.value !== undefined){
            const cardColor = card.color;
            const cardID = card.id;
            playerDeck.innerHTML += `
            <li class="card ${cardColor} ${cardID}" id="${cardID}">
                <img src="assets/images/reverse.png" alt="carta salto" class="reverse-img-top">
                <img src="assets/images/reverse.png" alt="carta salto" class="reverse-img">
                <img src="assets/images/reverse.png" alt="carta salto" class="reverse-img-bottom">
            </li>`;
        }
    }
}


//initializeDeck();
//dealCards();

//background-color: #032546;

function setSinglePlayerTable(){
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
    <section id="welcome-window" class="welcome-window">
        <ul class="rival-deck deck" id="rival-deck">
            <li class="card card-hidden"></li>
            <li class="card card-hidden"></li>
            <li class="card card-hidden"></li>
            <li class="card card-hidden"></li>
            <li class="card card-hidden"></li>
            <li class="card card-hidden"></li>
            <li class="card card-hidden"></li>
        </ul>
        <ul class="table-deck deck" id="table-deck">
            <li class="card card-hidden"></li>
            <li class="card card-hidden"></li>
        </ul>
        <ul class="player-deck deck" id="player-deck">
                    
        </ul>
    </section>
    `;
    let welcomeWindow = document.getElementById("welcome-window");
    welcomeWindow.style.backgroundColor = "#032546"
    initializeDeck();
    dealCards();
}


document.getElementById("welcome-window").addEventListener('click',(e) =>{
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
            <div id="multi-player" class="selection-card">
                <img src="assets/images/multiplayericon.svg" alt="logo multiplayer">
                <h3>Multi-player</h3>
                <p>2-4 Jugadorres</p>
            </div>
        </div>
    </div>
    `;
});


