const oilSpillQuizQuestions = [
  {
    question: "What is the primary challenge in cleaning up oil spills?",
    options: [
      "Oil spreads quickly and covers large areas of the ocean.",
      "Oil is heavier than water, making it difficult to locate.",
      "Most cleanup methods are too expensive to implement.",
      "Oil sinks to the bottom of the ocean, making it hard to retrieve.",
    ],
    correctAnswer: 0,
  },
  {
    question: "How does oil affect marine life and coastal ecosystems?",
    options: [
      "Oil helps filter the ocean water, benefiting marine species.",
      "Oil suffocates marine organisms, harms birds, and damages coral reefs.",
      "Oil dissolves into the water without causing harm.",
      "Oil only affects deep-sea ecosystems, leaving coastal regions unaffected.",
    ],
    correctAnswer: 1,
  },
  {
    question: "What are some common methods used to clean up oil spills?",
    options: [
      "Using skimmers, absorbent materials, and dispersants.",
      "Using sand and gravel to cover the oil.",
      "Introducing new marine species that can consume oil.",
      "Evaporating the oil with heat waves.",
    ],
    correctAnswer: 0,
  },
  {
    question: "How do dispersants work in oil spill response?",
    options: [
      "They solidify the oil, making it easier to remove.",
      "They break up the oil into smaller droplets that mix with water, reducing surface slicks.",
      "They burn the oil off the surface of the water.",
      "They attract marine organisms to help absorb the oil.",
    ],
    correctAnswer: 1,
  },
  {
    question:
      "What are some long-term environmental and economic impacts of oil spills?",
    options: [
      "Marine life and ecosystems fully recover within a few months.",
      "Oil spills have little to no effect on coastal economies.",
      "Oil spills can cause long-term harm to marine life, fisheries, tourism, and local economies.",
      "Oil spills only impact the environment for a short period.",
    ],
    correctAnswer: 2,
  },
  {
    question:
      "What was one of the major oil spills in history and what were its consequences?",
    options: [
      "The Deepwater Horizon spill, which caused widespread damage to marine life and coastal ecosystems.",
      "The Gulf of Mexico spill, which had no significant environmental impact.",
      "The Pacific Spill of 1985, which primarily affected desert regions.",
      "The Great Lakes spill, which damaged freshwater marine life but had no long-term effects.",
    ],
    correctAnswer: 0,
  },
];

function initQuiz() {
  const quizContainer = document.getElementById("quiz");
  if (!quizContainer) {
    console.error("Oil spill quiz container not found");
    return;
  }

  let quizHTML = "<h2>Oil Spill Quiz</h2>";

  oilSpillQuizQuestions.forEach((q, index) => {
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

  quizHTML += '<button id="submit-oil-spill-quiz">Submit Quiz</button>';
  quizHTML += '<div id="oil-spill-quiz-results"></div>';

  quizContainer.innerHTML = quizHTML;

  const submitButton = document.getElementById("submit-oil-spill-quiz");
  if (submitButton) {
    submitButton.addEventListener("click", submitOilSpillQuiz);
  } else {
    console.error("Submit button for oil spill quiz not found");
  }
}

function submitOilSpillQuiz() {
  let score = 0;
  const results = [];

  oilSpillQuizQuestions.forEach((q, index) => {
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
    <p>You scored ${score} out of ${oilSpillQuizQuestions.length}</p>
    <ul>
      ${results.map((result) => `<li>${result}</li>`).join("")}
    </ul>
  `;

  document.getElementById("quiz-results").innerHTML = resultsHTML;
}

export function initOilSpillQuiz() {
  initQuiz();
}
