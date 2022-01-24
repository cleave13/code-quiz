//VARIABLES

//store the location of all relevant DOM elements to global JavaScript variables.
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

//global variables to be referenced throughout the application.
let deckSelected = 'JavaScript-Quiz';
let scoreKey = `${deckSelected}-scores`;
let secondsLeft = 60;
let points;
let questionNum = 0;
let games = localStorage.getItem(scoreKey);
let timerStatus = 'active';

// Define deck object with a child "questions" object array. Each question has a child object array of "answers" that have a name and "isCorrect" property.
let deck = {
    name: 'JavaScript Quiz',
    questions: [
        {
            questionName: 'What do you call a collection of multiple elements?',
            answers: [
                { answerText: 'An array', isCorrect: true },
                { answerText: 'A collection', isCorrect: false },
                { answerText: 'A bucket', isCorrect: false },
                { answerText: 'A set', isCorrect: false }
            ]
        },
        {
            questionName: 'What does the typeof operator do?',
            answers: [
                { answerText: 'Changes the type of a variable', isCorrect: false },
                { answerText: 'Returns a string representing the type of and element', isCorrect: true },
                { answerText: 'Prints the special function "of" to the console', isCorrect: false },
                { answerText: 'typeof is not a javascript operator', isCorrect: false }
            ]
        },{
            questionName: 'Is JavaScript an interpretted version of Java?',
            answers: [
                { answerText: 'You better believe it!', isCorrect: false },
                { answerText: 'No way, Jose. It is its own separate programming language.', isCorrect: true },
                { answerText: 'It is an uninterpretted version of Java', isCorrect: false },
                { answerText: 'JavaScript is the scripted version of Java', isCorrect: false }
            ]
        },
        {
            questionName: 'JavaScript is a loosely typed language. What does that mean?',
            answers: [
                { answerText: 'Its variables can be declared without a type unlike other languages', isCorrect: true },
                { answerText: 'It requires so many keystrokes, you should stay loose while coding', isCorrect: false },
                { answerText: 'It is forgiving of typos unlike other languages', isCorrect: false },
                { answerText: 'The original javascript was handwritten', isCorrect: false }
            ]
        },{
            questionName: 'Which layer of an application does JavaScript primarily control?',
            answers: [
                { answerText: 'The behavioral layer', isCorrect: true },
                { answerText: 'The presentation layer', isCorrect: false },
                { answerText: 'The content layer', isCorrect: false },
                { answerText: 'The onion layer', isCorrect: false }
            ]
        },
        {
            questionName: 'What is the definition of an object in javascript?',
            answers: [
                { answerText: 'A standalone entity made up of properties and functions', isCorrect: true },
                { answerText: 'A set of procedures to be executed when called', isCorrect: false },
                { answerText: 'An attribute that can be changed throughout an application', isCorrect: false },
                { answerText: 'An object is the same as a function', isCorrect: false }
            ]
        },{
            questionName: 'Which of the following is false?',
            answers: [
                { answerText: 'A function declaration must be must be declared before it is called.', isCorrect: true },
                { answerText: 'A variable declared with the "var" keyword is globally scoped', isCorrect: false },
                { answerText: 'A function expression cannot be hoisted', isCorrect: false },
                { answerText: 'Javascript has a list of reserved keywords', isCorrect: false }
            ]
        },
        {
            questionName: 'Who would win in a fight: Chuck Norris or JavaScript?',
            answers: [
                { answerText: 'Chuck Norris wins every fight', isCorrect: true },
                { answerText: 'JavaScript would throw Chuck Norris into an infinite loop', isCorrect: true },
                { answerText: `They'd probably be friends - A fight is very unlikely`, isCorrect: true },
                { answerText: `You ran out of questions, didn't you...`, isCorrect: true }
            ]
        }
    ]
};

//functions
function showScores() {

    //Selects all existing cells in the High Score table
    let priorCells = document.querySelectorAll('.scores-row');

    //If cells are found, they're removed from the table. This allows for the table to be "refreshed" as needed.
    if (priorCells !== null) {
        for (let i = 0; i < priorCells.length; i++) {
            const priorCell = priorCells[i];
            priorCell.parentElement.removeChild(priorCells[i]);
        }
    }

    //Add to protect against null pointer errors. If no games exist in local storage, the variable is set to an empty array.
    if (games == null) {
        games = [];
    
    //game history is found in local storage, the string is parsed into JavaScript object notation.
    } else if (typeof games === 'string') {
        games = JSON.parse(games);
    }
    
    // loops five times to generate new table rows and cells.
    for (let i = 0; i < 5; i++) {
        
        const newRow = document.createElement('tr');
        const playerRank = document.createElement('td');
        const playerName = document.createElement('td');
        const playerScore = document.createElement('td');

        newRow.setAttribute('class', 'scores-row');
        
        //increments a placeholder rank of 1-5
        playerRank.textContent = i + 1;

        //As long as there is a savedScore to pull data from, the next rank is populated with the information from local storage.
        if (games !== null && games.length > i) {
            const savedScore = games[i];
            playerName.textContent = savedScore.player;
            playerScore.textContent = savedScore.score;

        } else {
            // if we reach the end of the local storage array, then placeholders are populated in the scores table.
            playerName.textContent = '--';
            playerScore.textContent = '--';
        }

        //appends the table cell data to the row
        newRow.appendChild(playerRank);
        newRow.appendChild(playerName);
        newRow.appendChild(playerScore);

        //the new row is appended at the end of each loop.
        scoresTableEl.appendChild(newRow);
    }

    //toggles visibility of the three primary screens so that only one is displayed at a time.
    gameHomeEl.style.display = "flex";
    gamePlayEl.style.display = "none";
    gameOverEl.style.display = "none";
    return;
};

