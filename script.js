// Define canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define game variables
const paddleWidth = 10;
const paddleHeight = 80; 
const ballSize = 20;
const paddleSpeed = 10;
let ballSpeed = 3.6; 
const maxScore = 21; // because badminton goes to 21
let gravity = 0.1;

let ballPosition = { x: canvas.width / 2, y: canvas.height / 2 };
let ballVelocity = { x: ballSpeed, y: ballSpeed, direction: Math.random() < 0.5 ? -1 : 1 };
let player1Position = { x: 10, y: canvas.height / 2 - paddleHeight / 2 };
let player2Position = { x: canvas.width - 10 - paddleWidth, y: canvas.height / 2 - paddleHeight / 2 };
let player1Score = 0;
let player2Score = 0;
let server = 1;
let gameStarted = false; // Flag to indicate if the game has started

// Load the ball image
const ballImage = new Image();
ballImage.src = 'https://static.vecteezy.com/system/resources/previews/011/572/035/non_2x/badminton-ball-or-shuttlecock-isolated-on-transparent-background-free-png.png';

// Load the court image
const courtImage = new Image();
courtImage.src = 'https://5.imimg.com/data5/QH/OC/IF/SELLER-9872475/yonex-badminton-courts-mat-500x500.jpg';

// Load sound effects
const hitPaddleSound = new Audio('hitPaddleSound.mp3');
const scoreSound = new Audio('scoreSound.mp3');

// Function to reset the game
function resetGame() {
    player1Score = 0;
    player2Score = 0;
    server = 1;
    ballSpeed = 7; // Reset ball speed to its initial value, made faster 
    ballPosition = { x: canvas.width / 2, y: canvas.height / 2 };
    player1Position = { x: 10, y: canvas.height / 2 - paddleHeight / 2 };
    player2Position = { x: canvas.width - 10 - paddleWidth, y: canvas.height / 2 - paddleHeight / 2 };
   
    // Recalculate ballVelocity after updating ballSpeed
    ballVelocity = {
        x: ballVelocity.x !== 0 ? ballSpeed * Math.sign(ballVelocity.x) : ballSpeed,
        y: ballVelocity.y !== 0 ? ballSpeed * Math.sign(ballVelocity.y) : ballSpeed,
        direction: Math.random() < 0.5 ? -1 : 1 
    };

    const endPage = document.getElementById('endPage');
    const startPage = document.getElementById('startPage');
    const gameCanvas = document.getElementById('gameCanvas');
    endPage.style.display = 'none';
    startPage.style.display = 'flex'; // Display the start page
    gameCanvas.style.display = 'none'; // Hide the game canvas
    gameStarted = false; // Reset the gameStarted flag
}



// Function to reset the ball
function resetBall() {
    ballPosition.x = server === 1 ? canvas.width / 4 : (canvas.width / 4) * 3;
    ballPosition.y = canvas.height / 2;
    ballVelocity.direction *= -1;
}

