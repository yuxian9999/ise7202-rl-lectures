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
  "We could update the value after every visit to a state \\(S_t\\), removing the “Unless ...” line from the pseudocode.",
  "<strong>Convergence:</strong> do we approximately obtain \\(v_\\pi\\)?",
  "The law of large numbers provides the key intuition.",
  "For policy improvement, we actually need Monte Carlo prediction of <span class=\"scarlet\">action-values</span>.",
  "Without a model, finding a policy requires \\(q\\) functions (HW2, Problem 1, part d).",
  "The method can calculate averages based on state-action visits.",
  "<span class=\"scarlet\">Exploration!</span> \\(\\rightarrow\\) exploring starts."
];

const mcControlItems = [
  "Monte Carlo control approximately finds an optimal policy.",
  S`For policy improvement, again use greedy one-step lookahead:` + display(S`\pi'(s)\in\arg\max_a q_\pi(s,a).`),
  "Start by considering a Monte Carlo version of policy iteration (PI).",
  "Two issues remain: infinite prediction - policy-evaluation - loops, and exploring starts. First remove the infinite-loop limitation."
];

const esNotes = [
  "Does this find an optimal policy?",
  "<span class=\"scarlet\">Difficulty in the proof:</span> returns appended to the Returns list come from different policies.",
  "For greater memory and computational efficiency, use an incremental implementation of the averaging step.",
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

const mcSummary = extra =>
  ul([
    "MC methods do not need a model of the environment.",
    "They do not bootstrap: value estimates are not based on other value estimates."
  ]) + (extra ? "<p class=\"spaced\">Our second class of learning methods is <span class=\"scarlet\">temporal difference (TD)</span>. TD does not need a model, like MC, and it bootstraps, like DP.</p>" : "");

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
  {kind:"dense mc-gridworld-slide",title:"An example: finding \\(v_\\pi\\) for the random policy in Gridworld",body:gridworldExample},
  ...[1,3,6,7].map(i => ({kind:"dense",title:"Some notes on MC prediction",body:visible(mcPredictionNotes,i)})),

  ...[2,3].map(i => ({kind:"dense",title:"Monte Carlo control",body:visible(mcControlItems,i)})),
  {kind:"algorithm algorithm-long",title:"Monte Carlo method with exploring starts",body:renderAlgorithm(mcExploringStartsLatex)},
  ...[0,1,2,3].map(i => ({kind:"dense",title:"Notes on the First-Visit MC ES algorithm",body:visible(esNotes,i)})),
  {kind:"algorithm algorithm-extra-long",title:"On-policy Monte Carlo method without exploring starts",body:renderAlgorithm(onPolicyMCLatex)},

  {kind:"dense",title:"How are Monte Carlo methods different from DP methods?",body:mcSummary(false)},
  {kind:"dense",title:"How are Monte Carlo methods different from DP methods?",body:mcSummary(true)},

  {kind:"dense",title:"Let us illustrate MC versus TD with an example",body:
    "<p>Suppose we observe the following eight episodes, with only one action:</p>" +
    display(S`\{A,0,B,0\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,0\}.`) +
    "<p class=\"footnote\">Example 6.4 from SB</p>"},
  {kind:"dense",title:"Let us illustrate MC versus TD with an example",body:
    "<p>Suppose we observe the following eight episodes, with only one action:</p>" +
    display(S`\{A,0,B,0\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,1\},\ \{B,0\}.`) +
    ul(["Let us compare batch updating using MC versus TD:","(batch) MC would say","(batch) TD would say"]) +
    "<p class=\"footnote\">Example 6.4 from SB</p>"},

  ...[1,3,4].map(i => ({kind:"dense",title:"Temporal Difference (TD) methods",body:visible(tdMethodItems,i)})),
  ...[0,1,2,3].map(i => ({kind:"dense",title:"TD prediction",body:visible(tdPredictionItems,i)})),
  {kind:"algorithm algorithm-medium",title:"TD(0) prediction algorithm",body:renderAlgorithm(tdPredictionLatex)},
  ...[0,1,2,3,4,5].map(i => ({kind:"dense",title:"Advantages of TD prediction",body:visible(tdAdvantages,i)})),
  {title:"Next lecture",body:ul(["Temporal Difference (TD) methods, continued.","Homework 3 due Friday by 11:59pm ET."])}
];
