// Professor-editable source. Edit titles, HTML, and LaTeX here, then run build.mjs.
// Rebuilt natively from introduction.pdf and 1_ Introduction.pdf.
export const course = {
  number: "ISE/ECE 7202", name: "Reinforcement Learning",
  lecture: "Lecture 1: Introduction", professor: "Xian Yu",
  unit: "Department of Integrated Systems Engineering", institution: "The Ohio State University"
};

const ul = items => `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
const visible = (items, active) => ul(items.map((item, index) =>
  `<span class="${index <= active ? "" : "muted"}">${item}</span>`));
const display = latex => `<div class="display">\\[${latex}\\]</div>`;

const interaction = (active = 3) => `
  <div class="interaction-layout">
    <div class="interaction-node agent-node">Agent<br><small>learner / controller</small></div>
    <div class="interaction-arrow action-arrow ${active >= 1 ? "" : "muted-diagram"}"><span>action \\(A_t\\)</span><b>↓</b></div>
    <div class="interaction-node environment-node">Environment<br><small>dynamical system</small></div>
    <div class="interaction-arrow feedback-arrow ${active >= 2 ? "" : "muted-diagram"}"><b>↑</b><span>state \\(S_{t+1}\\) · reward \\(R_{t+1}\\)</span></div>
  </div>
  <p class="interaction-caption ${active >= 3 ? "" : "muted"}">Learning occurs through repeated interaction—not from a fixed list of correct actions.</p>`;

const mainFeatures = [
  "Discover useful actions by trying them: <strong>trial-and-error search</strong>.",
  "The current action changes what state the agent encounters next.",
  "Evaluate behavior by <strong>long-term return</strong>, not only immediate reward.",
  "The agent must balance <strong>exploration</strong> and <strong>exploitation</strong>."
];

const cartPole = `
  <div class="example-layout">
    <div>${ul([
      "<strong>Objective:</strong> balance a pole on a movable cart.",
      "<strong>State:</strong> pole angle, cart position, and velocities.",
      "<strong>Action:</strong> apply a horizontal force.",
      "<strong>Reward:</strong> one unit for each step the pole remains upright."
    ])}</div>
    <div class="cartpole-diagram" aria-label="Cart-pole illustration"><div class="track"></div><div class="cart"></div><div class="pole"></div></div>
  </div>`;

const tetris = `
  <div class="example-layout">
    <div>${ul([
      "<strong>Objective:</strong> stay in the game as long as possible.",
      "<strong>State:</strong> the configuration of the tiles.",
      "<strong>Action:</strong> choose the orientation and placement of the falling piece.",
      "<strong>Reward:</strong> survive and clear lines."
    ])}</div>
    <div class="tetris-board" role="img" aria-label="Stylized Tetris board">
      ${Array.from({length: 60}, (_, i) => `<span class="${[40,41,42,43,46,47,48,51,52,53,54,55,56,57,58,59].includes(i) ? "filled" : i === 17 || i === 18 || i === 23 ? "falling" : ""}"></span>`).join("")}
    </div>
  </div>`;

const goExample = `
  <div class="example-layout">
    <div>${ul([
      "<strong>Objective:</strong> win the game.",
      "<strong>State:</strong> the board position.",
      "<strong>Action:</strong> place the next stone.",
      "<strong>Reward:</strong> final game outcome."
    ])}</div>
    <div class="go-board" role="img" aria-label="Stylized Go board">
      ${Array.from({length: 81}, (_, i) => `<span class="${[11,15,20,30,38,47,56,66].includes(i) ? "black" : [13,23,28,40,48,58,68].includes(i) ? "white" : ""}"></span>`).join("")}
    </div>
  </div>`;

const driving = `
  <div class="example-layout">
    <div>${ul([
      "<strong>Objective:</strong> safe and efficient transportation.",
      "<strong>State:</strong> the vehicle and surrounding environment.",
      "<strong>Action:</strong> steering, braking, and acceleration.",
      "<strong>Reward:</strong> progress, lane keeping, comfort, and safety."
    ])}</div>
    <div class="road-scene" role="img" aria-label="Stylized self-driving road scene"><div class="lane left-lane"></div><div class="lane right-lane"></div><div class="car-icon">▲</div><div class="sensor-cone"></div></div>
  </div>`;

const dpOverview = stage => `<div class="dp-overview">
  <p class="dp-kicker">Optimal control and operations research, in particular dynamic programming</p>
  <ul>
    <li>In principle, the sequential decision problems we study in this course are solvable by DP.</li>
    <li>Many of the algorithms we see in this course are rooted in DP ideas.</li>
    <li>Hence the equivalent names “approximate dynamic programming” and “neuro-dynamic programming”.</li>
    <li class="${stage >= 1 ? "" : "muted"}">We will see that RL can be used as opposed to DP in problems where:
      <ol>
        <li class="${stage >= 1 ? "" : "muted"}">the environment model is not fully known to the agent,</li>
        <li class="${stage >= 2 ? "" : "muted"}">(typically) the agent is not trying to learn the dynamics of the environment, and</li>
        <li class="${stage >= 3 ? "" : "muted"}">parameterized approximations can be used to address DP’s “curse of dimensionality”.</li>
      </ol>
    </li>
  </ul>