// Function to start the game
function startGame() {
    const startPage = document.getElementById('startPage');
    const gameCanvas = document.getElementById('gameCanvas');
    startPage.style.display = 'none';
    gameCanvas.style.display = 'block';
    gameLoop();
    gameStarted = true; // Set gameStarted to true when the game starts
}
  
  // Function to update the ball's position
  function updateBall() {
    if (!gameStarted) return; // Exit early if the game hasn't started
  
    // Apply gravity
    ballVelocity.y += gravity;
    ballPosition.x += ballVelocity.x;
    ballPosition.y += ballVelocity.y;
  
    // Check if the ball has crossed the net
    const netX = canvas.width / 2;
    const ballCrossedNet = ballPosition.x - ballSize < netX && ballPosition.x + ballSize > netX;
  
    // Check for collisions with paddles
    if (ballPosition.x - ballSize <= player1Position.x + paddleWidth &&
        ballPosition.y >= player1Position.y &&
        ballPosition.y <= player1Position.y + paddleHeight) {
      if (ballCrossedNet && server !== 1) {
        player2Score++;
        server = 2;
        resetBall();
        scoreSound.play();
      }
      ballVelocity.x *= -1;
      hitPaddleSound.play();
    } else if (ballPosition.x + ballSize >= player2Position.x - paddleWidth &&
               ballPosition.y >= player2Position.y &&
               ballPosition.y <= player2Position.y + paddleHeight) {
      if (ballCrossedNet && server !== 2) {
        player1Score++;
        server = 1;
        resetBall();
        scoreSound.play();
      }
      ballVelocity.x *= -1;
      hitPaddleSound.play();
    }
  
    // Check for collisions with top and bottom walls
    if (ballPosition.y - ballSize <= 0 || ballPosition.y + ballSize >= canvas.height) {
      ballVelocity.y *= -1; // Reverse the ball's vertical velocity
    }
  
  
    // Check for ball going out of bounds
    if (ballPosition.x - ballSize < 0) {
      player2Score++;
      server = 2;
      resetBall();
      scoreSound.play();
    } else if (ballPosition.x + ballSize > canvas.width) {
      player1Score++;
      server = 1;
      resetBall();
      scoreSound.play();
    }
  }
  
  // Function to handle keyboard input
  function handleInput(event) {
    if (!gameStarted) return; // Exit early if the game hasn't started
  
    if (event.key === 'w' && player1Position.y > 0) {
      player1Position.y -= paddleSpeed;
    } else if (event.key === 's' && player1Position.y < canvas.height - paddleHeight) {
      player1Position.y += paddleSpeed;
    } else if (event.key === 'ArrowUp' && player2Position.y > 0) {
      player2Position.y -= paddleSpeed;
    } else if (event.key === 'ArrowDown' && player2Position.y < canvas.height - paddleHeight) {
      player2Position.y += paddleSpeed;
    } else if (event.key === 'a' && player1Position.x > 0) {
      player1Position.x -= paddleSpeed;
    } else if (event.key === 'd' && player1Position.x < canvas.width - paddleWidth) {
      player1Position.x += paddleSpeed;
    } else if (event.key === 'ArrowLeft' && player2Position.x > 0) {
      player2Position.x -= paddleSpeed;
    } else if (event.key === 'ArrowRight' && player2Position.x < canvas.width - paddleWidth) {
      player2Position.x += paddleSpeed;
    }
  }
  
  // Function to draw the game
  function drawGame() {
    if (!gameStarted) return; // Exit early if the game hasn't started
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the court background
    ctx.drawImage(courtImage, 0, 0, canvas.width, canvas.height);
  
    // Draw the net
    drawNet();
  
    // Draw the paddles
    drawPaddle(player1Position.x, player1Position.y, true);
    drawPaddle(player2Position.x, player2Position.y, false);
  
    // Draw the ball
    drawBall(ballPosition.x, ballPosition.y);
  
    // Draw the scores
    drawScores();
  
    // Draw the server
    drawServer();
  
    // Check if a player has won
    checkWinCondition();
  
    // Request next animation frame
    requestAnimationFrame(drawGame);
  }

// Function to handle keyboard input
function handleInput(event) {
    if (event.key === 'w' && player1Position.y > 0) {
        player1Position.y -= paddleSpeed;
    } else if (event.key === 's' && player1Position.y < canvas.height - paddleHeight) {
        player1Position.y += paddleSpeed;
    } else if (event.key === 'ArrowUp' && player2Position.y > 0) {
        player2Position.y -= paddleSpeed;
    } else if (event.key === 'ArrowDown' && player2Position.y < canvas.height - paddleHeight) {
        player2Position.y += paddleSpeed;
    } else if (event.key === 'a' && player1Position.x > 0) {
        player1Position.x -= paddleSpeed;
    } else if (event.key === 'd' && player1Position.x < canvas.width - paddleWidth) {
        player1Position.x += paddleSpeed;
    } else if (event.key === 'ArrowLeft' && player2Position.x > 0) {
        player2Position.x -= paddleSpeed;
    } else if (event.key === 'ArrowRight' && player2Position.x < canvas.width - paddleWidth) {
        player2Position.x += paddleSpeed;
    }
}

// Function to draw a paddle
function drawPaddle(x, y, isPlayer1) {
    // Draw a thicker rectangle for the paddle
    ctx.fillStyle = '#000000'; // Set fill color to black
    ctx.fillRect(x, y, paddleWidth, paddleHeight); // Draw a rectangle for the paddle

    // Draw the image for player 2
    if (!isPlayer1) {
        const paddleImage = new Image();
        paddleImage.src = 'https://ih1.redbubble.net/image.3764298929.2281/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg';
        ctx.drawImage(paddleImage, x - 55, y - 10, paddleWidth + 60, paddleHeight + 40);
    } else {
        // Draw the image for player 1
        const paddleImage = new Image();
        paddleImage.src = 'https://ih1.redbubble.net/image.4962363360.0091/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg';
        ctx.drawImage(paddleImage, x - 5, y - 10, paddleWidth + 60, paddleHeight + 40);
    }
}

