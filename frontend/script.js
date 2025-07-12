let gameState = {};
let gameId = null;
let ws = new WebSocket('ws://localhost:3001/uno');
let index = 0;
let player = []
let chosenColor = null;
const notification = document.getElementById('notification-window');
const notificationText = document.getElementById('notification-text');
const unoScreamModal = document.getElementById('unoScream');
const unoScreamContent = document.getElementById('unoScream-content');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

ws.onopen = () => {
  console.log('Conexión establecida');
  if (gameId) { // Solo si ya tenemos gameId
    ws.send(JSON.stringify({ 
      type: 'subscribe', // Corregido
      gameId: gameId 
    }));
  }
};


async function startNewRound(){
  resetV4PlayerTable();
  try {
    const response = await fetch('http://localhost:3001/new-round', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },body: JSON.stringify({
        gameId: gameState.gameId,
      })
    });

    if (!response.ok) {
      throw new Error('Error al iniciar la partida');
    }

    gameState = await response.json();
    gameId = gameState.gameId;

    console.log('Partida iniciada:', gameState);
    console.log('ID del juego:', gameId);

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'subscribe',
        gameId: gameId
      }));
    }


    updateGameUI(gameState);
    
    return;

  } catch (error) {
    console.error('Error al iniciar el juego:', error);
    showNotification("Error al iniciar el juego: " + error.message);
  }
}

async function startGame() {
  try {
    const response = await fetch('http://localhost:3001/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al iniciar la partida');
    }

    gameState = await response.json();
    gameId = gameState.gameId;

    console.log('Partida iniciada:', gameState);
    console.log('ID del juego:', gameId);

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'subscribe',
        gameId: gameId
      }));
    }

    updateGameUI(gameState);
    
    return;

  } catch (error) {
    console.error('Error al iniciar el juego:', error);
    showNotification("Error al iniciar el juego: " + error.message);
  }
}

