export function initOceanAcidificationSimulation(container) {
  // The entire simulation code you provided goes here
  // Replace `simulations.oceanAcidification = (container) => {` with

  container.innerHTML = `
    <div class="simulation" id="ocean-acidification-sim">
      <div class="controls">
        <label for="co2-level">CO2 Level: <span id="co2-level-value">400</span> ppm</label>
        <input type="range" id="co2-level" min="300" max="1000" value="400">
        <label for="time-scale">Time Scale: <span id="time-scale-value">1</span>x</label>
        <input type="range" id="time-scale" min="1" max="100" step="1" value="1">
        <button id="add-shellfish">Add Shellfish</button>
        <button id="add-coral">Add Coral</button>
        <button id="add-phytoplankton">Add Phytoplankton</button>
      </div>
      <canvas id="ocean-acidification-canvas"></canvas>
      <div id="info-panel"></div>
    </div>
  `;

  const co2LevelSlider = document.getElementById("co2-level");
  const co2LevelValue = document.getElementById("co2-level-value");
  const timeScaleSlider = document.getElementById("time-scale");
  const timeScaleValue = document.getElementById("time-scale-value");
  const addShellfishBtn = document.getElementById("add-shellfish");
  const addCoralBtn = document.getElementById("add-coral");
  const addPhytoplanktonBtn = document.getElementById("add-phytoplankton");
  const canvas = document.getElementById("ocean-acidification-canvas");
  const ctx = canvas.getContext("2d");
  const infoPanel = document.getElementById("info-panel");

  canvas.width = 800;
  canvas.height = 600;

  let co2Level = 400;
  let timeScale = 1;
  let organisms = [];
  let bubbles = [];
  let currentYear = 2024;
  let temperature = 15; // Starting temperature in Celsius

  class Organism {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.size = type === "phytoplankton" ? 5 : 20;
      this.health = 100;
      this.age = 0;
    }

    update(pH, temp) {
      this.age += 0.1 * timeScale;

      if (this.type === "shellfish") {
        if (pH < 7.8) {
          this.health -= (7.8 - pH) * 0.2 * timeScale;
        }
        if (temp > 20) {
          this.health -= (temp - 20) * 0.1 * timeScale;
        }
      } else if (this.type === "coral") {
        if (pH < 8.0) {
          this.health -= (8.0 - pH) * 0.3 * timeScale;
        }
        if (temp > 28) {
          this.health -= (temp - 28) * 0.2 * timeScale;
        }
      } else if (this.type === "phytoplankton") {
        if (pH < 7.6) {
          this.health -= (7.6 - pH) * 0.1 * timeScale;
        }
        if (temp > 25) {
          this.health -= (temp - 25) * 0.05 * timeScale;
        }
      }

      this.health = Math.max(0, Math.min(100, this.health));
    }

    draw() {
      const alpha = this.health / 100;
      ctx.globalAlpha = alpha;
      if (this.type === "shellfish") {
        ctx.fillStyle = "brown";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === "coral") {
        ctx.fillStyle = "pink";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x + this.size, this.y + this.size);
        ctx.lineTo(this.x - this.size, this.y + this.size);
        ctx.closePath();
        ctx.fill();
      } else if (this.type === "phytoplankton") {
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw health bar
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

  class Bubble {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.speed = Math.random() * 2 + 1;
    }

    update() {
      this.y -= this.speed * timeScale;
      if (this.y + this.size < 0) {
        this.y = canvas.height + this.size;
      }
    }

    draw() {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function addOrganism(type) {
    organisms.push(
      new Organism(
        Math.random() * canvas.width,
        Math.random() * (canvas.height / 2) + canvas.height / 2,
        type
      )
    );
  }

  function calculatePH(co2) {
    // More realistic pH calculation based on CO2 levels
    return 8.1 - Math.log(co2 / 400) * 0.3;
  }

  function updateTemperature() {
    // Simplified temperature increase based on CO2 levels
    temperature = 15 + (co2Level - 400) * 0.01;
  }

  function updateSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update temperature
    updateTemperature();

    // Draw water
    const pH = calculatePH(co2Level);
    const blueValue = Math.max(0, Math.min(255, 190 - (co2Level - 400) * 0.2));
    ctx.fillStyle = `rgb(0, ${119 - (temperature - 15) * 5}, ${blueValue})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw organisms
    organisms = organisms.filter((org) => org.health > 0);
    organisms.forEach((org) => {
      org.update(pH, temperature);
      org.draw();
    });

    // Update and draw bubbles
    bubbles.forEach((bubble) => {
      bubble.update();
      bubble.draw();
    });

    // Add new bubbles
    if (Math.random() < 0.1 * timeScale * (co2Level / 400)) {
      bubbles.push(new Bubble(Math.random() * canvas.width, canvas.height));
    }

    // Display stats
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`pH: ${pH.toFixed(2)}`, 10, 20);
    ctx.fillText(`Temperature: ${temperature.toFixed(1)}°C`, 10, 40);
    ctx.fillText(`Year: ${Math.floor(currentYear)}`, 10, 60);
    ctx.fillText(`Organisms: ${organisms.length}`, 10, 80);

    // Update current year
    currentYear += 0.1 * timeScale;

    // Update info panel
    updateInfoPanel(pH, temperature);

    requestAnimationFrame(updateSimulation);
  }

  function updateInfoPanel(pH, temperature) {
    let info = `
      <h3>Ocean Acidification Information</h3>
      <p>CO2 Level: ${co2Level} ppm</p>
      <p>pH: ${pH.toFixed(2)}</p>
      <p>Temperature: ${temperature.toFixed(1)}°C</p>
      <p>Year: ${Math.floor(currentYear)}</p>
      <h4>Effects:</h4>
      <ul>
        <li>Shellfish: ${getHealthStatus(pH, 7.8, temperature, 20)}</li>
        <li>Coral: ${getHealthStatus(pH, 8.0, temperature, 28)}</li>
        <li>Phytoplankton: ${getHealthStatus(pH, 7.6, temperature, 25)}</li>
      </ul>
    `;
    infoPanel.innerHTML = info;
  }

  function getHealthStatus(pH, criticalPH, temp, criticalTemp) {
    if (pH < criticalPH - 0.2 || temp > criticalTemp + 2) {
      return "Severe stress";
    } else if (pH < criticalPH || temp > criticalTemp) {
      return "Moderate stress";
    } else {
      return "Healthy";
    }
  }

  co2LevelSlider.addEventListener("input", () => {
    co2Level = parseInt(co2LevelSlider.value);
    co2LevelValue.textContent = co2Level;
  });

  timeScaleSlider.addEventListener("input", () => {
    timeScale = parseInt(timeScaleSlider.value);
    timeScaleValue.textContent = timeScale;
  });

  addShellfishBtn.addEventListener("click", () => addOrganism("shellfish"));
  addCoralBtn.addEventListener("click", () => addOrganism("coral"));
  addPhytoplanktonBtn.addEventListener("click", () =>
    addOrganism("phytoplankton")
  );

  // Initialize simulation
  for (let i = 0; i < 20; i++) {
    bubbles.push(
      new Bubble(Math.random() * canvas.width, Math.random() * canvas.height)
    );
  }

  // Add initial organisms
  for (let i = 0; i < 5; i++) {
    addOrganism("shellfish");
    addOrganism("coral");
    addOrganism("phytoplankton");
  }

  updateSimulation();
}
