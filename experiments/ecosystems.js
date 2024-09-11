// experiments/ecosystems.js
import { initEcosystemsSimulation } from "../simulations/ecosystemsSimulation.js";

export const ecosystems = {
  id: "ecosystems",
  title: "Ecosystems: The Web of Life",
  theory: `
    <h2>Ecosystems: Understanding the Interconnected Web</h2>
    <p>An ecosystem is a complex network of interactions among living organisms (plants, animals, microorganisms) and their physical environment (air, water, soil). These interactions create a dynamic system where energy and nutrients flow through various trophic levels, from producers to consumers and decomposers.</p>
    <h3>Key Points:</h3>
    <ul>
      <li>Every ecosystem is characterized by its biodiversity, including species diversity, genetic diversity, and ecosystem diversity.</li>
      <li>Energy flows through ecosystems via food chains and food webs, starting from primary producers (plants) to herbivores, carnivores, and decomposers.</li>
      <li>Nutrient cycles, such as the carbon and nitrogen cycles, are essential for maintaining ecosystem health and sustainability.</li>
      <li>Human activities, such as deforestation, pollution, and climate change, can disrupt ecosystem balance and lead to loss of biodiversity and ecosystem services.</li>
    </ul>
    <p>Studying ecosystems helps us understand the intricate relationships between organisms and their environment and the importance of preserving these systems for the health of our planet.</p>
  `,
  procedure: `
    <h2>Experiment Procedure: Exploring Ecosystem Interactions</h2>
    <ol>
      <li>Prepare three different small terrariums or aquariums to represent different types of ecosystems: a forest, a desert, and an aquatic ecosystem.</li>
      <li>In each terrarium, include a variety of plants, animals, and microorganisms appropriate for the ecosystem you are simulating. Ensure each terrarium has a source of light, water, and air to mimic natural conditions.</li>
      <li>Observe and document the interactions between different organisms within each ecosystem, noting the roles of producers, consumers, and decomposers.</li>
      <li>Simulate a disturbance in each ecosystem, such as altering the water levels or introducing a new species. Observe and record the changes in ecosystem dynamics and recovery processes.</li>
      <li>Compare the resilience and adaptability of each ecosystem to disturbances and discuss the importance of biodiversity in maintaining ecosystem stability.</li>
    </ol>
    <p>This experiment illustrates how various organisms interact within an ecosystem and how disturbances can impact the balance and health of these systems.</p>
  `,
  simulation: `
    <div id="ecosystems-simulation">
      <!-- The simulation will be loaded here by the main script -->
    </div>
  `,
  assignment: `
    <h2>Ecosystems: Research and Analysis Assignment</h2>
    <ol>
      <li>Describe the key components and processes of a specific ecosystem (e.g., a rainforest, coral reef, tundra). Write a brief report (200-300 words) including information on energy flow, nutrient cycles, and species interactions.</li>
      <li>Investigate the impact of human activities on ecosystems. Choose one human activity (e.g., deforestation, pollution) and describe how it affects ecosystem health and biodiversity.</li>
      <li>Design a hypothetical experiment to study the effects of a specific disturbance on an ecosystem of your choice. Include:
        <ul>
          <li>A clear hypothesis</li>
          <li>Materials needed</li>
          <li>Step-by-step procedure</li>
          <li>How you would measure and analyze the results</li>
        </ul>
      </li>
      <li>Research and propose strategies for ecosystem conservation and restoration. Write a short essay (400-500 words) discussing the effectiveness, challenges, and potential solutions for preserving ecosystems.</li>
    </ol>
    <p>Submit your completed assignment for review and be prepared to discuss your findings with your group.</p>
  `,

  initSimulation: initEcosystemsSimulation,
};