ws.onmessage = (e) => {
  try {
    const msg = JSON.parse(e.data);
    console.log('Mensaje recibido:', msg);
    
    switch(msg.type) {
    case 'client_play':
      console.log('Jugador humano jugó carta');
      gameState = msg.gameState
      notificationText.textContent = `Has jugado una carta`;
      notification.classList.toggle('hidden');

      setTimeout(() => {
        notification.classList.toggle('hidden');
        notificationText.classList.toggle('hidden');
        }, 3000); 
      updateGameUI(gameState);
      break;

    case 'bot_play':
      console.log(`Bot ${msg.player} jugó carta`);
      gameState = msg.gameState

      notificationText.textContent = `${msg.player} ha jugado`;
      notification.classList.toggle('hidden');

      setTimeout(() => {
        notification.classList.toggle('hidden');
        notificationText.classList.toggle('hidden');
        }, 3000); 
      updateGameUI(gameState);

      break;

    case 'client_draw_from_deck':
      console.log('Jugador humano robó carta');
      gameState = msg.gameState

      notificationText.textContent = `Has robado una carta`;
      notification.classList.toggle('hidden');

      setTimeout(() => {
        notification.classList.toggle('hidden');
        notificationText.classList.toggle('hidden');
        }, 3000); 
      updateGameUI(gameState);
      break;

    case 'bot_draw_from_deck':
      console.log(`Bot ${msg.player} robó carta`);
      gameState = msg.gameState;
      notificationText.textContent = `${msg.player} ha robado una carta`;
      notification.classList.toggle('hidden');

      setTimeout(() => {
        notification.classList.toggle('hidden');
        notificationText.classList.toggle('hidden');
        }, 3000); 
      updateGameUI(gameState);
      updateGameUI(gameState);
      break;

    case 'draw_penalty':
      console.log(`Penalización de ${msg.amount}`);
      gameState = msg.gameState
      notificationText.textContent = `${msg.player} ha sido penalizado`;
      notification.classList.toggle('hidden');

      setTimeout(() => {
        notification.classList.toggle('hidden');
        notificationText.classList.toggle('hidden');
        }, 3000); 
      updateGameUI(gameState);
      updateGameUI(gameState);
      break;

    case 'uno_penalty':
      console.log(`Penalización de ${msg.amount}`);
      gameState = msg.gameState
      updateGameUI(gameState);
      console.log('Penalización por no decir UNO');
      updateGameUI(gameState);
      break;

    case 'uno_warning':
      console.log('Advertencia: decir UNO');
      notificationText.textContent = "Presiona el botón de UNO para gritarlo, aprovecha la oportunidad";
      notification.classList.toggle('hidden');

      setTimeout(() => {
        notification.classList.toggle('hidden');
        notificationText.classList.toggle('hidden');
        }, 3000);
      break;

    case 'client_uno':
      console.log('Jugador humano dijo UNO');
      unoScreamContent.innerHTML = `
                <img src="assets/UNO-Logopng.png"></img>
                <p>Haz gritado UNO</p>
      `;
      unoScreamModal.classList.toggle('hidden');

      setTimeout(() => {
        unoScreamModal.classList.toggle('hidden');
        unoScreamContent.classList.toggle('hidden');
      }, 1000);
      break;

    case 'bot_uno':
      console.log(`Bot ${msg.player} dijo UNO`);
      unoScreamContent.innerHTML = `
                <img src="assets/UNO-Logopng.png"></img>
                <p>${msg.player} ha gritado UNO</p>
      `;
      unoScreamModal.classList.toggle('hidden');
      setTimeout(() => {
        unoScreamModal.classList.toggle('hidden');
        unoScreamContent.classList.toggle('hidden');
      }, 1000);
      break;

    case 'round_score':
      console.log('Fin de ronda', msg.winner, msg.roundScore);
      modalContent.innerHTML=`
      <h2>${msg.winner} ha ganado</h2>
        <p><i>Posiciones</i></p>
                <table>
                    <thead>
                        <tr>
                            <th class="tg-baqh">Jugadores</th>
                            <th class="tg-baqh">Puntaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tg-baqh">Player 1</td>
                            <td class="tg-baqh">${msg.scores[0]}</td>
                        </tr>
                        <tr>
                            <td class="tg-baqh">Player 2</td>
                            <td class="tg-baqh">${msg.scores[1]}</td>
                        </tr>
                        <tr>
                            <td class="tg-baqh">Player 3</td>
                            <td class="tg-baqh">${msg.scores[2]}</td>
                        </tr>
                        <tr>
                            <td class="tg-baqh">Player 4</td>
                            <td class="tg-baqh">${msg.scores[3]}</td>
                            </tr>
                    </tbody>
                </table>
                <div id="buttonsModal" class="modalButtons">
                    <button onclick= "startNewRound()">Reiniciar</button> 
                    <button onclick= "returnHome()" >Salir</button>
                </div>
      `;
      modal.classList.toggle('hidden');
    
      break;

    default:
      console.warn('Tipo de mensaje no reconocido:', msg.type);
  }
  } catch (error) {
    console.error('Error procesando mensaje:', error);
  }
};

function updateGameUI(state) {
  const playerDeck = document.getElementById('player-deck-0');
  if (playerDeck) {
    playerDeck.innerHTML = state.clientCards.map(card => displayCard(card, true,false)).join('');
  }

  const tableDeck = document.getElementById('table-deck');
  if (tableDeck) {
    tableDeck.innerHTML = `
    ${displayCard(state.discardPile,false,true)}
    <li class="card card-hidden" onclick= "drawCard()">
      <img src="assets/Uno-Logo-2020.png">
    </li>
    `
    
    ;
  }

  for (let i = 0; i < 3; i++) {
    const rivalDeck = document.getElementById(`player-deck-${i+1}`);
    if (rivalDeck && state.otherPlayers && state.otherPlayers[i]) {
      // Mostrar el número correcto de cartas (back side)
      rivalDeck.innerHTML = ``;
      for(let j = 0; j < state.otherPlayers[i].count; j ++){
        rivalDeck.innerHTML += displayRivalCards();
      }
        
    }
  }
}


