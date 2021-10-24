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
    const gameboard = [];

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
        cells.forEach(function(cell) {
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
        if(gameboard[index] === undefined) {
            return true;
        }
        return false;
    }

    function _render() {
        cells.forEach(function(cell, index) {
            cell.textContent = gameboard[index];
        });
    }

    function addMark(mark, index) {
        gameboard[index] = mark;
        _render();
        _displayResult();
    }

    function _checkWin() {
        const rowsWin = _checkRowsWin();
        const columnsWin = _checkColumnsWin();
        const diagonalsWin = _checkDiagonalsWin();
        if(rowsWin || columnsWin || diagonalsWin) {
            return true;
        }
        return false;
    }

    function _checkRowsWin() {
        for(let i=0; i<9; i+=3) {
            if(!_isCellEmpty(i)) {
                if((gameboard[i] == gameboard[i+1]) && (gameboard[i] == gameboard[i+2])) {
                    return true;
                }
            }
        }
        return false;
    }

    function _checkColumnsWin() {
        for(let i=0; i<3; i++) {
            if(!_isCellEmpty(i)) {
                if((gameboard[i] == gameboard[i+3]) && (gameboard[i] == gameboard[i+6])) {
                    return true;
                }
            }
        }
        return false;
    }

    function _checkDiagonalsWin() {
        if(!_isCellEmpty(0)) {
            if((gameboard[0] == gameboard[4]) && (gameboard[0] == gameboard[8])) {
                return true;
            }
        }
        if(!_isCellEmpty(2)) {
            if((gameboard[2] == gameboard[4]) && (gameboard[2] == gameboard[6])) {
                return true;
            }
        }
        return false;
    }

    function _isBoardFull() {
        for(let i=0; i<9; i++) {
            if(_isCellEmpty(i)) {
                return false;
            }
        }
        return true;
    }


    function _displayResult() {
        if(_checkWin()) {
            game.declareWinner();
        } else if(_isBoardFull()) {
            game.declareDraw();
        }
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

    function start() {
        // TODO
    }

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

    function declareDraw() {
        console.log("It's a draw");
        gameOver = true;
    }

    function isGameOver() {
        return gameOver;
    }

    return {
        start,
        getCurrentPlayer, 
        changePlayer, 
        declareWinner,
        declareDraw,
        isGameOver
    }
})();