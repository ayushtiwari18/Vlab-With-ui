// import { experimentContent } from "./experiments/index.js";
import { oceanAcidification } from "./experiments/oceanacidification.js";
import { waves } from "./experiments/wavesFormation.js";
import { ecosystems } from "./experiments/ecosystems.js";
import { oceanCurrents } from "./experiments/oceanCurrent.js";
import { plasticPollution } from "./experiments/plasticPollution.js";
import { tsunami } from "./experiments/tsunami.js";
import { salinity } from "./experiments/salinity.js";

const experimentContent = {
  oceanAcidification,
  waves,
  ecosystems,
  oceanCurrents,
  plasticPollution,
  tsunami,
  salinity,

  // ... other experiments ...
};

// DOM elements
const experimentList = document.getElementById("experiment-list");
const experimentTitle = document.getElementById("experiment-title");
const tabContents = document.querySelectorAll(".tab-content");
const tabs = document.querySelectorAll(".tab");
const progressBar = document.getElementById("progress");
const achievementPopup = document.getElementById("achievement-popup");

// Populate experiment list
function populateExperimentList() {
  Object.entries(experimentContent).forEach(([id, experiment]) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = experiment.title;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      loadExperiment(id);
    });
    li.appendChild(a);
    experimentList.appendChild(li);
  });
}

// Load experiment
function loadExperiment(id) {
  const experiment = experimentContent[id];
  if (!experiment) {
    console.error(`Experiment with id "${id}" not found`);
    return;
  }

  experimentTitle.textContent = experiment.title;
  document.getElementById("theory").innerHTML = experiment.theory;
  document.getElementById("procedure").innerHTML = experiment.procedure;
  document.getElementById("simulation").innerHTML = experiment.simulation;
  document.getElementById("assignment").innerHTML = experiment.assignment;

  // Initialize the simulation
  // Create a container for the simulation
  const simulationContainer = document.createElement("div");
  simulationContainer.id = `${id}-simulation`;
  document.getElementById("simulation").appendChild(simulationContainer);

  // Initialize the simulation
  if (typeof experiment.initSimulation === "function") {
    try {
      experiment.initSimulation(simulationContainer);
    } catch (error) {
      console.error(
        `Error initializing simulation for experiment "${id}":`,
        error
      );
      simulationContainer.innerHTML = `<p>An error occurred while loading the simulation. Please try refreshing the page.</p>`;
    }
  } else {
    console.warn(`initSimulation is not a function for experiment "${id}"`);
    simulationContainer.innerHTML = `<p>Simulation not available for this experiment.</p>`;
  }

  resetProgress();
}

// Tab functionality
tabs.forEach((tab) => {
  tab.addEventListener("click", (event) => openTab(event, tab.dataset.tab));
});

function openTab(event, tabName) {
  tabContents.forEach((content) => content.classList.remove("active"));
  tabs.forEach((tab) => tab.classList.remove("active"));

  document.getElementById(tabName).classList.add("active");
  event.currentTarget.classList.add("active");

  updateProgress();
}

// Progress tracking
function updateProgress() {
  const completedTabs = document.querySelectorAll(".tab.active").length;
  const totalTabs = tabs.length;
  const progressPercentage = (completedTabs / totalTabs) * 100;

  progressBar.style.width = `${progressPercentage}%`;

  if (progressPercentage === 100) {
    showAchievement();
  }
}

function resetProgress() {
  progressBar.style.width = "0%";
  tabs.forEach((tab) => tab.classList.remove("active"));
  tabContents.forEach((content) => content.classList.remove("active"));
}

// Achievement popup
function showAchievement() {
  achievementPopup.style.display = "block";
  setTimeout(() => {
    achievementPopup.style.display = "none";
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  populateExperimentList();
  // Load the first experiment by default
  const firstExperimentId = Object.keys(experimentContent)[0];
  if (firstExperimentId) {
    loadExperiment(firstExperimentId);
  }
});
