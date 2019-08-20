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

  // const resetBoard = () => {
  //   cells = new Array(9).fill(" ");
  // }

  return {cells, fillCell, isCellTaken}

})();

const Player = function(name, symbol) {
  return {name, symbol}
}

const Game = (() => {
  let moves = 0;
  let playerX = Player("", "X");
  let playerO = Player("", "O");
  let currentPlayer = playerX;

  // swap current player
  const playerSwap = function() {
    if(this.currentPlayer == playerX) {
      this.currentPlayer = playerO;
    } else {
      this.currentPlayer = playerX;
    }
    console.log(this.currentPlayer)
  }

  // checks for winning
  const isWin = function() {
    return checkHorizontal() || checkVertical() || checkDiagonal();
  }
  const checkHorizontal = function() {
    for(let i = 0; i< Board.cells.length; i+=3) {
      if (Board.cells[i] == Board.cells[i+1] && Board.cells[i] == Board.cells[i+2] && Board.cells[i] != " ") {
        return true;
      }
    }
    return false;
  }
  const checkVertical = function() {
    for(let i = 0; i < 3; i++) {
      if (Board.cells[i] == Board.cells[i+3] && Board.cells[i] == Board.cells[i+6] && Board.cells[i] != " ") {
        return true;
      }
    }
    return false;
  }
  const checkDiagonal = function() {
    if (Board.cells[4] == " ") {
      return false
    } else if ((Board.cells[4] == Board.cells[0] && Board.cells[4] == Board.cells[8]) || (Board.cells[4] == Board.cells[2] && Board.cells[4] == Board.cells[6])) {
      return true;
    }
    return false;
  }

  // checks for draw
  const isDraw = function() {
    return moves == 9;
  }

  // update cells from input
  const updateState = function(cellNumber) {
    Board.fillCell(cellNumber, this.currentPlayer.symbol);
    moves++;
  }


  const start = function() {
    event.preventDefault();
    DOMController.addClickListenerToCells();

    firstPlayerName = document.getElementById("fplayer").value;
    secondPlayerName = document.getElementById("splayer").value;

    playerX = Player(firstPlayerName, "X");
    playerO = Player(secondPlayerName, "O");
    this.currentPlayer = playerX;

    DOMController.replaceFormWithNames(playerX, playerO);
  }

  return {updateState, currentPlayer, isWin, isDraw, playerSwap, start}
})();


// ------------------------
// DOM
// ------------------------

const DOMController = (() => {
  const updateCell = (cellId, playerSymbol) => {
    const cell = document.getElementById(cellId);
    cell.innerHTML = playerSymbol;
  }

  // const resetCells = () => {
  //   const allCells = document.querySelectorAll(".cell");

  //   allCells.forEach(function(cell) {
  //     cell.innerHTML = " ";
  //   });
  // }

  const showMessage = (message, className) => {
    const messageBox = document.getElementById("message");
    messageBox.style.display = "block";
    messageBox.className = className;
    messageBox.innerHTML = message;
    if(className=="danger"){
      window.setTimeout(()=>messageBox.style.display = "none", 4000);
    }
  }

  const addClickListenerToCells = () => {
    const allCells = document.querySelectorAll(".cell");
    
    console.log(allCells);
    
    allCells.forEach(function(cell) {
      cell.addEventListener("click", clickHandler);
    });
  }

  const clickHandler = function() {
    const cellNumber = parseInt(this.id.replace('cell-', ''));

    if (Board.isCellTaken(cellNumber)){
      showMessage('Cell is already taken', 'danger');
    } else {
      Game.updateState(cellNumber);
      updateCell(this.id, Game.currentPlayer.symbol);
      if (Game.isWin()) {
        showMessage((Game.currentPlayer.name || Game.currentPlayer.symbol) + ' Wins', 'success');
        removeClickListenerToCells();
      } else if (Game.isDraw()) {
        showMessage('Draw', 'success')
      }
      Game.playerSwap();
    }
  }

  const removeClickListenerToCells = () => {
    const allCells = document.querySelectorAll(".cell");
    allCells.forEach(function(cell) {
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

  return {showMessage, addClickListenerToCells, replaceFormWithNames}
})();

// ------------------------
// Tic-Tac-Toe
// ------------------------

function main() {
  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener('click', () => {
    // Board.resetBoard();
    // DOMController.resetCells();
    // DOMController.addClickListenerToCells();
    window.location.reload();
  });
}

main()