</div>`;

const mlRelation = [
  "<strong>Supervised learning:</strong> learns from labeled examples containing a target or correct response.",
  "<strong>Unsupervised learning:</strong> uncovers structure in data, but the discovered structure need not optimize reward.",
  "<strong>Reinforcement learning:</strong> receives evaluative feedback from consequences rather than instructions about the correct action.",
  "RL is distinguished by evaluative feedback and sequential consequences—hence exploration versus exploitation."
];

const mlCycle = (stage, withCaption = false) => `<div class="ml-cycle-stack">
  <div class="ml-cycle" aria-label="Agent and environment interaction">
      <div class="ml-cycle-box ml-agent">Agent</div>
      <div class="ml-cycle-label ml-action ${stage >= 1 ? "" : "muted-diagram"}">Action <span>↓</span></div>
      <div class="ml-cycle-label ml-state ${stage >= 2 ? "" : "muted-diagram"}">State <span>↑</span></div>
      <div class="ml-cycle-box ml-environment">Environment</div>
    </div>
    ${withCaption ? '<p class="ml-cycle-caption">Learning occurs through repeated interaction—not from a fixed list of correct actions.</p>' : ""}
  </div>`;

const mlOverview = stage => {
  const supervised = `<strong>Difference from supervised learning</strong><ul>
    <li>No access to labelled data containing a state and the <span class="scarlet"><strong>correct</strong></span> action (instructive feedback).</li>
    ${stage >= 1 ? "<li><strong>RL:</strong> learning from its own experience—the agent has to explore (evaluative feedback).</li>" : ""}
  </ul>`;
  const items = [supervised];
  if (stage >= 2) items.push("<strong>Difference from unsupervised learning</strong><ul><li>Unsupervised learning finds hidden structure, e.g. clustering using PCA or K-means.</li><li><strong>RL:</strong> maximizing the long-term return.</li></ul>");
  if (stage >= 3) items.push("<strong>RL:</strong> data-driven decision/control engines instead of knowledge engines.");
  return `<div class="ml-overview-layout">${mlCycle(2)}<div>${ul(items)}</div></div>`;
};

const dpNetworkAnnotations = stage => [
  stage >= 1 ? String.raw`
    <span class="dp-path-value dp-v-top-3">\(5\)</span>
    <span class="dp-path-value dp-v-bottom-3">\(6\)</span>
    <span class="dp-destination-note">Distance to<br>destination</span>` : "",
  stage >= 2 ? String.raw`
    <span class="dp-path-value dp-v-top-2">\(6=\min\{6,8\}\)</span>
    <span class="dp-path-value dp-v-bottom-2">\(8=\min\{8,8\}\)</span>` : "",
  stage >= 3 ? String.raw`
    <span class="dp-path-value dp-v-start">\(10\)</span>
    <span class="dp-path-value dp-v-top-1">\(9\)</span>
    <span class="dp-path-value dp-v-bottom-1">\(10\)</span>` : ""
].join("");

const dpNetworkSvg = `<svg class="dp-network-svg" viewBox="0 0 720 250" role="img" aria-labelledby="dp-network-title dp-network-description">
  <title id="dp-network-title">Layered shortest-path network</title>
  <desc id="dp-network-description">A directed graph from source S through three stages of two nodes to destination D, with a cost on every edge.</desc>
  <defs><marker id="dp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>
  <g class="dp-network-edges">
    <line x1="84" y1="109" x2="170" y2="76"></line><line x1="84" y1="141" x2="170" y2="174"></line>
    <line x1="244" y1="62" x2="322" y2="62"></line><line x1="235" y1="89" x2="333" y2="159"></line>
    <line x1="235" y1="159" x2="333" y2="89"></line><line x1="244" y1="185" x2="322" y2="185"></line>
    <line x1="397" y1="62" x2="475" y2="62"></line><line x1="388" y1="89" x2="486" y2="159"></line>
    <line x1="388" y1="159" x2="486" y2="89"></line><line x1="397" y1="185" x2="475" y2="185"></line>
    <line x1="546" y1="80" x2="632" y2="110"></line><line x1="546" y1="168" x2="632" y2="140"></line>
  </g>
  <g class="dp-network-nodes">
    <circle cx="52" cy="125" r="36"></circle><circle cx="207" cy="62" r="36"></circle><circle cx="207" cy="185" r="36"></circle>
    <circle cx="360" cy="62" r="36"></circle><circle cx="360" cy="185" r="36"></circle><circle cx="513" cy="62" r="36"></circle><circle cx="513" cy="185" r="36"></circle><circle cx="668" cy="125" r="36"></circle>
  </g>
  <g class="dp-node-labels"><text x="52" y="137">S</text><text x="668" y="137">D</text></g>
  <g class="dp-edge-labels">
    <text x="125" y="93">1</text><text x="125" y="166">2</text><text x="283" y="53">3</text><text x="255" y="119">4</text><text x="310" y="119">4</text><text x="283" y="194">6</text>
    <text x="436" y="53">1</text><text x="409" y="119">2</text><text x="464" y="119">3</text><text x="436" y="194">2</text><text x="594" y="94">5</text><text x="594" y="166">6</text>
  </g>
</svg>`;

const dpNetworkFigure = (stage = 0) => `<div class="dp-network-figure">
  ${dpNetworkSvg}
  ${dpNetworkAnnotations(stage)}
