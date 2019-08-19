// ------------------------
// LOGIC
// ------------------------

const Board = (() => {
  let cells = new Array(9).fill(" ");

  // fill the cell
  const fillCell = (cellNumber, cellSymbol) => {
    cells[cellNumber] = cellSymbol;
  }

  // check for cell availability
  const isCellTaken = (cellNumber) => {
    return cells[cellNumber] != " ";
  }

  return {cells, fillCell, isCellTaken}

})();

const Player = function(name, symbol) {

  return {name, symbol}
}

const Game = (() => {
  let moves = 0;
  const playerX = Player("Darshan", "X");
  const playerO = Player("Ebeid", "O");
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
  return {updateState, currentPlayer, isWin, isDraw, playerSwap}
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
    window.setTimeout(()=>messageBox.style.display = "none", 4000,);
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
      // Board.fillCell(cellNumber, 'X');
      Game.updateState(cellNumber);
      updateCell(this.id, Game.currentPlayer.symbol);
      if (Game.isWin()) {
        showMessage(Game.currentPlayer.name + ' Wins', 'success')
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

  return {showMessage, addClickListenerToCells}
})();

// ------------------------
// Tic-Tac-Toe
// ------------------------

function main() {
  DOMController.addClickListenerToCells();
}

main()