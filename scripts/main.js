const player = function(name, mark, isHuman) {

    const play = function(index) {

        if(isHuman) {
            gameboard.addMark(mark, index);
        } else {
            _computerPlay();

        }
    }

    const _computerPlay = function() {
        let randomIndex = Math.floor(Math.random() * 10);
        while(!gameboard.isCellEmpty(randomIndex)) {
            randomIndex = Math.floor(Math.random() * 10);
        }
        console.log(randomIndex);
        console.log('Randoming');
        gameboard.addMark(mark, randomIndex);
    }

    return {name, mark, isHuman, play}
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
    boardContainer, markButtons, playerOneInput, playerTwoInput, chooseOpponentDiv,
    pvpButton, pveButton;

    /* ============== GAME ELEMENTS =============== */
    let displayText, playerOne, playerTwo, currentPlayer, gameOver, gameBoardState,
    vsComputer;

    init();

    function init() {
        displayText = 'PVP or PVE';
        vsComputer = false;
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
        chooseOpponentDiv = document.querySelector('.choose-opponent');
        pvpButton = document.querySelector('.pvp-button');
        pveButton = document.querySelector('.pve-button');
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
        pvpButton.addEventListener('click', _handlePvpButtonClick);
        pveButton.addEventListener('click', _handlePveButtonClick);
    }

    function _handlePvpButtonClick(event)  {
        chooseOpponentDiv.classList.add('invisible');
        inputControls.classList.remove('invisible');
        displayText = 'Enter player names to start';
        _render();
    }

    function _handlePveButtonClick(event) {
        chooseOpponentDiv.classList.add('invisible');
        inputControls.classList.remove('invisible');
        displayText = 'Enter player names to start';
        vsComputer = true;
        playerTwoInput.value = 'Computer';
        _render();
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
            playerOne = player(playerOneName, playerOneMark, true);
            
            if(vsComputer) {
                playerTwo = player(playerTwoName, playerTwoMark, false);
                console.log("I'm playing vs computer");
            } else {
                playerTwo = player(playerTwoName, playerTwoMark, true);
            }
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

            _checkingResult();
        }

        if(!currentPlayer.isHuman && !gameOver) {
            currentPlayer.play(0);
            // checking result
            _checkingResult();
        }

        _render();
    }

    function _checkingResult() {
        // checking result
        if(gameboard.checkWin()) {
            displayText = currentPlayer.name + " wins";
            gameOver = true;
            board.classList.add('board-disabled');
            console.log(board);
            if(!currentPlayer.isHuman) { // change player if computer wins
                _changePlayer();
            }

        } else if(gameboard.isBoardFull()) {
            displayText = "It's a draw";
            gameOver = true;
            board.classList.add('board-disabled');
            _changePlayer();
            if(!currentPlayer.isHuman) {
                _changePlayer(); // change players if its a computer
            }
        } else {
            _changePlayer();
            _showTurnInDisplay();
        }
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

    return { 
        init, 
        isGameOver,
    };

})();