document.getElementById("welcome-window").addEventListener('click',(e) =>{
    let rightWindow = document.getElementById("right-window");
    rightWindow.innerHTML = 
    `
    <div id="gaming-mode" class="selection-window">
        <h2>Modo de juego</h2>
        <div id="gaming-mode-selection" class="selection-card-container">
            <div id="single-player" class="selection-card">
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
