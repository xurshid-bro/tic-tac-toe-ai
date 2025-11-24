const boardEl = document.getElementById('board');
const messageEl = document.getElementById('message');
const playerScoreEl = document.getElementById('playerScore');
const aiScoreEl = document.getElementById('aiScore');
const tieScoreEl = document.getElementById('tieScore');

let gameBoard = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let difficulty = 'impossible';
let playerScore = 0, aiScore = 0, tieScore = 0;
let cells = [];

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  boardEl.innerHTML = '';
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    boardEl.appendChild(cell);
    cells.push(cell);
  }
}

function handleCellClick(e) {
  const index = parseInt(e.target.dataset.index);
  if (!gameActive || gameBoard[index]) return;

  gameBoard[index] = 'X';
  e.target.textContent = 'X';
  e.target.classList.add('x');

  const result = getGameResult();
  if (result) {
    endGame(result);
    return;
  }

  currentPlayer = 'O';
  messageEl.textContent = 'AI o\'ylayapti...';
  setTimeout(aiTurn, 500 + Math.random() * 500);
}

function aiTurn() {
  let moveIndex;
  if (difficulty === 'easy') {
    moveIndex = getRandomMove();
  } else if (difficulty === 'medium') {
    moveIndex = Math.random() < 0.5 ? minimaxMove() : getRandomMove();
  } else {
    moveIndex = minimaxMove();
  }

  gameBoard[moveIndex] = 'O';
  cells[moveIndex].textContent = 'O';
  cells[moveIndex].classList.add('o');

  const result = getGameResult();
  if (result) {
    endGame(result);
  } else {
    currentPlayer = 'X';
    messageEl.textContent = "Sizning navbatingiz (X)";
  }
}

function minimaxMove() {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === null) {
      gameBoard[i] = 'O';
      const score = minimax(gameBoard, 0, false);
      gameBoard[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function minimax(newBoard, depth, isMaximizing) {
  const result = getGameResult(newBoard);
  if (result === 'O') return 10 - depth;
  if (result === 'X') return depth - 10;
  if (result === 'tie') return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === null) {
        newBoard[i] = 'O';
        const evalScore = minimax(newBoard, depth + 1, false);
        newBoard[i] = null;
        maxEval = Math.max(maxEval, evalScore);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === null) {
        newBoard[i] = 'X';
        const evalScore = minimax(newBoard, depth + 1, true);
        newBoard[i] = null;
        minEval = Math.min(minEval, evalScore);
      }
    }
    return minEval;
  }
}

function getRandomMove() {
  const emptyCells = gameBoard.map((cell, index) => cell === null ? index : null).filter(v => v !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getGameResult(board = gameBoard) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(cell => cell !== null)) return 'tie';
  return null;
}

function endGame(result) {
  gameActive = false;
  if (result === 'X') {
    messageEl.textContent = '🎉 Siz yutdingiz!';
    playerScore++;
    playerScoreEl.textContent = playerScore;
  } else if (result === 'O') {
    messageEl.textContent = '🤖 AI yutdi!';
    aiScore++;
    aiScoreEl.textContent = aiScore;
  } else {
    messageEl.textContent = 'Durrang!';
    tieScore++;
    tieScoreEl.textContent = tieScore;
  }
}

function resetGame() {
  gameBoard = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  messageEl.textContent = "Sizning navbatingiz (X)";
  createBoard();
}

function setDifficulty(newDiff) {
  difficulty = newDiff;
  document.querySelectorAll('.controls button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(newDiff + 'Btn').classList.add('active');
  resetGame();
}

// Event listeners
document.getElementById('easyBtn').addEventListener('click', () => setDifficulty('easy'));
document.getElementById('mediumBtn').addEventListener('click', () => setDifficulty('medium'));
document.getElementById('impossibleBtn').addEventListener('click', () => setDifficulty('impossible'));
document.getElementById('resetBtn').addEventListener('click', resetGame);

// Initialize
createBoard();
messageEl.textContent = "Sizning navbatingiz (X)";