function renderGame(currentState) {
  let allCards = []
  let clientCards = currentState.clientCards;
  
  let rivalContainer = ``;
  
  clientContainer = ``;
  console.log("Renderizando juego con el estado:", currentState);
  for(let i = 0; i < clientCards.length; i++){
    
    clientContainer += displayCard(clientCards[i],true, false);

  }
  allCards.push(clientContainer);
  for(let i = 0; i < 3; i ++){
    const rivalCards = currentState.otherPlayers[i];
    
    for(let j = 0; j < 7; j ++){
      rivalContainer += displayCard(rivalCards[j],false,false)
    }
    allCards.push(rivalContainer);
  }
  
  
  return clientContainer;

}

function displayRivalCards(){

  return `<li class="card card-deck card-hidden">
                <img src="assets/Uno-Logo-2020.png">
            </li>`;
  
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setColor(color){  
  gameState.currentColor = color;
}

async function playCard(element){

  const clientCards = document.getElementById("player-deck-0");
  const listOfElements = Array.from(clientCards.children);

  index = listOfElements.indexOf(element);
  console.log(gameState.clientCards[index].color === "wild");
  
  if(gameState.clientCards[index].color === "wild"){
    console.log("wild card detected");
    const tableDeck = document.getElementById("table-deck");
    tableDeck.innerHTML = 
    
    `
    <li>
            <svg width="200" height="200" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path style="cursor: pointer;" d="M62 32C62 48.5685 48.5685 62 32 62" stroke="#FF0000" stroke-width="2" onclick="setColor('red')"/>
                <path style="cursor: pointer;" d="M62 31C62 14.4315 48.5685 1 32 1" stroke="#84C03F" stroke-width="2" onclick="setColor('green')"/>
                <path style="cursor: pointer;" d="M1 31C1 14.4315 14.4315 1 31 1" stroke="#FFD237" stroke-width="2" onclick="setColor('yellow')"/>
                <path style="cursor: pointer;" d="M1 32C1 48.5685 14.4315 62 31 62" stroke="#0A78B9" stroke-width="2" onclick="setColor('blue')"/>
            </svg>
        </li>
    `;
    await sleep(3000);
    //aqui deberia ir el modal
  }  
    try {
    // Enviar la jugada al servidor
    const response = await fetch('http://localhost:3001/play', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId: gameId,
        card: gameState.clientCards[index],
        chosenColor: gameState.currentColor
      })
    });

    if (!response.ok) {
      const error = await response.json();
      notificationText.textContent = "La carta que intetaste jugar no es compatible con la carta de la pila de descarte";
      notification.classList.toggle('hidden');

      setTimeout(() => {
        notification.classList.toggle('hidden');
        notificationText.classList.toggle('hidden');
        }, 3000);
      throw new Error(error.message || "Error al jugar carta");

    }
    
    
    chosenColor = null;

  } catch (error) {
    console.error('Error al jugar carta:', error);
    showNotification(error.message);
  }
}

async function drawCard() {
  
  try {
    const response = await fetch('http://localhost:3001/draw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId: gameId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al robar carta");
    }

  } catch (error) {
    console.error('Error al robar carta:', error);
    showNotification(error.message);
  }
}

async function unoScream() {
  
  try {
    const response = await fetch('http://localhost:3001/uno', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId: gameId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al robar carta");
    }

  } catch (error) {
    console.error('Error al robar carta:', error);
    showNotification(error.message);
  }
}

async function newRound() {
  
  try {
    const response = await fetch('http://localhost:3001/new-round', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId: gameId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al robar carta");
    }

  } catch (error) {
    console.error('Error al robar carta:', error);
    showNotification(error.message);
  }
}

