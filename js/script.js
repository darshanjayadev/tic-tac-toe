// ------------------------
// LOGIC
// ------------------------

const Board = (() => {
  let cells = new Array(9).fill(" ");

  const fillCell = (cellNumber, cellSymbol) => {
    cells[cellNumber] = cellSymbol;
  }

  const isCellTaken = (cellNumber) => {
    return cells[cellNumber] != " ";
  }

  const resetBoard = () => {
    cells.forEach((element, index) => cells[index] = " ");
  }

  return { cells, fillCell, isCellTaken, resetBoard }

})();

const Player = function (name, symbol, score = 0) {
  const getScore = () => score;
  const increaseScore = () => score++;

  return { name, symbol, getScore, increaseScore }
}

const Game = (() => {
  let moves = 0;
  let playerX = Player("", "X");
  let playerO = Player("", "O");
  let currentPlayer = playerX;

  const getMoves = () => moves;
  const resetMoves = () => moves = 0;

  const playerSwap = () => {
    if (Game.currentPlayer == playerX) {
      Game.currentPlayer = playerO;
    } else {
      Game.currentPlayer = playerX;
    }
  }

  const isWin = () => {
    return checkHorizontal() || checkVertical() || checkDiagonal();
  }

  const checkHorizontal = () => {
    for (let i = 0; i < Board.cells.length; i += 3) {
      if (Board.cells[i] == Board.cells[i + 1] && Board.cells[i] == Board.cells[i + 2] && Board.cells[i] != " ") {
        return true;
      }
    }
    return false;
  }

  const checkVertical = () => {
    for (let i = 0; i < 3; i++) {
      if (Board.cells[i] == Board.cells[i + 3] && Board.cells[i] == Board.cells[i + 6] && Board.cells[i] != " ") {
        return true;
      }
    }
    return false;
  }

  const checkDiagonal = () => {
    if (Board.cells[4] == " ") {
      return false
    } else if ((Board.cells[4] == Board.cells[0] && Board.cells[4] == Board.cells[8]) || 
               (Board.cells[4] == Board.cells[2] && Board.cells[4] == Board.cells[6])) {
      return true;
    }
    return false;
  }

  const isDraw = () => {
    return moves == 9;
  }

  const updateState = (cellNumber) => {
    Board.fillCell(cellNumber, Game.currentPlayer.symbol);
    moves++;
  }

  const start = () => {
    event.preventDefault();
    DOMController.addClickListenerToCells();

    const firstPlayerName = document.getElementById("fplayer").value;
    const secondPlayerName = document.getElementById("splayer").value;

    playerX = Player(firstPlayerName, "X");
    playerO = Player(secondPlayerName, "O");
    Game.currentPlayer = playerX;

    DOMController.replaceFormWithNames(playerX, playerO);
  }

  return { updateState, currentPlayer, isWin, isDraw, playerSwap, start, getMoves, resetMoves }
})();


// ------------------------
// DOM
// ------------------------

const DOMController = (() => {
  const updateCell = (cellId, playerSymbol) => {
    const cell = document.getElementById(cellId);
    cell.innerHTML = playerSymbol;
  }

  const showMessage = (message, className) => {
    const messageBox = document.getElementById("message");
    messageBox.style.display = "block";
    messageBox.className = className;
    messageBox.innerHTML = message;
    if (className == "danger") {
      window.setTimeout(() => messageBox.style.display = "none", 4000);
    }
  }

  const addClickListenerToCells = () => {
    const allCells = document.querySelectorAll(".cell");

    allCells.forEach(function (cell) {
      cell.addEventListener("click", clickHandler);
    });
  }

  const updateScores = () => {
    const scores = document.getElementsByClassName("score");
    if (Game.currentPlayer.symbol == 'X') {
      scores[0].innerHTML = Game.currentPlayer.getScore();
    }else {
      scores[1].innerHTML = Game.currentPlayer.getScore();
    }
  }

  const resetCells = () => {
    const allCells = document.querySelectorAll(".cell");
    allCells.forEach((cell) => cell.innerHTML = " ");
  }

  const clickHandler = function () {
    const cellNumber = parseInt(this.id.replace('cell-', ''));

    if (Board.isCellTaken(cellNumber)) {
      showMessage('Cell is already taken', 'danger');
    } else {
      Game.updateState(cellNumber);
      updateCell(this.id, Game.currentPlayer.symbol);
      if (Game.isWin()) {
        showMessage((Game.currentPlayer.name || Game.currentPlayer.symbol) + ' Wins', 'success');
        Game.currentPlayer.increaseScore();
        Game.resetMoves();
        updateScores();
        removeClickListenerToCells();
      } else if (Game.isDraw()) {
        showMessage('Draw', 'success');
        Game.resetMoves();
        removeClickListenerToCells();
      }
      Game.playerSwap();
    }
  }

  const removeClickListenerToCells = () => {
    const allCells = document.querySelectorAll(".cell");
    allCells.forEach(function (cell) {
      cell.removeEventListener("click", clickHandler);
    });
  }

  const replaceFormWithNames = (firstPlayer, secondPlayer) => {
    const playerNamesForm = document.getElementById("player-names-form");

    playerNamesForm.innerHTML = `
      <div class="names">
        <div class="name">
          <p>${firstPlayer.name}</p>
          <p class="symbol">${firstPlayer.symbol}</p>
          <p class="score">${firstPlayer.getScore()}</p>
        </div>
        <span> VS </span>
        <div class="name">
          <p>${secondPlayer.name}</p>
          <p class="symbol"> ${secondPlayer.symbol} </p>
          <p class="score">${secondPlayer.getScore()}</p>
        </div>
      </div>
    `;

  }

  const hideMessages = () => {
    const messageDiv = document.getElementById("message")
    messageDiv.style.display = "none";
  }

  return { showMessage, addClickListenerToCells, replaceFormWithNames, resetCells, hideMessages }
})();

// ------------------------
// Tic-Tac-Toe
// ------------------------

function main() {
  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener('click', () => {
    Board.resetBoard();
    DOMController.resetCells();
    DOMController.addClickListenerToCells();
    DOMController.hideMessages();
  });
}

main()
