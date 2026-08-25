// Professor-editable source. Edit titles, HTML, and LaTeX here, then run build.mjs.
export const course = {
  number: "ISE/ECE 7202", name: "Reinforcement Learning",
  lecture: "Lecture 3: Multi-Armed Bandits", professor: "Xian Yu",
  unit: "Department of Integrated Systems Engineering", institution: "The Ohio State University"
};

const S = String.raw;
const ul = items => `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
const reveal = (items, active) => `<ul>${items.map((item, i) => `<li class="${i <= active ? "" : "muted"}">${item}</li>`).join("")}</ul>`;
const display = latex => `<div class="display">\\[${latex}\\]</div>`;

const history = [
  S`The history is a sequence of all variables observed up to time \(t\)${display(S`H_t:=\{o_0,a_0,r_0,o_1,a_1,r_1,o_2,a_2,r_2,\ldots,o_{t-1},a_{t-1},r_{t-1}\}.`)}`,
  S`<strong>Observations vs states:</strong> Not everything in the history matters for determining what happens next. The part that does, is the state. Formally, the state is a function of the history: \(S_t=f(H_t)\).`,
  S`There are different states: the environment state \(S_t^e\) (the information the environment uses to determine its evolution) vs. the agent state \(S_t^a\) (what the agent/algorithm knows and uses for making decisions).`,
  `The environment state is, by definition, an information (Markov) state.`,
  `<strong>Observations vs states:</strong> In a perfectly observable MDP, the agent state is the environment state. In partially observable MDPs (POMDPs), the agent has to identify its own state representation (all the history, belief states, etc).`
];

const agentInteraction = observation => S`<p>At each time \(t\):</p>${ul([
  `The agent observes \\(${observation ? "o_t" : "s_t"}\\)`,
  S`The agent takes action \(a_t\)`,
  S`The environment generates a reward \(r_t\)`,
  `The environment ${observation ? "emits observation" : "changes to state"} \\(${observation ? "o_{t+1}" : "s_{t+1}"}\\)`,
  S`A trajectory is realized: \(\{${observation ? "o" : "s"}_0,a_0,r_0,${observation ? "o" : "s"}_1,a_1,r_1,\ldots\}\)`
])}<p>In this course, we assume the state is Markovian, i.e.,</p>${display(S`\mathbb P[S_{t+1}\mid S_t,A_t]=\mathbb P[S_{t+1}\mid S_1,S_2,\ldots,S_t,A_t]`)}<p><strong>Q:</strong> What is a Markovian state for the rescue robot example? <strong>Q:</strong> What about a game of chess?</p><p class="scarlet">Observations vs states</p>`;

const introMab = [
  `Recall the distinction between evaluative vs instructive feedback.`,
  `We will start looking at the effects of evaluative feedback in a problem of sequential decision making with a single state.`,
  `In particular, we study the <em>multi-armed bandit problem</em>.`,
  S`The agent repeatedly faces a choice between \(K\) actions, each with its own unknown reward distribution. At each time step, she picks one action and observes the reward. Her goal is to maximize the total expected reward over some period of time.`
];

const applications = [
  `Applications:<ul><li>Original motivation: medical trials. Different treatments are available for a certain disease and one must decide which treatment to use on the next patient.</li><li>Online services such as ad placement, packet routing in communication networks, etc.</li></ul>`,
  `For now, let us start with a simple setting: finite number of arms, non-associative (i.e., no context, state), and random rewards.`,
  `Also, for now we’ll just care about balancing exploration vs exploitation to some extent, but not doing this “efficiently”.`
];

const stochastic = [
  S`A finite set of \(K\) arms, indexed \(i=1,2,\ldots,K\).`,
  S`Let \(I_t\) be index of arm selected at time \(t\).`,
  S`If \(I_t=i\), you get i.i.d. reward \(R_{i,t}\sim\nu_i\), where \(\nu_i\) is arm \(i\)’s underlying reward distribution.`,
  S`Let \(\mu_i\) be the mean reward of arm \(i\), and ${display(S`\mu^*=\max_i\mu_i,\qquad i^*=\arg\max_i\mu_i.`)}`,
  `Learner’s goal is to maximize the total expected reward over some period of time.`
];
const stochasticBody = active => reveal(stochastic, active) + (active === 4 ? S`
  <div class="principle compact">
    <h2>MAB optimization model</h2>
    ${display(S`\max_{I_1,I_2,\ldots,I_T}\;\mathbb E\!\left[\sum_{t=1}^{T}R_{I_t,t}\right].`)}
  </div>` : "");

const explorationExample = stage => {
  const observations = stage >= 1 ? ul([
    S`At time \(t=1\), choose arm 1: \(I_1=1\), and observe \(R_{1,1}=0\).`,
    S`At time \(t=2\), choose arm 2: \(I_2=2\), and observe \(R_{2,2}=1\).`,
    S`At time \(t=3\), the sample-average estimates are \(Q_3(1)=\frac{0}{1}=0\) and \(Q_3(2)=\frac{1}{1}=1\).`
  ]) : "";
  const consequence = stage >= 2 ? S`<div class="example-consequence">
    ${display(S`I_3=\arg\max_{i\in\{1,2\}}Q_3(i)=2`)}
    <p>A greedy policy therefore keeps choosing arm 2 and never re-explores the truly optimal arm \(i^*=1\).</p>
  </div>` : "";
  const remedy = stage >= 3 ? S`<div class="principle compact exploration-remedy">
    <h2>Simple remedy: \(\epsilon\)-greedy</h2>
    <p>With probability \(1-\epsilon\), choose \(\arg\max_i Q_t(i)\); with probability \(\epsilon\), choose an arm uniformly at random.</p>
  </div>` : "";
  return S`<p><strong>Example:</strong></p>
    <div class="two-arm-setting">
      <div><span class="scarlet">Arm 1</span>: \(R_{1,t}\in\{0,1\}\), \(\mu_1=0.9\)</div>
      <div><span class="scarlet">Arm 2</span>: \(R_{2,t}\in\{0,1\}\), \(\mu_2=0.5\)</div>
    </div>
    ${observations}${consequence}${remedy}`;
};

const actionValueIntro = S`<p><span class="scarlet">Action-value function:</span> calculate the sample average of each arm</p>${display(S`Q_t(a):=\frac{\text{sum of rewards when }a\text{ taken, up to }t}{\text{number of times }a\text{ has been taken, up to }t}`)}`;
const actionValue = stage => {
  if (stage === 0) return actionValueIntro;
  const greedyEquation = display(S`A_t=\arg\max_a Q_t(a).`);
  return actionValueIntro + S`<ul>
    <li><span class="scarlet">Greedy:</span> pick the action with the highest \(Q_t(a)\), i.e.,
      <div class="${stage >= 2 ? "" : "muted"}">${greedyEquation}</div></li>
    ${stage >= 3 ? S`<li><span class="scarlet">\(\epsilon\)-greedy:</span> pick greedy action with probability \(1-\epsilon\), pick an action at random with probability \(\epsilon\).</li>` : ""}
    ${stage >= 4 ? `<li>Which one is better?</li><li>Improving greedy: optimistic initial values.</li>` : ""}
  </ul>`;
};

const nonstationary = stage => S`<p>What if the underlying distributions are time-varying?</p><ul>
  <li>Both greedy and \(\epsilon\)-greedy weigh all samples equally.</li>
  <li>To see why:${stage >= 1 ? display(S`Q_{n+1}=Q_n+\frac{1}{n}[R_n-Q_n].`) : ""}</li>
  ${stage >= 2 ? S`<li>What if we use a constant step-size \(\alpha\in(0,1]\) instead?${display(S`Q_{n+1}=Q_n+\alpha[R_n-Q_n].`)}</li>` : ""}
  ${stage >= 3 ? `<li>Note: convergence given step-size choice.</li>` : ""}
