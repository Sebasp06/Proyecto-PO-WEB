let deck = [];
let discardPile = [];
const colors = ['red','green','blue','yellow'];
const specialCards = ['jump','reverse','draw-2','draw-4','change-color'];

class Card{
    constructor (id,color,type,value){
        this.id = id;
        this.color = color;
        this.type = type;
        this.value = value
    }
}

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
        deck.push(new Card(colors[color] + '-0',colors[color],'number',0));
        deck.push(new Card(colors[color] + '-jump',colors[color],'jump',null));
        deck.push(new Card(colors[color] + '-reverse',colors[color],'reverse',null));
        deck.push(new Card(`${colors[color]}-draw-2`,colors[color],'draw',2));
        deck.push(new Card(`draw-4-${color + 1}`,'black','draw',4));
        deck.push(new Card(`change-color-${color + 1}`,'black','change-color',null));
        for(let number = 1; number < 10; number++){
            deck.push(new Card(`${colors[color]}-${number.toString()}-1`,colors[color],'number',number));
            deck.push(new Card(`${colors[color]}-${number.toString()}-2`,colors[color],'number',number));
        }
    }
    shuffleCards();
    console.log(deck);
    
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
                console.log(cardNumber);
                
                tableDeck.innerHTML += `
                        <li class="card ${cardColor} ${cardID}" id="${cardID}">
                            <p class="top-number number edge">${cardNumber}</p>
                            <p class="mid-number number">${cardNumber}</p>
                            <p class="bottom-number number edge">${cardNumber}</p>
                        </li>
                        <li class="card card-hidden"></li>
                `;
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
                        <li class="card card-hidden"></li>

        `;
        
        deck.splice(index, 1);
}

function dealCards(){
    let playerDeck = document.getElementById('player-deck');
    playerDeck.innerHTML = ``;

    for (let numberOfCards = 0; numberOfCards < 7; numberOfCards++) {
        let index = getRandomInt(deck.length); 
        const card = deck[index];
        
        if (card && card.value !== undefined && card.type === 'number') {
            const cardColor = card.color;
            const cardID = card.id;
            const cardNumber = card.value;
    
            playerDeck.innerHTML += `
            <li class="card card-deck ${cardColor} ${cardID}" id="${cardID}">
                <p class="top-number number edge">${cardNumber}</p>
                <p class="mid-number number">${cardNumber}</p>
                <p class="bottom-number number edge">${cardNumber}</p>
            </li>`;
    
            
        } else if(card && card.type == 'jump' && card.value !== undefined){
            const cardColor = card.color;
            const cardID = card.id;
            playerDeck.innerHTML += `
            <li class="card card-deck ${cardColor} ${cardID}" id="${cardID}">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img-top">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img">
                <img src="assets/images/block.svg" alt="carta salto" class="jump-img-bottom">
            </li>`;
            

        }else if(card && card.type === 'reverse' && card.value !== undefined){
            const cardColor = card.color;
            const cardID = card.id;
            playerDeck.innerHTML += `
            <li class="card card-deck ${cardColor} ${cardID}" id="${cardID}">
                <img src="assets/images/reverse.png" alt="carta salto" class="reverse-img-top">
                <img src="assets/images/reverse.png" alt="carta salto" class="reverse-img">
                <img src="assets/images/reverse.png" alt="carta salto" class="reverse-img-bottom">
            </li>`;
        }else if(card && card.type === 'draw' && card.value !== undefined && card.value === 4){
            const cardColor = card.color;
            const cardID = card.id;
            playerDeck.innerHTML += `
            <li class="card card-deck ${cardColor} ${cardID}" id="${cardID}">
                <p class="top-number number edge">+4</p>
                <img src="assets/images/draw4.svg" alt="carta salto" class="reverse-img">
                <p class="bottom-number number edge">+4</p>
            </li>`;
        }else if(card && card.type === 'draw' && card.value !== undefined && card.value === 2){
            const cardColor = card.color;
            const cardID = card.id;
            playerDeck.innerHTML += `
            <li class="card card-deck ${cardColor} ${cardID}" id="${cardID}">
                <p class="top-number number edge">+2</p>
                <img src="assets/images/draw2.svg" alt="carta salto" class="reverse-img">
                <p class="bottom-number number edge">+2</p>
            </li>`;
        }else if(card && card.type === 'change-color' && card.value !== undefined){
            const cardColor = card.color;
            const cardID = card.id;
            playerDeck.innerHTML += `
            <li class="card card-deck ${cardColor} ${cardID}" id="${cardID}"> 
                <img src="assets/images/color.svg" alt="carta salto" class="reverse-img">
            </li>`;
        }
        deck.splice(index, 1);
    }
    setDeckCard();
}

function setSinglePlayerTable(){
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
    <section id="welcome-window" class="welcome-window">
        <ul class="rival-deck deck" id="rival-deck">
            <li class="card card-deck card-hidden"></li>
            <li class="card card-deck card-hidden"></li>
            <li class="card card-deck card-hidden"></li>
            <li class="card card-deck card-hidden"></li>
            <li class="card card-deck card-hidden"></li>
            <li class="card card-deck card-hidden"></li>
            <li class="card card-deck card-hidden"></li>
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

function setV3PlayerTable(){
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
    <section id="welcome-window" class="welcome-window">

    <div class="v3player-deck">
        <div class= rival-one>
            <ul class="rival-deck deck" id="rival-deck">
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
            </ul>
        </div>
        <div class= "middle">
        <ul class="table-deck deck" id="table-deck">
                <li class="card card-hidden"></li>
                <li class="card card-hidden"></li>
        </ul>
        </div>
        <div class= rival-two>
        <ul class="rival-deck deck" id="rival-deck">
            <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
        </div>

        <div class= "player">
            
        <ul class="player-deck deck" id="player-deck">
                    
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
    dealCards();
}

function setV4PlayerTable(){
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
    <section id="welcome-window" class="welcome-window">

    <div class="v4player-deck">

        <div class= rival-one>
            <ul class="rival-deck deck" id="rival-deck">
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
            </ul>
        </div>

        <div class= rival-three>
            <ul class="rival-deck deck" id="rival-deck">
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
            </ul>
        </div>

        <div class= rival-two>
            <ul class="rival-deck deck" id="rival-deck">
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
                <li class="card card-deck card-hidden">
                <img src="assets/images/Uno-Logo-2020.svg"></img>
                </li>
            </ul>
        </div>

        <div class= "middle">
            <ul class="table-deck deck" id="table-deck">
                <li class="card card-hidden"></li>
                <li class="card card-hidden"></li>
            </ul>
        </div>

        <div class= "player">
            
        <ul class="player-deck deck" id="player-deck">
                    
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
    dealCards();
}

function gamingModeSelection() {
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
      let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
            <div id="welcome-window" class="welcome-window">
                <strong>Reglas</strong>
                <p class="press">Proximamente!</p>
            </div>
    `;
}




