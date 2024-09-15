import { initOilSpillSimulation } from "../simulations/oilspillSimulation.js";
import { initOilSpillQuiz } from "../quizzes/oilSpillQuiz.js";

export const oilSpill = {
  id: "oil-spill",
  title: "Oil Spill Containment and Cleanup",
  theory: `
    <h2>Oil Spill: Environmental Disaster in Marine Ecosystems</h2>
    <p>Oil spills are one of the most harmful forms of marine pollution. When oil is released into the ocean, it spreads across the water’s surface, creating a slick that affects marine life, coastal ecosystems, and human activities.</p>
    <h3>Key Points:</h3>
    <ul>
      <li>Oil is less dense than water, so it spreads quickly over the ocean's surface, covering large areas.</li>
      <li>The thick, sticky nature of oil makes it difficult to clean up and can suffocate marine organisms, harm birds, and damage coral reefs.</li>
      <li>Cleanup strategies include containment booms, skimmers, dispersants, and bioremediation (using bacteria to break down oil).</li>
      <li>Oil spills also disrupt human activities such as fishing, tourism, and coastal economies, with long-term environmental and economic consequences.</li>
    </ul>
    <p>Understanding oil spill dynamics and developing effective cleanup techniques is essential to mitigate damage and protect marine ecosystems.</p>
  `,
  procedure: `
    <h2>Experiment Procedure: Simulating Oil Spill Cleanup</h2>
    <ol>
      <li>Fill a large, shallow container with water to represent the ocean.</li>
      <li>Add a small amount of vegetable oil to the surface of the water to simulate an oil spill.</li>
      <li>Observe how the oil spreads across the water’s surface.</li>
      <li>Try different cleanup methods, such as:
        <ul>
          <li>Using absorbent materials (e.g., cotton balls, paper towels) to remove the oil.</li>
          <li>Using a spoon or skimmer to remove oil from the water’s surface.</li>
          <li>Adding a few drops of dish soap to the water to simulate the use of dispersants, and observe how the oil breaks up.</li>
        </ul>
      </li>
      <li>Record which method is most effective at removing the oil from the water.</li>
    </ol>
    <p>This experiment demonstrates the challenges of cleaning up an oil spill and highlights different strategies used to contain and remove oil from marine environments.</p>
  `,
  simulation: `
    <div id="oil-spill-simulation">
      <!-- The simulation will be loaded here by the main script -->
    </div>
  `,
  assignment: `
    <h2>Oil Spill Cleanup: Research and Analysis Assignment</h2>
    <ol>
      <li>Research the causes of major oil spills in history, such as the Deepwater Horizon spill or the Exxon Valdez spill. Write a brief (200-300 words) report on one oil spill, including the cause, environmental impact, and cleanup efforts.</li>
      <li>Investigate three marine species that are particularly vulnerable to oil spills. Describe how oil pollution affects each species and the broader ecological consequences.</li>
      <li>Design a hypothetical experiment to test the effectiveness of different oil spill cleanup methods (e.g., absorbent materials, dispersants, or skimmers). Include:
        <ul>
          <li>A clear hypothesis</li>
          <li>Materials needed</li>
          <li>Step-by-step procedure</li>
          <li>How you would measure and analyze the results</li>
        </ul>
      </li>
      <li>Research current strategies for preventing and responding to oil spills. Write a short essay (400-500 words) on one strategy, discussing its potential effectiveness, challenges, and any criticisms it may face.</li>
    </ol>
    <p>Submit your completed assignment for review and be prepared to discuss your findings with your group.</p>
  `,
  quiz: `
    <div id="quiz">
      <!-- The quiz will be loaded here by the initQuiz function -->
    </div>
  `,
  references: `
    <h3>Learn More About Oil Spills</h3>
    <div class="video-container">
      <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
    </div>
    <h4>Additional Resources:</h4>
    <ul>
      <li><a href="https://www.epa.gov/oil-spills-prevention-and-preparedness-regulations" target="_blank">EPA: Oil Spills Prevention and Preparedness</a></li>
      <li><a href="https://www.nationalgeographic.com/environment/article/oil-spills" target="_blank">National Geographic: Oil Spills</a></li>
      <li><a href="https://oceanservice.noaa.gov/hazards/oilspill/" target="_blank">NOAA: Oil Spills</a></li>
    </ul>
  `,
  feedback: `
    <h3>Your Feedback is Valuable!</h3>
    <p>Please share your thoughts on the Oil Spill Containment and Cleanup experiment:</p>
    <form id="feedback-form">
      <textarea id="feedback-text" rows="4" placeholder="Enter your feedback here..."></textarea>
      <button type="submit">Submit Feedback</button>
    </form>
  `,
  initSimulation: initOilSpillSimulation,
  initQuiz: initOilSpillQuiz,
};
