const player = function(name, mark) {
    const play = function(index) {
        if(!game.isGameOver()) {
            gameboard.addMark(mark, index);
            game.changePlayer();
        }
    }
    return {name, mark, play}
};

const gameboard = (function() {
    const gameboardArray = [];

    // cache dom
    const board = document.querySelector('.board');
    _populateBoard();
    const cells = board.querySelectorAll('.cell');

    // bind events
    _bindEvents();

    _render();

    function _populateBoard() {
        for(let i=0; i<9; i++) {
            const cell = _createBoardCell();
            cell.setAttribute('data-index', i);
            board.appendChild(cell);
        }
    }

    function _createBoardCell() {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        return cell;
    }

    function _bindEvents() {
        cells.forEach(function(cell, index) {
            cell.addEventListener('click', _handleCellClick);
        });
    }

    function _handleCellClick(event) {
        const targetCell = event.target;
        const index = targetCell.getAttribute('data-index');
        if(_isCellEmpty(index)) {
            const currPlayer = game.getCurrentPlayer();
            currPlayer.play(index);
        }
    }

    function _isCellEmpty(index) {
        if(gameboardArray[index] === undefined) {
            return true;
        }
        return false;
    }

    function _render() {
        cells.forEach(function(cell, index) {
            cell.textContent = gameboardArray[index];
        });
    }

    function addMark(mark, index) {
        gameboardArray[index] = mark;
        _checkWin();
        _render();
    }

    function _checkWin() {
        const rowsWin = _checkRowsWin();
        const columnsWin = _checkColumnsWin();
        if(rowsWin || columnsWin) {
            game.declareWinner();
        }
    }

    function _checkRowsWin() {
        for(let i=0; i<9; i+=3) {
            if(!_isCellEmpty(i)) {
                if((gameboardArray[i] == gameboardArray[i+1]) && (gameboardArray[i] == gameboardArray[i+2])) {
                    return true;
                }
            }
        }
        return false;
    }

    function _checkColumnsWin() {
        for(let i=0; i<3; i++) {
            if(!_isCellEmpty(i)) {
                if((gameboardArray[i] == gameboardArray[i+3]) && (gameboardArray[i] == gameboardArray[i+6])) {
                    return true;
                }
            }
        }
        return false;
    }

    return {
        addMark,
    }

})();

// controller
const game = (function() {
    const p1 = player('Niels', 'X');
    const p2 = player('Enemy', 'O');

    let currentPlayer = p1;
    let gameOver = false;

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function changePlayer() {
        currentPlayer = (currentPlayer === p1) ? p2 : p1;
    }

    function declareWinner() {
        console.log(currentPlayer.mark + " wins");
        gameOver = true;
    }

    function isGameOver() {
        return gameOver;
    }

    return {
        getCurrentPlayer, 
        changePlayer, 
        declareWinner,
        isGameOver
    }
})();