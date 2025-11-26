document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const turnIndicator = document.getElementById('turn-indicator');
    const restartBtn = document.getElementById('restart-btn');
    const scoreXElement = document.getElementById('score-x');
    const scoreOElement = document.getElementById('score-o');
    const scoreTiesElement = document.getElementById('score-ties');
    
    // Modal elements
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const btnQuit = document.getElementById('btn-quit');
    const btnNextRound = document.getElementById('btn-next-round');

    let currentPlayer = 'x';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    
    let scores = {
        x: 0,
        o: 0,
        ties: 0
    };

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellClick = (clickedCellEvent) => {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    };

    const handleCellPlayed = (clickedCell, clickedCellIndex) => {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.classList.add(currentPlayer);
        clickedCell.innerText = currentPlayer.toUpperCase();
    };

    const handleResultValidation = () => {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            handleWin();
            return;
        }

        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            handleDraw();
            return;
        }

        handlePlayerChange();
    };

    const handlePlayerChange = () => {
        currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
        updateTurnIndicator();
    };

    const updateTurnIndicator = () => {
        turnIndicator.innerHTML = `<span class="turn-icon">${currentPlayer.toUpperCase()}</span> TURN`;
    };

    const handleWin = () => {
        gameActive = false;
        scores[currentPlayer]++;
        updateScoreBoard();
        showModal(false);
    };

    const handleDraw = () => {
        gameActive = false;
        scores.ties++;
        updateScoreBoard();
        showModal(true);
    };

    const updateScoreBoard = () => {
        scoreXElement.innerText = scores.x;
        scoreOElement.innerText = scores.o;
        scoreTiesElement.innerText = scores.ties;
    };

    const showModal = (isDraw) => {
        setTimeout(() => {
            modalOverlay.classList.add('active');
            if (isDraw) {
                modalSubtitle.innerText = '';
                modalTitle.innerHTML = '<span class="winner-icon"></span> ROUND TIED';
                modalTitle.className = 'modal-title draw';
            } else {
                const winnerText = currentPlayer === 'x' ? 'YOU WON!' : 'CPU WON!'; // Assuming P1 is X
                // For this simple version, we'll just say Player X or Player O wins
                modalSubtitle.innerText = `PLAYER ${currentPlayer.toUpperCase()} WINS!`;
                modalTitle.innerHTML = `<span class="winner-icon">${currentPlayer.toUpperCase()}</span> TAKES THE ROUND`;
                modalTitle.className = `modal-title ${currentPlayer}-win`;
            }
        }, 500);
    };

    const handleRestartGame = () => {
        gameActive = true;
        currentPlayer = 'x';
        gameState = ['', '', '', '', '', '', '', '', ''];
        updateTurnIndicator();
        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('x');
            cell.classList.remove('o');
        });
        modalOverlay.classList.remove('active');
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', handleRestartGame);
    btnNextRound.addEventListener('click', handleRestartGame);
    btnQuit.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        // In a real app, this might go to a menu. Here we just close modal but keep game state as is (ended)
    });
});