</div>`;

const dpNetworkIntro = mode => `<div class="dp-network-intro">
  ${dpNetworkFigure()}
  <p>Find the shortest path from S to D.</p>
  ${mode === "exclusive"
    ? String.raw`<p class="dp-method"><strong>Exclusive search (forward search):</strong><br>number of possible paths \(=2\times2\times2=8\)</p>`
    : `<p class="dp-method"><strong>DP (backward search):</strong><br>start from the destination</p>`}
</div>`;

const dpNetworkComputation = stage => String.raw`<div class="dp-network-computation">
  <p>Find the shortest path from S to D.<br>DP: backward search.</p>
  <ul>
    <li>Calculate the shortest distance from a current node to destination D.</li>
    <li>Each calculation is a comparison of two choices (numbers).</li>
  </ul>
  ${dpNetworkFigure(stage)}
  <p class="dp-comparison-count ${stage >= 3 ? "" : "muted"}">\(1+2+2+1=6\) comparisons</p>
</div>`;

const shortestPathPrinciple = stage => String.raw`<div class="dp-shortest-path-principle">
  <p>How to find the shortest distance to a node (say node \(i\)) from any other node?</p>
  ${stage === 0 ? "" : String.raw`<section class="dp-principle-card">
    <h2>Dynamic Programming Principle</h2>
    <p>\(\mathcal N(j)\): set of outgoing neighbors of node \(j\)<br>
    \(c(j,k)\): distance of edge from node \(j\) to node \(k\), denoted by \((j,k)\)</p>
    ${display(String.raw`d(j,i)=\min_{k\in\mathcal N(j)}\bigl\{c(j,k)+d(k,i)\bigr\}`)}
    ${stage === 2 ? String.raw`<div class="dp-proof-row"><span>1</span><div><p><strong>“\(\le\)” proof:</strong> a shortest path from \(j\) to \(i\) has to go through \(\mathcal N(j)\).</p>${display(String.raw`d(j,i)\le c(j,k)+d(k,i),\qquad \forall k\in\mathcal N(j)`)}</div></div>` : ""}
    ${stage === 3 ? String.raw`<div class="dp-proof-row"><span>1</span><div><p><strong>“\(\ge\)” proof:</strong> if \(P_{j\to i}\) is a shortest path and goes through \(k^*\in\mathcal N(j)\), then the subpath from \(k^*\) to \(i\) is also a shortest path.</p>${display(String.raw`d(j,i)=c(j,k^*)+d(k^*,i)\ge\min_{k\in\mathcal N(j)}\bigl\{c(j,k)+d(k,i)\bigr\}`)}<p>We therefore conclude:</p>${display(String.raw`d(j,i)=\min_{k\in\mathcal N(j)}\bigl\{c(j,k)+d(k,i)\bigr\}`)}</div></div>` : ""}
  </section>`}
</div>`;

const finiteHorizonSystem = withExample => String.raw`<div class="finite-dp-layout">
  <p>System equation:</p>
  ${display(String.raw`x_{k+1}=f_k(x_k,u_k),\qquad k=0,1,\ldots,N-1`)}
  <p class="finite-dp-definitions">\(x_k\): system state at time \(k\), &nbsp; \(u_k\): control at time \(k\)</p>
  ${withExample ? String.raw`<div class="finite-dp-example"><p>In the shortest path problem,</p><p>\(x_k\): on the top or bottom node at stage \(k\)<br>\(u_k\): move up or down at stage \(k\)</p></div>` : ""}
</div>`;

const finiteHorizonCost = withOptimum => String.raw`<div class="finite-dp-layout">
  <p>For given initial state \(x_0\), the cost over control sequence \((u_0,u_1,\ldots,u_{N-1})\) is defined to be</p>
  ${display(String.raw`J(x_0;u_0,\ldots,u_{N-1})=g_N(x_N)+\sum_{k=0}^{N-1}g_k(x_k,u_k)`)}
  ${withOptimum ? `<div class="finite-dp-optimum"><p>Optimal cost and optimal control:</p>${display(String.raw`J^*(x_0)=\min_{u_0,\ldots,u_{N-1}}J(x_0;u_0,\ldots,u_{N-1})`)}</div>` : ""}
</div>`;

const finiteHorizonBackward = withRecursion => String.raw`<div class="finite-dp-layout finite-dp-backward">
  <p>Backward computation:</p>
  <div class="terminal-cost">${display(String.raw`J_N^*(x_N)=g_N(x_N).`)}<span>(trivial)</span></div>
  ${withRecursion ? String.raw`<p>According to the DP principle,</p>
    ${display(String.raw`J_{N-1}^*(x_{N-1})=\min_{u_{N-1}}\left(g_{N-1}(x_{N-1},u_{N-1})+J_N^*\!\left(f(x_{N-1},u_{N-1})\right)\right)`)}
    <p>where we assume \(f_k(\cdot)=f(\cdot)\) for all \(k\). In general,</p>
    ${display(String.raw`J_k^*(x_k)=\min_{u_k}\left(g_k(x_k,u_k)+J_{k+1}^*\!\left(f(x_k,u_k)\right)\right).`)}`
    : `<p>In the shortest path problem, we have</p>${display(String.raw`g_N(x_N)=0.`)}`}
