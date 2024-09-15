export function initPlasticPollutionSimulation(container) {
  container.innerHTML = `
     <div class="simulation" id="plastic-pollution-sim">
    <h2>Plastic Pollution Simulation</h2>
    <div class="controls-canvas-wrapper">
      <div class="controls">
        <div class="control-group">
          <label for="pollution-rate">Pollution Rate: <span id="pollution-rate-value">1</span>x</label>
          <input type="range" id="pollution-rate" min="0" max="5" step="0.1" value="1">
        </div>
        <div class="control-group">
          <label for="cleanup-effort">Cleanup Effort: <span id="cleanup-effort-value">0</span>%</label>
          <input type="range" id="cleanup-effort" min="0" max="100" value="0">
        </div>
        <div class="control-group">
          <label for="wind-speed">Wind Speed: <span id="wind-speed-value">0</span> km/h</label>
          <input type="range" id="wind-speed" min="0" max="50" value="0">
        </div>
        <div class="control-group">
          <label for="current-strength">Current Strength: <span id="current-strength-value">0</span></label>
          <input type="range" id="current-strength" min="0" max="10" value="0">
        </div>
        <div class="button-group">
          <button id="add-fish">Add Fish</button>
          <button id="add-turtle">Add Turtle</button>
          <button id="add-shark">Add Shark</button>
          <button id="add-skimmer">Add Skimmer</button>
          <button id="add-boom">Add Boom</button>
          <button id="add-drone">Add Drone</button>
        </div>
      </div>
      <canvas id="plastic-pollution-canvas" class="simulation-canvas"></canvas>
    </div>
    <div id="info-panel" class="info-panel">
      <h3>Simulation Statistics</h3>
      <p>Plastic Particles: <span id="particle-count">0</span></p>
      <p>Microplastics: <span id="microplastic-count">0</span></p>
      <p>Animals: <span id="animal-count">0</span></p>
      <p>Average Animal Health: <span id="avg-animal-health">100</span>%</p>
    </div>
    <div id="educational-info" class="info-panel">
      <h3>Plastic Pollution Facts</h3>
      <p id="fact-display"></p>
      <button id="next-fact">Next Fact</button>
    </div>
  </div>
  `;

  const canvas = document.getElementById("plastic-pollution-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;

  let pollutionRate = 1;
  let cleanupEffort = 0;
  let windSpeed = 0;
  let currentStrength = 0;
  let plasticParticles = [];
  let microplastics = [];
  let animals = [];
  let cleanupMethods = [];

  const plasticTypes = [
    {
      name: "PET",
      color: "rgba(255, 0, 0, 0.7)",
      breakdownRate: 0.001,
      toxicity: 2,
    },
    {
      name: "HDPE",
      color: "rgba(0, 255, 0, 0.7)",
      breakdownRate: 0.0005,
      toxicity: 1,
    },
    {
      name: "PVC",
      color: "rgba(0, 0, 255, 0.7)",
      breakdownRate: 0.002,
      toxicity: 3,
    },
    {
      name: "LDPE",
      color: "rgba(255, 255, 0, 0.7)",
      breakdownRate: 0.0008,
      toxicity: 1,
    },
    {
      name: "PP",
      color: "rgba(255, 0, 255, 0.7)",
      breakdownRate: 0.0006,
      toxicity: 2,
    },
  ];

  class PlasticParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.speed = Math.random() * 0.5 + 0.1;
      this.type = plasticTypes[Math.floor(Math.random() * plasticTypes.length)];
      this.lifespan = 1000 / this.type.breakdownRate;
    }

    update() {
      this.y += this.speed;
      this.x += windSpeed / 10;
      this.y += currentStrength / 10;

      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      this.lifespan--;
      if (this.lifespan <= 0) {
        return this.breakDown();
      }
    }

    breakDown() {
      for (let i = 0; i < 5; i++) {
        microplastics.push(new Microplastic(this.x, this.y, this.type));
      }
      return true; // Signal to remove this particle
    }

    draw() {
      ctx.fillStyle = this.type.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Microplastic {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.size = 1;
      this.speed = Math.random() * 0.2 + 0.05;
      this.type = type;
    }

    update() {
      this.y += this.speed;
      this.x += windSpeed / 20;
      this.y += currentStrength / 20;

      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.fillStyle = this.type.color.replace("0.7", "0.5");
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  class Animal {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.size = type === "fish" ? 15 : type === "turtle" ? 30 : 45;
      this.speed = type === "fish" ? 2 : type === "turtle" ? 1 : 1.5;
      this.direction = Math.random() * Math.PI * 2;
      this.health = 100;
      this.plasticIngested = 0;
      this.microplasticsIngested = 0;
    }

    update() {
      this.x += Math.cos(this.direction) * this.speed;
      this.y += Math.sin(this.direction) * this.speed;

      if (this.x < 0 || this.x > canvas.width)
        this.direction = Math.PI - this.direction;
      if (this.y < 0 || this.y > canvas.height)
        this.direction = -this.direction;

      // Check for plastic ingestion
      plasticParticles.concat(microplastics).forEach((particle, index) => {
        const dx = this.x - particle.x;
        const dy = this.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + particle.size) {
          this.health -=
            particle instanceof Microplastic
              ? particle.type.toxicity
              : particle.type.toxicity * 5;
          if (particle instanceof Microplastic) {
            this.microplasticsIngested++;
          } else {
            this.plasticIngested++;
          }
          if (particle instanceof PlasticParticle) {
            plasticParticles.splice(index, 1);
          } else {
            microplastics.splice(index, 1);
          }
        }
      });

      this.health = Math.max(0, this.health);

      // Behavior change based on health
      this.speed =
        this.type === "fish"
          ? 2 * (this.health / 100)
          : this.type === "turtle"
          ? 1 * (this.health / 100)
          : 1.5 * (this.health / 100);

      // Food chain interaction
      if (this.type === "shark") {
        animals.forEach((prey, index) => {
          if (prey.type === "fish") {
            const dx = this.x - prey.x;
            const dy = this.y - prey.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + prey.size) {
              this.health = Math.min(100, this.health + 10);
              this.microplasticsIngested += prey.microplasticsIngested;
              animals.splice(index, 1);
            }
          }
        });
      }
    }

    draw() {
      ctx.fillStyle =
        this.type === "fish"
          ? "orange"
          : this.type === "turtle"
          ? "green"
          : "gray";
      ctx.beginPath();
      if (this.type === "fish") {
        ctx.moveTo(this.x + this.size, this.y);
        ctx.lineTo(this.x - this.size, this.y - this.size / 2);
        ctx.lineTo(this.x - this.size, this.y + this.size / 2);
      } else {
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      }
      ctx.closePath();
      ctx.fill();

      // Health bar
      ctx.fillStyle = `rgb(${255 - this.health * 2.55}, ${
        this.health * 2.55
      }, 0)`;
      ctx.fillRect(
        this.x - this.size,
        this.y - this.size - 10,
        this.size * 2 * (this.health / 100),
        5
      );
    }
  }

  class CleanupMethod {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.size = type === "skimmer" ? 40 : type === "boom" ? 100 : 20;
      this.speed = type === "skimmer" ? 1 : type === "boom" ? 0 : 2;
      this.direction = Math.random() * Math.PI * 2;
      this.efficiency = type === "skimmer" ? 0.7 : type === "boom" ? 0.9 : 0.5;
    }

    update() {
      if (this.type !== "boom") {
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;

        if (this.x < 0 || this.x > canvas.width)
          this.direction = Math.PI - this.direction;
        if (this.y < 0 || this.y > canvas.height)
          this.direction = -this.direction;
      }

      // Clean up plastic particles
      plasticParticles = plasticParticles.filter((particle) => {
        const dx = this.x - particle.x;
        const dy = this.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return (
          distance > this.size + particle.size ||
          Math.random() > this.efficiency
        );
      });

      // Clean up microplastics
      microplastics = microplastics.filter((particle) => {
        const dx = this.x - particle.x;
        const dy = this.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return (
          distance > this.size + particle.size ||
          Math.random() > this.efficiency
        );
      });
    }

    draw() {
      ctx.fillStyle =
        this.type === "skimmer"
          ? "gray"
          : this.type === "boom"
          ? "yellow"
          : "white";
      if (this.type === "boom") {
        ctx.fillRect(this.x - this.size / 2, 0, this.size, canvas.height);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function addAnimal(type) {
    animals.push(
      new Animal(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        type
      )
    );
  }

  function addCleanupMethod(type) {
    cleanupMethods.push(
      new CleanupMethod(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        type
      )
    );
  }

  function updateSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw water
    ctx.fillStyle = "rgba(0, 119, 190, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw plastic particles
    plasticParticles = plasticParticles.filter((particle) => {
      particle.update();
      particle.draw();
      return Math.random() >= cleanupEffort / 10000;
    });

    // Update and draw microplastics
    microplastics.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    // Add new plastic particles based on pollution rate
    if (Math.random() < 0.1 * pollutionRate) {
      plasticParticles.push(
        new PlasticParticle(Math.random() * canvas.width, 0)
      );
    }

    // Update and draw animals
    animals = animals.filter((animal) => animal.health > 0);
    animals.forEach((animal) => {
      animal.update();
      animal.draw();
    });

    // Update and draw cleanup methods
    cleanupMethods.forEach((method) => {
      method.update();
      method.draw();
    });

    // Update statistics
    document.getElementById("particle-count").textContent =
      plasticParticles.length;
    document.getElementById("microplastic-count").textContent =
      microplastics.length;
    document.getElementById("animal-count").textContent = animals.length;
    const avgHealth =
      animals.reduce((sum, animal) => sum + animal.health, 0) / animals.length;
    document.getElementById("avg-animal-health").textContent =
      avgHealth.toFixed(2);

    requestAnimationFrame(updateSimulation);
  }

  // Event listeners for controls
  document.getElementById("pollution-rate").addEventListener("input", (e) => {
    pollutionRate = parseFloat(e.target.value);
    document.getElementById("pollution-rate-value").textContent =
      pollutionRate.toFixed(1);
  });

  document.getElementById("cleanup-effort").addEventListener("input", (e) => {
    cleanupEffort = parseInt(e.target.value);
    document.getElementById("cleanup-effort-value").textContent = cleanupEffort;
  });

  document.getElementById("wind-speed").addEventListener("input", (e) => {
    windSpeed = parseFloat(e.target.value);
    document.getElementById("wind-speed-value").textContent = windSpeed;
  });

  document.getElementById("current-strength").addEventListener("input", (e) => {
    currentStrength = parseFloat(e.target.value);
    document.getElementById("current-strength-value").textContent =
      currentStrength;
  });

  document
    .getElementById("add-fish")
    .addEventListener("click", () => addAnimal("fish"));
  document
    .getElementById("add-turtle")
    .addEventListener("click", () => addAnimal("turtle"));
  document
    .getElementById("add-shark")
    .addEventListener("click", () => addAnimal("shark"));
  document
    .getElementById("add-skimmer")
    .addEventListener("click", () => addCleanupMethod("skimmer"));
  document
    .getElementById("add-boom")
    .addEventListener("click", () => addCleanupMethod("boom"));
  document
    .getElementById("add-drone")
    .addEventListener("click", () => addCleanupMethod("drone"));

  // Educational facts
  const facts = [
    "Over 8 million tons of plastic end up in our oceans every year.",
    "Plastic takes hundreds of years to decompose in the ocean.",
    "Microplastics can be ingested by marine life, leading to health problems.",
    "More than 1 million seabirds and 100,000 marine mammals die each year due to plastic pollution.",
    "Reducing plastic use and improving waste management can help mitigate ocean pollution.",
  ];
  let factIndex = 0;

  function showNextFact() {
    document.getElementById("fact-display").textContent = facts[factIndex];
    factIndex = (factIndex + 1) % facts.length;
  }

  document.getElementById("next-fact").addEventListener("click", showNextFact);

  // Start the simulation
  updateSimulation();
}
