

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
    /*
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
    */
}


function gamingModeSelection() {
    deck = [];
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
    <div id="gaming-mode" class="selection-window">
        <h2>Modo de juego</h2>
        <div id="gaming-mode-selection" class="selection-card-container">
            <div id="single-player" class="selection-card" onclick="startGame()">
                <img src="assets/singleplayericon.svg" alt="Logo singleplayer">
                <h3>Single player</h3>
                <p>Juega local</p>
            </div>
            <div id="multi-player" class="selection-card" onclick="multiplayerSelection()">
                <img src="assets/multiplayericon.svg" alt="logo multiplayer">
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
                <img src="assets/singleplayericon.svg" alt="Logo singleplayer">
                <h3>Juega contra:</h3>
                <p>2 jugadores</p>
            </div>
            <div id="multi-player" class="selection-card" onclick="setV4PlayerTable()">
                <img src="assets/multiplayericon.svg" alt="logo multiplayer">
                <h3>Juega contra:</h3>
                <p>3 jugadores</p>
            </div>
        </div>
    </div>
    `;
}

function returnHome() {
    deck = [];
    let rightWindow = document.getElementById("right-window");
    modal.innerHTML = `<div class="modal-content" id="modal-content"></div>`;
    unoScreamContent.classList.add('hidden');
    unoScreamModal.classList.add('hidden');
    modal.classList.add('hidden');
    rightWindow.innerHTML = 
    `
            <div id="welcome-window" class="welcome-window">
                <strong>BIENVENIDO A</strong>
                <img src="assets/UNO-Logopng.png" alt="Logo UNO" class="start-img" onclick="setV4PlayerTable()"></img>
                <p class="press">Presiona para continuar</p>
                <p class="slogan">¡El clásico que nunca pasa de moda!</p>
                <p class="team">Grupo 2: Sebastián Pérez, Lisa García y Ana García</p>
            </div>
    `;
}