</div>`;

const stochasticValueLabels = values => Object.entries(values).map(([position, value]) =>
  String.raw`<span class="stochastic-value stochastic-value-${position}">\(${value}\)</span>`).join("");

const stochasticNetworkFigure = ({highlight = "", values = {}, actions = false, axis = false} = {}) => `<div class="stochastic-network-stack">
  <div class="dp-network-figure stochastic-network-figure ${highlight}">
    ${dpNetworkSvg}
    ${actions ? '<span class="stochastic-action stochastic-action-up">Up</span><span class="stochastic-action stochastic-action-down">Down</span>' : ""}
    ${stochasticValueLabels(values)}
  </div>
  ${axis ? '<div class="stochastic-stage-axis"><strong>stage</strong><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></div>' : ""}
</div>`;

const stochasticIntro = () => String.raw`<div class="stochastic-intro">
  ${stochasticNetworkFigure({actions:true})}
  <p>Find the shortest path from S to D. Actions \(\in\{\mathrm{up},\mathrm{down}\}\).</p>
  <div class="stochastic-transition-grid">
    <span>\(u_k=\mathrm{up}\Rightarrow\)</span>
    <span>\(\begin{cases}P(x_{k+1}=\mathrm{top})=0.6\\P(x_{k+1}=\mathrm{bottom})=0.4\end{cases}\)</span>
    <span>\(u_k=\mathrm{down}\Rightarrow\)</span>
    <span>\(\begin{cases}P(x_{k+1}=\mathrm{top})=0.4\\P(x_{k+1}=\mathrm{bottom})=0.6\end{cases}\)</span>
  </div>
</div>`;

const stochasticPolicy = stage => String.raw`<div class="stochastic-policy">
  ${stochasticNetworkFigure({actions:true})}
  <p><strong>Optimal policy:</strong></p>
  <p class="stochastic-fixed-sequence ${stage >= 2 ? "rejected" : ""}">A fixed sequence \((u_0,u_1,\ldots,u_{N-1})\)?</p>
  ${stage >= 1 ? '<p class="stochastic-no">NO.</p>' : ""}
  ${stage >= 2 ? '<p class="stochastic-state-policy">State-dependent policy: \\(u_k^*(x_k),\\;\\forall x_k\\)</p>' : ""}
</div>`;

const stochasticCostExample = stage => {
  if (stage === 0) return String.raw`<div class="stochastic-cost-example stochastic-recursion-finish">
    ${stochasticNetworkFigure({highlight:"highlight-stage-3", values:{"top-3":"5","bottom-3":"6"}})}
    <p>The red nodes have only one possible path to reach node D.</p>
    <ul>
      <li>Cost-to-go from the top node: \(5\)</li>
      <li>Cost-to-go from the bottom node: \(6\)</li>
      <li class="stochastic-optimum">\(J_3^*(T)=5,\qquad J_3^*(B)=6\)</li>
      <li class="stochastic-optimum">\(u_3^*(T)=u_3^*(B)=\text{go to D}\)</li>
    </ul>
  </div>`;
  if (stage === 1) return String.raw`<div class="stochastic-cost-example stochastic-recursion-finish">
    ${stochasticNetworkFigure({highlight:"highlight-top-2", values:{"top-2":"6.8","top-3":"5","bottom-3":"6"}})}
    <p class="stochastic-current-state"><strong>Current state:</strong> \(x_2=T\)</p>
    <ul>
      <li>Cost-to-go with action Up: \(0.6(1+5)+0.4(2+6)=3.6+3.2=6.8\)</li>
      <li>Cost-to-go with action Down: \(0.4\times6+0.6\times8=7.2\)</li>
      <li class="stochastic-optimum">\(J_2^*(T)=6.8,\qquad u_2^*(T)=\mathrm{up}\)</li>
    </ul>
  </div>`;
  return String.raw`<div class="stochastic-cost-example stochastic-recursion-finish">
    ${stochasticNetworkFigure({highlight:"highlight-bottom-2", values:{"bottom-2":"8","top-3":"5","bottom-3":"6"}})}
    <p class="stochastic-current-state"><strong>Current state:</strong> \(x_2=B\)</p>
    <ul>
      <li>Cost-to-go with action Up: \(0.6(3+5)+0.4(2+6)=8\)</li>
      <li>Cost-to-go with action Down: \(0.4\times8+0.6\times8=8\)</li>
      <li class="stochastic-optimum">\(J_2^*(B)=8,\qquad u_2^*(B)\in\{\mathrm{up},\mathrm{down}\}\)</li>
    </ul>
  </div>`;
};

const stochasticDPDefinition = String.raw`<div class="stochastic-definition">
  <p>Random transitions \(P(x_{k+1}\mid x_k,u_k)\)</p>
  <p>Cost function:</p>
  ${display(String.raw`E\!\left[g_N(x_N)+\sum_{k=0}^{N-1}g_k(x_k,u_k)\right]`)}
  <p>Given initial state \(x_0\), find a policy</p>
  ${display(String.raw`\pi=\{\mu_0,\mu_1(x_1),\ldots,\mu_{N-1}(x_{N-1})\}`)}
  <p>that minimizes</p>
  ${display(String.raw`J(x_0)=\min_{\pi}E\!\left[g_N(x_N)+\sum_{k=0}^{N-1}g_k\!\left(x_k,\mu_k(x_k)\right)\right]`)}
