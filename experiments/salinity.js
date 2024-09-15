import { initSalinitySimulation } from "../simulations/salinitySimulation.js";
import { initSalinityQuiz } from "../quizzes/salinityQuiz.js";

export const salinity = {
  id: "salinity",
  title: "Salinity and Its Effects",
  theory: `
    <h2>Salinity: Understanding Its Role in Ocean Dynamics</h2>
    <p>Salinity refers to the concentration of dissolved salts in seawater. It is a critical factor in determining the density of ocean water, which in turn influences ocean circulation, marine life distribution, and climate patterns.</p>
    <h3>Key Points:</h3>
    <ul>
      <li>Salinity is measured in parts per thousand (ppt) and varies between different regions of the ocean, influenced by factors such as evaporation, precipitation, and river inflows.</li>
      <li>Higher salinity increases the density of seawater, causing it to sink and drive deep ocean currents. Conversely, lower salinity decreases density and can lead to more buoyant water masses.</li>
      <li>Salinity gradients can create stratification in the ocean, affecting nutrient distribution and marine ecosystems.</li>
      <li>Changes in salinity can impact marine organisms, particularly those adapted to specific salinity levels, such as coral reefs and estuarine species.</li>
    </ul>
    <p>Understanding salinity and its effects is crucial for studying ocean circulation, marine habitats, and climate change.</p>
  `,
  procedure: `
    <h2>Experiment Procedure: Exploring the Effects of Salinity</h2>
    <ol>
      <li>Prepare two clear containers filled with water. Label one container as "Low Salinity" and the other as "High Salinity".</li>
      <li>In the "Low Salinity" container, add a small amount of salt and stir until it is dissolved. For the "High Salinity" container, add a larger amount of salt and stir until it is fully dissolved.</li>
      <li>Using a graduated cylinder or pipette, add a few drops of food coloring to each container. Observe how the food coloring disperses in the different salinity levels.</li>
      <li>Gently place a piece of paper or a lightweight object on the surface of the water in each container. Observe how the object behaves differently in the low and high salinity solutions.</li>
      <li>Record your observations on how varying salinity affects the density of water and the behavior of objects placed in the water.</li>
    </ol>
    <p>This experiment demonstrates how changes in salinity affect water density and how it influences the movement of objects and substances in water.</p>
  `,
  simulation: `
    <div id="salinity-simulation">
      <!-- The simulation will be loaded here by the main script -->
    </div>
  `,
  assignment: `
    <h2>Salinity: Research and Analysis Assignment</h2>
    <ol>
      <li>Explain how salinity affects ocean water density and circulation patterns. Write a brief (200-300 words) report including examples of how salinity variations impact ocean currents and marine ecosystems.</li>
      <li>Investigate three marine species that are particularly sensitive to changes in salinity. Describe how fluctuations in salinity impact their survival and behavior.</li>
      <li>Design a hypothetical experiment to test the effects of different salinity levels on a specific marine organism or water property. Include:
        <ul>
          <li>A clear hypothesis</li>
          <li>Materials needed</li>
          <li>Step-by-step procedure</li>
          <li>How you would measure and analyze the results</li>
        </ul>
      </li>
      <li>Research the impact of climate change on ocean salinity and its effects on global ocean circulation. Write a short essay (400-500 words) discussing potential changes and their implications for marine life and weather patterns.</li>
    </ol>
    <p>Submit your completed assignment for review and be prepared to discuss your findings with your group.</p>
  `,
  quiz: `
    <div id="quiz">
      <!-- The quiz will be loaded here by the initQuiz function -->
    </div>
  `,
  references: `
    <h3>Learn More About Salinity</h3>
    <div class="video-container">
      <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
    </div>
    <h4>Additional Resources:</h4>
    <ul>
      <li><a href="https://oceanservice.noaa.gov/education/tutorial_currents/03currents3.html" target="_blank">NOAA: Salinity and Ocean Currents</a></li>
      <li><a href="https://www.whoi.edu/know-your-ocean/oceanography/ocean-salinity/" target="_blank">Woods Hole Oceanographic Institution: Ocean Salinity</a></li>
      <li><a href="https://www.sciencedaily.com/terms/ocean_salinity.htm" target="_blank">Science Daily: Ocean Salinity</a></li>
    </ul>
  `,
  feedback: `
    <h3>Your Feedback is Valuable!</h3>
    <p>Please share your thoughts on the Salinity and Its Effects experiment:</p>
   <form id="feedback-form">
      <textarea id="feedback-text" rows="4" placeholder="Enter your feedback here..."></textarea>
      <button type="submit">Submit Feedback</button>
    </form>
  `,
  initSimulation: initSalinitySimulation,
  initQuiz: initSalinityQuiz,
};
