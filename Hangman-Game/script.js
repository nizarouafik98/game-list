const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const button = document.querySelector("#start");
let lastHole;
let timeUp = false;
let score = 0;

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) return randomHole(holes);
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(300, 1000);
    const hole = randomHole(holes);
    hole.classList.add("up");
    setTimeout(() => {
        hole.classList.remove("up");
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    button.style.visibility = "hidden";
    peep();

    // Partie de 10 secondes
    setTimeout(() => {
        timeUp = true;
        button.innerHTML = "Rejouer ?";
        button.style.visibility = "visible";
    }, 10000);
}

function bonk(e) {
    if (!e.isTrusted) return; // Empêche la triche (clics simulés)
    score++;
    this.parentNode.classList.remove("up");
    scoreBoard.textContent = score;
}

moles.forEach((mole) => mole.addEventListener("click", bonk));