 // Game Constants and Variables
 let inputDir = { x: 0, y: 0 };
 const foodSound = new Audio('food.mp3');
 const gameOverSound = new Audio('gameover.mp3');
 const moveSound = new Audio('move.mp3');
 const musicSound = new Audio('music.mp3');
 let speed = 5;
 let score = 0;
 let lastPaintTime = 0;
 let snakeArr = [{ x: 13, y: 15 }];
 let food = { x: 6, y: 7 };

 let scoreBox = document.getElementById('scoreBox');
 let HighScoreBox = document.getElementById('HighScoreBox');
 let HighScoreVal = localStorage.getItem("HighScore") ? JSON.parse(localStorage.getItem("HighScore")) : 0;
 HighScoreBox.innerHTML = "High Score: " + HighScoreVal;

 // Start music function
 function startMusic() {
     musicSound.play().catch(error => {
         console.log('Music play failed:', error);
     });
 }

 // Game Functions
 function main(ctime) {
     window.requestAnimationFrame(main);
     if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
         return;
     }
     lastPaintTime = ctime;
     gameEngine();
 }

 function isCollide(sarr) {
     // if you bump into yourself
     for (let i = 1; i < sarr.length; i++) {
         if (sarr[i].x === sarr[0].x && sarr[i].y === sarr[0].y) {
             return true;
         }
     }
     // if you bump into the wall
     if (sarr[0].x >= 18 || sarr[0].x < 0 || sarr[0].y >= 18 || sarr[0].y < 0) {
         return true;
     }
     return false;
 }

 function gameEngine() {
     // Part 1: Updating the snake Array and food
     if (isCollide(snakeArr)) {
         gameOverSound.play();
         musicSound.pause();
         inputDir = { x: 0, y: 0 };
         alert("Game Over, Press any key to Play Again");
         snakeArr = [{ x: 13, y: 15 }];
         musicSound.play();
         score = 0;
     }

     if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
         foodSound.play();
         score += 1;
         if (score > HighScoreVal) {
             HighScoreVal = score;
             localStorage.setItem("HighScore", JSON.stringify(HighScoreVal));
             HighScoreBox.innerHTML = "High Score: " + HighScoreVal;
         }
         scoreBox.innerHTML = "Score: " + score;
         snakeArr.unshift({
             x: snakeArr[0].x + inputDir.x,
             y: snakeArr[0].y + inputDir.y
         });
         let a = 2;
         let b = 16;
         food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
     }

     // Moving the Snake
     for (let i = snakeArr.length - 2; i >= 0; i--) {
         snakeArr[i + 1] = { ...snakeArr[i] };
     }
     snakeArr[0].x += inputDir.x;
     snakeArr[0].y += inputDir.y;

     // Display the snake and Food
     let board = document.getElementById('board');
     board.innerHTML = "";
     snakeArr.forEach((e, index) => {
         let snakeElement = document.createElement('div');
         snakeElement.style.gridRowStart = e.y;
         snakeElement.style.gridColumnStart = e.x;

         if (index === 0) {
             snakeElement.classList.add('head');
         } else {
             snakeElement.classList.add('snake');
         }
         board.appendChild(snakeElement);
     });

     // Display the Food
     let foodElement = document.createElement('div');
     foodElement.style.gridRowStart = food.y;
     foodElement.style.gridColumnStart = food.x;
     foodElement.classList.add('food');
     board.appendChild(foodElement);
 }

 // Main logic starts here
 let startButton = document.getElementById('startButton');
 startButton.addEventListener('click', () => {
     startMusic(); // Attempt to start music on button click
     startButton.style.display = 'none'; // Hide the start button
     window.requestAnimationFrame(main);
 });

 window.addEventListener('keydown', e => {
     moveSound.play();
     switch (e.key) {
         case "ArrowUp":
             inputDir.x = 0;
             inputDir.y = -1;
             break;
         case "ArrowDown":
             inputDir.x = 0;
             inputDir.y = 1;
             break;
         case "ArrowLeft":
             inputDir.x = -1;
             inputDir.y = 0;
             break;
         case "ArrowRight":
             inputDir.x = 1;
             inputDir.y = 0;
             break;
         default:
             break;
     }
 });