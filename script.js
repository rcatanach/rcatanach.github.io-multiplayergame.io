let deck = [];
let discardPile = [];
let playerHand = [];
let opponentHand = [];
let currentPlayer = 0; // 0 for player, 1 for opponent

document.addEventListener('DOMContentLoaded', function() {
    const deckElement = document.getElementById('deck');
    const discardPileElement = document.getElementById('discard-pile');
    const playerHandElement = document.getElementById('player-hand');
    const opponentHandElement = document.getElementById('opponent-hand');

    function initializeDeck() {
        const colors = ['red', 'blue', 'green', 'yellow'];
        const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw-two'];
        const wilds = ['wild', 'wild-draw-four'];
        
        let deck = [];
        
        for (let color of colors) {
            for (let value of values) {
                deck.push({ color, value });
            }
        }
        
        for (let wild of wilds) {
            deck.push({ color: 'wild', value: wild });
        }
        
        return deck;
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function dealCards() {
        playerHand = deck.splice(0, 7);
        opponentHand = deck.splice(0, 7);
    }

    function displayGameState() {
        // Clear existing card elements
        playerHandElement.innerHTML = '';
        opponentHandElement.innerHTML = '';
        discardPileElement.innerHTML = '';

        // Display player's hand
        playerHand.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.textContent = `${card.color}-${card.value}`;
            cardElement.addEventListener('click', () => playCard(index));
            playerHandElement.appendChild(cardElement);
        });
        
        // Display opponent's hand
        opponentHand.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.textContent = 'Card';
            opponentHandElement.appendChild(cardElement);
        });
        
        // Display discard pile
        discardPile.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.textContent = `${card.color}-${card.value}`;
            discardPileElement.appendChild(cardElement);
        });
    }

    function drawCard() {
        const card = deck.pop();
        playerHand.push(card);
    }

    function playCard(index) {
        const card = playerHand.splice(index, 1)[0];
        discardPile.push(card);
        
        if (playerHand.length === 0) {
            alert('You win!');
        }
        
        currentPlayer = 1;
        
        opponentTurn();
    }

    function opponentTurn() {
        const card = deck.pop();
        opponentHand.push(card);
        
        if (opponentHand.length === 0) {
            alert('Opponent wins!');
        }
        
        currentPlayer = 0;
    }

    function initGame() {
        deck = initializeDeck();
        shuffleDeck();
        dealCards();
        displayGameState();
    }

    initGame();
});
