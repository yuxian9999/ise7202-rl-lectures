// Professor-editable source. Edit titles, HTML, and LaTeX here, then run build.mjs.
export const course = {
  number: "ISE/ECE 7202", name: "Reinforcement Learning",
  lecture: "Lecture 2: Main Concepts and Examples", professor: "Xian Yu",
  unit: "Department of Integrated Systems Engineering", institution: "The Ohio State University"
};

const agentInteraction = (observation = false) => String.raw`
  <p>At each time \(t\):</p><ul>
    <li>The agent observes \(${observation ? "o_t" : "s_t"}\)</li>
    <li>The agent takes action \(a_t\)</li>
    <li>The environment generates a reward \(r_t\)</li>
    <li>The environment ${observation ? "emits observation" : "transitions to state"} \(${observation ? "o_{t+1}" : "s_{t+1}"}\)</li>
  </ul>`;

const exampleQuestions = [
  "What are the agent, the environment, the state, the actions, and the state transitions? What about rewards?",
  "What is the optimal policy?",
  "How about the value functions? Can we use them to determine the optimal policy?",
  "Finally, what if the agent does not know the model? Can it learn the optimal policy simply by interacting with the environment?"
];

const revealExampleQuestions = active =>
  `<ul class="reveal-list">${exampleQuestions.map((q,i)=>`<li class="${i<=active?"":"muted"}">${q}</li>`).join("")}</ul>`;

const gridQuestions = active => {
  return `${revealExampleQuestions(active)}
    <figure class="grid-question-figure"><img src="assets/grid-world-policy.png" alt="A five-by-five Grid World with a robot, walls, a hazard, a goal, and an optimal path"></figure>`;
};

const gridAnnotationPage = String.raw`
  <div class="grid-answer-layout grid-annotation-layout">
    <figure><img src="assets/grid-world-policy.png" alt="A five-by-five Grid World with a robot, walls, a hazard, a goal, and an optimal path"><figcaption>One concrete deterministic Grid World</figcaption></figure>
    <div class="grid-annotation-space" aria-label="Blank space for handwritten answers"></div>
  </div>`;

const rescueRobotVisual = String.raw`
  <div class="rescue-robot-example" role="img" aria-label="A rescue robot navigating a rubble-filled building with stochastic movement and a battery level">
    <div class="rescue-map-wrap">
      <div class="rescue-map" aria-hidden="true">
        <div class="rescue-cell"></div><div class="rescue-cell"></div><div class="rescue-cell rubble">Rubble</div><div class="rescue-cell"></div><div class="rescue-cell victim"><span>V</span><small>Victim</small></div>
        <div class="rescue-cell"></div><div class="rescue-cell blocked"></div><div class="rescue-cell rubble">Rubble</div><div class="rescue-cell"></div><div class="rescue-cell"></div>
        <div class="rescue-cell charger"><span>C</span><small>Charge</small></div><div class="rescue-cell"></div><div class="rescue-cell blocked"></div><div class="rescue-cell rubble">Rubble</div><div class="rescue-cell"></div>
        <div class="rescue-cell robot"><span>R</span><small>Robot</small></div><div class="rescue-cell"></div><div class="rescue-cell"></div><div class="rescue-cell"></div><div class="rescue-cell"></div>
      </div>
      <div class="rescue-map-caption">Damaged building: locate and rescue the victim</div>
    </div>
    <div class="rescue-dynamics">
      <div class="transition-panel">
        <strong>Command: move north</strong>
        <div class="transition-row" aria-label="The robot moves left with probability 0.1, north with probability 0.8, and right with probability 0.1">
          <span>←<small>0.1</small></span><span class="intended">↑<small>0.8</small></span><span>→<small>0.1</small></span>
        </div>
        <small>Blocked moves leave the robot in place.</small>
      </div>
      <div class="battery-panel">
        <div><strong>Battery status:</strong> <span class="battery-label">60%</span></div>
        <div class="battery-shell"><span></span></div>
        <small>normal move −10% · rubble −20% · recharge → 100%</small>
      </div>
      <div class="rescue-reward"><strong>Rewards:</strong> rescue +20 · move −1 · empty battery −10</div>
    </div>
  </div>`;

const rescueRobotQuestions = active => `${revealExampleQuestions(active)}
  <figure class="grid-question-figure rescue-question-figure">${rescueRobotVisual}</figure>`;

const rescueRobotAnnotationPage = `
  <div class="grid-answer-layout grid-annotation-layout">
    <figure class="rescue-answer-figure">${rescueRobotVisual}<figcaption>Rescue Robot with stochastic transitions and battery constraints</figcaption></figure>
    <div class="grid-annotation-space" aria-label="Blank space for handwritten answers"></div>
  </div>`;

