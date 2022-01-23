//variables
const mainHeaderEl = document.getElementById('main-header');
const gameHomeEl = document.getElementById('game-home');
const ruleListEl = document.getElementById('rules-list');
const scoresTableEl = document.getElementById('scores-table');
const btnStartEl = document.getElementById('btn-start');
const btnClearEl = document.getElementById('btn-clear');
const gamePlayEl = document.getElementById('game-play');
const questionNameEl = document.getElementById('question-name');
const answerListEl = document.getElementById('answer-list');
const timeLeftEl = document.getElementById('time-left');
const pointsEl = document.getElementById('points');
const btnLeaveEl = document.getElementById('btn-leave');
const gameOverEl = document.getElementById('game-over');
const playerNameEl = document.getElementById('player-name');
const btnFinishEl = document.getElementById('btn-finish');

let deckSelected = 'JavaScript-Quiz';
let scoreKey = `${deckSelected}-scores`;
let secondsLeft = 60;
let points;
let questionNum = 0;
let games = localStorage.getItem(scoreKey);
let timerStatus = 'active';

let deck = {
    name: 'JavaScript Quiz',
    questions: [
        {
            questionName: 'Question 1',
            answers: [
                { answerText: 'Answer 1-1', isCorrect: true },
                { answerText: 'Answer 1-2', isCorrect: false },
                { answerText: 'Answer 1-3', isCorrect: false },
                { answerText: 'Answer 1-4', isCorrect: false }
            ]
        },
        {
            questionName: 'Question 2',
            answers: [
                { answerText: 'Answer 2-1', isCorrect: true },
                { answerText: 'Answer 2-2', isCorrect: false },
                { answerText: 'Answer 2-3', isCorrect: false },
                { answerText: 'Answer 2-4', isCorrect: false }
            ]
        }
    ]
};

//functions
function showScores() {

    let priorCells = document.querySelectorAll('.scores-row');

    if (priorCells !== null) {
        for (let i = 0; i < priorCells.length; i++) {
            const priorCell = priorCells[i];
            priorCell.parentElement.removeChild(priorCells[i]);
        }
    }

    if (games == null) {
        games = [];
        
    } else if (typeof games === 'string') {
        games = JSON.parse(games);
    }
    

    for (let i = 0; i < 5; i++) {
        
        const newRow = document.createElement('tr');
        const playerRank = document.createElement('td');
        const playerName = document.createElement('td');
        const playerScore = document.createElement('td');

        newRow.setAttribute('class', 'scores-row');
        
        playerRank.textContent = i + 1;
        if (games !== null && games.length > i) {
            const savedScore = games[i];
            playerName.textContent = savedScore.player;
            playerScore.textContent = savedScore.score;
            console.log(playerName.textContent);
            console.log(playerScore.textContent);
        } else {
            playerName.textContent = '--';
            playerScore.textContent = '--';
        }

        newRow.appendChild(playerRank);
        newRow.appendChild(playerName);
        newRow.appendChild(playerScore);

        scoresTableEl.appendChild(newRow);
    }
    gameHomeEl.style.display = "flex";
    gamePlayEl.style.display = "none";
    gameOverEl.style.display = "none";
    return;
};

function clearScores() {
    localStorage.clear(scoreKey);
    games = localStorage.getItem(scoreKey)
    showScores();
    return;
};

function startTimer() {
    let timerInterval = setInterval(function () {
        console.log(`timerStatus === ${timerStatus}`);
        if (timerStatus !== 'active') {
            secondsLeft = 60;
            clearInterval(timerInterval);
            console.log(`timerInterval cleared`);
        } else {
            secondsLeft--;
            timeLeftEl.textContent = secondsLeft;

            if (secondsLeft === 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }

    }, 1000);
};

function decrementTimer() {
    secondsLeft -= 10;
};

function incrementPoints() {
    points += 10;
    pointsEl.innerText = points;
    return;
};

function randomizeAnswers(answerList) {
    let currentIndex = answerList.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [answerList[currentIndex], answerList[randomIndex]] = [answerList[randomIndex], answerList[currentIndex]];
    }

    return answerList;
};

function displayQuestion() {

    if (questionNum === deck.questions.length) {
        endGame();
        return;
    }

    let priorQuestions = document.querySelectorAll('.answer-item');

    if (priorQuestions !== null) {
        
        for (let i = 0; i < priorQuestions.length; i++) {
            const priorQuestion = priorQuestions[i];
            priorQuestion.parentElement.removeChild(priorQuestions[i]);

        }
    }

    questionNameEl.textContent = deck.questions[questionNum].questionName;
    const randomAnswers = randomizeAnswers(deck.questions[questionNum].answers);

    for (let i = 0; i < randomAnswers.length; i++) {
        const answer = randomAnswers[i];
        const listItem = document.createElement('li');
        listItem.textContent = answer.answerText;
        listItem.setAttribute('class', 'answer-item');
        listItem.setAttribute('data-correct', answer.isCorrect);
        answerListEl.appendChild(listItem);
    }

    return;
};

function checkAnswer(event) {
    let target = event.target;
    let answerResult = target.getAttribute('data-correct');

    if (answerResult === 'true') {
        incrementPoints();
    } else {
        decrementTimer();
    }

    //add some type of feedback for user

    questionNum++
    displayQuestion(questionNum);

    return;
};

function init() {
    mainHeaderEl.textContent = deckSelected;
    showScores();
    return;
};

function startGame() {
    points = 0;
    secondsLeft = 60;
    timerStatus = 'active';
    pointsEl.textContent = points;
    startTimer(secondsLeft);
    displayQuestion();
    gameHomeEl.style.display = "none";
    gamePlayEl.style.display = "block";
    return;
};

function leaveGame() {
    timerStatus = 'stopped';
    questionNum = 0;
    startTimer();
    showScores();
    gamePlayEl.style.display = "none";
}

function endGame() {
    timerStatus = 'stopped';
    questionNum = 0;
    startTimer();
    gamePlayEl.style.display = "none";
    gameOverEl.style.display = "block";
};

function Game(player, score, deckPlayed) {
    this.player = player;
    this.score = score;
    this.deckPlayed = deckPlayed;
};

function submitScore(event) {
    event.preventDefault();
    const newGame = new Game(playerNameEl.value, points, deckSelected);
    
    games.push(newGame);
    games.sort((a, b) => {
        if(a > b) return 1;
        if(a < b) return -1;
        return 0;
    }).reverse();
    games = games.slice(0, 5);
    localStorage.setItem(scoreKey, JSON.stringify(games));
    showScores();
    return;
};


//event listeners
btnStartEl.addEventListener('click', startGame);
btnClearEl.addEventListener('click', clearScores);
btnLeaveEl.addEventListener('click', leaveGame);
btnFinishEl.addEventListener('click', submitScore);
answerListEl.addEventListener('click', checkAnswer);

//logic
init();
