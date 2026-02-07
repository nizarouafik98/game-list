let board = [];
let rows = 8;
let columns = 8;
let minesCount = 10;
let minesLocation = [];
let tilesClicked = 0;
let flagEnabled = false;
let gameOver = false;

window.onload = function () {
    startGame();
};

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r + "-" + c;
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

// --- LOGIQUE DES PUBLICITÉS ---
function triggerAd(status) {
    gameOver = true; // Bloque les interactions pendant la pub

    adBreak({
        type: 'next',
        name: status === 'win' ? 'win-game' : 'game-over',
        beforeAd: () => { console.log("Début de la pub"); },
        afterAd: () => {
            if(confirm(status === 'win' ? "Gagné ! Rejouer ?" : "BOOM ! Rejouer ?")) {
                location.reload();
            }
        }
    });

    // Simulateur pour test local (localhost)
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        setTimeout(() => {
            if(confirm(status === 'win' ? "Gagné ! Rejouer ?" : "BOOM ! Rejouer ?")) {
                location.reload();
            }
        }, 300);
    }
}

function setFlag() {
    flagEnabled = !flagEnabled;
    this.style.backgroundColor = flagEnabled ? "darkgray" : "lightgray";
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) return;

    let tile = this;
    if (flagEnabled) {
        tile.innerText = tile.innerText == "" ? "🚩" : "";
        return;
    }

    if (minesLocation.includes(tile.id)) {
        revealMines();
        triggerAd('lose'); // Appel pub sur défaite
        return;
    }

    let coords = tile.id.split("-");
    checkMine(parseInt(coords[0]), parseInt(coords[1]));
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) return;
    if (board[r][c].classList.contains("tile-clicked")) return;

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;
    for(let i=-1; i<=1; i++) {
        for(let j=-1; j<=1; j++) {
            minesFound += checkTile(r + i, c + j);
        }
    }

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound);
    } else {
        for(let i=-1; i<=1; i++) {
            for(let j=-1; j<=1; j++) {
                checkMine(r + i, c + j);
            }
        }
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        triggerAd('win'); // Appel pub sur victoire
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) return 0;
    return minesLocation.includes(r + "-" + c) ? 1 : 0;
}