</div>`;

const stochasticBackwardForward = stage => String.raw`<div class="stochastic-backward-forward">
  <section class="stochastic-algorithm-item">
    <p><strong class="scarlet">Backward pass</strong> for calculating the optimal cost-to-go.</p>
    <p>Starting from \(J_N^*(x_N)=g_N(x_N)\), \(\forall x_N\), calculate</p>
    ${display(String.raw`J_k^*(x_k)=\min_{u_k}E\!\left[g_k(x_k,u_k)+J_{k+1}^*(x_{k+1})\right],`)}
    <p class="stochastic-expectation-note">where both terms inside the expectation are random variables based on \(P(x_{k+1}\mid x_k,u_k)\).</p>
  </section>
  ${stage >= 1 ? String.raw`<section class="stochastic-algorithm-item">
    <p><strong class="scarlet">Forward pass</strong> to find the optimal policy:</p>
    <p>Given state \(x_k\) and \(J_{k+1}^*(x_{k+1})\),</p>
    ${display(String.raw`u_k^*\in\arg\min_{u_k}E\!\left[g_k(x_k,u_k)+J_{k+1}^*(x_{k+1})\right]`)}
  </section>` : ""}
  ${stage >= 2 ? '<section class="stochastic-algorithm-item"><p><strong class="scarlet">Backward-forward algorithm:</strong> first compute \\(J_k^*\\) backward, then find \\(u_k^*\\) forward.</p></section>' : ""}
</div>`;

const stochasticRecursionFinish = stage => {
  const configurations = [
    {
      highlight:"highlight-top-1",
      values:{"top-1":"10.68","top-2":"6.8","bottom-2":"8","top-3":"5","bottom-3":"6"},
      state:String.raw`\(x_1=T\)`,
      up:String.raw`0.6(3+6.8)+0.4(4+8)=10.68`,
      down:String.raw`0.4(3+6.8)+0.6(4+8)=11.12`,
      optimum:String.raw`J_1^*(T)=10.68,\qquad u_1^*(T)=\mathrm{up}`
    },
    {
      highlight:"highlight-bottom-1",
      values:{"top-1":"10.68","bottom-1":"12.08","top-2":"6.8","bottom-2":"8","top-3":"5","bottom-3":"6"},
      state:String.raw`\(x_1=B\)`,
      up:String.raw`0.6(4+6.8)+0.4(6+8)=12.08`,
      down:String.raw`0.4(4+6.8)+0.6(6+8)=12.72`,
      optimum:String.raw`J_1^*(B)=12.08,\qquad u_1^*(B)=\mathrm{up}`
    },
    {
      highlight:"highlight-start",
      values:{"start":"12.64","top-1":"10.68","bottom-1":"12.08","top-2":"6.8","bottom-2":"8","top-3":"5","bottom-3":"6"},
      state:String.raw`\(x_0=S\)`,
      up:String.raw`0.6(1+10.68)+0.4(2+12.08)=12.64`,
      down:String.raw`0.4(1+10.68)+0.6(2+12.08)=13.12`,
      optimum:String.raw`J_0^*(S)=12.64,\qquad u_0^*(S)=\mathrm{up}`
    }
  ];
  const current = configurations[stage];
  return String.raw`<div class="stochastic-cost-example stochastic-recursion-finish">
    ${stochasticNetworkFigure({highlight:current.highlight, values:current.values})}
    <p class="stochastic-current-state"><strong>Current state:</strong> ${current.state}</p>
    <ul>
      <li>Cost-to-go with action Up: \(${current.up}\)</li>
      <li>Cost-to-go with action Down: \(${current.down}\)</li>
      <li class="stochastic-optimum">\(${current.optimum}\)</li>
    </ul>
  </div>`;
};

const bellmanDifficultyItems = [
  {
    problem:String.raw`Model-based: need to know \(P(X_{k+1}\mid X_k,U_k)\).`,
    solution:String.raw`\(\rightarrow\) model-free, data-driven methods`
  },
  {
    problem:String.raw`Curse of dimensionality: large state and action spaces (the \(9\times9\) Go game has \(10^{35}\) states).`,
    solution:String.raw`\(\rightarrow\) function approximation`
  },
  {
    problem:"Find the minimum.",
    solution:String.raw`\(\rightarrow\) actor-critic, policy gradient`
  }
];

const bellmanEquationSlide = (problemCount, solutionCount) => String.raw`<div class="bellman-equation-slide">
  <p>The Bellman Equation:</p>
  ${display(String.raw`\begin{aligned}J_k^*(x_k)&=\min_{u_k}E\!\left[g_k(x_k,u_k)+J_{k+1}^*(x_{k+1})\right]\\&=\min_{u_k}\left[\sum_g g\,P(g_k=g\mid x_k,u_k)+\sum_xJ_{k+1}^*(x)P(x_{k+1}=x\mid x_k,u_k)\right].\end{aligned}`)}
  <p>Difficulties in solving the Bellman equation:</p>
  <ol class="bellman-difficulties">
    ${bellmanDifficultyItems.slice(0, problemCount).map((item, index) => `<li>${item.problem}${index < solutionCount ? `<span class="bellman-solution">${item.solution}</span>` : ""}</li>`).join("")}
  </ol>
