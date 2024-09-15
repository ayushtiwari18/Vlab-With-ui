const waveFormationQuizQuestions = [
  {
    question: "What is the primary cause of ocean waves?",
    options: [
      "Wind",
      "Earthquakes",
      "Volcanic eruptions",
      "Underwater landslides",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "What term describes the height of a wave from its trough to its crest?",
    options: ["Wavelength", "Wave height", "Wave period", "Wave speed"],
    correctAnswer: 1,
  },
  {
    question: "How does wind speed affect wave formation?",
    options: [
      "Faster winds create smaller waves",
      "Faster winds create larger waves",
      "Wind speed has no effect on wave size",
      "Wind speed only affects the color of the waves",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is a wave period?",
    options: [
      "The time it takes for one full wave to pass a fixed point",
      "The distance between two consecutive crests",
      "The height of a wave",
      "The speed of the wave",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "What is the term for waves that approach the shore and become steeper, breaking into foam?",
    options: ["Swells", "Rip currents", "Breakers", "Tsunamis"],
    correctAnswer: 2,
  },
  {
    question: "How do waves affect coastal erosion?",
    options: [
      "Waves have no impact on coastal erosion",
      "Waves can erode coastlines by removing sediment and rock",
      "Waves build up coastal landforms",
      "Waves only affect underwater marine life",
    ],
    correctAnswer: 1,
  },
  {
    question: "What causes the phenomenon of wave refraction?",
    options: [
      "Change in wave speed due to varying water depths",
      "Wind direction changes",
      "Tsunamis",
      "Ocean currents",
    ],
    correctAnswer: 0,
  },
];

function initQuiz() {
  const quizContainer = document.getElementById("wave-formation-quiz");
  if (!quizContainer) {
    console.error("Quiz container not found");
    return;
  }

  let quizHTML = "<h2>Wave Formation Quiz</h2>";

  waveFormationQuizQuestions.forEach((q, index) => {
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

  quizHTML += '<button id="submit-wave-formation-quiz">Submit Quiz</button>';
  quizHTML += '<div id="wave-formation-quiz-results"></div>';

  quizContainer.innerHTML = quizHTML;

  document
    .getElementById("submit-wave-formation-quiz")
    .addEventListener("click", submitWaveFormationQuiz);
}

function submitWaveFormationQuiz() {
  let score = 0;
  const results = [];

  waveFormationQuizQuestions.forEach((q, index) => {
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
    <p>You scored ${score} out of ${waveFormationQuizQuestions.length}</p>
    <ul>
      ${results.map((result) => `<li>${result}</li>`).join("")}
    </ul>
  `;

  document.getElementById("wave-formation-quiz-results").innerHTML =
    resultsHTML;
}

export function initWaveFormationQuiz() {
  initQuiz();
}
