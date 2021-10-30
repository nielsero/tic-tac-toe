const player = function(name, mark) {
    const play = function(index) {
        gameboard.addMark(mark, index);
    }
    return {name, mark, play}
};

const gameboard = (function() {
    const gameboard = [];  

    resetBoard();

    function isCellEmpty(index) {
        if(gameboard[index] === '') {
            return true;
        }
        return false;
    }

    function resetBoard() {
        // grid size is 9
        for(let i=0; i<9; i++) {
            gameboard[i] = '';
        }
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
            if(!isCellEmpty(i)) {
                if((gameboard[i] == gameboard[i+1]) && (gameboard[i] == gameboard[i+2])) {
                    return true;
                }
            }
        }
        return false;
    }

    function _checkColumnsWin() {
        for(let i=0; i<3; i++) {
            if(!isCellEmpty(i)) {
                if((gameboard[i] == gameboard[i+3]) && (gameboard[i] == gameboard[i+6])) {
                    return true;
                }
            }
        }
        return false;
    }

    function _checkDiagonalsWin() {
        if(!isCellEmpty(0)) {
            if((gameboard[0] == gameboard[4]) && (gameboard[0] == gameboard[8])) {
                return true;
            }
        }
        if(!isCellEmpty(2)) {
            if((gameboard[2] == gameboard[4]) && (gameboard[2] == gameboard[6])) {
                return true;
            }
        }
        return false;
    }

    function isBoardFull() {
        for(let i=0; i<9; i++) {
            if(isCellEmpty(i)) {
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
        isBoardFull,
        resetBoard
    };

})();

const game = (function() {
    /* ============== DOM ELEMENTS ================= */
    let display, board, restartButton, cells, startButton, inputControls,
    boardContainer, markButtons, playerOneInput, playerTwoInput;

    /* ============== GAME ELEMENTS =============== */
    let displayText, playerOne, playerTwo, currentPlayer, gameOver, gameBoardState;

    init();

    function init() {
        displayText = 'Enter player names to start';
        gameOver = true;
        gameBoardState = gameboard.getGameBoard();
        currentPlayer = null;
        _cacheDom();
        _render();
        _bindInitialEvents();
    }

    function isGameOver() {
        return gameOver;
    }

    /* ========== LOADING DOM ELEMENTS ============ */
    function _cacheDom() {
        display = document.querySelector('.display');
        boardContainer = document.querySelector('.board-container');
        inputControls = document.querySelector('.input-controls');
        board = document.querySelector('.board');
        _populateBoard(); // put cells in board
        cells = board.querySelectorAll('.cell');
        restartButton = document.querySelector('.restart-button');
        startButton = document.querySelector('.start-button');
        markButtons = document.querySelectorAll('.mark-button');
        playerOneInput = document.querySelector('.name-player-one');
        playerTwoInput = document.querySelector('.name-player-two');
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
        markButtons.forEach(function(markButton) {
            markButton.addEventListener('click', _handleMarkButtonClick);
        });
    }

    function _handleStartButtonClick(event) {
        event.preventDefault();
        const playerOneName = playerOneInput.value;
        const playerTwoName = playerTwoInput.value;
        
        console.log(playerOneName);
        console.log(playerTwoName);

        if(playerOneName != '' && playerTwoName != '') {
            const playerOneMark = _getPlayerOneMark();
            const playerTwoMark = _getPlayerTwoMark();
            playerOne = player(playerOneName, playerOneMark);
            playerTwo = player(playerTwoName, playerTwoMark);
            _startGame();
            inputControls.classList.add('invisible');
            boardContainer.classList.remove('invisible');
            _render();
        }
    }

    function _startGame() {
        currentPlayer = playerOne;
        gameOver = false;
        displayText = currentPlayer.name + " turn to play";
        gameboard.resetBoard();
    }

    function _getPlayerOneMark() {
        const xMarkSelected = markButtons[0].getAttribute('data-selected');
        if(xMarkSelected == 'yes') {
            return 'x';
        } else { 
            return 'o';
        }
    }

    function _getPlayerTwoMark() {
        const playerOneMark = _getPlayerOneMark();
        if(playerOneMark == 'x') {
            return 'o';
        } else {
            return 'x';
        }
    }

    function _handleCellClick(event) {
        const index = this.getAttribute('data-index');
        if(!isGameOver() && gameboard.isCellEmpty(index)) {
            console.log(index);
            currentPlayer.play(index);
            // checking result
            if(gameboard.checkWin()) {
                displayText = currentPlayer.name + " wins";
                gameOver = true;
                board.classList.add('board-disabled');
                console.log(board);
            } else if(gameboard.isBoardFull()) {
                displayText = "It's a draw";
                gameOver = true;
                board.classList.add('board-disabled');
                _changePlayer(); // change players if its a draw
            } else {
                _changePlayer();
                _showTurnInDisplay();
            }
        }
        _render();
    }

    function _handleRestartButtonClick(event) {
        _restartGame();
        board.classList.remove('board-disabled');
        _render();
    }

    function _restartGame() {
        gameOver = false;
        displayText = currentPlayer.name + " turn to play";
        gameboard.resetBoard();
    }

    function _handleMarkButtonClick(event) {
        event.preventDefault();
        const dataGroup = this.getAttribute('data-group');

        markButtons.forEach(function(button) {
            const group = button.getAttribute('data-group');
            if(group == dataGroup) {
                button.setAttribute('data-selected', 'yes');
            } else {
                button.setAttribute('data-selected', 'no');
            }
        });

        _styleSelectedMarkButtons();
    }

    function _styleSelectedMarkButtons() {
        markButtons.forEach(function(button) {
            button.classList.remove('mark-selected');
            const selected = button.getAttribute('data-selected');
            if(selected == 'yes') {
                button.classList.add('mark-selected');
            }
        });
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function _changePlayer() {
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    }

    function _showTurnInDisplay() {
        displayText = currentPlayer.name + " turn to play";
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
                //const xIcon = _createXIcon();
                // cell.appendChild(xIcon);
                const xImg = _createXImg();
                cell.appendChild(xImg);
            }
            if(gameBoardState[index] == 'o') {
                //const oIcon = _createOIcon();
                //cell.appendChild(oIcon);
                const oImg = _createOImg();
                cell.appendChild(oImg);
            }
        });
    }

    /* NO MORE ICONS
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
    } */

    function _createXImg() {
        const xImg = document.createElement('img');
        xImg.setAttribute('src', './images/tic-tac-toe-x.png');
        xImg.classList.add('mark-image');
        return xImg;
    }

    function _createOImg() {
        const oImg = document.createElement('img');
        oImg.setAttribute('src', './images/tic-tac-toe-o.png');
        oImg.classList.add('mark-image');
        return oImg;
    }

    function _handleVsPlayerButtonClick(event) {
        // TODO
    }

    function _handleVsComputerButtonClick(event) {
        // TODO
    }

    return { 
        init, 
        isGameOver,
    };

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