</div>`;

const elements = [
  "<strong>Agent and actions:</strong> the decision maker and the choices available to it.",
  "<strong>Environment and state:</strong> what the agent interacts with and the information describing the current situation.",
  "<strong>Model:</strong> how actions influence the next state and reward; methods may be model-based or model-free.",
  "<strong>Policy:</strong> how the agent chooses actions, deterministically or stochastically."
];

const challengesAndLimitations = `<ul class="notes-challenges-list">
  <li>Defining and representing the state is challenging. We abstract from it and focus on decision making only.</li>
  <li>Reward function design and shaping: choosing the size of rewards, addressing reward sparsity.</li>
  <li>Design of other elements of the RL system in simulations: the environment, choice of action space, etc.</li>
  <li>Words (or videos) of caution :)
    <ul>
      <li>RL does what you told it to do, even if that is not what you intended (the Cobra Effect)
        <ul>
          <li>RL for improving agent design <a href="https://storage.googleapis.com/quickdraw-models/sketchRNN/designrl/bipedhard_compare_vs_augment.mp4" target="_blank" rel="noopener noreferrer">[Link 1]</a> <a href="https://storage.googleapis.com/quickdraw-models/sketchRNN/designrl/augmentbipedhard.lognormal.blooper.mp4" target="_blank" rel="noopener noreferrer">[Link 2]</a></li>
          <li>Let’s play a game <a href="https://www.youtube.com/watch?v=tlOIHko8ySg" target="_blank" rel="noopener noreferrer">[Link]</a></li>
        </ul>
      </li>
      <li>Local optimal are hard to escape: Half Cheetah example <a href="https://www.alexirpan.com/public/rl-hard/upright_half_cheetah.mp4" target="_blank" rel="noopener noreferrer">[Link 1]</a> <a href="https://www.alexirpan.com/public/rl-hard/upsidedown_half_cheetah.mp4" target="_blank" rel="noopener noreferrer">[Link 2]</a></li>
    </ul>
  </li>
</ul>`;

const courseTopics = `<div class="course-topic-grid">
  <section><h2>Background and formalization</h2>${ul([
    "Simple examples and terminology (×1)",
    "Multi-armed bandits (×2)",
    "Markov decision processes (MDPs) (×3)"
  ])}</section>
  <section><h2>Tabular methods</h2>${ul([
    "Dynamic programming (×3–4)",
    "Monte Carlo methods (×2)",
    "Temporal difference methods, e.g. Q-learning (×2)",
    "Summary and other methods (×1)"
  ])}</section>
  <section><h2>Approximate solution methods</h2>${ul([
    "RL with function approximation (×4)",
    "Policy gradient methods (×2)",
    "Actor-critic methods (×1)",
    "Summary and other methods (×1)"
  ])}</section>
  <section><h2>Advanced topics</h2>${ul(["Deep RL algorithms"])}</section>
</div>`;

const logistics = (kicker, items) => `<div class="logistics-layout">
  <p class="logistics-kicker">${kicker}</p>
  <ul class="logistics-list">${items.map(item => `<li>${item}</li>`).join("")}</ul>
