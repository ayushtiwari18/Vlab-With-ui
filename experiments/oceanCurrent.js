// experiments/oceanCurrents.js
import { initOceanCurrentsSimulation } from "../simulations/oceanCurrentSimulation.js";

export const oceanCurrents = {
  id: "ocean-currents",
  title: "Ocean Currents",
  theory: `
    <h2>Ocean Currents: The Earth's Marine Highways</h2>
    <p>Ocean currents are large-scale movements of water within the oceans, driven by wind, temperature, salinity differences, and the Earth's rotation. These currents play a crucial role in regulating the Earth's climate, distributing heat, and supporting marine life by transporting nutrients and organisms across the globe.</p>
    <h3>Key Points:</h3>
    <ul>
      <li>Surface currents are primarily driven by wind patterns, while deep ocean currents are influenced by differences in water temperature and salinity.</li>
      <li>The Earth's rotation causes the Coriolis effect, which deflects the path of ocean currents, creating circular gyres in the world's oceans.</li>
      <li>Ocean currents regulate global climate by redistributing heat, particularly through currents like the Gulf Stream and the Antarctic Circumpolar Current.</li>
      <li>Currents also transport marine life, influence weather patterns, and play a role in nutrient cycling in marine ecosystems.</li>
    </ul>
    <p>Understanding ocean currents is essential for studying global climate change, marine navigation, and ecosystem health.</p>
  `,
  procedure: `
    <h2>Experiment Procedure: Visualizing Ocean Currents</h2>
    <ol>
      <li>Fill a clear, shallow container with water to represent the ocean.</li>
      <li>Add a few drops of food coloring near the surface to visualize the water's movement.</li>
      <li>Gently blow across the water’s surface using a straw to simulate wind-driven surface currents. Observe how the colored water moves.</li>
      <li>Heat one corner of the container (e.g., with a small light bulb) to simulate the effect of the sun on ocean water temperatures. Observe how the heat affects the movement of the colored water.</li>
      <li>Add salt to one side of the container to simulate differences in salinity. Observe the movement of water as the salt dissolves and how it affects the current flow.</li>
      <li>Record your observations on how wind, heat, and salinity affect water movement.</li>
    </ol>
    <p>This experiment simulates how ocean currents are influenced by wind, temperature, and salinity, which are the key drivers of both surface and deep ocean currents.</p>
  `,
  simulation: `
    <div id="ocean-currents-simulation">
      <!-- The simulation will be loaded here by the main script -->
    </div>
  `,
  assignment: `
    <h2>Ocean Currents: Research and Analysis Assignment</h2>
    <ol>
      <li>Explain the factors that drive ocean currents and the role of the Coriolis effect. Write a brief (200-300 words) report that includes examples of major ocean currents and their influence on the global climate.</li>
      <li>Investigate three marine species whose migration patterns are influenced by ocean currents. Describe how these currents impact their movement and feeding behaviors.</li>
      <li>Design a hypothetical experiment to test how temperature and salinity differences affect the speed and direction of ocean currents in a controlled environment. Include:
        <ul>
          <li>A clear hypothesis</li>
          <li>Materials needed</li>
          <li>Step-by-step procedure</li>
          <li>How you would measure and analyze the results</li>
        </ul>
      </li>
      <li>Research the impact of climate change on global ocean currents. Write a short essay (400-500 words) discussing the potential effects of shifting currents on marine life, weather patterns, and human activity.</li>
    </ol>
    <p>Submit your completed assignment for review and feedback. Be prepared to discuss your findings with your peers.</p>
  `,

  initSimulation: initOceanCurrentsSimulation,
};