function displayCard(clientCard,isHuman, cardOnTable){

  let classCard = "";
  let click = "";

  if(isHuman){

    classCard = "card-deck card-player";
    click = "onclick=playCard(this)";


  } 
  
  if(clientCard && clientCard.type === "number"){
    return `
    <li class="card ${classCard} ${clientCard.color} ${clientCard.id}" id="${clientCard.id}" ${click}>
      <p class="top-number number edge">${clientCard.value}</p>
      <p class="mid-number number">${clientCard.value}</p>
      <p class="bottom-number number edge">${clientCard.value}</p>
    </li>`;
  }else if(clientCard && clientCard.type === "skip"){

    return `
    <li class="card ${classCard} ${clientCard.color} ${clientCard.id}" id="${clientCard.id}" ${click}>
                <img src="assets/block.svg" alt="carta salto" class="jump-img-top">
                <img src="assets/block.svg" alt="carta salto" class="jump-img">
                <img src="assets/block.svg" alt="carta salto" class="jump-img-bottom">
    </li>`;

  }else if(clientCard && clientCard.type === "reverse"){

    return `
    <li class="card ${classCard} ${clientCard.color} ${clientCard.id}" id="${clientCard.id}" ${click}>
        <img src="assets/reverse.png" alt="carta salto" class="jump-img-top">
        <img src="assets/reverse.png" alt="carta salto" class="jump-img">
        <img src="assets/reverse.png" alt="carta salto" class="jump-img-bottom">
    </li>`;

  }else if(clientCard && clientCard.type === "draw2"){
    return `
    <li class="card ${classCard} ${clientCard.color} ${clientCard.id}" id="${clientCard.id}" ${click}>
                <p class="top-number number edge">+2</p>
                <img src="assets/draw2.svg" alt="carta salto" class="reverse-img">
                <p class="bottom-number number edge">+2</p>
    </li>`
  }else if(clientCard && clientCard.type === "wild4" && !cardOnTable){
    return `
    <li class="card ${classCard} black ${clientCard.id}" id="${clientCard.id}" ${click}>
                <p class="top-number number edge">+4</p>
                <img src="assets/draw4.svg" alt="carta salto" class="reverse-img">
                <p class="bottom-number number edge">+4</p>
    </li>`
  }else if(clientCard && clientCard.type === "wild" && !cardOnTable){
    return `
    <li class="card ${classCard} black ${clientCard.id}" id="${clientCard.id}" ${click}>
                <img src="assets/color.svg" alt="carta salto" class="reverse-img">
    </li>`
  }else if(clientCard && clientCard.type === "wild4" && cardOnTable){
    return `
    <li class="card ${classCard} black ${clientCard.id}" id="${clientCard.id}" ${click}>
                <p class="top-number number edge">+4</p>
                <img src="assets/draw4${gameState.currentColor}.svg" alt="carta salto" class="reverse-img">
                <p class="bottom-number number edge">+4</p>
    </li>`
  }else if(clientCard && clientCard.type === "wild" && cardOnTable){
    return `
    <li class="card ${classCard} black ${clientCard.id}" id="${clientCard.id}" ${click}>
                <img src="assets/color${gameState.currentColor}.svg" alt="carta salto" class="reverse-img">
    </li>`
  }

}

async function resetV4PlayerTable(){
    let rightWindow = document.getElementById("right-window");
    modal.innerHTML = `<div class="modal-content" id="modal-content"></div>`;
    modal.classList.toggle('hidden');
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
                <img src='assets/Uno-Logo-2020.png'></img>
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
    welcomeWindow.style.backgroundColor = "#032546";
    
    
}

async function setV4PlayerTable(){
    startGame();
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
                <img src='assets/Uno-Logo-2020.png'></img>
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
    welcomeWindow.style.backgroundColor = "#032546";
    
    
}