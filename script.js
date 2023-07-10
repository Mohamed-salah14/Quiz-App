// Selecting Elements
let quizArea = document.querySelector(".quiz-area");
let AnswerArea = document.querySelector(".answers-area");
let questionsCount = document.querySelector(".count span");
let bulletsSpans = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let subBtn = document.querySelector(".submitBtn");
let resultsContainer = document.querySelector(".results div");
let countDownTimer = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

// Get Data Function From JSON Object
async function getData() {
  let data = await fetch("data.json");
  data = await data.json();
  let len = data.length;
  // Question Count And Bullets Function
  createQuestionCountAndBullets(len);

  // Add Questions Function
  addQuestions(data[currentIndex], len);

  // Start Countdown Timer
  countDown(5, len);

  // On Clicking Submit Button
  subBtn.onclick = () => {
    // Clear Countdown Timer And Add It Again
    clearInterval(countDownInterval);
    countDown(3, len);

    let answers = Array.from(document.querySelectorAll("input[type=radio]"));
    let rightAnswer = data[currentIndex].right_answer;
    // increase current index
    currentIndex++;
    // check answer
    answers.forEach((answer) => {
      let choosenAnswer = answer.dataset.answer;
      if (answer.checked == true) {
        if (choosenAnswer === rightAnswer) {
          rightAnswers++;
        }
      }
    });

    // Remove Previous Questions
    quizArea.innerHTML = "";
    AnswerArea.innerHTML = "";

    // Add Question Data Again
    addQuestions(data[currentIndex], data.length);

    // Handle The Bullets And Add Class Active On Them
    handleBullets();

    // Show Results Function
    showResults(len);
  };
}

getData();

// Create Question Count Function

function createQuestionCountAndBullets(num) {
  questionsCount.innerHTML = num;
  // Create Bullets Loop
  for (let i = 0; i < num; i++) {
    // Create Span Length Depend On Questions Count
    let span = document.createElement("span");
    // Check the first span for adding active class
    if (i === 0) {
      span.className = "active";
    }
    // Append Spann To Bullets Span Parent
    bulletsSpans.appendChild(span);
  }
}

function addQuestions(obj, count) {
  // Important Condition To Avoid Error On Ending Of Questions
  if (currentIndex < count) {
    // Create Question
    let questionsTitle = document.createElement("h2");

    // Append Question Text To H2 Title
    questionsTitle.appendChild(document.createTextNode(obj.title));

    // Append H2 To Quiz Area
    document.querySelector(".quiz-area").appendChild(questionsTitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.classList.add("answer");

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + ATTR
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make First Checked
      if (i === 1) {
        radioInput.checked = true;
      }

      // Create Label
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;

      // label Text & append
      label.appendChild(document.createTextNode(obj[`answer_${i}`]));
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(label);
      document.querySelector(".answers-area").appendChild(mainDiv);
    }
  }
}

function handleBullets() {
  let bullets = Array.from(document.querySelectorAll(".spans span"));
  bullets.forEach((bullet, i) => {
    if (i == currentIndex) {
      bullet.className = "active";
    }
  });
}

function showResults(length) {
  let results;
  if (currentIndex === length) {
    quizArea.remove(), AnswerArea.remove(), subBtn.remove(), bullets.remove();
    if (rightAnswers > length / 2 && rightAnswers < length) {
      results = `<span class="good">Good</span>, You Answered ${rightAnswers} From ${length}`;
    } else if (rightAnswers === length) {
      results = `<span class="perfect">Perfect</span>, All Answers Is Correct`;
    } else {
      results = `<span class="bad">Bad</span>, You Answered ${rightAnswers} From ${length}`;
    }
    let link = document.createElement("a");
    link.className = "link";
    link.onclick = () => {
      window.open("https://www.w3schools.com/tags/default.asp");
    };
    link.appendChild(document.createTextNode("Review HTML Refrence"));
    document.querySelector(".results").appendChild(link);
    resultsContainer.innerHTML = results;
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownTimer.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        subBtn.click();
      }
    }, 1000);
  }
}
