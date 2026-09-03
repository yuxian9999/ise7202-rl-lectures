// Professor-editable source. Edit titles, HTML, and LaTeX here, then run build.mjs.
export const course = {
  number: "ISE/ECE 7202", name: "Reinforcement Learning",
  lecture: "Lecture 4: Markov Decision Processes", professor: "Xian Yu",
  unit: "Department of Integrated Systems Engineering", institution: "The Ohio State University"
};

const S = String.raw;
const ul = items => `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
const reveal = (items, active) => `<ul>${items.map((item,i)=>`<li class="${i<=active?"":"muted"}">${item}</li>`).join("")}</ul>`;
const visible = (items, active) => `<ul>${items.slice(0,active+1).map(item=>`<li>${item}</li>`).join("")}</ul>`;
const sequence = (items, active, noBullets=[]) => `<ul>${items.map((item,i)=>`<li class="${i<=active?"":"muted"} ${noBullets.includes(i)?"no-bullet":""}">${item}</li>`).join("")}</ul>`;
const visibleSequence = (items, active, noBullets=[]) => `<ul>${items.slice(0,active+1).map((item,i)=>`<li class="${noBullets.includes(i)?"no-bullet":""}">${item}</li>`).join("")}</ul>`;
const display = latex => `<div class="display">\\[${latex}\\]</div>`;
const title = (name, subtitle="") => ({kind:"section",title:name,body:`<div class="section-card"><p class="section-kicker">Lecture 4</p><h2>${name}</h2>${subtitle?`<p>${subtitle}</p>`:""}</div>`});

// Editable LaTeX source using the algorithm + algorithmic package syntax.
const policyEvaluationAlgorithmLatex = S`\begin{algorithm}
\caption{Iterative policy evaluation for estimating $v_\pi$}
\begin{algorithmic}[1]
\Require $\pi$, policy to be evaluated; $\theta>0$, threshold
\Ensure $V\approx v_\pi$
\State Initialize $V(s)$ arbitrarily, except $V(\text{terminal})=0$
\While{$\Delta>\theta$}
  \State $\Delta\gets 0$
  \ForAll{$s\in\mathcal S$}
    \State $v\gets V(s)$
    \State $V(s)\gets\sum_a\pi(a\mid s)\sum_{s'}p(s,a,s')\,[r(s,a)+\delta V(s')]$
    \State $\Delta\gets\max(\Delta,\lvert v-V(s)\rvert)$
  \EndFor
\EndWhile
\end{algorithmic}
\end{algorithm}`;

const inlineLatex = text => text.replace(/\$([^$]+)\$/g, (_,math) => `\\(${math}\\)`);
const renderAlgorithm = source => {
  const lines = source.split("\n").map(line => line.trim()).filter(Boolean);
  let indent = 0, lineNumber = 1, caption = "", rows = "";
  const row = (content, numbered=true, role="") => {
    rows += `<div class="alg-row ${role}" style="--indent:${indent}"><span class="alg-num">${numbered?lineNumber++:""}</span><span>${inlineLatex(content)}</span></div>`;
  };
  for (const line of lines) {
    if (/^\\(?:begin|end)\{(?:algorithm|algorithmic)\}/.test(line)) continue;
    let match;
    if ((match=line.match(/^\\caption\{(.+)\}$/))) { caption=inlineLatex(match[1]); continue; }
    if ((match=line.match(/^\\Require\s+(.+)$/))) { row(`<strong>Input:</strong> ${match[1]}`,false,"alg-input"); continue; }
    if ((match=line.match(/^\\Ensure\s+(.+)$/))) { row(`<strong>Output:</strong> ${match[1]}`,false,"alg-output"); continue; }
    if (/^\\End(?:For|While)/.test(line)) { indent=Math.max(0,indent-1); row(`<strong>end</strong>`,false,"alg-end"); continue; }
    if ((match=line.match(/^\\While\{(.+)\}$/))) { row(`<strong>while</strong> ${match[1]} <strong>do</strong>`); indent++; continue; }
    if ((match=line.match(/^\\ForAll\{(.+)\}$/))) { row(`<strong>for each</strong> ${match[1]} <strong>do</strong>`); indent++; continue; }
    if ((match=line.match(/^\\State\s+(.+)$/))) { row(match[1]); }
  }
  return `<div class="latex-algorithm"><div class="algorithm-caption"><strong>Algorithm 1</strong> ${caption}</div><div class="algorithmic">${rows}</div></div>`;
};

const mabRecap = [
  S`\(K\) arms to choose from, each has reward distribution \(\nu_i\), mean \(\mu_i\).`,
  S`Goal is to maximize the expected long-run sum of rewards.${display(S`\mathbb E\!\left[\sum_{t=1}^{T}R_{I_t,t}\right]`)}`,
  S`Planning (full information) solution: pick \(i^*=\arg\max_i\mu_i\).`,
  S`<span class="scarlet">Action-value methods:</span> calculate the sample average of each arm \(Q_t(a)\).`,
  S`<span class="scarlet">Greedy:</span> pick the highest \(Q_t(a)\), i.e., \(I_t=\arg\max_a Q_t(a)\).`,
  S`<span class="scarlet">\(\epsilon\)-greedy:</span> pick greedy action with probability \(1-\epsilon\), pick an action at random with probability \(\epsilon\).`,
  S`<span class="scarlet">UCB:</span> Pick arm ${display(S`I_t=\arg\max_a\left[Q_t(a)+c\sqrt{\frac{\ln t}{N_t(a)}}\right]`)}`,
  S`<span class="scarlet">Gradient bandit:</span> ${display(S`\pi_t(a):=\mathbb P(A_t=a)=\frac{e^{H_t(a)}}{\sum_{i=1}^{K}e^{H_t(i)}}.`)}`
];

const regretReview = [
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
const otherMabs = [
  `Three fundamental formulations depending on the assumed nature of the rewards`,
  S`The stochastic bandits \(\rightarrow\) UCB`,
  S`The adversarial bandit \(\rightarrow\) Exp3`,
  S`The Markovian bandit \(\rightarrow\) Gittins indices`,
  `Contextual bandits`, `Bayesian bandits`, `Linear and Lipschitz bandits`, `Bandits with knapsacks`, `...`
];

const contrast = [
  `The (sequence of) actions that I choose have different consequences depending on the starting state. This can to some extent be captured by contextual bandits.`,
  `More importantly, the (sequence of) actions I take determine the next “context”.`,
  S`The parallels of what we saw for MABs in the full RL problem...<ul><li><span class="scarlet">Model:</span> \(K,\nu_i\Rightarrow\) Markov decision processes (MDPs)</li><li><span class="scarlet">Planning problem:</span> \(\arg\max\mu_i\Rightarrow\) Dynamic programming (DP)</li><li><span class="scarlet">Learning problem:</span> Greedy, \(\epsilon\)-greedy, UCB \(\Rightarrow\) Tabular methods (like Q-learning); and Gradient bandit \(\Rightarrow\) Approximate solution methods (like policy gradient and actor-critic methods)</li></ul>`
];
const interaction = [
  S`The environment is in state \(S_t\in\mathcal S\).`,
  S`The agent takes an action \(A_t\in\mathcal A\).`,
  S`The agent observes reward \(R_t\in\mathbb R\).`,
  S`The environment transitions to state \(S_{t+1}\in\mathcal S\).`
];
const mdpElements = [
  S`State transition function \(p:\mathcal S\times\mathcal A\times\mathcal S\to[0,1]\):${display(S`p(s,a,s')=\mathbb P[S_{t+1}=s'\mid S_t=s,A_t=a].`)}`,
  S`Reward function \(r:\mathcal S\times\mathcal A\to\mathbb R\):${display(S`r(s,a)=\mathbb E[R_t\mid S_t=s,A_t=a].`)}`,
  S`Initial state distribution \(d_0:\mathcal S\to[0,1]\), with \(d_0(s)=\mathbb P[S_0=s]\).`,
  S`Discount factor \(\delta\in[0,1]\).`,
  `<span class="scarlet">Assumptions:</span> Markov property. Stationary MDP.`
];
const returns = [
  `The <span class="scarlet">reward hypothesis</span>: the agent’s learning goal is aligned with maximizing the cumulative sum of rewards.`,
  S`<span class="scarlet">Finite-horizon tasks:</span> task stops after the time of termination \(T\).`,
  S`<span class="scarlet">The return:</span>${display(S`\begin{aligned}G_t&=R_t+R_{t+1}+\cdots+R_T &&\text{(finite-horizon)},\\G_t&=R_t+\delta R_{t+1}+\delta^2R_{t+2}+\cdots &&\text{(infinite-horizon)}.\end{aligned}`)}`,
  S`Note that ${display(S`G_t=R_t+\delta G_{t+1}.`)}`
];
const policies = [
  `The policy describes the agent’s behavior, mathematically. It is a decision rule: how should the agent choose its actions in the MDP?`,
  S`Formally, the policy \(\pi\) maps states to (probability of taking) actions:${display(S`\pi(s)=a\quad\text{(deterministic)},\qquad \pi(a\mid s)=\mathbb P[A_t=a\mid S_t=s]\quad\text{(stochastic)}.`)}`,
  `Question: for a given MDP: how many policies are there?`,
  `How many deterministic policies?`
];
const optimalPolicy = [
  S`The optimal policy \(\pi^*\) maximizes the expected return. Formally,${display(S`\pi^*=\arg\max_{\pi\in\Pi}\mathbb E_\pi[G_0]=\arg\max_{\pi\in\Pi}\mathbb E_\pi\!\left[\sum_{t=0}^{\infty}\delta^tR_t\right].`)}`,
  `Question: Does an optimal policy always exist?`,
  `Question: Is the optimal policy unique?`
];
const valueFunctions = [
  S`The value function of a state \(s\) under a policy \(\pi\), is the expected return when starting from that state and following policy \(\pi\) thereafter.${display(S`v_\pi(s)=\mathbb E_\pi[G_t\mid S_t=s]=\mathbb E_\pi\!\left[\sum_{k=0}^{\infty}\delta^kR_{t+k}\mid S_t=s\right].`)}`,
  S`A closely related function is the <span class="scarlet">action-value function</span> for policy \(\pi\):${display(S`q_\pi(s,a)=\mathbb E_\pi[G_t\mid S_t=s,A_t=a]=\mathbb E_\pi\!\left[\sum_{k=0}^{\infty}\delta^kR_{t+k}\mid S_t=s,A_t=a\right].`)}`
];
const bellmanDerivation = [
  S`A fundamental property of value functions used throughout DP/RL is a recursive relationship they satisfy. Let’s start from the definition ${display(S`v_\pi(s)=\mathbb E_\pi[G_t\mid S_t=s]\ldots`)}`,
  S`${display(S`\begin{aligned}v_\pi(s)&=\mathbb E_\pi\!\left[\sum_{k=0}^{\infty}\delta^kR_{t+k}\mid S_t=s\right]\\&=\mathbb E_\pi\!\left[R_t+\delta\sum_{k=1}^{\infty}\delta^{k-1}R_{t+k}\mid S_t=s\right]\\&=\sum_{a\in\mathcal A}\pi(a\mid s)\sum_{s'\in\mathcal S}p(s,a,s')\,\mathbb E_\pi[R_t+\delta G_{t+1}\mid S_t=s,A_t=a,S_{t+1}=s']\\&=\sum_{a\in\mathcal A}\pi(a\mid s)\sum_{s'\in\mathcal S}p(s,a,s')\,[r(s,a)+\delta v_\pi(s')].\end{aligned}`)}`
];
const optimalViaValue = [
  S`Value functions provide a partial ordering over policies. A policy \(\pi\) is better than \(\pi'\) if and only if \(v_\pi(s)\ge v_{\pi'}(s),\ \forall s\in\mathcal S\).`,
  S`Let \(\pi^*\) denote the optimal policy, that is, the policy (or policies) \(\pi^*\ge\pi,\ \forall\pi\in\Pi\). How can we find it?`,
  S`${display(S`\pi^*\ge\pi\quad\text{iff}\quad v_{\pi^*}(s)\ge v_\pi(s),\ \forall s\in\mathcal S.`)}`,
  `Note: How is this different from our earlier definition of the optimal policy? Which one is stricter?`,
  S`Denote the optimal state-value function \(v^*(s)=\max_\pi v_\pi(s)\), and the optimal action-value function \(q^*(s,a)=\max_\pi q_\pi(s,a)\). If I can find a policy \(\pi^*\) for which \(v_{\pi^*}(s)=v^*(s),\forall s\), then I have found an optimal policy.`
];
const bellmanOptimality = S`<ul><li><strong>Fix the first action.</strong> If the agent chooses \(a\) in state \(s\) and behaves optimally thereafter, its expected return is${display(S`\begin{aligned}&\mathbb E\!\left[R_t+\delta v_*(S_{t+1})\mid S_t=s,A_t=a\right]\\&\qquad=\sum_{s'}p(s,a,s')\bigl(r(s,a)+\delta v_*(s')\bigr).\end{aligned}`)}</li><li><strong>Choose the best first action.</strong> Therefore,${display(S`\boxed{v_*(s)=\max_a\sum_{s'}p(s,a,s')\bigl(r(s,a)+\delta v_*(s')\bigr).}`)}</li><li><strong>Why is the continuation optimal?</strong> If it were not optimal after some \(s'\), replacing it with an optimal continuation would improve the return, contradicting the definition of \(v_*(s)\).</li></ul>`;
const whyOptimality = [
  S`If a policy \(\pi\) satisfies the Bellman optimality equations, it is an optimal policy.`,
  S`(Under the assumptions we have made on the MDP) there exists a policy \(\pi\) that satisfies the Bellman optimality equations.`,
  S`This means that if I manage to solve the Bellman optimality equations, I can find the optimal policy: for each state \(s\), find the actions that are the maximizers in the Bellman optimality equation. Place non-zero probability on those.`
];
const dpItems = [
  `Dynamic programming methods are closely related to the Bellman optimality equation.`,
  S`These methods are <em>planning algorithms</em>: if I know \(p\) and \(r\), how can I efficiently solve for the optimal policy?`,
  `Limitations: assumes a perfect model, and computational expense (although still better than some alternative methods for solving MDPs). Later RL algorithms are closely related to these methods.`,
  `DP methods are based on two computations, performed iteratively: (1) <span class="scarlet">policy evaluation</span> and (2) <span class="scarlet">policy improvement</span>.<br>Different mixes between these two building blocks lead to different DP methods. We will discuss two of the most popular ones: policy iteration (PI) and value iteration (VI).`
];
const policyEval = [
  S`Given a policy \(\pi\), how can I compute \(v_\pi\)?`,
  S`Recall the Bellman equation for \(v_\pi\):${display(S`v_\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}p(s,a,s')\bigl(r(s,a)+\delta v_\pi(s')\bigr)`)}`,
  S`Iterative solution method:${display(S`v_{k+1}(s)=\sum_a\pi(a\mid s)\sum_{s'}p(s,a,s')\bigl(r(s,a)+\delta v_k(s')\bigr)`)}`
];

export const slides = [
  {kind:"title",title:course.lecture,body:`<div class="title-card"><div class="title-rule"></div><h1>${course.lecture}</h1><p class="course-line">${course.number} ${course.name}</p><p>${course.institution}</p><p>Autumn 2026</p><p class="professor">${course.professor}</p></div>`},
  {title:"Outline",body:ul([`Last week: MABs. Basic problem in sequential decision making`,`Wrap up of MABs: more general frameworks, references`,`A more general sequential decision making problem: Markov Decision Processes<ul><li>(Review of) the defining elements of an MDP</li><li>Finite-horizon v.s. infinite-horizon tasks</li><li>Agents’ policies</li></ul>`])},
  ...[2,6,7].map(i=>({kind:`dense${i===7?" recap-full":""}`,title:"Quick recap of MABs",body:visible(mabRecap,i)})),
  ...[1,2].map(i=>({kind:"dense",title:`Review: “Sophisticated” exploration vs exploitation`,body:`<p>Seems some algorithms do balance exploration and exploitation, but take their time. Can we formalize this?</p>`+reveal(regretReview,i)})),
  ...[0,1,2,3].map(i=>({kind:"dense",title:"UCB regret (upper) bounds¹",body:visible(regretBounds,i)+`<p class="footnote">¹ If interested, see Slivkins (2019) for derivation details.</p>`})),
  ...[0,1,2,3,8].map(i=>({kind:"dense",title:"Other MAB problems",body:reveal(otherMabs,i)})),
  {kind:"dense",title:"Additional resources to learn about MABs",body:`<p class="scarlet">Two great monographs:</p>${ul([`(on stochastic and adversarial bandits) “Regret Analysis of Stochastic and Nonstochastic Multi-armed Bandit Problems” by Sebastien Bubeck and Nicolo Cesa-Bianchi, 2012.`,`(on Markovian bandits) “Multi-armed bandit problems” by A. Mahajan and D. Teneketzis, 2008.`])}<p class="scarlet">And two textbooks, both available online (free):</p>${ul([`(a concise one) “Introduction to Multi-Armed Bandits” by Alex Slivkins.`,`(a more detailed one) “Bandit Algorithms” by T. Lattimore and Cs. Szepesvari, with the accompanying blog <span class="url">https://banditalgs.com/about/</span>.`])}`},
  ...[0,2].map(i=>({kind:"dense",title:"Let’s contrast MABs with the Gridwold example...",body:visible(contrast,i)})),
  {title:"What are Markov Decision Processes?",body:ul([`A mathematical framework to formalize more general sequential decision making problems.`,`Like MABs, we allow for <em>evaluative feedback</em>. In addition, the problem is now <em>associative</em> too: different actions may be optimal in different states, and actions can affect the next state.`])},
  {title:"MDPs: the agent-environment interaction",body:S`<p>Recall the agent-environment interaction.<br>Let \(t=0,1,2,\ldots\) denote the time step. At each time \(t\):</p>${ul(interaction)}`},
  {title:"MDPs: the agent-environment interaction",body:S`<p>Recall the agent-environment interaction.<br>Let \(t=0,1,2,\ldots\) denote the time step. At each time \(t\):</p>${ul(interaction)}<p><span class="scarlet">Assumptions:</span> \(|\mathcal S|<\infty\) and \(|\mathcal A|<\infty\), and reward is bounded: \(|R_t|\le R_{\max},\forall t\).</p>`},
  ...[0,1,2,3,4].map(i=>({kind:"dense",title:"MDPs: the defining elements",body:S`<p>An MDP is defined by \(\langle\mathcal S,\mathcal A,p,r,d_0,\delta\rangle\).</p>`+visible(mdpElements,i)})),
  ...[0,1,2,3].map(i=>({kind:"dense",title:"Agents’ goal and returns",body:visible(returns,i)})),
  {kind:"cartpole",title:"Example: Cart-Pole Balancing",body:`<p>Let’s say the balancing fails if the pole falls some angle past the vertical.<br>The pole is reset to vertical after each failure.<br>Would you model this as a finite-horizon or infinite-horizon task?</p><div class="cartpole-diagram" aria-label="Cart pole balancing schematic"><div class="track"></div><div class="cart"><div class="pole"></div></div></div>`},
  ...[0,1,2,3].map(i=>({kind:"dense",title:"Policies",body:reveal(policies,i)})),
  ...[0,2].map(i=>({kind:"dense",title:"The optimal policy",body:reveal(optimalPolicy,i)})),
  ...[0,1].map(i=>({kind:"dense",title:"Value functions",body:visible(valueFunctions,i)})),
  {kind:"dense chain-example",title:"Example: state-values and action-values in a chain MDP",body:S`<p>Consider a deterministic chain with discount factor \(\delta=0.9\). The policy \(\pi\) always selects <em>Right</em>.</p><div class="chain-line" aria-label="Five-state chain MDP with right, left, and self-loop transitions"><div class="chain-state-wrap"><span class="self-loop-marker loop-left" aria-label="Left self-loop with reward zero"><span>\(L,0\)</span></span><span class="state-node">\(s_0\)</span></div><div class="chain-edge"><span>\(\xrightarrow{R,0}\)</span><span>\(\xleftarrow{L,0}\)</span></div><span>\(s_1\)</span><div class="chain-edge"><span>\(\xrightarrow{R,0}\)</span><span>\(\xleftarrow{L,0}\)</span></div><span>\(s_2\)</span><div class="chain-edge"><span>\(\xrightarrow{R,0}\)</span><span>\(\xleftarrow{L,0}\)</span></div><span>\(s_3\)</span><div class="chain-edge one-way"><span>\(\xrightarrow{R,1}\)</span></div><div class="chain-state-wrap terminal-wrap"><span class="self-loop-marker loop-right" aria-label="Absorbing self-loop with zero reward"><span>\(\text{any},0\)</span></span><span class="state-node terminal">terminal</span></div></div><p>At \(s_0\), Left is a zero-reward self-loop; terminal is a zero-reward absorbing self-loop. Therefore,</p>${display(S`v_\pi(s_3)=1,\quad v_\pi(s_2)=0.9,\quad v_\pi(s_1)=0.9^2,\quad v_\pi(s_0)=0.9^3.`)}<p>For example, \(q_\pi(s_2,\text{Right})=0.9\). How about \(q_\pi(s_2,\text{Left})\)?</p>`},
  ...[0,1].map(i=>({kind:"dense",title:"The Bellman equation for v<sub>π</sub>",body:visibleSequence(bellmanDerivation,i,[1])})),
  {kind:"dense",title:"The Bellman equation for state-value function",body:visibleSequence(bellmanDerivation,1,[1])},
  {kind:"dense bellman-action-question",title:"The Bellman equation for action-value function",body:S`<p><span class="scarlet">Question:</span> Can you derive the Bellman equation for \(q_\pi(s,a)\)?</p><div class="bellman-answer-space" aria-label="Blank space for a handwritten derivation of the Bellman equation for the action-value function"></div>`},
  ...[0,1,2,3,4].map(i=>({kind:"dense",title:"Using value functions to find the optimal policy",body:sequence(optimalViaValue,i,[2])})),
  {kind:"dense",title:"The Bellman optimality equation",body:bellmanOptimality},
  ...[1,2].map(i=>({kind:"dense",title:"Why the Bellman optimality equation?",body:`<p>Why is this “Bellman optimality equation” useful?</p>`+reveal(whyOptimality,i)})),
  ...[2,3].map(i=>({title:"Considerations in solving the Bellman optimality equation",body:reveal([`Computational power`,`Full and accurate MDP knowledge`,`Markov property`,`Note: Optimality and approximations`],i)})),
  ...[0,1,2,3].map(i=>({kind:"dense",title:"Dynamic Programming",body:visible(dpItems,i)})),
  ...[0,1,2].map(i=>({kind:"dense",title:"Policy evaluation",body:reveal(policyEval,i)})),
  {kind:"algorithm",title:"Iterative policy evaluation algorithm",body:renderAlgorithm(policyEvaluationAlgorithmLatex)},
  {title:"Next lecture",body:ul([`Dynamic programming, continued.`])}
];
