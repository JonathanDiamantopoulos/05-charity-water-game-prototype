const roundLength = 30;
const titleScreen = document.querySelector('#menu');
const gameScreen = document.querySelector('#game');
const resultsScreen = document.querySelector('#results');
const timerElement = document.querySelector('#timer');
const timerBar = document.querySelector('#timer-bar');
const scoreElement = document.querySelector('#score');
const finalScoreElement = document.querySelector('#final-score');
const currentDrop = document.querySelector('#current-drop');
const dropName = document.querySelector('#drop-name');
const dropDisplay = document.querySelector('#drop-display');
const sortMessage = document.querySelector('#sort-message');
const basinButtons = document.querySelectorAll('.basin-button');

let secondsRemaining = roundLength;
let score = 0;
let currentWaterType = 'clean';
let dropIsActive = false;
let timerInterval;
let nextDropTimeout;

// Show one screen at a time and move focus to its heading.
function showScreen(screenToShow) {
	titleScreen.hidden = true;
	gameScreen.hidden = true;
	resultsScreen.hidden = true;
	screenToShow.hidden = false;
	screenToShow.querySelector('h1, h2').focus();
}

// Reset all round values so a restart always begins fresh.
function startGame() {
	clearInterval(timerInterval);
	clearTimeout(nextDropTimeout);

	secondsRemaining = roundLength;
	score = 0;
	scoreElement.textContent = score;
	timerElement.textContent = secondsRemaining;
	timerBar.style.width = '100%';
	timerBar.style.backgroundColor = '';
	sortMessage.textContent = 'Choose the matching basin';
	sortMessage.className = 'sort-message';
	basinButtons.forEach((button) => {
		button.disabled = false;
	});

	showScreen(gameScreen);
	makeNextDrop();

	timerInterval = setInterval(() => {
		secondsRemaining -= 1;
		timerElement.textContent = secondsRemaining;
		timerBar.style.width = `${(secondsRemaining / roundLength) * 100}%`;

		if (secondsRemaining <= 10) {
			timerBar.style.backgroundColor = '#f16061';
		}

		if (secondsRemaining === 0) {
			finishGame();
		}
	}, 1000);
}

// Choose a water type at random and show its color and label.
function makeNextDrop() {
	currentWaterType = Math.random() < 0.5 ? 'clean' : 'dirty';
	dropIsActive = true;
	currentDrop.className = `water-drop drop-${currentWaterType}`;
	dropName.textContent = currentWaterType === 'clean' ? 'Clean water' : 'Dirty water';
	sortMessage.textContent = 'Choose the matching basin';
	sortMessage.className = 'sort-message';
	basinButtons.forEach((button) => {
		button.disabled = false;
	});

	// Restart the entrance animation each time a new drop appears.
	dropDisplay.classList.remove('drop-display');
	void dropDisplay.offsetWidth;
	dropDisplay.classList.add('drop-display');
}

// Update the score, then reveal another drop after a short pause.
function sortDrop(chosenType) {
	if (!dropIsActive) {
		return;
	}

	dropIsActive = false;
	basinButtons.forEach((button) => {
		button.disabled = true;
	});

	if (chosenType === currentWaterType) {
		score += 10;
		sortMessage.textContent = 'Nice sort! +10 points';
		sortMessage.classList.add('message-correct');
	} else {
		score = Math.max(0, score - 5);
		sortMessage.textContent = 'Not quite. -5 points';
		sortMessage.classList.add('message-wrong');
	}

	scoreElement.textContent = score;
	nextDropTimeout = setTimeout(() => {
		if (secondsRemaining > 0) {
			makeNextDrop();
		}
	}, 650);
}

function finishGame() {
	clearInterval(timerInterval);
	clearTimeout(nextDropTimeout);
	dropIsActive = false;
	finalScoreElement.textContent = score;
	showScreen(resultsScreen);
}

document.querySelector('#play-button').addEventListener('click', startGame);
document.querySelector('#restart-button').addEventListener('click', startGame);

document.querySelector('#menu-button').addEventListener('click', () => {
	clearInterval(timerInterval);
	clearTimeout(nextDropTimeout);
	showScreen(titleScreen);
});

document.querySelector('#home-link').addEventListener('click', (event) => {
	event.preventDefault();
	clearInterval(timerInterval);
	clearTimeout(nextDropTimeout);
	showScreen(titleScreen);
});

basinButtons.forEach((button) => {
	button.addEventListener('click', () => {
		sortDrop(button.dataset.sort);
	});
});
