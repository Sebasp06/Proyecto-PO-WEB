let gameState = {};
let gameId = null;
let ws = new WebSocket('ws://localhost:3001/uno');
let index = 0;
let player = []

ws.onopen = () => {
  console.log('Conexión establecida');
  if (gameId) { // Solo si ya tenemos gameId
    ws.send(JSON.stringify({ 
      type: 'subscribe', // Corregido
      gameId: gameId 
    }));
  }
};

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
      gameState.discardPile = gameState.clientCards[index];
      gameState.clientCards.splice(index, 1);
      updateGameUI(gameState);
      break;

    case 'bot_play':
      console.log(`Bot ${msg.player} jugó carta`);
      player = msg.player.split(' '); //['player','2']
      gameState.otherPlayers[player[1] - 2].count --;
      console.log(gameState.otherPlayers[player[1] - 2].count);
      gameState.discardPile = msg.card;
      
      updateGameUI(gameState);

      break;

    case 'client_draw_from_deck':
      console.log('Jugador humano robó carta');
      gameState.clientCards.push(msg.card);
      updateGameUI(gameState);
      break;

    case 'bot_draw_from_deck':
      console.log(`Bot ${msg.player} robó carta`);
      player = msg.player.split(' '); //['player','2']
      gameState.otherPlayers[player[1] - 2].count ++;
      updateGameUI(gameState);
      break;

    case 'draw_penalty':
      console.log(`Penalización de ${msg.amount}`);
      console.log(msg.affectedPlayer);
      
      if(msg.affectedPlayer !== 0){
        gameState.otherPlayers[msg.affectedPlayer - 1].count += msg.amount;
        
      }
      updateGameUI(gameState);
      break;

    case 'uno_penalty':
      console.log(`Penalización de ${msg.amount}`);
      console.log(msg.affectedPlayer);
      
      if(msg.affectedPlayer !== 0){
        gameState.otherPlayers[msg.affectedPlayer - 1].count += msg.amount;
        
      }
      updateGameUI(gameState);
      console.log('Penalización por no decir UNO');
      break;

    case 'uno_warning':
      console.log('Advertencia: decir UNO');
      //Agregar un modal que indique que debes presionar uno
      break;

    case 'client_uno':
      console.log('Jugador humano dijo UNO');
      break;

    case 'bot_uno':
      console.log(`Bot ${msg.player} dijo UNO`);
      break;

    case 'round_score':
      console.log('Fin de ronda', msg.winner, msg.roundScore);
      //modal con mensaje de finalizado, que devuelva a la pagina de inicio
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
    playerDeck.innerHTML = state.clientCards.map(card => displayCard(card, true)).join('');
  }

  const tableDeck = document.getElementById('table-deck');
  if (tableDeck) {
    tableDeck.innerHTML = `
    ${displayCard(state.discardPile,false)}
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
    
    clientContainer += displayCard(clientCards[i],true);

  }
  allCards.push(clientContainer);
  for(let i = 0; i < 3; i ++){
    const rivalCards = currentState.otherPlayers[i];
    
    for(let j = 0; j < 7; j ++){
      rivalContainer += displayCard(rivalCards[j],false)
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

async function playCard(element){

  const clientCards = document.getElementById("player-deck-0");
  const listOfElements = Array.from(clientCards.children);
  index = listOfElements.indexOf(element);  
  console.log();

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
        chosenColor: null
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al jugar carta");
    }
    
    

    //se elimine la carta seleccionada

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

function displayCard(clientCard,isHuman){

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
  }else if(clientCard && clientCard.type === "wild4"){
    return `
    <li class="card ${classCard} black ${clientCard.id}" id="${clientCard.id}" ${click}>
                <p class="top-number number edge">+4</p>
                <img src="assets/draw4.svg" alt="carta salto" class="reverse-img">
                <p class="bottom-number number edge">+4</p>
    </li>`
  }else if(clientCard && clientCard.type === "wild"){
    return `
    <li class="card ${classCard} black ${clientCard.id}" id="${clientCard.id}" ${click}">
                <img src="assets/color.svg" alt="carta salto" class="reverse-img">
    </li>`
  }

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