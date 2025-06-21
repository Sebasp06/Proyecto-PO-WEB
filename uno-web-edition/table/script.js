let deck = [];
let discardPile = [];
const colors = ['red','green','blue','yellow'];
const specialCards = ['jump','reverse','draw2'];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function initializeDeck(){
    

    for(let color = 0; color < 4; color ++){
        const card = {
            id: colors[color] + '-0',
            color: colors[color],
            type: 'number',
            value: 0
    
        };
        deck.push(card);
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
}

function dealCards(){
    let playerDeck = document.getElementById('player-deck');
    playerDeck.innerHTML = ``;

    for (let numberOfCards = 0; numberOfCards < 7; numberOfCards++) {
        let index = getRandomInt(deck.length); 
        const card = deck[index];
    
        if (card && card.value !== undefined) {
            const cardColor = card.color;
            const cardID = card.id;
            const cardNumber = card.value;
    
            playerDeck.innerHTML += `
            <li class="card ${cardColor} ${cardID}">
                <p class="top-number number edge">${cardNumber}</p>
                <p class="mid-number number">${cardNumber}</p>
                <p class="bottom-number number edge">${cardNumber}</p>
            </li>`;
    
            deck.splice(index, 1); 
        } else {
            console.warn("Carta no válida en posición:", index, card);
        }
    }
}


initializeDeck();
dealCards();