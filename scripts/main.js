const player = function(name, mark) {
    const human = true;

    const isHuman = function() {
        return human;
    }

    const play = function(index) {
        if(!game.isGameOver()) {
            gameboard.addMark(mark, index);
            game.changePlayer();
        }
    }
    return {name, mark, isHuman, play}
};

const gameboard = (function() {
    const gameboard = ['x','o','o','x','o','x'];  

    function isCellEmpty(index) {
        if(gameboard[index] === undefined) {
            return true;
        }
        return false;
    }

    function addMark(mark, index) {
        gameboard[index] = mark;
    }

    function checkWin() {
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

    function isBoardFull() {
        for(let i=0; i<9; i++) {
            if(_isCellEmpty(i)) {
                return false;
            }
        }
        return true;
    }

    function getGameBoard() {
        return gameboard;
    }

    return {
        getGameBoard,
        addMark,
        checkWin,
        isCellEmpty,
        isBoardFull
    };

})();

const game = (function() {
    /* ============== DOM ELEMENTS ================= */
    let display, vsPlayerForm, board, restartButton, cells, startButton, inputOutputContainer,
    boardContainer;

    /* ============== GAME ELEMENTS =============== */
    let displayText, currentPlayer, gameOver;
    let gameBoardState = gameboard.getGameBoard();

    _init();

    function _init() {
        displayText = 'Enter player names to start';
        gameOver = false;
        _cacheDom();
        _render();
        //_bindInitialEvents();
    }

    function isGameOver() {
        return gameOver;
    }

    function _cacheDom() {
        display = document.querySelector('.display');
        boardContainer = document.querySelector('board-container');
        inputOutputContainer = document.querySelector('.input-output');
        vsPlayerForm = document.querySelector('.vs-player-form');
        board = document.querySelector('.board');
        _populateBoard(); // put cells in board
        cells = board.querySelectorAll('.cell');
        restartButton = document.querySelector('.restart-button');
        startButton = document.querySelector('.start-button');
    }

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

    function _bindInitialEvents() {
        cells.forEach(function(cell) {
            cell.addEventListener('click', _handleCellClick);
        });
        startButton.addEventListener('click', _handleStartButtonClick);
        restartButton.addEventListener('click', _handleRestartButtonClick);
    }

    function _handleStartButtonClick(event) {
        // TODO
    }

    function _handleCellClick(event) {
        const targetCell = event.target;
        const index = targetCell.getAttribute('data-index');
        if(_isCellEmpty(index)) {
            const currPlayer = game.getCurrentPlayer();
            currPlayer.play(index);
        }
    }

    function _handleRestartButtonClick(event) {
        
    }

    function _render() {
        _renderDisplay();
        _renderBoard();
    }

    function _renderDisplay() {
        display.textContent = displayText;
    }

    function _renderBoard() {
        cells.forEach(function(cell, index) {
            // to avoid re-appending in every render()
            if(cell.firstChild != null) {
                cell.removeChild(cell.firstChild);
            }

            if(gameBoardState[index] == 'x') {
                const xIcon = _createXIcon();
                cell.appendChild(xIcon);
            }
            if(gameBoardState[index] == 'o') {
                const oIcon = _createOIcon();
                cell.appendChild(oIcon);
            }
        });
    }

    function _createXIcon() {
        const xIcon = document.createElement('i');
        xIcon.classList.add('bx');
        xIcon.classList.add('bxs-x-square');
        xIcon.classList.add('cell-icon');
        return xIcon;
    }

    function _createOIcon() {
        const oIcon = document.createElement('i');
        oIcon.classList.add('bx');
        oIcon.classList.add('bxs-circle');
        oIcon.classList.add('cell-icon');
        return oIcon;
    }

    function _renderInputControls() {

    }

    function _clearAllInputControls() {
        const inputControlsList = inputControls.children;
        inputControlsList.forEach(function(control) {
            inputControls.removeChild(control);
        });
    }

    function _renderInitialInputControls() {
        const vsPlayerButton = document.createElement('button');
        const vsComputerButton = document.createElement('button');
        vsPlayerButton.textContent = 'vs Player';
        vsComputerButton.textContent = 'vs Computer';

        _bindInitialInputControlsButtonsEvents(vsPlayerButton, vsComputerButton);

        inputControls.appendChild(vsPlayerButton);
        inputControls.appendChild(vsComputerButton);
    }

    function _bindInitialInputControlsButtonsEvents(playerBtn, cpuBtn) {
        playerBtn.addEventListener('click', _handleVsPlayerButtonClick);
        cpuBtn.addEventListener('click', _handleVsComputerButtonClick)
    }

    function _renderVsPlayerInputControls() {
        const playerOneInput = _createPlayerNameInput('Player 1 Name');
        const playerTwoInput = _createPlayerNameInput('Player 2 Name');
        const markContainerPlayerOne = _createMarkContainerForPlayer(1);
        const markContainerPlayerTwo = _createMarkContainerForPlayer(2);

        _clearAllInputControls();

        inputControls.appendChild(playerOneInput);
        inputControls.appendChild(markContainerPlayerOne);
        inputControls.appendChild(playerTwoInput);
        inputControls.appendChild(markContainerPlayerTwo);
    }

    function _createPlayerNameInput(placeholderText) {
        const input = document.createElement('input');
        input.classList.add('player-name-input');
        input.setAttribute('placeholder', placeholderText);
        return input;
    }

    function _createMarkContainerForPlayer(playerNumber) {
        const markContainer = document.createElement('div');
        const xMarkButton = document.createElement('button');
        const oMarkButton = document.createElement('button');
        xMarkButton.textContent = 'x';
        oMarkButton.textContent = 'o';

        // relating p1's x button with p2's o button and vice versa to create cool click effect
        if(playerNumber === 1) {
            xMarkButton.setAttribute('data-group', 1);
            oMarkButton.setAttribute('data-group', 2);
        } else {   
            xMarkButton.setAttribute('data-group', 2);
            oMarkButton.setAttribute('data-group', 1);
        }

        xMarkButton.addEventListener('click', _handleXButtonClick);
        oMarkButton.addEventListener('click', _handleOButtonClick);

        markContainer.appendChild(xMarkButton);
        markContainer.appendChild(oMarkButton);

        return markContainer;
    }

    function _handleXButtonClick(event) {

    }

    function _handleOButtonClick(event) {

    }

    function _handleVsPlayerButtonClick(event) {
        // TODO
    }

    function _handleVsComputerButtonClick(event) {
        // TODO
    }

})();

/*const player = function(name, mark) {
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
})();*/