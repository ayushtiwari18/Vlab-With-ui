export function initOilSpillSimulation(container) {
  container.innerHTML = `
    <div class="simulation" id="oilspill-sim">
    <h2>Oil Spill Simulation</h2>
    <div class="controls-canvas-wrapper">
      <div class="controls">
        <div class="button-group">
          <button id="start-spill">Start Oil Spill</button>
          <button id="deploy-skimmer">Deploy Skimmer ($500)</button>
          <button id="deploy-boom">Deploy Boom ($200)</button>
          <button id="deploy-dispersant">Use Dispersant ($1000)</button>
        </div>
        <div class="control-group">
          <label for="wind-direction">Wind Direction: <span id="wind-direction-value">0</span>°</label>
          <input type="range" id="wind-direction" min="0" max="359" value="0">
        </div>
        <div class="control-group">
          <label for="wind-speed">Wind Speed: <span id="wind-speed-value">0</span> km/h</label>
          <input type="range" id="wind-speed" min="0" max="100" value="0">
        </div>
        <div class="control-group">
          <label for="current-direction">Ocean Current: <span id="current-direction-value">0</span>°</label>
          <input type="range" id="current-direction" min="0" max="359" value="0">
        </div>
        <div class="control-group">
          <label for="oil-type">Oil Type:</label>
          <select id="oil-type">
            <option value="light">Light Crude</option>
            <option value="heavy">Heavy Crude</option>
          </select>
        </div>
      </div>
      <canvas id="oilspill-canvas" class="simulation-canvas"></canvas>
    </div>
    <div id="simulation-info" class="info-panel"></div>
  </div>
  `;

  const startSpillBtn = document.getElementById("start-spill");
  const deploySkimmerBtn = document.getElementById("deploy-skimmer");
  const deployBoomBtn = document.getElementById("deploy-boom");
  const deployDispersantBtn = document.getElementById("deploy-dispersant");
  const windDirectionSlider = document.getElementById("wind-direction");
  const windDirectionValue = document.getElementById("wind-direction-value");
  const windSpeedSlider = document.getElementById("wind-speed");
  const windSpeedValue = document.getElementById("wind-speed-value");
  const currentDirectionSlider = document.getElementById("current-direction");
  const currentDirectionValue = document.getElementById(
    "current-direction-value"
  );
  const oilTypeSelect = document.getElementById("oil-type");
  const canvas = document.getElementById("oilspill-canvas");
  const ctx = canvas.getContext("2d");
  const infoDiv = document.getElementById("simulation-info");

  canvas.width = 800;
  canvas.height = 600;

  let oilParticles = [];
  let skimmers = [];
  let booms = [];
  let dispersants = [];
  let isSpillActive = false;
  let windDirection = 0;
  let windSpeed = 0;
  let currentDirection = 0;
  let simulationTime = 0;
  let budget = 10000;
  let environmentalImpact = 0;
  let coastalAreas = [
    { x: 0, y: 0, width: 100, height: canvas.height, type: "rocky" },
    {
      x: canvas.width - 100,
      y: 0,
      width: 100,
      height: canvas.height,
      type: "sandy",
    },
    {
      x: 0,
      y: canvas.height - 100,
      width: canvas.width,
      height: 100,
      type: "marshland",
    },
  ];
  let wildlife = [];

  class OilParticle {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.type = type;
      this.size =
        type === "light" ? Math.random() * 2 + 1 : Math.random() * 4 + 2;
      this.age = 0;
      this.weatheringFactor = 0;
    }

    move() {
      const windForceX =
        (Math.cos((windDirection * Math.PI) / 180) * windSpeed) / 10;
      const windForceY =
        (Math.sin((windDirection * Math.PI) / 180) * windSpeed) / 10;
      const currentForceX =
        (Math.cos((currentDirection * Math.PI) / 180) * 5) / 10;
      const currentForceY =
        (Math.sin((currentDirection * Math.PI) / 180) * 5) / 10;

      this.vx += (windForceX + currentForceX) * 0.01;
      this.vy += (windForceY + currentForceY) * 0.01;

      // Apply drift based on oil type
      if (this.type === "light") {
        this.vx += (Math.random() - 0.5) * 0.1;
        this.vy += (Math.random() - 0.5) * 0.1;
      } else {
        this.vx += (Math.random() - 0.5) * 0.05;
        this.vy += (Math.random() - 0.5) * 0.05;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Apply drag force
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      this.age++;
      this.weatheringFactor = Math.min(
        1,
        this.age / (this.type === "light" ? 1000 : 2000)
      );
    }

    draw() {
      const alpha = Math.max(0, 1 - this.weatheringFactor);
      ctx.fillStyle =
        this.type === "light"
          ? `rgba(100, 100, 100, ${alpha})`
          : `rgba(50, 50, 50, ${alpha})`;
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        this.size * (1 - this.weatheringFactor * 0.5),
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  class Skimmer {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 30;
      this.capacity = 100;
      this.collected = 0;
      this.efficiency = 0.8 + Math.random() * 0.2; // 80-100% efficiency
    }

    move() {
      // Move towards the nearest high-density oil area
      let nearestOil = null;
      let minDistance = Infinity;
      oilParticles.forEach((particle) => {
        const distance = Math.sqrt(
          (particle.x - this.x) ** 2 + (particle.y - this.y) ** 2
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestOil = particle;
        }
      });

      if (nearestOil) {
        const dx = nearestOil.x - this.x;
        const dy = nearestOil.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.x += (dx / distance) * 2;
        this.y += (dy / distance) * 2;
      }

      // Apply environmental effects
      this.x += (Math.random() - 0.5) * 2;
      this.y += (Math.random() - 0.5) * 2;

      if (this.x < 0) this.x = 0;
      if (this.x > canvas.width) this.x = canvas.width;
      if (this.y < 0) this.y = 0;
      if (this.y > canvas.height) this.y = canvas.height;
    }

    draw() {
      ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw capacity indicator
      ctx.fillStyle = "white";
      ctx.fillRect(this.x - 15, this.y - 25, 30, 5);
      ctx.fillStyle = "green";
      ctx.fillRect(
        this.x - 15,
        this.y - 25,
        (this.collected / this.capacity) * 30,
        5
      );
    }
  }

  class Dispersant {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 50;
      this.duration = 300;
    }

    update() {
      this.duration--;
      // Dispersant drift
      this.x += (Math.random() - 0.5) * 2;
      this.y += (Math.random() - 0.5) * 2;
    }

    draw() {
      const alpha = this.duration / 300;
      ctx.fillStyle = `rgba(0, 255, 0, ${alpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Wildlife {
    constructor(type) {
      this.type = type;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.speed = Math.random() * 2 + 1;
      this.direction = Math.random() * Math.PI * 2;
      this.contaminated = false;
    }

    move() {
      this.x += Math.cos(this.direction) * this.speed;
      this.y += Math.sin(this.direction) * this.speed;

      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      // Randomly change direction
      if (Math.random() < 0.02) {
        this.direction += ((Math.random() - 0.5) * Math.PI) / 2;
      }

      // Check for oil contamination
      if (!this.contaminated) {
        for (let particle of oilParticles) {
          const dx = this.x - particle.x;
          const dy = this.y - particle.y;
          if (dx * dx + dy * dy < 100) {
            this.contaminated = true;
            environmentalImpact += 10;
            break;
          }
        }
      }
    }

    draw() {
      ctx.fillStyle = this.contaminated ? "brown" : "blue";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function startSpill() {
    if (!isSpillActive) {
      isSpillActive = true;
      oilParticles = [];
      const oilType = oilTypeSelect.value;
      for (let i = 0; i < 1000; i++) {
        oilParticles.push(
          new OilParticle(canvas.width / 2, canvas.height / 2, oilType)
        );
      }
      simulationTime = 0;
      environmentalImpact = 0;
      wildlife = [];
      for (let i = 0; i < 20; i++) {
        wildlife.push(new Wildlife(Math.random() < 0.5 ? "fish" : "bird"));
      }
    }
  }

  function deploySkimmer() {
    if (budget >= 500) {
      skimmers.push(
        new Skimmer(Math.random() * canvas.width, Math.random() * canvas.height)
      );
      budget -= 500;
    }
  }

  function deployBoom() {
    if (budget >= 200) {
      booms.push({
        x1: Math.random() * canvas.width,
        y1: Math.random() * canvas.height,
        x2: Math.random() * canvas.width,
        y2: Math.random() * canvas.height,
      });
      budget -= 200;
    }
  }

  function deployDispersant() {
    if (budget >= 1000) {
      dispersants.push(
        new Dispersant(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        )
      );
      budget -= 1000;
    }
  }

  function updateSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw water
    ctx.fillStyle = "rgba(0, 119, 190, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw coastal areas
    coastalAreas.forEach((area) => {
      switch (area.type) {
        case "rocky":
          ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
          break;
        case "sandy":
          ctx.fillStyle = "rgba(194, 178, 128, 0.8)";
          break;
        case "marshland":
          ctx.fillStyle = "rgba(76, 153, 0, 0.8)";
          break;
      }
      ctx.fillRect(area.x, area.y, area.width, area.height);
    });

    // Update and draw oil particles
    oilParticles = oilParticles.filter((particle, index) => {
      particle.move();
      particle.draw();

      // Check collision with skimmers
      skimmers.forEach((skimmer) => {
        const dx = particle.x - skimmer.x;
        const dy = particle.y - skimmer.y;
        if (
          dx * dx + dy * dy < skimmer.radius * skimmer.radius &&
          skimmer.collected < skimmer.capacity
        ) {
          if (Math.random() < skimmer.efficiency) {
            skimmer.collected++;
            return false;
          }
        }
      });

      // Check collision with booms
      booms.forEach((boom) => {
        const A = { x: boom.x1, y: boom.y1 };
        const B = { x: boom.x2, y: boom.y2 };
        const C = { x: particle.x, y: particle.y };
        const AB = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
        const AC = Math.sqrt((C.x - A.x) ** 2 + (C.y - A.y) ** 2);
        const BC = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2);
        const angle = Math.acos((BC ** 2 + AC ** 2 - AB ** 2) / (2 * AC * BC));

        // Check if particle is within boom influence
        if (angle < Math.PI / 8 && AC < AB && BC < AB) {
          particle.vx *= -0.5;
          particle.vy *= -0.5;
        }
      });

      // Check collision with dispersants
      dispersants.forEach((dispersant) => {
        const dx = particle.x - dispersant.x;
        const dy = particle.y - dispersant.y;
        if (dx * dx + dy * dy < dispersant.radius * dispersant.radius) {
          particle.weatheringFactor += 0.01;
          if (particle.weatheringFactor >= 1) {
            return false;
          }
        }
      });

      return true; // Keep particle in the simulation
    });

    // Update and draw skimmers
    skimmers.forEach((skimmer) => {
      skimmer.move();
      skimmer.draw();
    });

    // Update and draw dispersants
    dispersants = dispersants.filter((dispersant) => {
      dispersant.update();
      dispersant.draw();
      return dispersant.duration > 0; // Keep only active dispersants
    });

    // Update and draw wildlife
    wildlife.forEach((animal) => {
      animal.move();
      animal.draw();
    });

    // Draw booms
    booms.forEach((boom) => {
      ctx.strokeStyle = "orange";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(boom.x1, boom.y1);
      ctx.lineTo(boom.x2, boom.y2);
      ctx.stroke();
    });

    // Update simulation info
    infoDiv.innerHTML = `
      <p>Budget: $${budget}</p>
      <p>Simulation Time: ${simulationTime} seconds</p>
      <p>Environmental Impact: ${environmentalImpact}</p>
    `;

    // Update simulation time
    simulationTime++;

    // Continue the simulation loop
    requestAnimationFrame(updateSimulation);
  }

  // Event listeners
  startSpillBtn.addEventListener("click", startSpill);
  deploySkimmerBtn.addEventListener("click", deploySkimmer);
  deployBoomBtn.addEventListener("click", deployBoom);
  deployDispersantBtn.addEventListener("click", deployDispersant);

  windDirectionSlider.addEventListener("input", () => {
    windDirection = parseInt(windDirectionSlider.value);
    windDirectionValue.textContent = windDirection;
  });

  windSpeedSlider.addEventListener("input", () => {
    windSpeed = parseInt(windSpeedSlider.value);
    windSpeedValue.textContent = windSpeed;
  });

  currentDirectionSlider.addEventListener("input", () => {
    currentDirection = parseInt(currentDirectionSlider.value);
    currentDirectionValue.textContent = currentDirection;
  });

  // Start the simulation loop
  updateSimulation();
}