const cartPoleVisual = `
  <div class="cartpole-example" role="img" aria-label="A pole balanced on a movable cart">
    <div class="cartpole-track"></div>
    <div class="cartpole-cart"></div>
    <div class="cartpole-pole"></div>
    <div class="cartpole-pivot"></div>
    <div class="cartpole-force">← force &nbsp;&nbsp; force →</div>
  </div>`;

const cartPoleQuestions = active => `${revealExampleQuestions(active)}
  <figure class="grid-question-figure cartpole-question-figure">${cartPoleVisual}</figure>`;

const cartPoleAnnotationPage = `
  <div class="grid-answer-layout grid-annotation-layout">
    <figure class="cartpole-answer-figure">${cartPoleVisual}<figcaption>Cart-Pole control problem</figcaption></figure>
    <div class="grid-annotation-space" aria-label="Blank space for handwritten answers"></div>
  </div>`;

const llmFineTuningVisual = String.raw`
  <div class="llm-rl-example" role="img" aria-label="An LLM fine-tuning episode modeled as a reinforcement learning problem">
    <div class="llm-generation-flow">
      <div class="llm-stage llm-prompt"><strong>Prompt \(x\)</strong><small>“Explain the concept of RLHF.”</small></div>
      <div class="llm-arrow">→</div>
      <div class="llm-stage llm-policy"><strong>LLM policy</strong><span>\(\pi_\theta(a_t\mid s_t)\)</span></div>
      <div class="llm-arrow">→</div>
      <div class="llm-stage llm-response">
        <strong>Generated response \(y\)</strong>
        <small class="llm-response-sentence">“RLHF aligns models using human feedback.”</small>
        <div class="llm-tokens" aria-label="Tokens in the generated response">
          <span><small>token 1</small><b>RLHF</b></span>
          <span><small>token 2</small><b>aligns</b></span>
          <span><small>token 3</small><b>models</b></span>
          <span><small>token 4</small><b>using</b></span>
          <span><small>token 5</small><b>human</b></span>
          <span><small>token 6</small><b>feedback.</b></span>
          <span><small>end</small><b>EOS</b></span>
        </div>
      </div>
    </div>
    <div class="llm-feedback-flow">
      <div class="llm-reward-source"><strong>Reward model or human feedback</strong><span>terminal score \(R(x,y)\)</span></div>
      <div class="llm-update-loop">reward updates \(\theta\) &nbsp; ↺</div>
    </div>
  </div>`;

const llmFineTuningQuestions = active => `${revealExampleQuestions(active)}
  <figure class="grid-question-figure llm-question-figure">${llmFineTuningVisual}</figure>`;

const llmFineTuningAnnotationPage = `
  <div class="grid-answer-layout grid-annotation-layout">
    <figure class="llm-answer-figure">${llmFineTuningVisual}<figcaption>LLM fine-tuning as a reinforcement learning problem</figcaption></figure>
    <div class="grid-annotation-space" aria-label="Blank space for handwritten answers"></div>
  </div>`;

const previousLecture = showLast => `<ul>
  <li>Introduction to reinforcement learning</li>
  <li>Relation to other fields<ul>
    <li>Roots in DP. Can choose RL instead of DP when model unknown or not learnable, and to address the curse of dimensionality.</li>
    <li>Different from other ML paradigms due to evaluative feedback and sequential nature. Raises the challenge of exploration vs exploitation.</li>
  </ul></li>
  <li class="${showLast?"":"muted"}">Main elements of an RL problem: agent, action, environment, state, reward, model, policy, and value functions.</li>
</ul>`;

const modelBlock = String.raw`<ul><li><strong>Model:</strong> What the environment does next. Includes:<ul>
  <li>State transitions \(p(s,a,s')=\mathbb P(S_{t+1}=s'\mid S_t=s,A_t=a)\).</li>
  <li>Reward function \(r(s,a)=\mathbb E(R_t\mid S_t=s,A_t=a)\).</li>
</ul></li></ul>`;
const policyBlock = String.raw`<ul><li><strong>Policy:</strong> How will the agent behave?</li></ul>
  <div class="display">\[\pi(s)=a\qquad\text{(deterministic)},\]</div>
  <div class="display">\[\pi(a\mid s)=\mathbb P[A_t=a\mid S_t=s]\qquad\text{(stochastic)}.\]</div>`;
const valueBlock = String.raw`<ul><li><strong>Value function:</strong> what is the long-term “goodness” of a state?</li></ul>
  <div class="display">\[v_\pi(s)=\mathbb E_\pi[R_t+\delta R_{t+1}+\delta^2R_{t+2}+\cdots\mid S_t=s],\]</div>
  <p>where \(\delta\) is a discount factor.</p>`;
