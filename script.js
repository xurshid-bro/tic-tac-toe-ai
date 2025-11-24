const board = document.getElementById('board');
const cells = [];
const message = document.getElementById('message');
const playerScoreEl = document.getElementById('playerScore');
const aiScoreEl = document.getElementById('aiScore');
const tieEl = document.getElementById('tieScore');

let currentPlayer = 'X';
let gameBoard = Array(9).fill(null);
let gameActive = true;
let difficulty = 'impossible'; // easy | medium | impossible
let playerScore = 0, aiScore = 0, tieScore = 0;

function createBoard() {
  board.innerHTML = '';
  cells.length = 0;
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || gameBoard[index]) return;
  gameBoard[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  if (checkWin(currentPlayer)) {
    endGame(false);
  } else if (gameBoard.every(cell => cell)) {
    endGame(true);
  } else {
    currentPlayer = 'O';
    message.textContent = "AI is thinking...";
    setTimeout(aiMove, 600);
  }
}

function aiMove() {
  let move;
  if (difficulty === 'easy') move = easyMove();
  else if (difficulty === 'medium') move = (Math.random() < 0.7) ? minimaxMove() : easyMove();
  else move = minimaxMove();

  gameBoard[move] = 'O';
  cells[move].textContent = 'O';
  
  if (checkWin('O')) {
    endGame(false);
  } else if (gameBoard.every(cell => cell)) {
    endGame(true);
  } else {
    currentPlayer = 'X';
    message.textContent = "Your turn";
  }
}

function minimaxMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!gameBoard[i]) {
      gameBoard[i] = 'O';
      let score = minimax(gameBoard, 0, false);
      gameBoard[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  const result = checkWinner();
  if (result !== null) {
    return result === 'O' ? 10 - depth : result === 'X' ? depth - 10 : 0;
  }

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function easyMove() {
  const empty = gameBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function checkWin(player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(combo => combo.every(i => gameBoard[i] === player));
}

function checkWinner() {
  if (checkWin('O')) return 'O';
  if (checkWin('X')) return 'X';
  if (gameBoard.every(cell => cell)) return 'tie';
  return null;
}

function endGame(tie) {
  gameActive = false;
  if (tie) {
    message.textContent = "It's a Tie!";
    tieScore++;
    tieEl.textContent = tieScore;
  } else if (currentPlayer === 'X') {
    message.textContent = "🎉 You Win! (Lucky!)";
    playerScore++;
    playerScoreEl.textContent = playerScore;
  } else {
    message.textContent = "AI Wins! Try again";
    aiScore++;
    aiScoreEl.textContent = aiScore;
  }
}

function resetGame() {
  gameBoard = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  message.textContent = "Your turn (X)";
  createBoard();
}

document.getElementById('easyBtn').onclick = () => { difficulty='easy'; resetGame(); document.querySelectorAll('button')[0].classList.add('active'); document.querySelectorAll('button')[1].classList.remove('active'); document.querySelectorAll('button')[2].classList.remove('active'); }
document.getElementById('mediumBtn').onclick = () => { difficulty='medium'; resetGame(); ... }
document.getElementById('impossibleBtn').onclick = () => { difficulty='impossible'; resetGame(); ... }
document.getElementById('resetBtn').onclick = resetGame;

createBoard();
message.textContent = "Your turn (X)";
