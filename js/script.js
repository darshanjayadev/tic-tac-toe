

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

const DisplayController = (() => {
  const updateCell = (cellId, playerSymbol) => {
    const cell = document.getElementById(cellId);
    cell.innerHTML = playerSymbol;
  }

  const showMessage = (message, className) => {
    const messageBox = document.getElementById("message");
    messageBox.style.display = "block";
    messageBox.className = className;
    messageBox.innerHTML = message;
  }

  return {updateCell, showMessage}
})();

// const Game = (() => {
//   // update cells from input
//   Board.fillCell()
//   // swap current player
//   // checks for winning
//   // checks for draw
// })();


let allCells = document.querySelectorAll(".cell");

console.log(allCells)

allCells.forEach(function(cell) {
  cell.addEventListener("click", function() {

    const cellNumber = parseInt(this.id.replace('cell-', ''));

    if (Board.isCellTaken(cellNumber) == true){
      DisplayController.showMessage('Cell is already taken', 'danger');
    }else {
      Board.fillCell(cellNumber, 'X');
      DisplayController.updateCell(this.id, 'X');
    }

  });
});





