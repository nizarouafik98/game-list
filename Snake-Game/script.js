/**
 * TALHA SNAKE GAME - VERSION FINALE PRO
 */

const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Récupération du High Score
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// --- FONCTIONS DE JEU ---

const updateFoodPosition = () => {
    // Position aléatoire sur une grille de 1 à 30
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    // Optionnel : Déclencher une pub ici avant le reset
    showInterstitialAd();

    alert(`Game Over ! Votre score : ${score}\nAppuyez sur OK pour rejouer.`);
    location.reload();
};

const changeDirection = e => {
    // Vérification pour empêcher le retournement à 180°
    const key = e.key;
    if (key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// --- LOGIQUE PRINCIPALE ---

const initGame = () => {
    if (gameOver) return handleGameOver();

    // Génération HTML : La nourriture
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Vérification si le serpent mange la nourriture
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Ajout d'un segment
        score++;

        // Mise à jour des scores
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Mise à jour de la position du corps (on décale chaque segment)
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    // La tête avance selon la direction actuelle
    snakeX += velocityX;
    snakeY += velocityY;
    snakeBody[0] = [snakeX, snakeY];

    // Vérification collision murs (Sortie de grille)
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    // Rendu du corps du serpent et détection de collision interne
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // Si la tête touche une partie du corps (i > 0)
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
};

// --- GESTION PUBLICITAIRE (Google Ads) ---
const showInterstitialAd = () => {
    console.log("Appel d'une publicité interstitielle AdSense...");
    // Ici, vous pouvez insérer le code d'AdSense pour les jeux H5
    if (typeof adBreak === 'function') {
        adBreak({ type: 'next', name: 'restart-game' });
    }
};

// --- ÉCOUTEURS D'ÉVÉNEMENTS ---

// Support tactiles (icônes fléchées)
controls.forEach(button => {
    button.addEventListener("click", () => changeDirection({ key: button.dataset.key }));
});

// Initialisation
updateFoodPosition();
setIntervalId = setInterval(initGame, 125); // 125ms = Équilibre parfait entre vitesse et jouabilité
document.addEventListener("keydown", changeDirection);