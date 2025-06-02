const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let currentPlayer = "X";
let grid = Array(9).fill(null);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
      return grid[a];
    }
  }
  if (!grid.includes(null)) return "Egalité";
  return null;
}

function getPlayerLabel(player) {
  return player === "X" ? "étoile" : "lune";
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (grid[index] || checkWinner()) return;

  grid[index] = currentPlayer;
  e.target.innerHTML = `<img src="${
    currentPlayer === "X" ? "etoile.png" : "lune.png"
  }" alt="${getPlayerLabel(currentPlayer)}" class="symbol">`;

  e.target.classList.add("taken");

  const winner = checkWinner();
  if (!statusText) return;

  if (winner === "Egalité") {
    statusText.textContent = "Match nul !";
    statusText.classList.remove("victory");
    statusText.style.color = "";
  } else if (winner) {
    statusText.textContent = `Joueur ${getPlayerLabel(winner)} a gagné !`;
    statusText.classList.add("victory");
    statusText.style.color = winner === "X" ? "gold" : "lightgray";

    triggerExplosion(winner === "X" ? "gold" : "lightgray");
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `À ${getPlayerLabel(currentPlayer)} de jouer`;
  }
  // Change la classe du curseur selon le joueur
  board.classList.remove("star-cursor", "moon-cursor");
  board.classList.add(currentPlayer === "X" ? "star-cursor" : "moon-cursor");
}

function resetGame() {
  grid = Array(9).fill(null);
  currentPlayer = "X";
  statusText.textContent = "Joueur étoile commence";
  statusText.classList.remove("victory");
  statusText.style.color = "";
  board.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });
  board.classList.remove("moon-cursor");
  board.classList.add("star-cursor"); // car X commence (étoile)
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
}

function triggerExplosion(color) {
  const container = document.getElementById("explosion-container");
  container.innerHTML = "";

  for (let i = 0; i < 25; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.borderBottomColor = color;

    const angle = Math.random() * 2 * Math.PI;
    const distance = 150 + Math.random() * 100;
    const x = Math.cos(angle) * distance + "px";
    const y = Math.sin(angle) * distance + "px";

    particle.style.setProperty("--x", x);
    particle.style.setProperty("--y", y);

    container.appendChild(particle);
  }

  setTimeout(() => {
    container.innerHTML = "";
  }, 3000);
}

resetBtn.addEventListener("click", resetGame);

createBoard();
