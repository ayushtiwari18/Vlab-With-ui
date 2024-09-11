// experiments/plasticPollution.js
import { initPlasticPollutionSimulation } from "../simulations/plasticPollutionSimulation.js";

export const plasticPollution = {
  id: "plastic-pollution",
  title: "Plastic Pollution",
  theory: `
    <h2>Plastic Pollution: A Growing Threat to Oceans</h2>
    <p>Plastic pollution is a significant environmental issue, with millions of tons of plastic waste entering the oceans each year. This pollution affects marine ecosystems, harms wildlife, and contributes to the degradation of ocean health.</p>
    <h3>Key Points:</h3>
    <ul>
      <li>Plastic waste in the ocean can take hundreds of years to decompose, causing long-term damage to marine environments.</li>
      <li>Marine animals, such as turtles, fish, and seabirds, often mistake plastic debris for food, leading to ingestion, entanglement, and death.</li>
      <li>Microplastics, tiny plastic particles, have been found in the ocean's water column, sediments, and even inside marine organisms, affecting their health and the food chain.</li>
      <li>Plastic pollution also disrupts coral reefs, beaches, and other coastal ecosystems, affecting biodiversity and human activities like fishing and tourism.</li>
    </ul>
    <p>Efforts to reduce plastic pollution include banning single-use plastics, improving waste management, and promoting recycling and cleanup efforts.</p>
  `,
  procedure: `
    <h2>Experiment Procedure: Simulating Plastic Pollution in Water</h2>
    <ol>
      <li>Prepare a clear container filled with water.</li>
      <li>Add small pieces of plastic, like plastic beads, straws, or bags, to represent ocean plastic debris.</li>
      <li>Observe how the plastic pieces float or sink depending on their density.</li>
      <li>Introduce a small fan or gently blow across the water's surface to simulate ocean currents and waves. Observe how the plastic moves.</li>
      <li>Place a model of a marine animal (such as a toy turtle or fish) in the water. Observe how the plastic interacts with the animal.</li>
      <li>After the experiment, attempt to remove the plastic using tools like tweezers or a small net, simulating ocean cleanup efforts.</li>
    </ol>
    <p>This experiment illustrates the challenges of plastic pollution and the difficulties involved in removing plastic from the ocean once it's been introduced.</p>
  `,
  simulation: `
    <div id="plastic-pollution-simulation">
      <!-- The simulation will be loaded here by the main script -->
    </div>
  `,
  assignment: `
    <h2>Plastic Pollution: Research and Analysis Assignment</h2>
    <ol>
      <li>Research the primary sources of plastic pollution in the ocean. Write a brief (200-300 words) summary on how plastics enter marine environments and the types of plastics that are most commonly found.</li>
      <li>Investigate three marine species that are significantly affected by plastic pollution. Describe how plastics impact their behavior, health, and survival, and discuss potential ecological consequences.</li>
      <li>Design a hypothetical experiment to test the impact of microplastics on a specific marine organism. Include:
        <ul>
          <li>A clear hypothesis</li>
          <li>Materials needed</li>
          <li>Step-by-step procedure</li>
          <li>How you would measure and analyze the results</li>
        </ul>
      </li>
      <li>Research current strategies for reducing plastic pollution in the ocean. Write a short essay (400-500 words) on one strategy, discussing its potential effectiveness, challenges, and any criticisms it may face.</li>
    </ol>
    <p>Submit your completed assignment for review and be ready to discuss your findings with your peers.</p>
  `,

  initSimulation: initPlasticPollutionSimulation,
};
