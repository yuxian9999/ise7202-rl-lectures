// Professor-editable source. Edit HTML and LaTeX here, then run build.mjs.
export const course = {
  number: "ISE/ECE 7202", name: "Reinforcement Learning",
  lecture: "Lecture 6: Monte Carlo Methods", professor: "Xian Yu",
  institution: "The Ohio State University"
};

const S = String.raw;
const ul = items => `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
const visible = (items, active) => ul(items.slice(0, active + 1));
const display = latex => `<div class="display">\\[${latex}\\]</div>`;

const inlineLatex = text => text.replace(/\$([^$]+)\$/g, (_, math) => `\\(${math}\\)`);
const renderAlgorithm = source => {
  const lines = source.split("\n").map(line => line.trim()).filter(Boolean);
  let indent = 0, lineNumber = 1, caption = "", rows = "";
  const row = (content, numbered = true, role = "") => {
    rows += `<div class="alg-row ${role}" style="--indent:${indent}"><span class="alg-num">${numbered ? lineNumber++ : ""}</span><span>${inlineLatex(content)}</span></div>`;
  };
  for (const line of lines) {
    if (/^\\(?:begin|end)\{(?:algorithm|algorithmic)\}/.test(line)) continue;
    let match;
    if ((match = line.match(/^\\caption\{(.+)\}$/))) { caption = inlineLatex(match[1]); continue; }
    if ((match = line.match(/^\\Require\s+(.+)$/))) { row(`<strong>Input:</strong> ${match[1]}`, false, "alg-input"); continue; }
    if ((match = line.match(/^\\Ensure\s+(.+)$/))) { row(`<strong>Output:</strong> ${match[1]}`, false, "alg-output"); continue; }
    if (/^\\End(?:For|While|If)/.test(line)) { indent = Math.max(0, indent - 1); row("<strong>end</strong>", false, "alg-end"); continue; }
    if ((match = line.match(/^\\While\{(.+)\}$/))) { row(`<strong>while</strong> ${match[1]} <strong>do</strong>`); indent++; continue; }
    if ((match = line.match(/^\\ForAll\{(.+)\}$/))) { row(`<strong>for each</strong> ${match[1]} <strong>do</strong>`); indent++; continue; }
    if ((match = line.match(/^\\If\{(.+)\}$/))) { row(`<strong>if</strong> ${match[1]} <strong>then</strong>`); indent++; continue; }
    if ((match = line.match(/^\\Statex\s+(.+)$/))) { row(match[1], false, "alg-section"); continue; }
    if ((match = line.match(/^\\State\s+(.+)$/))) row(match[1]);
  }
  return `<div class="latex-algorithm"><div class="algorithm-caption"><strong>Algorithm</strong> ${caption}</div><div class="algorithmic">${rows}</div></div>`;
};

const mcPredictionLatex = S`\begin{algorithm}
\caption{First-visit Monte Carlo prediction for estimating $V\approx v_\pi$}
\begin{algorithmic}[1]
\Require A policy $\pi$
\Ensure $V\approx v_\pi$
\State Initialize $V(s)$ arbitrarily and $\operatorname{Returns}(s)$ to an empty list, $\forall s\in\mathcal S$
\ForAll{episodes}
  \State Generate an episode following $\pi$: $S_0,A_0,R_0,S_1,A_1,R_1,\ldots,S_{T-1},A_{T-1},R_{T-1}$
  \State $G\gets0$
  \ForAll{$t=T-1,T-2,\ldots,0$}
    \State $G\gets\delta G+R_t$
    \If{$S_t\notin\{S_0,S_1,\ldots,S_{t-1}\}$}
      \State Append $G$ to $\operatorname{Returns}(S_t)$
      \State $V(S_t)\gets\operatorname{average}(\operatorname{Returns}(S_t))$
    \EndIf
  \EndFor