const markovBlock = String.raw`${agentInteraction(false)}<p class="spaced">In this course, we assume the state is Markovian, i.e.,</p>
  <div class="display">\[\mathbb P[S_{t+1}\mid S_t,A_t]=\mathbb P[S_{t+1}\mid S_1,S_2,\ldots,S_t,A_t]\]</div>`;
const historyBase = String.raw`<ul><li>The history is a sequence of all variables observed up to time \(t\)
  <div class="display">\[H_t:=\{o_0,a_0,r_0,o_1,a_1,r_1,o_2,a_2,r_2,\ldots,o_{t-1},a_{t-1},r_{t-1}\}.\]</div></li></ul>`;
const historyObservation = String.raw`<li><strong>Observations vs states:</strong> Not everything in the history matters for determining what happens next. The part that does, is the state. Formally, the state is a function of the history: \(S_t=f(H_t)\).</li>`;
const historyTypes = `<li>There are different states: the environment state (the information the environment uses to determine its evolution) vs. the agent state (what the agent/RL algorithm knows and uses for making decisions).</li>`;
const historyMarkov = `<li>The environment state is, by definition, an information (Markov) state.</li>`;
const historyPOMDP = `<li><strong>Observations vs states:</strong> In a perfectly observable MDP, the agent state is the environment state. In partially observable MDPs, the agent has to identify its own state representation (all the history, belief states, etc).</li>`;

