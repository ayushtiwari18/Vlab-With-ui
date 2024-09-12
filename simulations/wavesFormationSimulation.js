export function initWavesSimulation(container) {
  container.innerHTML = `
    <div class="simulation-container">
  <!-- Waves Simulation -->
  <div class="simulation" id="waves-sim">
    <h2>Wave Formation Simulation</h2>
    <div class="controls-canvas-wrapper">
      <div class="controls">
        <div class="control-group">
          <label for="wind-speed">Wind Speed: <span id="wind-speed-value">10</span> m/s</label>
          <input type="range" id="wind-speed" min="0" max="30" value="10">
        </div>
        <div class="control-group">
          <label for="wind-direction">Wind Direction: <span id="wind-direction-value">0</span>°</label>
          <input type="range" id="wind-direction" min="0" max="359" value="0">
        </div>
        <div class="control-group">
          <label for="environment">Environment:</label>
          <select id="environment">
            <option value="deep-ocean">Deep Ocean</option>
            <option value="coastline">Coastline</option>
            <option value="shallow-water">Shallow Water</option>
          </select>
        </div>
      </div>
      <div id="wave-canvas" class="simulation-canvas"></div>
    </div>
    <div id="wave-info" class="info-panel">
      <h3>Wave Information</h3>
      <p>Height: <span id="wave-height">0</span> m</p>
      <p>Length: <span id="wave-length">0</span> m</p>
      <p>Period: <span id="wave-period">0</span> s</p>
      <p>Energy: <span id="wave-energy">0</span> J/m²</p>
    </div>
  </div>
  `;

  const windSpeedSlider = document.getElementById("wind-speed");
  const windSpeedValue = document.getElementById("wind-speed-value");
  const windDirectionSlider = document.getElementById("wind-direction");
  const windDirectionValue = document.getElementById("wind-direction-value");
  const environmentSelect = document.getElementById("environment");

  // Three.js setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 600);
  document.getElementById("wave-canvas").appendChild(renderer.domElement);

  // Create ocean plane
  const geometry = new THREE.PlaneGeometry(100, 100, 128, 128);
  const material = new THREE.MeshPhongMaterial({
    color: 0x0077be,
    shininess: 100,
    transparent: true,
    opacity: 0.8,
  });
  const ocean = new THREE.Mesh(geometry, material);
  ocean.rotation.x = -Math.PI / 2;
  scene.add(ocean);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  camera.position.set(0, 30, 50);
  camera.lookAt(0, 0, 0);

  // Wave parameters
  let windSpeed = 10;
  let windDirection = 0;
  let waveHeight = 2;
  let waveFrequency = 0.1;
  let environmentFactor = 1;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Update wave geometry
    const time = Date.now() * 0.001;
    const positions = ocean.geometry.attributes.position.array;

    let maxWaveHeight = 0;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];

      // Calculate wave height based on wind speed, direction, and environment
      const waveX =
        Math.sin(x * waveFrequency + time + (windDirection * Math.PI) / 180) *
        waveHeight *
        (windSpeed / 30) *
        environmentFactor;
      const waveY =
        Math.cos(y * waveFrequency + time) *
        waveHeight *
        (windSpeed / 30) *
        environmentFactor;

      const height = waveX + waveY;
      positions[i + 2] = height;

      if (Math.abs(height) > maxWaveHeight) {
        maxWaveHeight = Math.abs(height);
      }
    }

    ocean.geometry.attributes.position.needsUpdate = true;
    ocean.geometry.computeVertexNormals();

    // Update wave information
    const waveLength = Math.PI / waveFrequency;
    const wavePeriod = Math.sqrt((2 * Math.PI * waveLength) / 9.8);
    const waveEnergy = (1 / 8) * 1000 * 9.8 * maxWaveHeight * maxWaveHeight;

    // Check if elements exist before updating
    const waveHeightElement = document.getElementById("wave-height");
    const waveLengthElement = document.getElementById("wave-length");
    const wavePeriodElement = document.getElementById("wave-period");
    const waveEnergyElement = document.getElementById("wave-energy");

    if (waveHeightElement)
      waveHeightElement.textContent = maxWaveHeight.toFixed(2);
    if (waveLengthElement)
      waveLengthElement.textContent = waveLength.toFixed(2);
    if (wavePeriodElement)
      wavePeriodElement.textContent = wavePeriod.toFixed(2);
    if (waveEnergyElement)
      waveEnergyElement.textContent = waveEnergy.toFixed(2);

    // Color-code waves based on height
    const colors = ocean.geometry.attributes.color;
    if (!colors) {
      ocean.geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(new Float32Array(positions.length), 3)
      );
    }

    for (let i = 0; i < positions.length; i += 3) {
      const height = positions[i + 2];
      const normalizedHeight = (height + maxWaveHeight) / (2 * maxWaveHeight);
      ocean.geometry.attributes.color.setXYZ(
        i / 3,
        0,
        normalizedHeight,
        1 - normalizedHeight
      );
    }
    ocean.geometry.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
  }

  // Start animation
  animate();

  // Event listeners for controls
  windSpeedSlider.addEventListener("input", () => {
    windSpeed = parseInt(windSpeedSlider.value);
    windSpeedValue.textContent = windSpeed;
  });

  windDirectionSlider.addEventListener("input", () => {
    windDirection = parseInt(windDirectionSlider.value);
    windDirectionValue.textContent = windDirection;
  });

  environmentSelect.addEventListener("change", () => {
    switch (environmentSelect.value) {
      case "deep-ocean":
        environmentFactor = 1;
        waveFrequency = 0.1;
        break;
      case "coastline":
        environmentFactor = 0.8;
        waveFrequency = 0.15;
        break;
      case "shallow-water":
        environmentFactor = 0.6;
        waveFrequency = 0.2;
        break;
    }
  });

  // Clean up function
  return function cleanup() {
    // Remove event listeners
    windSpeedSlider.removeEventListener("input", () => {});
    windDirectionSlider.removeEventListener("input", () => {});
    environmentSelect.removeEventListener("change", () => {});

    // Stop the animation loop
    cancelAnimationFrame(animate);

    // Remove the renderer from the DOM
    renderer.domElement.remove();

    // Dispose of Three.js objects
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