\EndFor
\end{algorithmic}
\end{algorithm}`;

const mcExploringStartsLatex = S`\begin{algorithm}
\caption{Monte Carlo with exploring starts for estimating $\pi\approx\pi^*$}
\begin{algorithmic}[1]
\Ensure $\pi\approx\pi^*$
\State Initialize $\pi(s)$ arbitrarily, $\forall s\in\mathcal S$
\State Initialize $Q(s,a)$ arbitrarily and $\operatorname{Returns}(s,a)$ to an empty list, $\forall s,a$
\ForAll{episodes}
  \State Choose $S_0\in\mathcal S,A_0\in\mathcal A$ randomly so every pair has probability $>0$
  \State Generate an episode following $\pi$: $S_0,A_0,R_0,\ldots,S_{T-1},A_{T-1},R_{T-1}$
  \State $G\gets0$
  \ForAll{$t=T-1,T-2,\ldots,0$}
    \State $G\gets\delta G+R_t$
    \If{$(S_t,A_t)\notin\{(S_0,A_0),\ldots,(S_{t-1},A_{t-1})\}$}
      \State Append $G$ to $\operatorname{Returns}(S_t,A_t)$
      \State $Q(S_t,A_t)\gets\operatorname{average}(\operatorname{Returns}(S_t,A_t))$
      \State $\pi(S_t)\gets\arg\max_a Q(S_t,a)$
    \EndIf
  \EndFor
\EndFor
\end{algorithmic}
\end{algorithm}`;

const onPolicyMCLatex = S`\begin{algorithm}
\caption{On-policy first-visit Monte Carlo control with $\epsilon$-soft policies}
\begin{algorithmic}[1]
\Require A small $\epsilon>0$
\Ensure $\pi\approx\pi^*$
\State Initialize $\pi(a\mid s)$ arbitrarily, $\forall s\in\mathcal S,a\in\mathcal A$
\State Initialize $Q(s,a)$ arbitrarily and $\operatorname{Returns}(s,a)$ to an empty list, $\forall s,a$
\ForAll{episodes}
  \State Generate an episode following $\pi$: $S_0,A_0,R_0,\ldots,S_{T-1},A_{T-1},R_{T-1}$
  \State $G\gets0$
  \ForAll{$t=T-1,T-2,\ldots,0$}
    \State $G\gets\delta G+R_t$
    \If{$(S_t,A_t)\notin\{(S_0,A_0),\ldots,(S_{t-1},A_{t-1})\}$}
      \State Append $G$ to $\operatorname{Returns}(S_t,A_t)$
      \State $Q(S_t,A_t)\gets\operatorname{average}(\operatorname{Returns}(S_t,A_t))$
      \State $A^*\gets\arg\max_a Q(S_t,a)$, with ties broken arbitrarily
      \ForAll{$a\in\mathcal A$}
        \State $\pi(a\mid S_t)\gets\begin{cases}1-\epsilon+\epsilon/|\mathcal A|,&a=A^*,\\ \epsilon/|\mathcal A|,&a\ne A^*.\end{cases}$
      \EndFor
    \EndIf
  \EndFor