</ul>`;

const ucb = [
  S`\(\epsilon\)-greedy explores, but does so without accounting for which actions are worth exploring more/less.`,
  S`Alternative: the <em>upper-confidence bound</em> (UCB) algorithm selects actions according to ${display(S`A_t:=\arg\max_a\left[Q_t(a)+c\sqrt{\frac{\ln t}{N_t(a)}}\right]`)}`,
  S`The new term is a measure of uncertainty about \(a\)<ul><li>Accounts for how often you’ve tried \(a\) so far</li><li>If time passes but an action is not tried, uncertainty grows</li><li>\(c\) controls the exploration degree</li></ul>`,
  `Difficult to extend to deal with nonstationarity and large state spaces; we will not go over RL counterparts of UCB in this class.`
];

const gradient = [
  S`Use the soft-max function ${display(S`\pi_t(a):=\mathbb P(A_t=a)=\frac{e^{H_t(a)}}{\sum_{i=1}^{K}e^{H_t(i)}}`)}`,
  S`After choosing \(A_t\) and observing reward \(R_t\), update the “preference” \(H_t(a)\) for action \(a\) as follows:${display(S`\begin{aligned}H_{t+1}(A_t)&=H_t(A_t)+\alpha(R_t-\bar R_t)(1-\pi_t(A_t)),\\H_{t+1}(a)&=H_t(a)-\alpha(R_t-\bar R_t)\pi_t(a),\quad \text{for }a\ne A_t.\end{aligned}`)}`,
  S`\(\bar R_t\) is the average of all rewards up to time \(t\), and is used as a baseline to reduce variance.`
];

const regret = [
  S`<span class="scarlet">Regret:</span>${display(S`\operatorname{Regret}_T:=\max_{i=1,\ldots,K}\sum_{t=1}^{T}R_{i,t}-\sum_{t=1}^{T}R_{I_t,t}.`)}`,
  S`For the stochastic MAB, (pseudo-)regret is given by${display(S`\overline{\operatorname{Regret}}_T=T\mu^*-\sum_{t=1}^{T}\mathbb E[\mu_{I_t}]`)}`,
  S`The main question of interest is the dependence of the regret on the time horizon \(T\), i.e., balancing exploration and exploitation in a sophisticated way.`
];

const regretBounds = [
  S`<strong>Explore first, then Greedy:</strong> Play each arm \(N\) times, then exploit:${display(S`\overline{\operatorname{Regret}}_T\le T^{2/3}\times O(K\log(T))^{1/3}`)}`,
  S`<strong>\(\epsilon\)-greedy:</strong> choosing \(\epsilon_t=t^{-1/3}(K\log t)^{1/3}\)${display(S`\overline{\operatorname{Regret}}_t\le t^{2/3}\times O(K\log(t))^{1/3}`)}`,
  S`<strong>UCB:</strong>${display(S`\overline{\operatorname{Regret}}_T\le O(\log(T))`)}`,
  `<span class="scarlet">Regret in RL?</span>`
];
const regretBoundsBody = active => `<ul>${regretBounds.slice(0,3).map((item,i)=>`<li class="${i<=active?"":"muted"}">${item}</li>`).join("")}${active>=3?`<li>${regretBounds[3]}</li>`:""}</ul>`;

const fourArmBandit = S`<div class="four-arm-bandit" role="img" aria-label="An agent choosing among four arms with unknown reward distributions">
  <div class="bandit-agent"><span>Agent</span><small>choose \(I_t\)</small></div>
  <div class="choice-arrow">select one arm \(\longrightarrow\)</div>
  <div class="arm-row">
    ${[1,2,3,4].map(i=>`<div class="arm-machine"><span class="slot-icon" aria-hidden="true">🎰</span><strong>Arm ${i}</strong><span>\\(R_{${i},t}\\sim\\nu_${i}\\)</span></div>`).join("")}
  </div>
