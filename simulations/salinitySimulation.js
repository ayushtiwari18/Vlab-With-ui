export function initSalinitySimulation(container) {
  container.innerHTML = `
    <div class="simulation-container">
  <canvas id="salinity-canvas"></canvas>
  <div class="controls">
    <div class="control-group">
      <label for="salinity">Salinity: <span id="salinity-value">35</span> ppt</label>
      <input type="range" id="salinity" min="0" max="50" value="35" step="0.1">
    </div>
    <div class="control-group">
      <label for="object-density">Object Density: <span id="object-density-value">1000</span> kg/m³</label>
      <input type="range" id="object-density" min="800" max="1200" value="1000" step="1">
    </div>
    <div class="control-group">
      <label for="temperature">Temperature: <span id="temperature-value">20</span>°C</label>
      <input type="range" id="temperature" min="0" max="40" value="20" step="0.1">
    </div>
  </div>
  <div class="button-group">
    <button id="add-object">Add Object</button>
    <button id="reset">Reset Simulation</button>
  </div>
  <div id="info-panel">
    <h3>Simulation Info</h3>
    <p id="water-density"></p>
    <p id="objects-count"></p>
    <p id="educational-info"></p>
  </div>
</div>
  `;

  setTimeout(() => {
    const canvas = document.getElementById("salinity-canvas");
    if (!canvas) {
      console.error("Salinity canvas not found");
      return;
    }
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    let objects = [];
    let salinity = 35;
    let objectDensity = 1000;
    let temperature = 20;
    let time = 0;

    class FloatingObject {
      constructor(x, y, density) {
        this.x = x;
        this.y = y;
        this.density = density;
        this.radius = 20;
        this.vy = 0;
        this.color = this.getColor();
      }

      getColor() {
        const normalizedDensity = (this.density - 800) / 400;
        const r = Math.floor(255 * (1 - normalizedDensity));
        const b = Math.floor(255 * normalizedDensity);
        return `rgb(${r}, 0, ${b})`;
      }

      update(waterDensity) {
        const volume = (4 / 3) * Math.PI * this.radius ** 3;
        const buoyancyForce = (waterDensity - this.density) * 9.81 * volume;
        const dragCoefficient = 0.47; // Sphere drag coefficient
        const dragForce =
          -0.5 *
          waterDensity *
          dragCoefficient *
          Math.PI *
          this.radius ** 2 *
          this.vy *
          Math.abs(this.vy);
        const netForce = buoyancyForce + dragForce;

        const acceleration = netForce / (this.density * volume);
        this.vy += acceleration;
        this.y += this.vy;

        if (this.y < this.radius) {
          this.y = this.radius;
          this.vy *= -0.5; // Bounce with energy loss
        } else if (this.y > canvas.height - this.radius) {
          this.y = canvas.height - this.radius;
          this.vy *= -0.5; // Bounce with energy loss
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function addObject() {
      objects.push(
        new FloatingObject(
          Math.random() * canvas.width,
          canvas.height / 2,
          objectDensity
        )
      );
    }

    function resetSimulation() {
      objects = [];
      salinity = 35;
      objectDensity = 1000;
      temperature = 20;
      updateSliders();
    }

    function updateSliders() {
      document.getElementById("salinity").value = salinity;
      document.getElementById("salinity-value").textContent =
        salinity.toFixed(1);
      document.getElementById("object-density").value = objectDensity;
      document.getElementById("object-density-value").textContent =
        objectDensity;
      document.getElementById("temperature").value = temperature;
      document.getElementById("temperature-value").textContent =
        temperature.toFixed(1);
    }

    function calculateWaterDensity(salinity, temperature) {
      // More accurate equation for seawater density (UNESCO 1983 equation)
      const A =
        999.842594 +
        6.793952e-2 * temperature -
        9.09529e-3 * temperature ** 2 +
        1.001685e-4 * temperature ** 3 -
        1.120083e-6 * temperature ** 4 +
        6.536332e-9 * temperature ** 5;
      const B =
        8.24493e-1 -
        4.0899e-3 * temperature +
        7.6438e-5 * temperature ** 2 -
        8.2467e-7 * temperature ** 3 +
        5.3875e-9 * temperature ** 4;
      const C =
        -5.72466e-3 + 1.0227e-4 * temperature - 1.6546e-6 * temperature ** 2;
      const D = 4.8314e-4;

      return A + B * salinity + C * salinity ** 1.5 + D * salinity ** 2;
    }

    function getWaterColor(salinity, temperature) {
      const r = Math.floor(30 + salinity * 1.5);
      const g = Math.floor(119 + salinity - temperature * 1.5);
      const b = Math.floor(190 + salinity - temperature * 2);
      return `rgb(${r}, ${g}, ${b})`;
    }

    function drawWaves(ctx, time) {
      const waveAmplitude = 5;
      const waveFrequency = 0.02;
      const waveSpeed = 0.05;

      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      for (let x = 0; x < canvas.width; x++) {
        const y =
          Math.sin(x * waveFrequency + time * waveSpeed) * waveAmplitude +
          canvas.height / 2;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
    }

    function updateSimulation() {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const waterDensity = calculateWaterDensity(salinity, temperature);
      const waterColor = getWaterColor(salinity, temperature);
      ctx.fillStyle = waterColor;
      drawWaves(ctx, time);

      objects.forEach((object) => {
        object.update(waterDensity);
        object.draw();
      });

      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      const waterDensityElem = document.getElementById("water-density");
      const objectsCountElem = document.getElementById("objects-count");
      if (waterDensityElem) {
        waterDensityElem.textContent = `Water Density: ${waterDensity.toFixed(
          2
        )} kg/m³`;
      }
      if (objectsCountElem) {
        objectsCountElem.textContent = `Objects: ${objects.length}`;
      }
      updateEducationalInfo(waterDensity);

      time += 0.1;
      requestAnimationFrame(updateSimulation);
    }

    function updateEducationalInfo(waterDensity) {
      const infoPanel = document.getElementById("educational-info");
      if (!infoPanel) return;

      let info = "";

      if (salinity < 0.5) {
        info =
          "Fresh water: Typical of rivers and lakes. Density is lower than seawater.";
      } else if (salinity < 5) {
        info =
          "Slightly saline: Found in some estuaries and brackish seas. Density is increasing.";
      } else if (salinity < 30) {
        info =
          "Brackish water: Common in estuaries and some seas. Density is notably higher than fresh water.";
      } else if (salinity < 40) {
        info =
          "Typical seawater: Most oceans have salinity in this range. Density is significantly higher than fresh water.";
      } else {
        info =
          "Highly saline water: Found in some seas like the Dead Sea. Very high density.";
      }

      if (temperature < 4) {
        info += " Near freezing point, water density behaves uniquely.";
      } else if (temperature < 10) {
        info += " Cold water is denser than warm water at the same salinity.";
      } else if (temperature > 30) {
        info +=
          " Warm water decreases density, potentially leading to stratification.";
      }

      info += ` Current water density: ${waterDensity.toFixed(2)} kg/m³.`;

      if (objects.length > 0) {
        const floatingCount = objects.filter(
          (obj) => obj.density < waterDensity
        ).length;
        const sinkingCount = objects.length - floatingCount;
        info += ` ${floatingCount} object(s) floating, ${sinkingCount} sinking.`;
      }

      infoPanel.textContent = info;
    }

    container.addEventListener("input", (e) => {
      if (e.target.id === "salinity") {
        salinity = parseFloat(e.target.value);
        document.getElementById("salinity-value").textContent =
          salinity.toFixed(1);
      } else if (e.target.id === "object-density") {
        objectDensity = parseInt(e.target.value);
        document.getElementById("object-density-value").textContent =
          objectDensity;
      } else if (e.target.id === "temperature") {
        temperature = parseFloat(e.target.value);
        document.getElementById("temperature-value").textContent =
          temperature.toFixed(1);
      }
    });

    container.addEventListener("click", (e) => {
      if (e.target.id === "add-object") {
        addObject();
      } else if (e.target.id === "reset") {
        resetSimulation();
      }
    });

    updateSimulation();
  }, 0);
}