export const slides = [
  {kind:"title",title:"Lecture 2: Main Concepts and Examples",body:`<div class="title-card"><div class="title-rule"></div><h1>Lecture 2: Main Concepts and Examples</h1><p class="course-line">ISE/ECE 7202 Reinforcement Learning</p><p>${course.institution}</p><p>Autumn 2026</p><p class="professor">${course.professor}</p></div>`},
  {title:"Outline",body:`<ul><li>General concepts in sequential decision making</li><li>Examples: Gridworld, Rescue Robot, Cart-Pole, LLM Fine-Tuning</li></ul>`},
  {title:"Previous lecture",body:previousLecture(false)},
  {title:"Previous lecture",body:previousLecture(true)},
  {title:"Sequential decision making",body:`<p>Recall that a key feature of reinforcement learning is its sequential nature. In a sequential decision making problem</p><ul><li>The agent is making decisions over time, with the goal of maximizing (a notion of) long-run, cumulative rewards</li><li>Agents’ actions have consequences, and in particular, may change the future states of the environment</li><li>Rewards may only be realized at a future state</li><li>Even if getting immediate rewards at each state, the agent may forgo high immediate rewards when accounting for long-term effects</li></ul>`},
  {title:"Sequential decision making",body:`<p>Recall that a key feature of reinforcement learning is its sequential nature. In a sequential decision making problem</p><ul><li>The agent is making decisions over time, with the goal of maximizing (a notion of) long-run, cumulative rewards</li><li>Agents’ actions have consequences, and in particular, may change the future states of the environment</li><li>Rewards may only be realized at a future state</li><li>Even if getting immediate rewards at each state, the agent may forgo high immediate rewards when accounting for long-term effects</li></ul><p class="spaced"><strong>Examples:</strong> playing chess, investing in the stock market, a robot on a disaster recovery mission.</p>`},
  {title:"The Agent-Environment Interaction",body:agentInteraction(false)},
  {title:"The other components of RL",body:modelBlock},
  {title:"The other components of RL",body:modelBlock+policyBlock},
  {kind:"dense",title:"The other components of RL",body:modelBlock+policyBlock+valueBlock},
  {kind:"dense",title:"The other components of RL",body:modelBlock+policyBlock+valueBlock+`<p>We’ll see these notions many more time throughout the course. We’ll look at them more carefully in our lectures on MDPs and DP.</p>`},
  {kind:"grid-question",title:"Example: Grid World",body:gridQuestions(0)},
  {kind:"grid-question",title:"Example: Grid World",body:gridQuestions(1)},
  {kind:"grid-question",title:"Example: Grid World",body:gridQuestions(2)},
  {kind:"grid-question",title:"Example: Grid World",body:gridQuestions(3)},
  {kind:"grid-answer",title:"Grid World: Answers to the Four Questions",body:gridAnnotationPage},
  {kind:"grid-answer",title:"Grid World: Answers to the Four Questions",body:gridAnnotationPage},
  {kind:"grid-question",title:"Example: Rescue Robot",body:rescueRobotQuestions(0)},
  {kind:"grid-question",title:"Example: Rescue Robot",body:rescueRobotQuestions(1)},
  {kind:"grid-question",title:"Example: Rescue Robot",body:rescueRobotQuestions(2)},
  {kind:"grid-question",title:"Example: Rescue Robot",body:rescueRobotQuestions(3)},
  {kind:"grid-answer rescue-answer",title:"Rescue Robot: Answers to the Four Questions",body:rescueRobotAnnotationPage},
  {kind:"grid-answer rescue-answer",title:"Rescue Robot: Answers to the Four Questions",body:rescueRobotAnnotationPage},
  {kind:"grid-question",title:"Example: Cart-Pole",body:cartPoleQuestions(0)},
  {kind:"grid-question",title:"Example: Cart-Pole",body:cartPoleQuestions(1)},
  {kind:"grid-question",title:"Example: Cart-Pole",body:cartPoleQuestions(2)},
  {kind:"grid-question",title:"Example: Cart-Pole",body:cartPoleQuestions(3)},
  {kind:"grid-answer",title:"Cart-Pole: Answers to the Four Questions",body:cartPoleAnnotationPage},
  {kind:"grid-answer",title:"Cart-Pole: Answers to the Four Questions",body:cartPoleAnnotationPage},
  {kind:"grid-question",title:"Example: LLM Fine-Tuning with RL",body:llmFineTuningQuestions(0)},
  {kind:"grid-question",title:"Example: LLM Fine-Tuning with RL",body:llmFineTuningQuestions(1)},
  {kind:"grid-question",title:"Example: LLM Fine-Tuning with RL",body:llmFineTuningQuestions(2)},
  {kind:"grid-question",title:"Example: LLM Fine-Tuning with RL",body:llmFineTuningQuestions(3)},
  {kind:"grid-answer llm-answer",title:"LLM Fine-Tuning: Answers to the Four Questions",body:llmFineTuningAnnotationPage},
  {kind:"grid-answer llm-answer",title:"LLM Fine-Tuning: Answers to the Four Questions",body:llmFineTuningAnnotationPage},
  {title:"Categories of RL algorithms",body:`<p>Based on the way the agent learns:</p><ul><li>Value-based (policy is implicit)</li><li>Policy-based (value functions not explicitly calculated)</li><li>Both: Actor-Critic</li></ul>`},
  {title:"Categories of RL algorithms",body:`<p>Based on the way the agent learns:</p><ul><li>Value-based (policy is implicit)</li><li>Policy-based (value functions not explicitly calculated)</li><li>Both: Actor-Critic</li></ul><p class="spaced">Another categorization:</p><ul><li>Model-free (no model, just value and/or policy functions)</li><li>Model-based (estimate the model as well)</li><li>Note: learning vs planning</li></ul>`},
  {kind:"dense",title:"The Agent-Environment Interaction",body:markovBlock},
  {kind:"dense",title:"The Agent-Environment Interaction",body:markovBlock+`<p><strong>Q:</strong> What is a Markovian state for the rescue robot example?</p>`},
  {kind:"dense",title:"The Agent-Environment Interaction",body:markovBlock+`<p><strong>Q:</strong> What is a Markovian state for the rescue robot example? <strong>Q:</strong> What about a game of chess?</p>`},
  {kind:"dense",title:"The Agent-Environment Interaction",body:markovBlock+`<p><strong>Q:</strong> What is a Markovian state for the rescue robot example? <strong>Q:</strong> What about a game of chess?</p><p class="scarlet"><strong>Observations vs states</strong></p>`},
  {kind:"dense",title:"The Agent-Environment Interaction",body:agentInteraction(true)+String.raw`<p class="spaced">In this course, we assume the state is Markovian, i.e.,</p><div class="display">\[\mathbb P[S_{t+1}\mid S_t,A_t]=\mathbb P[S_{t+1}\mid S_1,S_2,\ldots,S_t,A_t]\]</div><p><strong>Q:</strong> What is a Markovian state for the rescue robot example? <strong>Q:</strong> What about a game of chess?</p><p class="scarlet"><strong>Observations vs states</strong></p>`},
  {kind:"dense",title:"More on the state",body:historyBase+`<ul><li class="muted"><strong>Observations vs states:</strong> Not everything in the history matters for determining what happens next. The part that does, is the state. Formally, the state is a function of the history: S<sub>t</sub> = f(H<sub>t</sub>).</li></ul>`},
  {kind:"dense",title:"More on the state",body:historyBase+`<ul>${historyObservation}</ul>`},
  {kind:"dense",title:"More on the state",body:historyBase+`<ul>${historyObservation}${historyTypes}</ul>`},
  {kind:"dense",title:"More on the state",body:historyBase+`<ul>${historyObservation}${historyTypes}${historyMarkov}</ul>`},
  {kind:"dense",title:"More on the state",body:historyBase+`<ul>${historyObservation}${historyTypes}${historyMarkov}${historyPOMDP}</ul>`},
  {title:"Next lecture",body:`<ul class="spaced-list"><li>Multi-armed bandit problems</li></ul>`}
];
