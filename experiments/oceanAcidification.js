// experiments/oceanAcidification.js
import { initOceanAcidificationSimulation } from "../simulations/oceanAcidificationSimulation.js";

export const oceanAcidification = {
  id: "ocean-acidification",
  title: "Ocean Acidification",
  theory: `
    <h2>Ocean Acidification: The Hidden Threat to Marine Life</h2>
    <p>Ocean acidification is the ongoing decrease in the pH of the Earth's oceans, caused by the uptake of carbon dioxide (CO2) from the atmosphere. This process occurs when CO2 dissolves in seawater, forming carbonic acid and increasing the concentration of hydrogen ions, which leads to a decrease in pH.</p>
    <h3>Key Points:</h3>
    <ul>
      <li>Ocean acidification is primarily caused by human activities that release CO2 into the atmosphere, such as burning fossil fuels.</li>
      <li>As oceans become more acidic, it becomes harder for marine organisms like corals, mollusks, and some plankton to form their calcium carbonate shells and skeletons.</li>
      <li>The food web and entire marine ecosystems are affected as these organisms struggle to survive in increasingly acidic waters.</li>
      <li>Ocean acidification also impacts the behavior and physiology of fish, affecting their ability to detect predators and find suitable habitats.</li>
    </ul>
    <p>Understanding and mitigating ocean acidification is crucial for preserving marine biodiversity and the health of our planet's oceans.</p>
  `,
  procedure: `
    <h2>Experiment Procedure: Demonstrating Ocean Acidification</h2>
    <ol>
      <li>Prepare two clear containers filled with seawater (or saltwater solution).</li>
      <li>Label one container as "Control" and the other as "CO2 Enriched".</li>
      <li>Measure and record the initial pH of both containers using a pH meter or pH indicator strips.</li>
      <li>Add a small piece of chalk (calcium carbonate) to each container.</li>
      <li>For the "CO2 Enriched" container, use a straw to blow bubbles into the water for about 2 minutes. This simulates the increased CO2 absorption by the ocean.</li>
      <li>Observe both containers for 30 minutes, noting any changes in the chalk pieces.</li>
      <li>After 30 minutes, measure and record the pH of both containers again.</li>
      <li>Compare the changes in pH and the condition of the chalk pieces in both containers.</li>
    </ol>
    <p>This experiment demonstrates how increased CO2 levels can lead to ocean acidification and affect calcium carbonate structures in marine organisms.</p>
  `,
  simulation: `
    <div id="ocean-acidification-simulation">
      <!-- The simulation will be loaded here by the main script -->
    </div>
  `,
  assignment: `
    <h2>Ocean Acidification: Research and Analysis Assignment</h2>
    <ol>
      <li>Research and explain the chemical process that occurs when CO2 dissolves in seawater. Write a brief explanation (200-300 words) including the relevant chemical equations.</li>
      <li>Investigate three marine species that are particularly vulnerable to ocean acidification. Describe how acidification affects each species and the potential ecological consequences.</li>
      <li>Design a hypothetical experiment to test the effects of ocean acidification on a specific marine organism of your choice. Include:
        <ul>
          <li>A clear hypothesis</li>
          <li>Materials needed</li>
          <li>Step-by-step procedure</li>
          <li>How you would measure and analyze the results</li>
        </ul>
      </li>
      <li>Research current strategies being developed or implemented to mitigate ocean acidification. Choose one strategy and write a short essay (400-500 words) discussing its potential effectiveness, challenges, and any criticisms it may face.</li>
    </ol>
    <p>Submit your completed assignment for review and feedback. Be prepared to discuss your findings and ideas in a group setting.</p>
  `,

  initSimulation: initOceanAcidificationSimulation,
};
