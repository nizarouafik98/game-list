// Initialisation du canvas et du contexte
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Boutons de contrôle
var startBtn = document.getElementById("start-btn");
var pauseBtn = document.getElementById("pause-btn");
var restartBtn = document.getElementById("restart-btn");

var animationId;
var gameRunning = false;
var isPausedForAd = false;

// --- GESTION DES PUBLICITÉS ET REDÉMARRAGE ---
function triggerAd() {
    // 1. On fige immédiatement le moteur de jeu
    gameRunning = false;
    isPausedForAd = true;
    cancelAnimationFrame(animationId);

    console.log("Appel publicitaire Google H5...");

    // Appel au SDK Google
    adBreak({
        type: 'next',
        name: 'ping-pong-restart',
        beforeAd: () => {
            console.log("Publicité en cours de lecture...");
        },
        afterAd: () => {
            // 2. Une fois la pub finie, on recharge proprement
            isPausedForAd = false;
            location.reload();
        }
    });

    // --- SÉCURITÉ TEST LOCAL ---
    // Si tu es en localhost, Google ne répondra pas. On force le reload après 400ms.
    setTimeout(() => {
        if (isPausedForAd) {
            console.warn("Mode Test : Redémarrage forcé sans pub.");
            location.reload();
        }
    }, 400);
}

// --- ÉVÉNEMENTS ---
startBtn.addEventListener("click", function () {
    if (!gameRunning && !isPausedForAd) {
        gameRunning = true;
        loop();
    }
});

pauseBtn.addEventListener("click", function () {
    gameRunning = false;
    cancelAnimationFrame(animationId);
});

restartBtn.addEventListener("click", triggerAd);

// --- PROPRIÉTÉS DU JEU ---
var ballRadius = 10;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballSpeedX = 5;
var ballSpeedY = 5;

var paddleHeight = 80;
var paddleWidth = 10;
var leftPaddleY = canvas.height / 2 - paddleHeight / 2;
var rightPaddleY = canvas.height / 2 - paddleHeight / 2;
var paddleSpeed = 10;

var leftPlayerScore = 0;
var rightPlayerScore = 0;
var maxScore = 5; // Score pour gagner

// Contrôles clavier
var upPressed = false, downPressed = false, wPressed = false, sPressed = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") upPressed = true;
    if (e.key === "ArrowDown") downPressed = true;
    if (e.key === "w") wPressed = true;
    if (e.key === "s") sPressed = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") upPressed = false;
    if (e.key === "ArrowDown") downPressed = false;
    if (e.key === "w") wPressed = false;
    if (e.key === "s") sPressed = false;
});

// --- LOGIQUE DE JEU ---
function update() {
    if (!gameRunning) return;

    // Mouvement des raquettes
    if (upPressed && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
    if (downPressed && rightPaddleY + paddleHeight < canvas.height) rightPaddleY += paddleSpeed;
    if (wPressed && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
    if (sPressed && leftPaddleY + paddleHeight < canvas.height) leftPaddleY += paddleSpeed;

    // Mouvement balle
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collision murs (Haut/Bas)
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) ballSpeedY = -ballSpeedY;

    // Collision Raquettes
    if (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) ballSpeedX = Math.abs(ballSpeedX);
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) ballSpeedX = -Math.abs(ballSpeedX);

    // Points
    if (ballX < 0) { rightPlayerScore++; resetBall(); }
    else if (ballX > canvas.width) { leftPlayerScore++; resetBall(); }

    // Condition de Victoire
    if (leftPlayerScore >= maxScore) playerWin("Joueur Gauche");
    else if (rightPlayerScore >= maxScore) playerWin("Joueur Droite");
}

function playerWin(player) {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    $("#message").text("Félicitations ! Victoire du " + player);
    $("#message-modal").modal("show");
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = Math.random() * 10 - 5;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFF";

    // Ligne pointillée centrale
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.stroke();

    // Dessin Ball et Raquettes
    ctx.setLineDash([]); // Reset ligne continue
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Scores
    ctx.font = "30px Arial";
    ctx.fillText(leftPlayerScore, canvas.width / 4, 50);
    ctx.fillText(rightPlayerScore, (canvas.width / 4) * 3, 50);
}

function loop() {
    if (gameRunning) {
        update();
        draw();
        animationId = requestAnimationFrame(loop);
    }
}

// Action du bouton Fermer du Modal
$("#message-modal-close").on("click", triggerAd);

// Premier rendu au chargement
draw();