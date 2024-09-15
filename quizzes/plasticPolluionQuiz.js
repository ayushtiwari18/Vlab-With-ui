const plasticPollutionQuizQuestions = [
  {
    question: "What is the primary source of plastic pollution in the ocean?",
    options: [
      "Plastic bottles and bags from land-based activities",
      "Natural debris from marine organisms",
      "Plastic debris from shipwrecks",
      "Plastic packaging from marine research vessels",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "How long does it typically take for plastic to decompose in the ocean?",
    options: [
      "A few days",
      "A few months",
      "Hundreds to thousands of years",
      "Plastic does not decompose",
    ],
    correctAnswer: 2,
  },
  {
    question: "What is microplastic?",
    options: [
      "Plastic pieces larger than 5 millimeters",
      "Plastic particles smaller than 5 millimeters",
      "Plastic that has been recycled",
      "Plastic that is biodegradable",
    ],
    correctAnswer: 1,
  },
  {
    question: "How does plastic pollution affect marine life?",
    options: [
      "It provides new habitats for marine organisms",
      "It has no effect on marine life",
      "It causes ingestion and entanglement, harming or killing marine species",
      "It enhances marine biodiversity",
    ],
    correctAnswer: 2,
  },
  {
    question: "What are some common methods to combat plastic pollution?",
    options: [
      "Improving waste management and recycling systems",
      "Banning all plastic products",
      "Ignoring the issue and focusing on other pollutants",
      "Using plastic to create artificial reefs",
    ],
    correctAnswer: 0,
  },
  {
    question: "What is the Great Pacific Garbage Patch?",
    options: [
      "A floating island of plastic and debris in the Pacific Ocean",
      "A natural underwater volcano",
      "A coral reef formation",
      "A protected marine sanctuary",
    ],
    correctAnswer: 0,
  },
];

function initQuiz() {
  const quizContainer = document.getElementById("quiz");
  if (!quizContainer) {
    console.error("Quiz container not found");
    return;
  }

  let quizHTML = "<h2>Plastic Pollution Quiz</h2>";

  plasticPollutionQuizQuestions.forEach((q, index) => {
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

  quizHTML += '<button id="submit-plastic-pollution-quiz">Submit Quiz</button>';
  quizHTML += '<div id="plastic-pollution-quiz-results"></div>';

  quizContainer.innerHTML = quizHTML;

  document
    .getElementById("submit-plastic-pollution-quiz")
    .addEventListener("click", submitPlasticPollutionQuiz);
}

function submitPlasticPollutionQuiz() {
  let score = 0;
  const results = [];

  plasticPollutionQuizQuestions.forEach((q, index) => {
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

  const resultsContainer = document.getElementById(
    "plastic-pollution-quiz-results"
  );
  if (resultsContainer) {
    const resultsHTML = `
      <h3>Quiz Results</h3>
      <p>You scored ${score} out of ${plasticPollutionQuizQuestions.length}</p>
      <ul>
        ${results.map((result) => `<li>${result}</li>`).join("")}
      </ul>
    `;
    resultsContainer.innerHTML = resultsHTML;
  } else {
    console.error("Results container not found");
  }
}

export function initPlasticPollutionQuiz() {
  initQuiz();
}
