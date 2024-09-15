export function initOceanCurrentsSimulation(container) {
  container.innerHTML = `
    <div class="simulation" id="currents-sim">
    <h2>Ocean Currents Simulation</h2>
    <div class="controls-canvas-wrapper">
      <div class="controls">
        <div class="control-group">
          <label for="temperature">Global Temperature: <span id="temperature-value">15</span>°C</label>
          <input type="range" id="temperature" min="0" max="30" value="15">
        </div>
        <div class="control-group">
          <label for="salinity">Global Salinity: <span id="salinity-value">35</span> ppt</label>
          <input type="range" id="salinity" min="30" max="40" value="35">
        </div>
        <div class="control-group">
          <label for="wind-strength">Wind Strength: <span id="wind-strength-value">5</span> m/s</label>
          <input type="range" id="wind-strength" min="0" max="20" value="5">
        </div>
        <div class="button-group">
          <button id="add-debris">Add Debris</button>
          <button id="add-marine-life">Add Marine Life</button>
          <button id="toggle-time-lapse">Toggle Time-Lapse</button>
        </div>
      </div>
      <div id="currents-canvas" class="simulation-canvas"></div>
    </div>
    <div id="info-panel" class="info-panel">
      <h3>Ocean Current Information</h3>
      <p id="current-info">Hover over a current for information</p>
    </div>
    <div id="time-lapse-info" class="info-panel">
      <h3>Time-Lapse: <span id="year">2023</span></h3>
    </div>
  </div>
  `;

  const temperatureSlider = document.getElementById("temperature");
  const temperatureValue = document.getElementById("temperature-value");
  const salinitySlider = document.getElementById("salinity");
  const salinityValue = document.getElementById("salinity-value");
  const windStrengthSlider = document.getElementById("wind-strength");
  const windStrengthValue = document.getElementById("wind-strength-value");
  const addDebrisButton = document.getElementById("add-debris");
  const addMarineLifeButton = document.getElementById("add-marine-life");
  const toggleTimeLapseButton = document.getElementById("toggle-time-lapse");
  const infoPanel = document.getElementById("current-info");
  const yearSpan = document.getElementById("year");

  // D3.js setup
  const width = 800;
  const height = 600;
  const projection = d3
    .geoNaturalEarth1()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2]);

  const svg = d3
    .select("#currents-canvas")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const path = d3.geoPath().projection(projection);

  // Load world map data
  d3.json(
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
  ).then(function (world) {
    // Draw world map
    svg
      .append("g")
      .selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#d0d0d0")
      .attr("stroke", "#ffffff");

    // Ocean currents data (expanded and more realistic)
    const currents = [
      {
        name: "Gulf Stream",
        coordinates: [
          [-80, 25],
          [-75, 35],
          [-60, 40],
          [-30, 50],
          [0, 50],
        ],
        info: "The Gulf Stream is a powerful ocean current in the Atlantic Ocean. It transports warm water from the Gulf of Mexico towards the North Atlantic, influencing climate patterns in North America and Europe.",
      },
      // ... (add more currents with detailed info)
    ];

    // Draw ocean currents
    const currentPaths = svg
      .append("g")
      .selectAll("path")
      .data(currents)
      .enter()
      .append("path")
      .attr("d", (d) =>
        path({ type: "LineString", coordinates: d.coordinates })
      )
      .attr("fill", "none")
      .attr("stroke", "#0077be")
      .attr("stroke-width", 2)
      .on("mouseover", (event, d) => {
        infoPanel.innerHTML = `<strong>${d.name}</strong><br>${d.info}<br>Temperature: ${temperatureSlider.value}°C<br>Salinity: ${salinitySlider.value} ppt<br>Wind Strength: ${windStrengthSlider.value} m/s`;
      })
      .on("mouseout", () => {
        infoPanel.innerHTML = "Hover over a current for information";
      });

    // Animation function
    function animateCurrents() {
      currentPaths
        .attr("stroke-dasharray", function () {
          const length = this.getTotalLength();
          return length + " " + length;
        })
        .attr("stroke-dashoffset", function () {
          return this.getTotalLength();
        })
        .transition()
        .duration(10000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .on("end", animateCurrents);
    }

    animateCurrents();

    // Debris particles
    let debris = [];

    function addDebris() {
      const newDebris = {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 2,
      };
      debris.push(newDebris);
      updateDebris();
    }

    function updateDebris() {
      const debrisElements = svg.selectAll(".debris").data(debris);

      debrisElements
        .enter()
        .append("circle")
        .attr("class", "debris")
        .attr("r", (d) => d.size)
        .attr("fill", "#8B4513")
        .merge(debrisElements)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      debrisElements.exit().remove();
    }

    addDebrisButton.addEventListener("click", addDebris);

    // Marine life
    let marineLife = [];
    const marineSpecies = [
      { name: "Whale", icon: "🐳", speed: 0.5 },
      { name: "Turtle", icon: "🐢", speed: 0.3 },
      { name: "Fish", icon: "🐠", speed: 0.7 },
    ];

    function addMarineLife() {
      const species =
        marineSpecies[Math.floor(Math.random() * marineSpecies.length)];
      const newMarineLife = {
        x: Math.random() * width,
        y: Math.random() * height,
        ...species,
      };
      marineLife.push(newMarineLife);
      updateMarineLife();
    }

    function updateMarineLife() {
      const marineLifeElements = svg.selectAll(".marine-life").data(marineLife);

      marineLifeElements
        .enter()
        .append("text")
        .attr("class", "marine-life")
        .text((d) => d.icon)
        .attr("font-size", "20px")
        .merge(marineLifeElements)
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);

      marineLifeElements.exit().remove();
    }

    addMarineLifeButton.addEventListener("click", addMarineLife);

    // Time-lapse feature
    let timeLapseInterval;
    let currentYear = 2023;

    function toggleTimeLapse() {
      if (timeLapseInterval) {
        clearInterval(timeLapseInterval);
        timeLapseInterval = null;
        toggleTimeLapseButton.textContent = "Start Time-Lapse";
      } else {
        timeLapseInterval = setInterval(() => {
          currentYear++;
          yearSpan.textContent = currentYear;
          // Simulate climate change effects
          temperatureSlider.value = Math.min(
            30,
            parseFloat(temperatureSlider.value) + 0.1
          );
          salinitySlider.value = Math.max(
            30,
            parseFloat(salinitySlider.value) - 0.05
          );
          windStrengthSlider.value = Math.min(
            20,
            parseFloat(windStrengthSlider.value) + 0.1
          );
          updateSimulation();
        }, 1000);
        toggleTimeLapseButton.textContent = "Stop Time-Lapse";
      }
    }

    toggleTimeLapseButton.addEventListener("click", toggleTimeLapse);

    // Update function
    function updateCurrents(temperature, salinity, windStrength) {
      const speed =
        (temperature - 15) / 15 + (salinity - 35) / 5 + windStrength / 10;

      currentPaths
        .transition()
        .duration(1000)
        .attr("stroke-width", 2 + speed * 2)
        .attr("stroke", d3.interpolateRdYlBu(1 - temperature / 30));

      // Update debris positions based on currents and wind
      debris.forEach((d) => {
        const [x, y] = projection.invert([d.x, d.y]);
        const nearestCurrent = currents.reduce(
          (nearest, current) => {
            const distance = d3.geoDistance([x, y], current.coordinates[0]);
            return distance < nearest.distance
              ? { current, distance }
              : nearest;
          },
          { distance: Infinity }
        ).current;

        if (nearestCurrent) {
          const currentVector = [
            nearestCurrent.coordinates[1][0] - nearestCurrent.coordinates[0][0],
            nearestCurrent.coordinates[1][1] - nearestCurrent.coordinates[0][1],
          ];
          const currentSpeed = speed * 2;
          d.x += currentVector[0] * currentSpeed;
          d.y += currentVector[1] * currentSpeed;
        }

        // Add wind effect
        d.x += windStrength * 0.1;
        d.y += windStrength * 0.05;

        // Wrap around the map
        if (d.x > width) d.x -= width;
        if (d.x < 0) d.x += width;
        if (d.y > height) d.y -= height;
        if (d.y < 0) d.y += height;
      });

      updateDebris();

      // Update marine life positions
      marineLife.forEach((m) => {
        const [x, y] = projection.invert([m.x, m.y]);
        const nearestCurrent = currents.reduce(
          (nearest, current) => {
            const distance = d3.geoDistance([x, y], current.coordinates[0]);
            return distance < nearest.distance
              ? { current, distance }
              : nearest;
          },
          { distance: Infinity }
        ).current;

        if (nearestCurrent) {
          const currentVector = [
            nearestCurrent.coordinates[1][0] - nearestCurrent.coordinates[0][0],
            nearestCurrent.coordinates[1][1] - nearestCurrent.coordinates[0][1],
          ];
          const currentSpeed = speed * m.speed;
          m.x += currentVector[0] * currentSpeed;
          m.y += currentVector[1] * currentSpeed;
        }

        // Wrap around the map
        if (m.x > width) m.x -= width;
        if (m.x < 0) m.x += width;
        if (m.y > height) m.y -= height;
        if (m.y < 0) m.y += height;
      });

      updateMarineLife();

      // Update temperature and salinity visualization
      svg.selectAll(".temp-sal-indicator").remove();
      svg
        .append("rect")
        .attr("class", "temp-sal-indicator")
        .attr("x", 10)
        .attr("y", height - 60)
        .attr("width", 20)
        .attr("height", 50)
        .attr("fill", d3.interpolateRdYlBu(1 - temperature / 30));

      svg
        .append("text")
        .attr("class", "temp-sal-indicator")
        .attr("x", 35)
        .attr("y", height - 30)
        .text(`${temperature.toFixed(1)}°C, ${salinity.toFixed(1)} ppt`);
    }

    // Event listeners for sliders
    temperatureSlider.addEventListener("input", updateSimulation);
    salinitySlider.addEventListener("input", updateSimulation);
    windStrengthSlider.addEventListener("input", updateSimulation);

    function updateSimulation() {
      const temp = parseFloat(temperatureSlider.value);
      const sal = parseFloat(salinitySlider.value);
      const wind = parseFloat(windStrengthSlider.value);

      temperatureValue.textContent = temp.toFixed(1);
      salinityValue.textContent = sal.toFixed(1);
      windStrengthValue.textContent = wind.toFixed(1);

      updateCurrents(temp, sal, wind);
    }

    // Initial simulation update
    updateSimulation();
  });
}
