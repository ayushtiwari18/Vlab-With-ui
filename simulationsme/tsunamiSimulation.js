export function initTsunamiSimulation(container) {
  // At the beginning of your initTsunamiSimulation function
  if (typeof THREE === "undefined") {
    console.error(
      "THREE.js is not loaded. Please make sure to include this library."
    );
    return;
  }

  // Later in the function, where you set up OrbitControls
  if (typeof THREE.OrbitControls !== "undefined") {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
  } else {
    console.warn(
      "THREE.OrbitControls is not available. Camera controls will be limited."
    );
  }

  // Check if OrbitControls is available
  if (typeof THREE.OrbitControls === "undefined") {
    console.error(
      "THREE.OrbitControls is not loaded. Please make sure to include the OrbitControls.js file."
    );
    return;
  }

  // Declare controls variable at the top level of the function
  let controls;

  container.innerHTML = `
    <div class="simulation" id="tsunami-sim">
      <div class="controls">
        <button id="trigger-tsunami">Trigger Earthquake</button>
        <label for="earthquake-magnitude">Earthquake Magnitude: <span id="magnitude-value">7.0</span></label>
        <input type="range" id="earthquake-magnitude" min="5.0" max="9.0" step="0.1" value="7.0">
        <label for="water-depth">Ocean Depth: <span id="depth-value">4000</span> m</label>
        <input type="range" id="water-depth" min="1000" max="8000" step="100" value="4000">
        <label for="epicenter-distance">Epicenter Distance: <span id="distance-value">200</span> km</label>
        <input type="range" id="epicenter-distance" min="50" max="500" step="10" value="200">
        <div>
          <label>Camera View:</label>
          <button id="view-overview">Overview</button>
          <button id="view-coastal">Coastal</button>
          <button id="view-underwater">Underwater</button>
        </div>
      </div>
      <div id="tsunami-canvas"></div>
      <div id="info-panel">
        <h3>Simulation Information</h3>
        <p id="simulation-stage"></p>
        <p id="wave-height"></p>
        <p id="wave-speed"></p>
        <p id="estimated-arrival"></p>
        <p id="evacuation-status"></p>
      </div>
    </div>
  `;

  const triggerButton = document.getElementById("trigger-tsunami");
  const magnitudeSlider = document.getElementById("earthquake-magnitude");
  const magnitudeValue = document.getElementById("magnitude-value");
  const depthSlider = document.getElementById("water-depth");
  const depthValue = document.getElementById("depth-value");
  const distanceSlider = document.getElementById("epicenter-distance");
  const distanceValue = document.getElementById("distance-value");
  const simulationStage = document.getElementById("simulation-stage");
  const waveHeightInfo = document.getElementById("wave-height");
  const waveSpeedInfo = document.getElementById("wave-speed");
  const estimatedArrival = document.getElementById("estimated-arrival");
  const evacuationStatus = document.getElementById("evacuation-status");

  // Three.js setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  document.getElementById("tsunami-canvas").appendChild(renderer.domElement);

  // Enhanced lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Advanced ocean setup with custom shader
  const oceanGeometry = new THREE.PlaneGeometry(200, 200, 256, 256);
  const oceanMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      waveHeight: { value: 0 },
      waveSpeed: { value: 0 },
    },
    vertexShader: `
      uniform float time;
      uniform float waveHeight;
      uniform float waveSpeed;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vNormal = normal;
        vPosition = position;
        float wave = sin(position.x * 0.05 + time * waveSpeed) * 
                     cos(position.z * 0.05 + time * waveSpeed) * waveHeight;
        vec3 newPosition = position + normal * wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 light = vec3(0.5, 0.2, 1.0);
        light = normalize(light);
        float dProd = max(0.0, dot(vNormal, light));
        vec3 baseColor = vec3(0.1, 0.3, 0.5);
        vec3 color = baseColor * dProd + vec3(0.1, 0.1, 0.2);
        gl_FragColor = vec4(color, 0.8);
      }
    `,
    transparent: true,
  });
  const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
  ocean.rotation.x = -Math.PI / 2;
  scene.add(ocean);

  // Seafloor setup
  const seafloorGeometry = new THREE.PlaneGeometry(200, 200, 128, 128);
  const seafloorMaterial = new THREE.MeshPhongMaterial({ color: 0x2b5d34 });
  const seafloor = new THREE.Mesh(seafloorGeometry, seafloorMaterial);
  seafloor.rotation.x = -Math.PI / 2;
  seafloor.position.y = -20;
  scene.add(seafloor);

  // Detailed coastal topography
  const coastGeometry = new THREE.PlaneGeometry(200, 60, 256, 64);
  const coastMaterial = new THREE.MeshPhongMaterial({ color: 0xc2b280 });
  const coast = new THREE.Mesh(coastGeometry, coastMaterial);
  coast.position.set(0, -0.1, -120);
  coast.rotation.x = -Math.PI / 2;
  scene.add(coast);

  // Add terrain features
  const terrainGeometry = new THREE.PlaneGeometry(200, 60, 256, 64);
  const terrainMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrain.position.set(0, 0.1, -120);
  terrain.rotation.x = -Math.PI / 2;
  scene.add(terrain);

  // Create hills and valleys
  const terrainPositions = terrain.geometry.attributes.position.array;
  for (let i = 0; i < terrainPositions.length; i += 3) {
    const x = terrainPositions[i];
    const y = terrainPositions[i + 1];
    terrainPositions[i + 2] = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 5;
  }
  terrain.geometry.attributes.position.needsUpdate = true;
  terrain.geometry.computeVertexNormals();

  // Buildings setup
  const buildingGeometry = new THREE.BoxGeometry(2, 10, 2);
  const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
  const buildings = new THREE.Group();
  for (let i = 0; i < 50; i++) {
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(
      Math.random() * 180 - 90,
      5,
      Math.random() * 30 - 135
    );
    buildings.add(building);
  }
  scene.add(buildings);

  // Enhanced debris setup with physics
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);

  const debrisGeometry = new THREE.SphereGeometry(0.5, 8, 8);
  const debrisMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
  const debris = new THREE.Group();
  const debrisBodies = [];

  for (let i = 0; i < 200; i++) {
    const debrisPiece = new THREE.Mesh(debrisGeometry, debrisMaterial);
    debrisPiece.position.set(
      Math.random() * 200 - 100,
      -1,
      Math.random() * 200 - 100
    );
    debris.add(debrisPiece);

    const debrisShape = new CANNON.Sphere(0.5);
    const debrisBody = new CANNON.Body({
      mass: 1,
      shape: debrisShape,
      position: new CANNON.Vec3(
        debrisPiece.position.x,
        debrisPiece.position.y,
        debrisPiece.position.z
      ),
    });
    world.addBody(debrisBody);
    debrisBodies.push({ mesh: debrisPiece, body: debrisBody });
  }
  scene.add(debris);

  // Tectonic plates
  const plate1 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 200),
    new THREE.MeshPhongMaterial({ color: 0x8b4513, side: THREE.DoubleSide })
  );
  const plate2 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 200),
    new THREE.MeshPhongMaterial({ color: 0xa0522d, side: THREE.DoubleSide })
  );
  plate1.rotation.x = -Math.PI / 2;
  plate2.rotation.x = -Math.PI / 2;
  plate1.position.set(-50, -21, 0);
  plate2.position.set(50, -21, 0);
  scene.add(plate1, plate2);

  // Evacuation routes and safe zones
  const routeGeometry = new THREE.BufferGeometry();
  const routeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const routePoints = [];
  for (let i = 0; i < 5; i++) {
    routePoints.push(
      new THREE.Vector3(
        Math.random() * 180 - 90,
        0.5,
        Math.random() * 30 - 135
      ),
      new THREE.Vector3(Math.random() * 180 - 90, 0.5, -150)
    );
  }
  routeGeometry.setFromPoints(routePoints);
  const evacuationRoutes = new THREE.Line(routeGeometry, routeMaterial);
  scene.add(evacuationRoutes);

  const safeZoneGeometry = new THREE.CircleGeometry(10, 32);
  const safeZoneMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.5,
  });
  const safeZone = new THREE.Mesh(safeZoneGeometry, safeZoneMaterial);
  safeZone.rotation.x = -Math.PI / 2;
  safeZone.position.set(0, 0.2, -150);
  scene.add(safeZone);

  // Camera positions
  const cameraPositions = {
    overview: {
      position: new THREE.Vector3(0, 60, 120),
      lookAt: new THREE.Vector3(0, 0, -30),
    },
    coastal: {
      position: new THREE.Vector3(0, 10, -100),
      lookAt: new THREE.Vector3(0, 0, -120),
    },
    underwater: {
      position: new THREE.Vector3(0, -15, 50),
      lookAt: new THREE.Vector3(0, -20, 0),
    },
  };

  // Set initial camera position
  camera.position.copy(cameraPositions.overview.position);
  camera.lookAt(cameraPositions.overview.lookAt);

  // Tsunami parameters
  let simulationState = "idle";
  let tsunamiTime = 0;
  let tsunamiMagnitude = 7.0;
  let waterDepth = 4000;
  let epicenterDistance = 200;
  let maxWaveHeight = 0;

  function triggerTsunami() {
    simulationState = "earthquake";
    tsunamiTime = 0;
    maxWaveHeight = 0;
  }

  function updateTsunami() {
    if (simulationState === "idle") return;

    tsunamiTime += 0.016; // Assuming 60 fps

    // Calculate wave speed based on water depth (shallow water equation)
    const waveSpeed = Math.sqrt(9.8 * waterDepth);

    // Calculate wave amplitude based on magnitude and distance
    const waveAmplitude =
      Math.pow(10, tsunamiMagnitude - 5) *
      2 *
      Math.exp(-epicenterDistance / 1000);

    // Update simulation stages
    if (simulationState === "earthquake" && tsunamiTime > 5) {
      simulationState = "water_recession";
    } else if (simulationState === "water_recession" && tsunamiTime > 15) {
      simulationState = "tsunami_wave";
    }

    // Update ocean shader uniforms
    ocean.material.uniforms.time.value = tsunamiTime;
    ocean.material.uniforms.waveHeight.value = waveAmplitude;
    ocean.material.uniforms.waveSpeed.value = waveSpeed * 0.01;

    // Tectonic plate movement during earthquake
    if (simulationState === "earthquake") {
      plate1.position.y = -21 + Math.sin(tsunamiTime * 2) * 0.5;
      plate2.position.y = -21 - Math.sin(tsunamiTime * 2) * 0.5;
    }

    // Update debris physics
    world.step(1 / 60);
    debrisBodies.forEach(({ mesh, body }) => {
      mesh.position.copy(body.position);
      mesh.quaternion.copy(body.quaternion);

      // Apply wave force to debris
      const waveHeight = getWaveHeight(body.position.x, body.position.z);
      body.applyForce(new CANNON.Vec3(0, waveHeight * 10, 0), body.position);
    });

    // Update building positions (simple flooding effect)
    buildings.children.forEach((building) => {
      const waveHeight = getWaveHeight(
        building.position.x,
        building.position.z
      );
      building.position.y = Math.max(5, waveHeight + 5);

      // Simple building damage based on wave height
      if (waveHeight > 10) {
        building.scale.y = Math.max(0.1, 1 - (waveHeight - 10) / 10);
      }
    });

    // Update maximum wave height
    maxWaveHeight = Math.max(maxWaveHeight, waveAmplitude);

    // Update information panel
    updateInfoPanel(waveSpeed, maxWaveHeight);

    if (tsunamiTime > 200) simulationState = "idle";
  }

  function getWaveHeight(x, z) {
    const distance = Math.sqrt(x * x + z * z);
    const wavePhase = distance - Math.sqrt(9.8 * waterDepth) * tsunamiTime;
    const waveAmplitude =
      Math.pow(10, tsunamiMagnitude - 5) *
      2 *
      Math.exp(-epicenterDistance / 1000);
    return (
      waveAmplitude * Math.exp(-0.0001 * distance) * Math.sin(0.1 * wavePhase)
    );
  }

  function updateInfoPanel(waveSpeed, maxWaveHeight) {
    waveHeightInfo.textContent = `Max Wave Height: ${maxWaveHeight.toFixed(
      2
    )} m`;
    waveSpeedInfo.textContent = `Wave Speed: ${waveSpeed.toFixed(2)} m/s`;
    estimatedArrival.textContent = `Estimated Arrival Time: ${Math.max(
      0,
      Math.ceil(epicenterDistance / waveSpeed)
    )} min`;
    evacuationStatus.textContent = `Evacuation Status: ${
      maxWaveHeight > 5 ? "EVACUATE IMMEDIATELY" : "Stay Alert"
    }`;

    // Update simulation stage information
    switch (simulationState) {
      case "idle":
        simulationStage.textContent = "Simulation Stage: Ready";
        break;
      case "earthquake":
        simulationStage.textContent = "Simulation Stage: Earthquake";
        break;
      case "water_recession":
        simulationStage.textContent = "Simulation Stage: Water Recession";
        break;
      case "tsunami_wave":
        simulationStage.textContent = "Simulation Stage: Tsunami Wave";
        break;
    }
  }

  // Remove the duplicate declaration of 'controls'
  if (THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
  } else {
    console.warn(
      "THREE.OrbitControls is not available. Camera controls will be limited."
    );
  }

  function animate() {
    requestAnimationFrame(animate);
    updateTsunami();
    if (controls) controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // Event listeners for controls
  triggerButton.addEventListener("click", triggerTsunami);

  magnitudeSlider.addEventListener("input", (event) => {
    tsunamiMagnitude = parseFloat(event.target.value);
    magnitudeValue.textContent = tsunamiMagnitude.toFixed(1);
  });

  depthSlider.addEventListener("input", (event) => {
    waterDepth = parseFloat(event.target.value);
    depthValue.textContent = waterDepth.toFixed(0);
  });

  distanceSlider.addEventListener("input", (event) => {
    epicenterDistance = parseFloat(event.target.value);
    distanceValue.textContent = epicenterDistance.toFixed(0);
  });

  // Camera control buttons
  document.getElementById("view-overview").addEventListener("click", () => {
    camera.position.set(0, 60, 120);
    camera.lookAt(0, 0, -30);
  });

  document.getElementById("view-coastal").addEventListener("click", () => {
    camera.position.set(0, 10, -100);
    camera.lookAt(0, 0, -120);
  });

  document.getElementById("view-underwater").addEventListener("click", () => {
    camera.position.set(0, -15, 50);
    camera.lookAt(0, -20, 0);
  });

  // Add mouse controls for camera
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.maxPolarAngle = Math.PI / 2;
}
