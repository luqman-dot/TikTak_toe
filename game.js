const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const newGameButton = document.getElementById('new-game');
const playerXWinsDisplay = document.getElementById('playerX-wins');
const playerOWinsDisplay = document.getElementById('playerO-wins');
const tiesDisplay = document.getElementById('ties');

const PLAYER_X = 'X';
const PLAYER_O = 'O';

let currentPlayer = PLAYER_X;
let gameBoard = Array(9).fill(null);
let playerXWins = 0;
let playerOWins = 0;
let ties = 0;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
newGameButton.addEventListener('click', resetBoard);

function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (!gameBoard[index] && !checkWinner(gameBoard)) {
        gameBoard[index] = currentPlayer;
        e.target.textContent = currentPlayer;

        if (checkWinner(gameBoard)) {
            updateScore(currentPlayer);
            alert(`${currentPlayer} wins!`);
            resetBoard();
        } else if (gameBoard.every(cell => cell)) {
            ties++;
            updateScore();
            alert("It's a tie!");
            resetBoard();
        } else {
            currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
            if (currentPlayer === PLAYER_O) {
                aiMove();
            }
        }
    }
}

function resetBoard() {
    gameBoard.fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = PLAYER_X;
}

function checkWinner(board) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });
}

function updateScore(winner = null) {
    if (winner === PLAYER_X) {
        playerXWins++;
        playerXWinsDisplay.textContent = playerXWins;
    } else if (winner === PLAYER_O) {
        playerOWins++;
        playerOWinsDisplay.textContent = playerOWins;
    } else {
        tiesDisplay.textContent = ties;
    }
}

function aiMove() {
    const bestMove = findBestMove(gameBoard, PLAYER_O);
    if (bestMove !== -1) {
        gameBoard[bestMove] = PLAYER_O;
        cells[bestMove].textContent = PLAYER_O;

        if (checkWinner(gameBoard)) {
            updateScore(PLAYER_O);
            alert(`${PLAYER_O} wins!`);
            resetBoard();
        } else if (gameBoard.every(cell => cell)) {
            ties++;
            updateScore();
            alert("It's a tie!");
            resetBoard();
        } else {
            currentPlayer = PLAYER_X;
        }
    }
}

function findBestMove(board, player) {
    const opponent = player === PLAYER_O ? PLAYER_X : PLAYER_O;
    if (checkWinner(board)) return -1;

    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = player;
            let score = minimax(board, 0, false, player, opponent, -Infinity, Infinity);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing, player, opponent, alpha, beta) {
    if (checkWinner(board)) return isMaximizing ? -1 : 1;
    if (board.every(cell => cell)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = player;
                let score = minimax(board, depth + 1, false, player, opponent, alpha, beta);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = opponent;
                let score = minimax(board, depth + 1, true, player, opponent, alpha, beta);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    }
}