</div>`;

const otherMabs = [
  `Three fundamental formulations depending on the assumed nature of the rewards`,
  S`The stochastic bandits \(\rightarrow\) UCB`,
  S`The adversarial bandit \(\rightarrow\) Exp3`,
  S`The Markovian bandit \(\rightarrow\) Gittins indices`,
  `Contextual bandits`, `Bayesian bandits`, `Linear and Lipschitz bandits`, `Bandits with knapsacks`, `...`
];

export const slides = [
  {kind:"title",title:course.lecture,body:`<div class="title-card"><div class="title-rule"></div><h1>${course.lecture}</h1><p class="course-line">${course.number} ${course.name}</p><p>${course.institution}</p><p>Autumn 2026</p><p class="professor">${course.professor}</p></div>`},
  {title:"Previous lecture",body:ul([`Intro to RL and main elements in an RL problem`,`Intro example: Gridworld. Using the value function to guide action choice, without explicitly learning a model of the environment.`,`More on defining the state: Observations vs. States`])},
  {kind:"dense",title:"The Agent-Environment Interaction",body:agentInteraction(false)},
  {kind:"dense",title:"The Agent-Environment Interaction",body:agentInteraction(true)},
  ...[0,1,2,3,4].map(i=>({kind:"dense",title:"More on the state",body:reveal(history,i)})),
  {title:"Outline",body:ul([`Introduction to multi-armed bandits`,`Balancing exploration vs exploitation in MABs`,`Overview of some other MAB problems and literature`])},
  {title:"The Multi-Armed Bandit Problem (I)",body:reveal(introMab,1)},
  {title:"The Multi-Armed Bandit Problem (I)",body:reveal(introMab,3)},
  {kind:"image",title:`Side note: “Bandits”?!`,body:`<p>The “one-armed bandit”: a colloquial term for a slot machine. A gambler trying to decide which arm to pull in a casino with a row of slot machines.</p><figure class="center-figure"><img src="assets/slot-machines.jpg" alt="A cartoon showing multiple slot machines"></figure>`},
  {title:"The Multi-Armed Bandit Problem (II)",body:reveal(applications,0)},
  {title:"The Multi-Armed Bandit Problem (II)",body:reveal(applications,2)},
  ...[0,1,2,3,4].map(i=>({kind:i===4?"dense":undefined,title:"Stochastic MAB model",body:stochasticBody(i)})),
  {kind:"dense",title:"Model-based versus model-free",body:S`
    <p>Suppose the reward distributions \(\nu_i\), and therefore the means \(\mu_i\), are known.</p>
    <p>Let \(\mu^*=\max_i\mu_i,\qquad i^*=\arg\max_i\mu_i\).</p>
    <p>Let \(V_k^*\) denote the optimal expected reward from time \(k\) through the horizon \(T\).</p>
    <div class="principle">
      <h2>Model-based approach</h2>
      <p>Because there is no state and the rewards are independent across time,</p>
      ${display(S`V_k^*=(T-k+1)\mu^*`)}
      <p>and the optimal arm at time \(k\) solves</p>
      ${display(S`I_k^*=\arg\max_i\mathbb E\!\left[R_{i,k}+V_{k+1}^*\right]=\arg\max_i\mu_i=i^*.`)}
    </div>
    <p class="spaced"><span class="scarlet"><strong>Model-free challenge:</strong></span> In a bandit problem, \(\nu_i\) and \(\mu_i\) are unknown, so the learner must estimate them while collecting rewards.</p>
  `},
  ...[0,1,2,3,4].map(i=>({kind:"dense",title:"Initial ideas: Action-value methods",body:actionValue(i)})),
  ...[0,1,2,3].map(i=>({kind:"dense exploration-example",title:"Exploration vs. Exploitation",body:explorationExample(i)})),
  ...[0,1,3].map(i=>({kind:"dense",title:"Non-stationary problems",body:nonstationary(i)})),

  {kind:"dense",title:"Another idea: optimism in the face of uncertainty (UCB)",body:reveal(ucb,2)},
  {kind:"dense",title:"Another idea: optimism in the face of uncertainty (UCB)",body:reveal(ucb,3)},
  {title:"Yet another idea: gradient-based algorithm",body:`<p>So far, all the methods we saw update the action-values. What if we instead worked directly with a “policy”?</p>`},
  ...[0,1,2].map(i=>({kind:"dense",title:"Yet another idea: gradient-based algorithm",body:`<p>So far, all the methods we saw update the action-values. What if we instead worked directly with a “policy”?</p>`+reveal(gradient,i)})),
  {title:"Comparison of the various ideas",body:S`<p>Which one will do better: greedy (with optimistic initial values), \(\epsilon\)-greedy, UCB, or Gradient bandit?</p><p class="spaced scarlet">One problem on your Homework 1!</p>`},
  {title:`“Sophisticated” exploration vs exploitation: Regret`,body:`<p>Seems some algorithms do balance exploration and exploitation, but take their time. Can we formalize this?</p>`},
  ...[0,1,2].map(i=>({kind:"dense",title:`“Sophisticated” exploration vs exploitation: Regret`,body:`<p>Seems some algorithms do balance exploration and exploitation, but take their time. Can we formalize this?</p>`+reveal(regret,i)})),
  ...[0,1,2,3].map(i=>({kind:"dense",title:"UCB regret (upper) bounds¹",body:regretBoundsBody(i)+`<p class="footnote">¹ If interested, see Slivkins (2019) for derivation details.</p>`})),
  ...[0,1,2,3,8].map(i=>({kind:"dense",title:"Other MAB problems",body:reveal(otherMabs,i)})),
  {kind:"dense",title:"Additional resources to learn about MABs",body:`<p class="scarlet">Two great monographs:</p>${ul([`(on stochastic and adversarial bandits) “Regret Analysis of Stochastic and Nonstochastic Multi-armed Bandit Problems” by Sebastien Bubeck and Nicolo Cesa-Bianchi, 2012.`,`(on Markovian bandits) “Multi-armed bandit problems” by A. Mahajan and D. Teneketzis, 2008.`])}<p class="scarlet">And two textbooks, both available online (free):</p>${ul([`(a concise one) “Introduction to Multi-Armed Bandits” by Alex Slivkins.`,`(a more detailed one) “Bandit Algorithms” by T. Lattimore and Cs. Szepesvari, with the accompanying blog <span class="url">https://banditalgs.com/about/</span>.`])}`},
  {title:"Next time",body:ul([`Markov Decision Processes`,`Homework 1 is posted and is due on 9/17.`])}
];