// Function to draw the ball
function drawBall(x, y) {
    ctx.drawImage(ballImage, x - ballSize, y - ballSize, ballSize * 2, ballSize * 2);
}

// Function to draw the scores
function drawScores() {
    // Draw player 1 score
    ctx.fillStyle = '#FFFFFF'; // Set fill color to white
    ctx.font = 'bold 36px Arial'; // Set font size and type
    ctx.fillText(player1Score, canvas.width / 4, 60); // Draw player 1 score

    // Draw player 2 score
    ctx.fillStyle = '#FFFFFF'; // Set fill color to white
    ctx.font = 'bold 36px Arial'; // Set font size and type
    ctx.fillText(player2Score, (canvas.width / 4) * 3, 60); // Draw player 2 score
}

// Function to draw the server
function drawServer() {
    ctx.fillStyle = '#000000'; // Set fill color to black
    ctx.font = 'bold 20px Arial'; // Set font size and type
    ctx.fillText('Server: Player ' + server, canvas.width / 2 - 70, 60); // Draw server information
}

// Function to draw the net
function drawNet() {
    ctx.beginPath();
    ctx.setLineDash([5, 5]); // Set dash pattern
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.stroke();
}

// Function to draw the game
function drawGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the court background
    ctx.drawImage(courtImage, 0, 0, canvas.width, canvas.height);

    // Draw the net
    drawNet();

    // Draw the paddles
    drawPaddle(player1Position.x, player1Position.y, true);
    drawPaddle(player2Position.x, player2Position.y, false);

    // Draw the ball
    drawBall(ballPosition.x, ballPosition.y);

    // Draw the scores
    drawScores();

    // Draw the server
    drawServer();

    // Check if a player has won
    checkWinCondition();
}

// Function to run the game loop
function gameLoop() {
    if (player1Score === maxScore || player2Score === maxScore) {
        return; // Stop the game loop if the game has ended
    }
    
    updateBall();
    drawGame();
    requestAnimationFrame(gameLoop);
}


// Start the game loop
gameLoop();

// Add event listener for keyboard input
window.addEventListener('keydown', handleInput);

// Function to toggle instructions visibility
function toggleInstructions() {
    var instructions = document.getElementById('instructions');
    instructions.style.display = (instructions.style.display == 'none') ? 'block' : 'none';
}

// Function to create the end page elements
function createEndPage() {
    // Create the endPage div
    const endPage = document.createElement('div');
    endPage.id = 'endPage';
    endPage.classList.add('endPage');

    // Create the winnerMessage div
    const winnerMessage = document.createElement('div');
    winnerMessage.classList.add('winnerMessage');
    endPage.appendChild(winnerMessage);

    // Create the scoreMessage div
    const scoreMessage = document.createElement('div');
    scoreMessage.classList.add('scoreMessage');
    endPage.appendChild(scoreMessage);

    // Create the resetButton button
    const resetButton = document.createElement('button');
    resetButton.classList.add('resetButton');
    resetButton.textContent = 'Play Again';
    resetButton.onclick = resetGame;
    endPage.appendChild(resetButton);

    // Append the endPage div to the body
    document.body.appendChild(endPage);
}

// Function to update the end page content
function updateEndPageContent(winner, score) {
    // Get the endPage div and its child elements
    const endPage = document.getElementById('endPage');
    const winnerMessage = endPage.querySelector('.winnerMessage');
    const scoreMessage = endPage.querySelector('.scoreMessage');

    // Update the winnerMessage and scoreMessage content
    winnerMessage.textContent = `${winner} wins!`;
    scoreMessage.textContent = `Final Score: ${score}`;
}

// Function to display the end page
function displayEndPage(winner, score) {
    // Create the end page elements
    createEndPage();

    // Update the end page content
    updateEndPageContent(winner, score);

    // Display the end page
    const endPage = document.getElementById('endPage');
    endPage.style.display = 'flex';
}

// Function to check if a player has won
function checkWinCondition() {
    if (player1Score === maxScore || player2Score === maxScore) {
        // Get the winner
        const winner = player1Score === maxScore ? 'Player 1' : 'Player 2';

        // Display the end page
        displayEndPage(winner, `${player1Score}-${player2Score}`);

        // Trigger confetti animation when a player wins
        triggerConfetti();

        // Stop the game loop
        cancelAnimationFrame(gameLoop);
    }
}

// Add event listener for start button
document.getElementById('startButton').addEventListener('click', startGame);


