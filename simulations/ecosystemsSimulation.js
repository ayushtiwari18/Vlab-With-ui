export function initEcosystemsSimulation(container) {
  container.innerHTML = `
     <div class="simulation" id="ecosystem-sim">
    <h2>Marine Ecosystem Simulation</h2>
    <div class="controls-canvas-wrapper">
      <div class="controls">
        <div class="control-group">
          <label for="fishing-rate">Fishing Intensity: <span id="fishing-rate-value">1</span>x</label>
          <input type="range" id="fishing-rate" min="0" max="5" step="0.1" value="1">
        </div>
        <div class="control-group">
          <label for="pollution-level">Pollution Level: <span id="pollution-level-value">0</span>%</label>
          <input type="range" id="pollution-level" min="0" max="100" value="0">
        </div>
        <div class="control-group">
          <label for="temperature">Water Temperature: <span id="temperature-value">15</span>°C</label>
          <input type="range" id="temperature" min="0" max="30" value="15">
        </div>
        <div class="button-group">
          <button id="add-ship">Add Fishing Ship</button>
          <button id="add-oil-spill">Simulate Oil Spill</button>
        </div>
      </div>
      <canvas id="ecosystem-canvas" class="simulation-canvas"></canvas>
    </div>
    <div id="ecosystem-info" class="info-panel"></div>
  </div>
</div>
  `;

  const fishingRateSlider = document.getElementById("fishing-rate");
  const fishingRateValue = document.getElementById("fishing-rate-value");
  const pollutionLevelSlider = document.getElementById("pollution-level");
  const pollutionLevelValue = document.getElementById("pollution-level-value");
  const temperatureSlider = document.getElementById("temperature");
  const temperatureValue = document.getElementById("temperature-value");
  const addShipButton = document.getElementById("add-ship");
  const addOilSpillButton = document.getElementById("add-oil-spill");
  const canvas = document.getElementById("ecosystem-canvas");
  const ctx = canvas.getContext("2d");
  const infoDiv = document.getElementById("ecosystem-info");

  canvas.width = 800;
  canvas.height = 600;

  class MarineOrganism {
    constructor(x, y, size, speed) {
      this.x = x || Math.random() * canvas.width;
      this.y = y || Math.random() * canvas.height;
      this.size = size;
      this.speed = speed;
      this.angle = Math.random() * Math.PI * 2;
    }

    move() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      if (this.x < 0 || this.x > canvas.width)
        this.angle = Math.PI - this.angle;
      if (this.y < 0 || this.y > canvas.height) this.angle = -this.angle;

      this.angle += (Math.random() - 0.5) * 0.2;
    }
  }

  class Fish extends MarineOrganism {
    constructor(type) {
      super(null, null, Math.random() * 10 + 5, Math.random() * 2 + 1);
      this.type = type || (Math.random() < 0.2 ? "predator" : "prey");
      this.energy = 100;
    }

    draw() {
      ctx.fillStyle =
        this.type === "predator"
          ? "rgba(255, 0, 0, 0.8)"
          : "rgba(255, 165, 0, 0.8)";
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.size, this.y - this.size / 2);
      ctx.lineTo(this.x - this.size, this.y + this.size / 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  class Plankton extends MarineOrganism {
    constructor() {
      super(null, null, Math.random() * 3 + 1, 0.1);
    }

    move() {
      super.move();
      this.y += Math.random() - 0.5;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Ship {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = 30;
      this.speed = 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.fishCaught = 0;
    }

    move() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      if (this.x < 0 || this.x > canvas.width)
        this.angle = Math.PI - this.angle;
      if (this.y < 0 || this.y > canvas.height) this.angle = -this.angle;

      this.angle += (Math.random() - 0.5) * 0.1;
    }

    draw() {
      ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.size, this.y - this.size / 2);
      ctx.lineTo(this.x - this.size, this.y + this.size / 2);
      ctx.closePath();
      ctx.fill();
    }

    fish(fishes) {
      const catchRadius = 50;
      fishes = fishes.filter((fish) => {
        const dx = this.x - fish.x;
        const dy = this.y - fish.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < catchRadius) {
          this.fishCaught++;
          return false;
        }
        return true;
      });
      return fishes;
    }
  }

  class OilSpill {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.maxRadius = 100;
      this.growthRate = 0.5;
    }

    grow() {
      if (this.radius < this.maxRadius) {
        this.radius += this.growthRate;
      }
    }

    draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let fishes = Array(100)
    .fill()
    .map(() => new Fish());
  let planktons = Array(1000)
    .fill()
    .map(() => new Plankton());
  let ships = [];
  let oilSpills = [];

  function updateEcosystem() {
    const fishingRate = parseFloat(fishingRateSlider.value);
    const pollutionLevel = parseInt(pollutionLevelSlider.value);
    const temperature = parseInt(temperatureSlider.value);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw water
    const waterColor = `rgba(0, ${119 - pollutionLevel}, ${
      190 - pollutionLevel
    }, 1)`;
    ctx.fillStyle = waterColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw plankton
    planktons.forEach((plankton) => {
      plankton.move();
      plankton.draw();
    });

    // Update and draw fish
    fishes.forEach((fish, index) => {
      fish.move();
      fish.draw();

      // Fish eating plankton or other fish
      if (fish.type === "prey") {
        planktons = planktons.filter((plankton) => {
          const dx = fish.x - plankton.x;
          const dy = fish.y - plankton.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < fish.size) {
            fish.energy += 10;
            return false;
          }
          return true;
        });
      } else {
        fishes = fishes.filter((prey, preyIndex) => {
          if (prey.type === "prey") {
            const dx = fish.x - prey.x;
            const dy = fish.y - prey.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < fish.size * 2) {
              fish.energy += 50;
              return false;
            }
          }
          return true;
        });
      }

      // Fish reproduction
      if (
        fish.energy > 150 &&
        Math.random() < 0.01 * (1 - Math.abs(temperature - 15) / 15)
      ) {
        fishes.push(new Fish(fish.type));
        fish.energy -= 50;
      }

      // Fish death
      fish.energy -=
        0.1 +
        (0.1 * pollutionLevel) / 100 +
        (0.1 * Math.abs(temperature - 15)) / 15;
      if (fish.energy <= 0) {
        fishes.splice(index, 1);
      }
    });

    // Update and draw ships
    ships.forEach((ship) => {
      ship.move();
      ship.draw();
      fishes = ship.fish(fishes);
    });

    // Update and draw oil spills
    oilSpills.forEach((spill) => {
      spill.grow();
      spill.draw();

      // Oil spill effects
      fishes = fishes.filter((fish) => {
        const dx = fish.x - spill.x;
        const dy = fish.y - spill.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < spill.radius) {
          fish.energy -= 1;
          return fish.energy > 0;
        }
        return true;
      });

      planktons = planktons.filter((plankton) => {
        const dx = plankton.x - spill.x;
        const dy = plankton.y - spill.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance >= spill.radius;
      });
    });

    // Plankton growth
    if (
      Math.random() <
      0.1 * (1 - pollutionLevel / 100) * (1 - Math.abs(temperature - 15) / 15)
    ) {
      planktons.push(new Plankton());
    }

    // Display stats
    updateInfo();

    requestAnimationFrame(updateEcosystem);
  }

  function updateInfo() {
    const preyCount = fishes.filter((fish) => fish.type === "prey").length;
    const predatorCount = fishes.filter(
      (fish) => fish.type === "predator"
    ).length;
    const totalFishCaught = ships.reduce(
      (total, ship) => total + ship.fishCaught,
      0
    );

    infoDiv.innerHTML = `
      <h3>Ecosystem Statistics</h3>
      <p>Prey Fish: ${preyCount}</p>
      <p>Predator Fish: ${predatorCount}</p>
      <p>Plankton: ${planktons.length}</p>
      <p>Ships: ${ships.length}</p>
      <p>Fish Caught: ${totalFishCaught}</p>
      <p>Oil Spills: ${oilSpills.length}</p>
    `;
  }

  fishingRateSlider.addEventListener("input", () => {
    fishingRateValue.textContent = parseFloat(fishingRateSlider.value).toFixed(
      1
    );
  });

  pollutionLevelSlider.addEventListener("input", () => {
    pollutionLevelValue.textContent = pollutionLevelSlider.value;
  });

  temperatureSlider.addEventListener("input", () => {
    temperatureValue.textContent = temperatureSlider.value;
  });

  addShipButton.addEventListener("click", () => {
    ships.push(new Ship());
  });

  addOilSpillButton.addEventListener("click", () => {
    oilSpills.push(
      new OilSpill(Math.random() * canvas.width, Math.random() * canvas.height)
    );
  });

  updateEcosystem();
}
