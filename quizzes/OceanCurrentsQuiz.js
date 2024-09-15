const quizQuestions = [
  {
    question: "What primarily drives surface ocean currents?",
    options: ["Wind", "Tides", "Seismic activity", "The Moon"],
    correctAnswer: 0,
  },
  {
    question: "What effect does the Earth's rotation have on ocean currents?",
    options: [
      "Slows down currents",
      "Speeds up currents",
      "Creates the Coriolis effect, deflecting the path of currents",
      "Has no effect",
    ],
    correctAnswer: 2,
  },
  {
    question: "Which of the following is an example of a major ocean current?",
    options: [
      "The Gulf Stream",
      "The Amazon River",
      "The Pacific Wave",
      "The Antarctic Crevasse",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "How do temperature and salinity differences affect ocean currents?",
    options: [
      "They cause currents to move faster in warm, salty areas",
      "They create density-driven currents, causing water to sink or rise",
      "They have no effect on currents",
      "They only affect surface currents",
    ],
    correctAnswer: 1,
  },
  {
    question: "What role do ocean currents play in global climate regulation?",
    options: [
      "They have minimal effect on the climate",
      "They distribute heat and help regulate temperatures",
      "They control rain patterns",
      "They block sunlight from reaching the surface",
    ],
    correctAnswer: 1,
  },
  {
    question:
      "What term describes the large-scale movement of water within the oceans?",
    options: [
      "Ocean current",
      "Ocean circulation",
      "Marine drift",
      "Wave formation",
    ],
    correctAnswer: 0,
  },
  {
    question: "How do ocean currents impact marine life?",
    options: [
      "They only provide food for small fish",
      "They have no direct effect",
      "They help transport nutrients and organisms",
      "They create habitat destruction",
    ],
    correctAnswer: 2,
  },
  {
    question: "What is the Coriolis effect?",
    options: [
      "A force that causes wind to blow east",
      "The deflection of moving objects due to Earth's rotation",
      "The force that causes ocean currents to stop",
      "An underwater volcanic activity",
    ],
    correctAnswer: 1,
  },
];

function initQuiz() {
  const quizContainer = document.getElementById("quiz");
  let quizHTML = "<h2>Ocean Currents Quiz</h2>";

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

export function initOceanCurrentsQuiz() {
  initQuiz();
}
