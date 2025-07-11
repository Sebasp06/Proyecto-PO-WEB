let gameState = {};
let gameId = null;

async function startGame() {
  try {
    const response = await fetch('http://localhost:3001/start', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Error al iniciar la partida');
    }

    gameState = await response.json();
    gameId = gameState.gameId;

    console.log('Partida iniciada:', gameState);
    gameId = gameState.gameId;
    console.log('ID del juego:', gameId);

    renderGame(gameState);

  } catch (error) {
    console.error(error);
  }
}

function renderGame(currentState) {

    console.log("Renderizando juego con el estado:", currentState);

}