</div>`;

const courseLogisticsSlides = [
  {kind:"logistics-slide",title:"Course logistics",body:logistics("Meeting and instructor",[
    "<strong>Lectures:</strong> Tuesday and Thursday, 3:00–4:20 PM, Bolz Hall 128.",
    "<strong>Instructor:</strong> Xian Yu, yu.3610@osu.edu.",
    "<strong>Office hours:</strong> Tuesday and Thursday, 4:30–5:30 PM, 246 Baker Systems Engineering, by appointment.",
    "Please email at least one day in advance to schedule an office-hours appointment."
  ])},
  {kind:"logistics-slide",title:"Course logistics",body:logistics("Assessment and grading",[
    "<strong>Homework assignments:</strong> 20% — four assignments, five points each.",
    "<strong>Paper presentation:</strong> 30%.",
    "<strong>Final project:</strong> 40%.",
    "<strong>In-class participation:</strong> 10%.",
    "Homework is submitted electronically through the Carmen dropbox by 11:59 PM on the corresponding Thursday."
  ])},
  {kind:"logistics-slide",title:"Course logistics",body:logistics("Paper presentation",[
    "Students will form groups of two, and each group will choose one relevant paper to present in class.",
    "Choose a paper using the <a href=\"https://docs.google.com/spreadsheets/d/1ZRcN3J9tIXX456T8XAFPV0t0ejC8NKtn2CxK23UXQOA/edit?usp=sharing\" target=\"_blank\" rel=\"noopener noreferrer\">signup sheet</a>, or email the instructor to propose another relevant paper.",
    "Each paper includes a 20-minute presentation; attendance at classmates’ presentations is required.",
    "Planned presentation dates are October 1, November 5, and November 24; the course schedule is subject to change."
  ])},
  {kind:"logistics-slide",title:"Course logistics",body:logistics("Final project",[
    "Students will form groups of two, and each group will choose to finish a project related to RL.",
    "Potential project ideas include but are not limited to i) nontrivial extension of the results introduced in class; ii) novel applications in your own research area; iii) new theoretical analysis of an existing algorithm, etc.",
    "The final report should use the ICML format and should be limited to six pages.",
    "Each project includes a 20-minute presentation; attendance at classmates’ presentations is required.",
    "Presentations: December 1, 3, and 8. Final report due: December 15."
  ])}
];

export const slides = [
  {kind:"title",title:course.lecture,body:`<div class="title-card"><div class="title-rule"></div><h1>${course.lecture}</h1><p class="course-line">${course.number} ${course.name}</p><p>${course.institution}</p><p>Autumn 2026</p><p class="professor">${course.professor}</p></div>`},
  {title:"Outline",body:`<ol class="outline-list">
    <li>What reinforcement learning is</li>
    <li>Defining features and connections to other fields</li>
    <li>Course logistics</li>
    <li>Core elements</li>
    <li>Course roadmap and challenges</li>
  </ol>`},

  {kind:"rl-definition-uniform",title:"What is reinforcement learning?",body:`<p>Informally speaking, reinforcement learning is learning how to behave optimally in an unknown environment through <span class="scarlet"><strong>trial and error</strong></span>.</p><p>More formally, an agent observes its <span class="scarlet"><strong>environment</strong></span>, takes an <span class="scarlet"><strong>action</strong></span>, observes the <span class="scarlet"><strong>consequences</strong></span>, and uses <span class="scarlet"><strong>&quot;reinforcements&quot; or &quot;rewards&quot;</strong></span> to improve future behavior toward a long-term goal.</p>`},

  {kind:"ml-cycle-slide",title:"Learning from interaction",body:mlCycle(1)},
  {kind:"ml-cycle-slide",title:"Learning from interaction",body:mlCycle(2, true)},

  ...[0,1,2,3].map(i => ({title:"Defining features of reinforcement learning",body:visible(mainFeatures,i)})),

  {kind:"example-slide",title:"Example: Cart-Pole",body:cartPole},
  {kind:"example-slide",title:"Example: Tetris",body:tetris},
  {kind:"example-slide",title:"Example: Go",body:goExample},
  {kind:"example-slide",title:"Example: Self-Driving",body:driving},

  {title:"Why is reinforcement learning exciting?",body:ul([
    "Game-playing systems such as AlphaGo, AlphaGo Zero, and MuZero reached or exceeded expert human performance.",
    "Later systems learned from self-play rather than examples of human play.",
    "They discovered strategies that looked unfamiliar to experts.",
    "The underlying learning ideas can transfer to many sequential decision problems."
  ])},
  ...[0,1,2,3].map(i => ({kind:"dense dp-relation-slide",title:"Relation of RL to other fields (I): Dynamic Programming",body:dpOverview(i)})),
  ...[0,1,2,3].map(i => ({kind:"dense ml-overview-slide",title:"Relation of RL to other fields (II): Machine Learning",body:mlOverview(i)})),
  ...courseLogisticsSlides,

  ...[0,1,2,3].map(i => ({kind:"dense",title:"Main elements of an RL problem",body:visible(elements,i)})),
  {title:"Reward provides immediate evaluative feedback",body:ul([
    "The reward is produced by the environment after an action.",
    "It evaluates what just happened; it does not identify the correct action.",
    "A reward may depend on both the state and action: \\(r(s,a)\\)."
  ])},
  {title:"Value represents long-term goodness",body:`<p>The value of a state estimates how much cumulative reward the agent can expect from that state under policy \\(\\pi\\).</p>${display("v_\\pi(s)=\\mathbb E_\\pi[R_{t+1}+\\gamma R_{t+2}+\\gamma^2R_{t+3}+\\cdots\\mid S_t=s]")}<p>Value looks beyond immediate reward and accounts for states that follow.</p>`},

  {kind:"formula-heavy",title:"The policy objective is long-term return",body:`<p>Let \\(S_t\\) be the state, \\(A_t\\) the action, \\(\\pi\\) the policy, and \\(r(S_t,A_t)\\) the reward. A discounted infinite-horizon objective is</p>${display("\\max_\\pi\\;\\mathbb E_\\pi\\!\\left[\\sum_{k=0}^{\\infty}\\gamma^k r(S_{t+k},A_{t+k})\\mid S_t=i\\right]")}<p>Choosing the action requires reasoning about the total future reward—not merely the next reward.</p>`},
  {title:"The Q-function compares actions",body:`<p>The optimal action-value function asks:</p><blockquote>What return can we obtain by taking action \\(a\\) in state \\(s\\), then acting optimally?</blockquote>${display("Q^*(s,a)=\\mathbb E\\!\\left[R_{t+1}+\\gamma\\max_{a'}Q^*(S_{t+1},a')\\mid S_t=s,A_t=a\\right]")}<p>An optimal policy selects an action in \\(\\arg\\max_a Q^*(s,a)\\).</p>`},
  {kind:"formula-heavy",title:"A model gives the Bellman optimality equation",body:`<p>If the transition model \\(p(s'\\mid s,a)\\) and expected reward \\(r(s,a)\\) are known, then</p>${display("Q^*(s,a)=r(s,a)+\\gamma\\sum_{s'}p(s'\\mid s,a)\\max_{a'}Q^*(s',a')")}<p>The equation decomposes a long-term problem into immediate reward plus the best future value.</p>`},
  {title:"Why not always solve the Bellman equation exactly?",body:ul([
    "The number of states can be enormous—the curse of dimensionality.",
    "The transition and reward model may be unknown.",
    "The action space may be large or continuous.",
    "Exact maximization and storage may be computationally infeasible."
  ])},

  {kind:"dp-example-slide dp-network-intro-slide",title:"A Deterministic DP Example",body:dpNetworkIntro("exclusive")},
  {kind:"dp-example-slide dp-network-intro-slide",title:"A Deterministic DP Example",body:dpNetworkIntro("backward")},
  {kind:"dp-example-slide dp-network-computation-slide",title:"A Deterministic DP Example",body:dpNetworkComputation(1)},
  {kind:"dp-example-slide dp-network-computation-slide",title:"A Deterministic DP Example",body:dpNetworkComputation(2)},
  {kind:"dp-example-slide dp-network-computation-slide",title:"A Deterministic DP Example",body:dpNetworkComputation(3)},
  {kind:"dp-example-slide",title:"A Deterministic DP Example",body:String.raw`<p>The computational complexity of exclusive search versus DP. Suppose the problem has \(T\) stages. Then</p><ul class="reveal-list"><li>Exclusive search: exponential in \(T\)</li><li>Dynamic programming: linear in \(T\)</li></ul>`},
  {kind:"dp-example-slide dp-principle-slide",title:"A Deterministic DP Example",body:shortestPathPrinciple(0)},
  {kind:"dp-example-slide dp-principle-slide",title:"A Deterministic DP Example",body:shortestPathPrinciple(1)},
  {kind:"dp-example-slide dp-principle-slide",title:"A Deterministic DP Example",body:shortestPathPrinciple(2)},
  {kind:"dp-example-slide dp-principle-slide",title:"A Deterministic DP Example",body:shortestPathPrinciple(3)},
  {kind:"dp-example-slide finite-dp-slide",title:"Finite horizon deterministic DP",body:finiteHorizonSystem(false)},
  {kind:"dp-example-slide finite-dp-slide",title:"Finite horizon deterministic DP",body:finiteHorizonSystem(true)},
  {kind:"dp-example-slide finite-dp-slide",title:"Finite horizon deterministic DP",body:finiteHorizonCost(false)},
  {kind:"dp-example-slide finite-dp-slide",title:"Finite horizon deterministic DP",body:finiteHorizonCost(true)},
  {kind:"dp-example-slide finite-dp-slide",title:"Finite horizon deterministic problem",body:finiteHorizonBackward(false)},
  {kind:"dp-example-slide finite-dp-slide",title:"Finite horizon deterministic problem",body:finiteHorizonBackward(true)},

  {kind:"stochastic-dp-slide stochastic-intro-slide",title:"A Stochastic DP Example",body:stochasticIntro()},
  {kind:"stochastic-dp-slide stochastic-policy-slide",title:"Stochastic DP Example",body:stochasticPolicy(0)},
  {kind:"stochastic-dp-slide stochastic-policy-slide",title:"Stochastic DP Example",body:stochasticPolicy(1)},
  {kind:"stochastic-dp-slide stochastic-policy-slide",title:"Stochastic DP Example",body:stochasticPolicy(2)},
  {kind:"stochastic-dp-slide stochastic-cost-slide",title:"Stochastic DP Example",body:stochasticCostExample(0)},
  {kind:"stochastic-dp-slide stochastic-cost-slide",title:"Stochastic DP Example",body:stochasticCostExample(1)},
  {kind:"stochastic-dp-slide stochastic-cost-slide",title:"Stochastic DP Example",body:stochasticCostExample(2)},
  ...Array.from({length:3}, (_, i) => ({kind:"stochastic-dp-slide stochastic-cost-slide stochastic-recursion-slide",title:"Stochastic DP Example",body:stochasticRecursionFinish(i)})),
  {kind:"stochastic-dp-slide stochastic-definition-slide",title:"Stochastic DP",body:stochasticDPDefinition},
  ...Array.from({length:3}, (_, i) => ({kind:"stochastic-dp-slide stochastic-backward-slide",title:"Stochastic DP",body:stochasticBackwardForward(i)})),
  ...Array.from({length:7}, (_, i) => ({
    kind:"stochastic-dp-slide bellman-slide",
    title:"Bellman Equation",
    body:bellmanEquationSlide(Math.min(i,3), Math.max(0,i-3))
  })),

  {kind:"course-topics-slide",title:"About this course: topics to be covered",body:courseTopics},
  {title:"Why learn many RL methods?",body:`<blockquote class="large-quote">“There are no methods that are guaranteed to work for all or even most problems, but there are enough methods to try on a given challenging problem with a reasonable chance of success at the end.”</blockquote><p class="quote-source">D. Bertsekas, <em>Reinforcement Learning and Optimal Control</em></p>`},
  {kind:"dense notes-challenges-slide",title:"Some challenges and limitations",body:challengesAndLimitations},
  {title:"Next lecture",body:ul([
    "Sequential decision-making terminology and notation",
    "A simple reinforcement learning example: Gridworld",
    "Policies, value functions, models, and states in more detail"
  ])}
];
