const salinityQuizQuestions = [
  {
    question: "What is salinity?",
    options: [
      "The concentration of dissolved salts in water",
      "The temperature of the ocean water",
      "The amount of sunlight reaching the ocean",
      "The depth of the ocean",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Which of the following processes increases the salinity of ocean water?",
    options: ["Precipitation", "Melting of ice", "Evaporation", "River inflow"],
    correctAnswer: 2,
  },
  {
    question: "How does salinity affect the density of seawater?",
    options: [
      "Higher salinity increases the density of seawater",
      "Higher salinity decreases the density of seawater",
      "Salinity has no effect on seawater density",
      "Higher salinity makes seawater less dense and more buoyant",
    ],
    correctAnswer: 0,
  },
  {
    question: "What is the typical range of salinity in ocean water?",
    options: [
      "0-10 PSU (Practical Salinity Units)",
      "10-30 PSU",
      "30-40 PSU",
      "40-50 PSU",
    ],
    correctAnswer: 2,
  },
  {
    question: "How does salinity affect marine life?",
    options: [
      "It has no impact on marine life",
      "It influences the distribution and adaptation of marine species",
      "It makes marine life more resistant to pollution",
      "It only affects the size of marine organisms",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is a halocline?",
    options: [
      "A layer of the ocean where salinity changes rapidly with depth",
      "A layer of the ocean where temperature changes rapidly with depth",
      "A type of marine organism that thrives in salty water",
      "A device used to measure salinity",
    ],
    correctAnswer: 0,
  },
  {
    question: "What is the primary source of freshwater input into the ocean?",
    options: [
      "Rainfall",
      "Ocean evaporation",
      "Iceberg melting",
      "Desalination plants",
    ],
    correctAnswer: 0,
  },
];

function initQuiz() {
  const quizContainer = document.getElementById("salinity-quiz");
  if (!quizContainer) {
    console.error("Salinity quiz container not found");
    return;
  }

  let quizHTML = "<h2>Salinity Quiz</h2>";

  salinityQuizQuestions.forEach((q, index) => {
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

  quizHTML += '<button id="submit-salinity-quiz">Submit Quiz</button>';
  quizHTML += '<div id="salinity-quiz-results"></div>';

  quizContainer.innerHTML = quizHTML;

  const submitButton = document.getElementById("submit-salinity-quiz");
  if (submitButton) {
    submitButton.addEventListener("click", submitSalinityQuiz);
  } else {
    console.error("Submit button for salinity quiz not found");
  }
}

function submitSalinityQuiz() {
  let score = 0;
  const results = [];

  salinityQuizQuestions.forEach((q, index) => {
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

  const resultsContainer = document.getElementById("salinity-quiz-results");
  if (resultsContainer) {
    const resultsHTML = `
      <h3>Quiz Results</h3>
      <p>You scored ${score} out of ${salinityQuizQuestions.length}</p>
      <ul>
        ${results.map((result) => `<li>${result}</li>`).join("")}
      </ul>
    `;
    resultsContainer.innerHTML = resultsHTML;
  } else {
    console.error("Results container for salinity quiz not found");
  }
}

export function initSalinityQuiz() {
  try {
    initQuiz();
  } catch (error) {
    console.error("Error initializing salinity quiz:", error);
  }
}