\EndFor
\end{algorithmic}
\end{algorithm}`;

const tdPredictionLatex = S`\begin{algorithm}
\caption{Tabular TD(0) prediction for estimating $V\approx v_\pi$}
\begin{algorithmic}[1]
\Require Policy $\pi$ to be evaluated; step size $\alpha\in(0,1]$
\Ensure $V\approx v_\pi$
\State Initialize $V(s)$ arbitrarily, except $V(\text{terminal})=0$
\ForAll{episodes}
  \State Initialize $S$
  \While{$S$ is not terminal}
    \State Choose $A$ according to $\pi$
    \State Take action $A$; observe reward $R$ and next state $S'$
    \State $V(S)\gets V(S)+\alpha\,[R+\delta V(S')-V(S)]$
    \State $S\gets S'$
  \EndWhile
\EndFor
\end{algorithmic}
\end{algorithm}`;

const storyItems = [
  "We started with a simplified form of the general sequential decision-making problem: <span class=\"scarlet\">multi-armed bandits</span>. This introduced collecting information sequentially to learn to behave optimally in the long run.",
  "<span class=\"scarlet\">Markov decision processes</span> provide the mathematical framework for general sequential decision-making problems. The state can change as a result of our actions, affecting what it means to behave optimally in the long run.",
  "<span class=\"scarlet\">Dynamic programming methods</span> are planning methods for finding an optimal policy in an MDP. Value and action-value functions guide the search for an optimal policy.",
  "Next: <span class=\"scarlet\">reinforcement learning algorithms</span> - learning methods for finding an optimal policy in MDPs."
];

const mcIntroItems = [
  "These are our first learning methods: they estimate value functions and use them to find optimal policies.",
  "They work from experience only, without knowledge of the environment - we do not know \\(p\\) and \\(r\\).",
  "They can also use simulated experience instead of the exact probability functions required by DP.",
  "The ideas are based on DP - GPI in particular - and resemble the bandit algorithms seen earlier.",
  "We define these methods only for episodic tasks, so average returns are well-defined."
];

const mcConnectionItems = [
  "How are these methods related to DP ideas?",
  "They use the same GPI building blocks: prediction - previously called policy evaluation - and policy improvement.",
  "GPI computes value functions from knowledge of the MDP. Learning methods instead have to predict the value function.",
  "Let us start with the prediction component.",
  "Recall: a value function is the expected discounted sum of future rewards starting from a state.",
  "As in MABs, estimate it from experience using sample averages of observed returns."
];

const mcPredictionNotes = [
  "<strong>First-visit versus every-visit MC</strong>",
  "We could update the value after every visit to a state \\(S_t\\), removing the “if \\(S_t\\notin\\{S_0,S_1,\\ldots,S_{t-1}\\}\\) then” line from the pseudocode.",
  "<strong>Convergence:</strong> do we approximately obtain \\(v_\\pi\\)?",
  "The law of large numbers provides the key intuition.",
  "For policy improvement, we actually need Monte Carlo prediction of <span class=\"scarlet\">action-values</span>.",
  "Without a model, finding a policy requires \\(q\\) functions.",
  "The method can calculate averages based on state-action visits.",
  "<span class=\"scarlet\">Exploration!</span> \\(\\rightarrow\\) exploring starts."
];

const mcControlItems = [
  "Monte Carlo control approximately finds an optimal policy.",
  S`For policy improvement, again use greedy one-step lookahead:` + display(S`\pi'(s)\in\arg\max_a q_\pi(s,a).`),
  "Start by considering a Monte Carlo version of policy iteration (PI).",
  "Two obstacles remain: policy evaluation would need infinitely many episodes to converge, and the scheme relies on exploring starts. We remove the first limitation now."
];

const esNotes = [
  "Does this find an optimal policy?",
  "<span class=\"scarlet\">Difficulty in the proof:</span> returns appended to the Returns list come from different policies.",
  S`For greater memory and computational efficiency, use an incremental implementation of the averaging step: after a new return \(G\), set \(N(S_t,A_t)\gets N(S_t,A_t)+1\) and` +
    display(S`Q(S_t,A_t)\gets Q(S_t,A_t)+\frac{1}{N(S_t,A_t)}\bigl[G-Q(S_t,A_t)\bigr],`) +
    "so the list of returns never has to be stored.",
  'A simpler alternative is a <span class="scarlet">constant step size</span> \\(\\alpha\\in(0,1]\\):' +
    display(S`Q(S_t,A_t)\gets Q(S_t,A_t)+\alpha\bigl[G-Q(S_t,A_t)\bigr],`) +
    "which weights recent returns more heavily.",
  "The exploring-starts assumption is limiting in many applications."
];

const tdMethodItems = [
  "Like MC methods, TD methods do not need a model of the environment; they learn from experience.",
  "Like DP methods, they bootstrap: value estimates are based on other value estimates - “update the guess based on other guesses”.",
  "As usual, start with prediction: given a policy, find its value or action-value.",
  "Then address control: combine prediction and improvement to find an optimal policy.",
  "TD again uses GPI. Its main difference from DP and MC lies in how prediction is performed."
];

const tdPredictionItems = [
  S`MC prediction generates an episode, calculates the return from each visited state \(S_t\), and updates` + display(S`V(S_t)\gets V(S_t)+\alpha\bigl(G_t-V(S_t)\bigr).`),
  "What if we do not wait until the end of the episode and instead update immediately after moving from \\(S_t\\) to \\(S_{t+1}\\)?",
  display(S`V(S_t)\gets V(S_t)+\alpha\bigl[R_t+\delta V(S_{t+1})-V(S_t)\bigr].`),
  S`To compare:` + display(S`\begin{aligned}v_\pi(s)&=\mathbb E_\pi[G_t\mid S_t=s]\\&=\mathbb E_\pi[R_t+\delta v_\pi(S_{t+1})\mid S_t=s].\end{aligned}`)
];

const tdAdvantages = [
  "Over DP: learn without a model of the environment.",
  "Over MC: learn in a truly online, incremental fashion.<ul><li>Tasks with very long episodes</li><li>Continuing tasks</li></ul>",
  "Does TD(0) converge? Yes or no? What might this depend on?",
  "<span class=\"scarlet\"><strong>Answer:</strong></span> Yes. It depends on the step size and on whether the implementation is tabular or uses function approximation.",
  "Is TD better - faster or more data-efficient - than MC?",
  "<span class=\"scarlet\"><strong>Answer:</strong></span> This remains an open question. In practice, TD has often been observed to converge faster."
];

const updateRules =
  '<p class="rules-lead">Compare the update rules:</p>' +
  '<div class="update-rules">' +
    '<div class="rule-row"><span class="rule-name">DP</span><span class="rule-math">' +
      "\\(V(s)\\gets\\sum_a\\pi(a\\mid s)\\sum_{s',r}p(s',r\\mid s,a)\\bigl[r+\\delta V(s')\\bigr]\\)" +
    '</span></div>' +
    '<div class="rule-row"><span class="rule-name">MC</span><span class="rule-math">' +
      '\\(V(S_t)\\gets V(S_t)+\\alpha\\bigl[G_t-V(S_t)\\bigr]\\)' +
    '</span></div>' +
  '</div>';

const mcSummary = extra =>
  ul([
    "MC methods do not need a model of the environment.",
    "They do not bootstrap: value estimates are not based on other value estimates."
  ]) + (extra ? updateRules + "<p class=\"spaced-tight\">Our second class of learning methods is <span class=\"scarlet\">temporal difference (TD)</span>. TD does not need a model, like MC, and it bootstraps, like DP.</p>" : "");

const gridworldExample =
  '<div class="mc-gridworld-layout">' +
    '<div>' +
      '<div class="mc-gridworld trajectory-grid" aria-label="Sample trajectory in a four by four Gridworld">' +
        '<div class="terminal"><strong>T</strong><small>t=4</small></div><div class="visited"><strong>1</strong><small>\\(S_1=s_{12}\\)</small></div><div></div><div></div>' +
        '<div class="visited"><strong>3</strong><small>\\(S_3=s_{21}\\)</small></div><div class="visited repeated"><strong>0, 2</strong><small>\\(s_{22}\\)</small></div><div></div><div></div>' +
        '<div></div><div></div><div></div><div></div>' +
        '<div></div><div></div><div></div><div class="terminal"><strong>T</strong></div>' +
      '</div>' +
      '<p class="grid-caption">Numbers show visit time \\(t\\); state \\(s_{22}\\) is visited twice.</p>' +
    '</div>' +
    '<div class="gridworld-notes trajectory-notes">' +
      '<p><strong>One sampled episode:</strong> random policy, reward \\(-1\\) per move, and \\(\\delta=1\\).</p>' +
      '<div class="trajectory-equation">\\[' +
        's_{22}\\xrightarrow{U,-1}s_{12}\\xrightarrow{D,-1}s_{22}' +
        '\\xrightarrow{L,-1}s_{21}\\xrightarrow{U,-1}T.' +
      '\\]</div>' +
      '<p><strong>Returns from each time step:</strong></p>' +
      '<div class="return-row">\\(G_0=-4,\\quad G_1=-3,\\quad G_2=-2,\\quad G_3=-1.\\)</div>' +
      '<ul>' +
        '<li><strong>First visit to \\(s_{22}\\):</strong> use \\(G_0=-4\\); ignore \\(G_2\\) from its repeated visit.</li>' +
        '<li>Append \\(-4\\) to \\(\\operatorname{Returns}(s_{22})\\).</li>' +
        '<li>If earlier episodes gave \\(\\{-3,-5\\}\\), then</li>' +
      '</ul>' +
      '<div class="grid-equation">\\[' +
        'V(s_{22})=\\operatorname{average}\\{-3,-5,-4\\}=-4.' +
      '\\]</div>' +
      '<p class="mc-repeat"><span class="scarlet"><strong>Repeat</strong></span> across many episodes for every state to construct \\(V\\approx v_\\pi\\).</p>' +
    '</div>' +
  '</div>';

const mcLeastSquares =
  '<p>Why average the returns? For a state \\(s\\) with observed returns \\(G_1,\\dots,G_n\\), consider the squared error</p>' +
  display(S`f(V)=\sum_{i=1}^{n}\bigl(G_i-V\bigr)^2.`) +
  '<p>Setting \\(f\'(V)=-2\\sum_{i}\\bigl(G_i-V\\bigr)=0\\) gives</p>' +
  display(S`V^\star=\frac{1}{n}\sum_{i=1}^{n}G_i,`) +
  '<p>which is exactly the Monte Carlo estimate.</p>' +
  '<div class="principle compact"><p>Batch MC converges to the value function with the <span class="scarlet">minimum squared error on the training data</span>: it is the best fit to the returns actually observed. We will see that batch TD answers a different question.</p></div>';

const tdCertaintyEquivalence =
  '<p>Batch MC returned the best fit to the returns actually observed. Batch TD instead fits a ' +
    '<span class="scarlet">model</span> to the data: from the observed transitions, form the maximum-likelihood estimates</p>' +
  display(S`\hat p(s'\mid s,a)=\frac{\#\{(s,a)\to s'\}}{\#\{(s,a)\}},\qquad \hat r(s,a)=\text{average reward observed after }(s,a),`) +
  '<p>and report the value function that is <em>exactly</em> correct for that model:</p>' +
  display(S`V(s)=\sum_a\pi(a\mid s)\sum_{s'}\hat p(s'\mid s,a)\bigl[\hat r(s,a)+\delta V(s')\bigr].`) +
  '<div class="principle compact"><p>This is the <span class="scarlet">certainty-equivalence estimate</span>. MC asks &ldquo;what fits the returns I saw?&rdquo;; TD asks &ldquo;what is the value under the best-fitting Markov model?&rdquo; TD usually predicts future data better - unless the process is not Markov.</p></div>';

const tdFixedPoint =
  '<p><strong>Batch TD(0):</strong> sweep the whole batch with \\(V\\) held fixed, apply the accumulated increments, and repeat. At convergence the increments at each state \\(s\\) must cancel:</p>' +
  display(S`\sum_{t:\,S_t=s}\bigl[R_t+\delta V(S_{t+1})-V(s)\bigr]=0.`) +
  '<p>With \\(n(s)\\) visits to \\(s\\), and \\(n(s,s\',r)\\) counting how often \\((s\',r)\\) followed \\(s\\),</p>' +
  display(S`\begin{aligned}V(s)&=\frac{1}{n(s)}\sum_{t:\,S_t=s}\bigl[R_t+\delta V(S_{t+1})\bigr]\\&=\sum_{s',r}\frac{n(s,s',r)}{n(s)}\bigl[r+\delta V(s')\bigr].\end{aligned}`) +
  '<div class="principle compact"><p>The ratio \\(n(s,s\',r)/n(s)\\) <em>is</em> the maximum-likelihood \\(\\hat p(s\',r\\mid s)\\), so this is the Bellman equation of the empirical model - reached without ever building it. Batch MC\'s condition is \\(\\sum_i\\bigl[G_i-V(s)\\bigr]=0\\): MC averages <span class="scarlet">whole returns</span>, TD averages <span class="scarlet">one-step targets</span>.</p></div>';

const twoStateDiagram =
  '<div class="mdp-figure">' +
  '<svg viewBox="0 0 780 260" role="img" aria-label="Two-state MDP: states s1 and s2 with actions L and R leading to each other and to the terminal state T">' +
    '<defs>' +
      '<marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="#ba0c2f"></path>' +
      '</marker>' +
    '</defs>' +
    '<path d="M192 62 C 300 8, 480 8, 588 62" fill="none" stroke="#ba0c2f" stroke-width="3" marker-end="url(#ah)"></path>' +
    '<text x="390" y="20" class="edge">R, 0</text>' +
    '<path d="M588 114 C 480 168, 300 168, 192 114" fill="none" stroke="#ba0c2f" stroke-width="3" marker-end="url(#ah)"></path>' +
    '<text x="390" y="138" class="edge">L, -1</text>' +
    '<path d="M174 124 L 346 208" fill="none" stroke="#ba0c2f" stroke-width="3" marker-end="url(#ah)"></path>' +
    '<text x="222" y="190" class="edge">L, +1</text>' +
    '<path d="M606 124 L 434 208" fill="none" stroke="#ba0c2f" stroke-width="3" marker-end="url(#ah)"></path>' +
    '<text x="558" y="190" class="edge">R, +5</text>' +
    '<circle cx="150" cy="88" r="42" fill="#fff" stroke="#ba0c2f" stroke-width="4"></circle>' +
    '<text x="150" y="88" class="node">s<tspan font-size="21" dy="9">1</tspan></text>' +
    '<circle cx="630" cy="88" r="42" fill="#fff" stroke="#ba0c2f" stroke-width="4"></circle>' +
    '<text x="630" y="88" class="node">s<tspan font-size="21" dy="9">2</tspan></text>' +
    '<rect x="345" y="200" width="90" height="44" rx="5" fill="#f2f2f2" stroke="#777" stroke-width="3"></rect>' +
    '<text x="390" y="222" class="node">T</text>' +
  '</svg>' +
  '</div>';

const mcEsExample =
  twoStateDiagram +
  '<p class="mdp-caption">Start from \\(Q\\equiv0\\), \\(\\delta=1\\), and the policy \\(\\pi(s_1)=L,\\ \\pi(s_2)=L\\). Exploring starts pick \\((S_0,A_0)\\); afterwards follow \\(\\pi\\).</p>' +
  '<div class="table-fill"><table class="ex-table wide-q">' +
    '<tr><th>Episode</th><th>Start</th><th>Trajectory</th><th>\\(Q\\) updated</th><th>New \\(\\pi\\)</th></tr>' +
    '<tr><td>1</td><td>\\((s_1,L)\\)</td><td>\\(s_1\\xrightarrow{L,+1}T\\)</td><td></td><td></td></tr>' +
    '<tr><td>2</td><td>\\((s_1,R)\\)</td><td>\\(s_1\\xrightarrow{R,0}s_2\\xrightarrow{L,-1}s_1\\xrightarrow{L,+1}T\\)</td><td></td><td></td></tr>' +
    '<tr><td>3</td><td>\\((s_2,R)\\)</td><td>\\(s_2\\xrightarrow{R,+5}T\\)</td><td></td><td></td></tr>' +
    '<tr><td>4</td><td>\\((s_1,R)\\)</td><td>\\(s_1\\xrightarrow{R,0}s_2\\xrightarrow{?}\\)</td><td></td><td></td></tr>' +
  '</table></div>';

const mcVsTdEpisode =
  '<p><strong>A three-state chain.</strong> \\(A\\to B\\to C\\to T\\), all rewards \\(0\\) except \\(C\\to T\\) which pays \\(+1\\). Take \\(\\delta=1\\), \\(\\alpha=0.5\\), and initialize \\(V(A)=V(B)=V(C)=0\\).</p>' +
  '<p>Run the single episode \\(A\\xrightarrow{0}B\\xrightarrow{0}C\\xrightarrow{+1}T\\) and fill in the table.</p>' +
  '<table class="ex-table roomy">' +
    '<tr><th>After episode 1</th><th>\\(V(A)\\)</th><th>\\(V(B)\\)</th><th>\\(V(C)\\)</th></tr>' +
    '<tr><td>MC, \\(V\\gets V+\\alpha[G_t-V]\\)</td><td></td><td></td><td></td></tr>' +
    '<tr><td>TD(0), updated every step</td><td></td><td></td><td></td></tr>' +
    '<tr><td>TD(0) after a second identical episode</td><td></td><td></td><td></td></tr>' +
  '</table>' +
  '<p class="ask"><strong>Ask:</strong> after one episode MC has moved all three states but TD only one. Which one, and how many episodes does TD need for the reward to reach \\(A\\)?</p>';

export const slides = [
  {kind:"title",title:course.lecture,body:`<div class="title-card"><div class="title-rule"></div><h1>${course.lecture}</h1><p class="course-line">${course.number} ${course.name}</p><p>${course.institution}</p><p>Autumn 2026</p><p class="professor">${course.professor}</p></div>`},
  {title:"Outline",body:ul([
    "Last few classes: DP algorithms such as PI, VI, and their variants",
    "Today: Monte Carlo methods<ul><li>A recap of what we have covered</li><li>Monte Carlo prediction</li><li>Monte Carlo control</li><li>Exploring starts versus \\(\\epsilon\\)-greedy control</li><li>Introduction to temporal difference methods</li></ul>"
  ])},

  ...[0,1,2,3].map(i => ({kind:"dense",title:"Brief intermission: The story so far",body:visible(storyItems,i)})),
  ...[2,3,4].map(i => ({kind:"dense",title:"Our first learning methods: Monte Carlo methods",body:visible(mcIntroItems,i)})),
  ...[2,3,5].map(i => ({kind:"dense",title:"Monte Carlo methods",body:visible(mcConnectionItems,i)})),

  {kind:"algorithm algorithm-medium",title:"Monte Carlo prediction",body:renderAlgorithm(mcPredictionLatex)},
  {kind:"dense",title:"Monte Carlo minimizes error on the training data",body:mcLeastSquares},
  {kind:"dense mc-gridworld-slide",title:"An example: finding \\(v_\\pi\\) for the random policy in Gridworld",body:gridworldExample},
  ...[1,3,6,7].map(i => ({kind:"dense",title:"Some notes on MC prediction",body:visible(mcPredictionNotes,i)})),

  ...[2,3].map(i => ({kind:"dense",title:"Monte Carlo control",body:visible(mcControlItems,i)})),
  {kind:"algorithm algorithm-long",title:"Monte Carlo method with exploring starts",body:renderAlgorithm(mcExploringStartsLatex)},
  ...[0,1,2,3,4].map(i => ({kind:"dense",title:"Notes on the First-Visit MC ES algorithm",body:visible(esNotes,i)})),
  {kind:"dense mc-es-slide",title:"Example: MC control with exploring starts",body:mcEsExample},
  {kind:"algorithm algorithm-extra-long",title:"On-policy Monte Carlo method without exploring starts",body:renderAlgorithm(onPolicyMCLatex)},

  {kind:"dense",title:"How are Monte Carlo methods different from DP methods?",body:mcSummary(false)},
  {kind:"dense",title:"How are Monte Carlo methods different from DP methods?",body:mcSummary(true)},

  ...[0,1,2,3].map(i => ({kind:"dense",title:"TD prediction",body:visible(tdPredictionItems,i)})),

  {kind:"dense",title:"Let us illustrate MC versus TD with an example",body:
    "<p>Suppose we observe the following eight episodes, with only one action:</p>" +
    display(S`\{A,0,B,0\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,0\}.`) +
    "<p class=\"footnote\">Example 6.4 from SB</p>"},
  {kind:"dense",title:"Let us illustrate MC versus TD with an example",body:
    "<p>Suppose we observe the following eight episodes, with only one action:</p>" +
    display(S`\{A,0,B,0\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,0\}.`) +
    ul(["Let us compare batch updating using MC versus TD:","(batch) MC would say","(batch) TD would say"]) +
    "<p class=\"footnote\">Example 6.4 from SB</p>"},

  {kind:"dense",title:"What batch TD solves",body:tdCertaintyEquivalence},
  {kind:"dense",title:"Why: the batch TD fixed point",body:tdFixedPoint},

  ...[1,3,4].map(i => ({kind:"dense",title:"Temporal Difference (TD) methods",body:visible(tdMethodItems,i)})),
  {kind:"algorithm algorithm-medium",title:"TD(0) prediction algorithm",body:renderAlgorithm(tdPredictionLatex)},
  {kind:"dense",title:"Example: MC versus TD on one episode",body:mcVsTdEpisode},
  ...[0,1,2,3,4,5].map(i => ({kind:"dense",title:"Advantages of TD prediction",body:visible(tdAdvantages,i)})),
  {title:"Next lecture",body:ul(["Temporal Difference (TD) methods, continued."])}
];