//clears local storage for the high scores of a specific deck. Constructing a unique scoreKey variable per deck allows for the application to grow to additional decks in the future.
function clearScores() {
    localStorage.clear(scoreKey);
    games = localStorage.getItem(scoreKey)
    showScores();
    return;
};

//Starts the 60 second game timer
function startTimer() {
    let timerInterval = setInterval(function () {
        //other functions can stop the clock. If they do, the timerInterval will be cleared, stopping the clock.
        if (timerStatus !== 'active') {
            secondsLeft = 60;
            clearInterval(timerInterval);
        } else {  //if the timer remains active, it decrements every 1000 ms and displays the remaining time in the timeLeft element in the DOM.
            secondsLeft--;

            //if the clock runs out, the game is over.
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                endGame();
                secondsLeft = 60;
            }
        }
    timeLeftEl.textContent = secondsLeft;
    
    }, 1000);
};

//removes 10 seconds from the timer. This utility function is called when the player answers incorrectly.
function decrementTimer() {
    secondsLeft -= 10;
};

//adds 10 points to the total score. This utility function is called when the player answers correctly.
function incrementPoints() {
    points += 10;
    pointsEl.innerText = points;
    return;
};

//randomizes the answers for a given question using the Fisher-Yates algorithm.
function randomizeAnswers(answerList) {
    let currentIndex = answerList.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [answerList[currentIndex], answerList[randomIndex]] = [answerList[randomIndex], answerList[currentIndex]];
    }

    return answerList;
};

//called when the game starts or each time a new question needs to display.
function displayQuestion() {

    //if the number of the question is incremented beyond the length of a question array in a deck, the game is immediately ended.
    if (questionNum === deck.questions.length) {
        endGame();
        return;
    }

    //retrieves all of the prior answer items from the DOM.
    let priorQuestions = document.querySelectorAll('.answer-item');

    //if prior questions exist, a for loop is executed to remove all of the prior elements before populating the new questions.
    if (priorQuestions !== null) {
        
        for (let i = 0; i < priorQuestions.length; i++) {
            const priorQuestion = priorQuestions[i];
            priorQuestion.parentElement.removeChild(priorQuestions[i]);

        }
    }

    //returns the question at the index equal to the questionNum global variable for the given deck.
    questionNameEl.textContent = deck.questions[questionNum].questionName;
    
    //shuffles the answers
    const randomAnswers = randomizeAnswers(deck.questions[questionNum].answers);

    //for each answer from the object tree, a new list item is created, given a class for styling and identification purposes and appended to the list element.
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

//checks the data attribute of the element that was clicked on the page.
function checkAnswer(event) {
    let target = event.target;
    let answerResult = target.getAttribute('data-correct');

    //If the clicked element is correct, then increment points, else decrement timer.
    if (answerResult === 'true') {
        incrementPoints();
    } else {
        decrementTimer();
    }

    //increments the questionNum global variable, so that the next time a question is displayed, it proceeds to the next question in the array for the deck.
    questionNum++
    displayQuestion(questionNum);

    return;
};

//triggered when the application loads. Populates the ain header with the name of the selected deck and calls the showScores.
function init() {
    mainHeaderEl.textContent = deckSelected;
    showScores();
    return;
};

//Starts the active play of the game. Sets the timer to 60 seconds, timer to active, displays the first question and hides the high scores div.
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

//Allows the player to leave a game before completing for enhanced user experience. Leaving the game shows the high score screen, hides the game play screen, stops the clock and restores the question number to 0. 
function leaveGame() {
    timerStatus = 'stopped';
    questionNum = 0;
    startTimer();
    showScores();
    gamePlayEl.style.display = "none";
}

//resets the game to its default values and displays the game over screen. Resetting to defaults allows the player to lpay the same deck multiple times.
function endGame() {
    timerStatus = 'stopped';
    questionNum = 0;
    startTimer();
    gamePlayEl.style.display = "none";
    gameOverEl.style.display = "block";
};

//constructor class to create a new object from the combination of the player's score, name entered and deck played.
function Game(player, score, deckPlayed) {
    this.player = player;
    this.score = score;
    this.deckPlayed = deckPlayed;
};

//adds the player's score to local storage if it's in the top five scores.
function submitScore(event) {
    //prevents default form behavior of clearing the form
    event.preventDefault();
    //creates the object by passing in the player's name, score and deck selected as function parameters.
    const newGame = new Game(playerNameEl.value, points, deckSelected);
    
    //pushes the newly created game object to the games array
    games.push(newGame);
    //sorts the games in reverse order.
    games.sort((a, b) => {
        if(a > b) return 1;
        if(a < b) return -1;
        return 0;
    }).reverse();
    //truncates the array after the first five scores.
    games = games.slice(0, 5);
    //commits the stringified version of the object array to local storage.
    localStorage.setItem(scoreKey, JSON.stringify(games));
    showScores();
    return;
};


//event listeners <-- listen for clicks on the various DOM elements and triggers the relevant function.
btnStartEl.addEventListener('click', startGame);
btnClearEl.addEventListener('click', clearScores);
btnLeaveEl.addEventListener('click', leaveGame);
btnFinishEl.addEventListener('click', submitScore);
answerListEl.addEventListener('click', checkAnswer);

//logic
init(); //initializes the game upon the initial page load.
