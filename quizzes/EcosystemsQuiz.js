const quizQuestions = [
  {
    question: "What is the primary source of energy in most ecosystems?",
    options: ["The Sun", "Oxygen", "Water", "Decomposers"],
    correctAnswer: 0,
  },
  {
    question: "Which of the following is NOT a type of ecosystem diversity?",
    options: [
      "Species diversity",
      "Genetic diversity",
      "Atmospheric diversity",
      "Ecosystem diversity",
    ],
    correctAnswer: 2,
  },
  {
    question:
      "What is the term for organisms that break down dead plant and animal matter?",
    options: ["Producers", "Consumers", "Predators", "Decomposers"],
    correctAnswer: 3,
  },
  {
    question: "Which of the following is an example of a keystone species?",
    options: ["Lion", "Elephant", "Shark", "All of the above"],
    correctAnswer: 3,
  },
  {
    question:
      "What is the process by which plants convert sunlight into chemical energy?",
    options: ["Respiration", "Photosynthesis", "Decomposition", "Evaporation"],
    correctAnswer: 1,
  },
  {
    question: "What role do decomposers play in an ecosystem?",
    options: [
      "Produce oxygen",
      "Recycle nutrients by breaking down dead matter",
      "Store energy in the form of carbohydrates",
      "Increase biodiversity",
    ],
    correctAnswer: 1,
  },
  {
    question: "Which cycle is crucial for the growth of plants?",
    options: ["Carbon cycle", "Nitrogen cycle", "Oxygen cycle", "Water cycle"],
    correctAnswer: 1,
  },
  {
    question: "What term describes the variety of life in a given area?",
    options: [
      "Biomass",
      "Biodiversity",
      "Ecosystem services",
      "Carrying capacity",
    ],
    correctAnswer: 1,
  },
];

function initQuiz() {
  const quizContainer = document.getElementById("quiz");
  let quizHTML = "<h2>Ecosystems Quiz</h2>";

  quizQuestions.forEach((q, index) => {
    quizHTML += `
      <div class="question">
        <p>${index + 1}. ${q.question}</p>
        ${q.options
          .map(
            (option, i) => `
          <label>
            <input type="radio" name="q${index}" value="${i}">
            ${option}
          </label>
        `
          )
          .join("")}
      </div>
    `;
  });

  quizHTML += '<button id="submit-quiz">Submit Quiz</button>';
  quizHTML += '<div id="quiz-results"></div>';

  quizContainer.innerHTML = quizHTML;

  document.getElementById("submit-quiz").addEventListener("click", submitQuiz);
}

function submitQuiz() {
  let score = 0;
  const results = [];

  quizQuestions.forEach((q, index) => {
    const selectedAnswer = document.querySelector(
      `input[name="q${index}"]:checked`
    );
    if (selectedAnswer) {
      const userAnswer = parseInt(selectedAnswer.value);
      if (userAnswer === q.correctAnswer) {
        score++;
        results.push(`Question ${index + 1}: Correct`);
      } else {
        results.push(
          `Question ${index + 1}: Incorrect. The correct answer was: ${
            q.options[q.correctAnswer]
          }`
        );
      }
    } else {
      results.push(`Question ${index + 1}: Not answered`);
    }
  });

  const resultsHTML = `
    <h3>Quiz Results</h3>
    <p>You scored ${score} out of ${quizQuestions.length}</p>
    <ul>
      ${results.map((result) => `<li>${result}</li>`).join("")}
    </ul>
  `;

  document.getElementById("quiz-results").innerHTML = resultsHTML;
}

export function initEcosystemsQuiz() {
  initQuiz();
}
