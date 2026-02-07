const boxEls = document.querySelectorAll('.box');
const statusEl = document.querySelector('.status');
const restartBtnEl = document.querySelector('.restartBtn');

// Tes fichiers locaux
const imgX = "X-player.png";
const imgO = "O-player.png";

const winPossibilities = [
    [0,1,2], [3,4,5], [6,7,8], // Lignes
    [0,3,6], [1,4,7], [2,5,8], // Colonnes
    [0,4,8], [2,4,6]           // Diagonales
];

let options = ["","","","","","","","",""];
let currentPlayer = "X";
let running = true;

function init() {
    boxEls.forEach(box => box.addEventListener('click', handleBoxClick));
    restartBtnEl.addEventListener('click', restartGame);
    updateStatus();
}

function handleBoxClick(e) {
    const index = e.target.dataset.index;
    if (options[index] !== "" || !running) return;

    options[index] = currentPlayer;
    // On injecte l'image
    e.target.innerHTML = `<img src="${currentPlayer === 'X' ? imgX : imgO}">`;

    checkWinner();
}

function updateStatus() {
    statusEl.textContent = `Au tour de "${currentPlayer}"`;
    statusEl.style.color = (currentPlayer === "X") ? "#38bdf8" : "#f43f5e";
}

function checkWinner() {
    let won = false;
    for (let i = 0; i < winPossibilities.length; i++) {
        const [a, b, c] = winPossibilities[i];
        if (options[a] && options[a] === options[b] && options[a] === options[c]) {
            won = true;
            [a, b, c].forEach(idx => boxEls[idx].classList.add('win'));
            break;
        }
    }

    if (won) {
        statusEl.textContent = `"${currentPlayer}" a gagné ! 🥳`;
        statusEl.style.color = "#10b981";
        running = false;
    } else if (!options.includes("")) {
        statusEl.textContent = "Match nul ! 🤝";
        statusEl.style.color = "#f59e0b";
        running = false;
    } else {
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
        updateStatus();
    }
}

function restartGame() {
    options = ["","","","","","","","",""];
    currentPlayer = "X";
    running = true;
    updateStatus();
    boxEls.forEach(box => {
        box.innerHTML = "";
        box.classList.remove('win');
    });
}

init();