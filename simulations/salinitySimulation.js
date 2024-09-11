export function initSalinitySimulation(container) {
  container.innerHTML = `
    <div class="simulation-container">
      <canvas id="salinity-canvas"></canvas>
      <div class="controls">
        <div>
          <label for="salinity">Salinity: <span id="salinity-value">35</span> ppt</label>
          <input type="range" id="salinity" min="0" max="50" value="35">
        </div>
        <div>
          <label for="object-density">Object Density: <span id="object-density-value">1000</span> kg/m³</label>
          <input type="range" id="object-density" min="800" max="1200" value="1000">
        </div>
        <div>
          <label for="temperature">Temperature: <span id="temperature-value">20</span>°C</label>
          <input type="range" id="temperature" min="0" max="40" value="20">
        </div>
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

  // Wrap the initialization code in a setTimeout to ensure DOM is updated
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
        const buoyancyForce =
          (waterDensity - this.density) *
          9.81 *
          ((4 / 3) * Math.PI * this.radius ** 3);
        const dragForce = -0.5 * this.vy * Math.abs(this.vy);
        const netForce = buoyancyForce + dragForce;

        this.vy +=
          netForce / ((4 / 3) * Math.PI * this.radius ** 3 * this.density);
        this.y += this.vy;

        if (this.y < this.radius) {
          this.y = this.radius;
          this.vy = 0;
        } else if (this.y > canvas.height - this.radius) {
          this.y = canvas.height - this.radius;
          this.vy = 0;
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
      document.getElementById("salinity-value").textContent = salinity;
      document.getElementById("object-density").value = objectDensity;
      document.getElementById("object-density-value").textContent =
        objectDensity;
      document.getElementById("temperature").value = temperature;
      document.getElementById("temperature-value").textContent = temperature;
    }

    function calculateWaterDensity(salinity, temperature) {
      // Simplified equation for water density based on salinity and temperature
      return 1000 + 0.8 * salinity - 0.2 * temperature;
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
      if (!ctx) return; // Add this check

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw water
      const waterDensity = calculateWaterDensity(salinity, temperature);
      const waterColor = getWaterColor(salinity, temperature);
      ctx.fillStyle = waterColor;
      drawWaves(ctx, time);

      // Update and draw objects
      objects.forEach((object) => {
        object.update(waterDensity);
        object.draw();
      });

      // Draw water surface line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Update info panel
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
      updateEducationalInfo();

      time += 0.1;
      requestAnimationFrame(updateSimulation);
    }

    function updateEducationalInfo() {
      const infoPanel = document.getElementById("educational-info");
      if (!infoPanel) return;

      if (salinity < 5) {
        info =
          "Low salinity: This represents freshwater environments like rivers and lakes.";
      } else if (salinity < 30) {
        info =
          "Moderate salinity: This is typical of brackish water in estuaries.";
      } else {
        info = "High salinity: This represents typical ocean conditions.";
      }

      if (temperature < 10) {
        info += " The low temperature increases water density.";
      } else if (temperature > 30) {
        info += " The high temperature decreases water density.";
      }

      infoPanel.textContent = info;
    }

    container.addEventListener("input", (e) => {
      if (e.target.id === "salinity") {
        salinity = parseInt(e.target.value);
        const salinityValueElem = document.getElementById("salinity-value");
        if (salinityValueElem) {
          salinityValueElem.textContent = salinity;
        }
      } else if (e.target.id === "object-density") {
        objectDensity = parseInt(e.target.value);
        const objectDensityValueElem = document.getElementById(
          "object-density-value"
        );
        if (objectDensityValueElem) {
          objectDensityValueElem.textContent = objectDensity;
        }
      } else if (e.target.id === "temperature") {
        temperature = parseInt(e.target.value);
        const temperatureValueElem =
          document.getElementById("temperature-value");
        if (temperatureValueElem) {
          temperatureValueElem.textContent = temperature;
        }
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
