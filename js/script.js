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

  return { cells, fillCell, isCellTaken }

})();

const Player = function (name, symbol) {
  return { name, symbol }
}

const Game = (() => {
  let moves = 0;
  let playerX = Player("", "X");
  let playerO = Player("", "O");
  let currentPlayer = playerX;

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
    } else if ((Board.cells[4] == Board.cells[0] && Board.cells[4] == Board.cells[8]) || (Board.cells[4] == Board.cells[2] && Board.cells[4] == Board.cells[6])) {
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

  return { updateState, currentPlayer, isWin, isDraw, playerSwap, start }
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

  const clickHandler = function () {
    const cellNumber = parseInt(this.id.replace('cell-', ''));

    if (Board.isCellTaken(cellNumber)) {
      showMessage('Cell is already taken', 'danger');
    } else {
      Game.updateState(cellNumber);
      updateCell(this.id, Game.currentPlayer.symbol);
      if (Game.isWin()) {
        showMessage((Game.currentPlayer.name || Game.currentPlayer.symbol) + ' Wins', 'success');
        removeClickListenerToCells();
      } else if (Game.isDraw()) {
        showMessage('Draw', 'success');
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
          <p class="symbol"> ${firstPlayer.symbol} </p>
        </div>

        <span> VS </span>

        <div class="name">
          <p>${secondPlayer.name}</p>
          <p class="symbol"> ${secondPlayer.symbol} </p>
        </div>
      </div>
    `;

  }

  return { showMessage, addClickListenerToCells, replaceFormWithNames }
})();

// ------------------------
// Tic-Tac-Toe
// ------------------------

function main() {
  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener('click', () => {
    window.location.reload();
  });
}

main()
