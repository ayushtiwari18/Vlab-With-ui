// Ocean Acidification Quiz

const quizQuestions = [
  {
    question: "What is the primary cause of ocean acidification?",
    options: [
      "Increased CO2 absorption by oceans",
      "Ocean pollution",
      "Global warming",
      "Overfishing",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Which of the following is NOT directly affected by ocean acidification?",
    options: ["Coral reefs", "Shellfish", "Plankton", "Sharks"],
    correctAnswer: 3,
  },
  {
    question:
      "What is the chemical process that occurs when CO2 dissolves in seawater?",
    options: [
      "Photosynthesis",
      "Respiration",
      "Formation of carbonic acid",
      "Evaporation",
    ],
    correctAnswer: 2,
  },
  {
    question:
      "How does ocean acidification affect marine organisms with calcium carbonate shells?",
    options: [
      "It makes their shells stronger",
      "It has no effect on their shells",
      "It makes it harder for them to form and maintain their shells",
      "It changes the color of their shells",
    ],
    correctAnswer: 2,
  },
  {
    question:
      "What is the primary human activity contributing to ocean acidification?",
    options: [
      "Deforestation",
      "Burning fossil fuels",
      "Agricultural runoff",
      "Plastic pollution",
    ],
    correctAnswer: 1,
  },
];

function initQuiz() {
  const quizContainer = document.getElementById("quiz");
  let quizHTML = "<h2>Ocean Acidification Quiz</h2>";

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

export function initOceanAcidificationQuiz() {
  initQuiz();
}
