let deck = [];
let discardPile = [];
const colors = ['red','green','blue','yellow'];
const specialCards = ['jump','reverse','draw2'];

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
    console.log(deck);
    
}

function dealCards(){
    let playerDeck = document.getElementById('player-deck');
    
}

initializeDeck();