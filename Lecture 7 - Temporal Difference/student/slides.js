// Professor-editable source. Edit HTML and LaTeX here, then run build.mjs.
export const course = {
  number: "ISE/ECE 7202", name: "Reinforcement Learning",
  lecture: "Lecture 7: Temporal Difference", professor: "Xian Yu",
  institution: "The Ohio State University"
};

const S = String.raw;
const ul = items => `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
const visible = (items, active) => ul(items.slice(0, active + 1));
const display = latex => `<div class="display">\\[${latex}\\]</div>`;
const escapeMath = math => math.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const inlineLatex = text => text.replace(/\$([^$]+)\$/g, (_, math) => `\\(${escapeMath(math)}\\)`);

// Editable LaTeX algorithm/algorithmic source is rendered natively as HTML + KaTeX.
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
    if (/^\\Else$/.test(line)) { indent = Math.max(0, indent - 1); row("<strong>else</strong>", false, "alg-else"); indent++; continue; }
    if ((match = line.match(/^\\While\{(.+)\}$/))) { row(`<strong>while</strong> ${match[1]} <strong>do</strong>`); indent++; continue; }
    if ((match = line.match(/^\\ForAll\{(.+)\}$/))) { row(`<strong>for each</strong> ${match[1]} <strong>do</strong>`); indent++; continue; }
    if ((match = line.match(/^\\For\{(.+)\}$/))) { row(`<strong>for</strong> ${match[1]} <strong>do</strong>`); indent++; continue; }
    if ((match = line.match(/^\\If\{(.+)\}$/))) { row(`<strong>if</strong> ${match[1]} <strong>then</strong>`); indent++; continue; }
    if ((match = line.match(/^\\Statex\s+(.+)$/))) { row(match[1], false, "alg-section"); continue; }
    if ((match = line.match(/^\\State\s+(.+)$/))) row(match[1]);
  }
  return `<div class="latex-algorithm"><div class="algorithm-caption"><strong>Algorithm</strong> ${caption}</div><div class="algorithmic">${rows}</div></div>`;
};

const sarsaLatex = S`\begin{algorithm}
\caption{SARSA (on-policy TD control) for estimating $\pi\approx\pi^*$}
\begin{algorithmic}[1]
\Require Step size $\alpha\in(0,1]$; small $\epsilon>0$
\Ensure $Q\approx q^*$, which can then be used to find $\pi\approx\pi^*$
\State Initialize $Q(s,a)$ arbitrarily, except $Q(\text{terminal},a)=0$, $\forall a$
\ForAll{episodes}
  \State Initialize $S$
  \State Choose $A$ at $S$ according to a policy derived from $Q$, e.g. $\epsilon$-greedy
  \While{$S$ is not terminal}
    \State Take action $A$; observe reward $R$ and next state $S'$
    \State Choose $A'$ at $S'$ according to a policy derived from $Q$, e.g. $\epsilon$-greedy
    \State $Q(S,A)\gets Q(S,A)+\alpha[R+\delta Q(S',A')-Q(S,A)]$
    \State $S\gets S'$; $A\gets A'$
  \EndWhile
\EndFor
\end{algorithmic}
\end{algorithm}`;

const qLearningLatex = S`\begin{algorithm}
\caption{Q-learning (off-policy TD control) for estimating $\pi\approx\pi^*$}
\begin{algorithmic}[1]
\Require Step size $\alpha\in(0,1]$; small $\epsilon>0$
\Ensure $Q\approx q^*$, which can then be used to find $\pi\approx\pi^*$
\State Initialize $Q(s,a)$ arbitrarily, except $Q(\text{terminal},a)=0$, $\forall a$
\ForAll{episodes}
  \State Initialize $S$
  \While{$S$ is not terminal}
    \State Choose $A$ at $S$ according to a policy derived from $Q$, e.g. $\epsilon$-greedy
    \State Take action $A$; observe reward $R$ and next state $S'$
    \State $Q(S,A)\gets Q(S,A)+\alpha[R+\delta\max_a Q(S',a)-Q(S,A)]$
    \State $S\gets S'$
  \EndWhile
\EndFor
\end{algorithmic}
\end{algorithm}`;

const nStepTDLatex = S`\begin{algorithm}
\caption{$n$-step TD algorithm for estimating $V\approx v_\pi$}
\begin{algorithmic}[1]
\Require Policy $\pi$; step size $\alpha\in(0,1]$; positive integer $n$
\Ensure $V\approx v_\pi$
\State Initialize $V(s)$ arbitrarily, except $V(\text{terminal})=0$
\ForAll{episodes}
  \State Initialize and store $S_0$; set $T\gets\infty$ and $t\gets0$
  \While{$\tau\ne T-1$}
    \State If $t<T$: take $A_t$ at $S_t$ according to $\pi$, observe and store $R_t$ and $S_{t+1}$, and set $T\gets t+1$ if $S_{t+1}$ is terminal
    \State $\tau\gets t-n+1$
    \If{$\tau\ge0$}
      \State $G\gets\sum_{i=\tau}^{\min\{\tau+n,T\}-1}\delta^{i-\tau}R_i$, and $G\gets G+\delta^nV(S_{\tau+n})$ if $\tau+n<T$
      \State $V(S_\tau)\gets V(S_\tau)+\alpha[G-V(S_\tau)]$
    \EndIf
    \State $t\gets t+1$
  \EndWhile
\EndFor
\end{algorithmic}
\end{algorithm}`;

const nStepSarsaLatex = S`\begin{algorithm}
\caption{$n$-step SARSA algorithm for estimating $\pi\approx\pi^*$}
\begin{algorithmic}[1]
\Require Step size $\alpha\in(0,1]$; small $\epsilon>0$; positive integer $n$
\Ensure $Q\approx q^*$, from which $\pi\approx\pi^*$ can be found
\State Initialize $Q(s,a)$ arbitrarily, except $Q(\text{terminal},a)=0$, and $\pi$ arbitrarily
\ForAll{episodes}
  \State Initialize and store $S_0$ and $A_0\sim\pi$; set $T\gets\infty$ and $t\gets0$
  \While{$\tau\ne T-1$}
    \State If $t<T$: take $A_t$, observe and store $R_t$ and $S_{t+1}$; if $S_{t+1}$ is terminal set $T\gets t+1$, else store $A_{t+1}\sim\pi$
    \State $\tau\gets t-n+1$
    \If{$\tau\ge0$}
      \State $G\gets\sum_{i=\tau}^{\min\{\tau+n,T\}-1}\delta^{i-\tau}R_i$, and $G\gets G+\delta^nQ(S_{\tau+n},A_{\tau+n})$ if $\tau+n<T$
      \State $Q(S_\tau,A_\tau)\gets Q(S_\tau,A_\tau)+\alpha[G-Q(S_\tau,A_\tau)]$
      \State Update $\pi(\cdot\mid S_\tau)$ to be $\epsilon$-greedy with respect to $Q$
    \EndIf
    \State $t\gets t+1$
  \EndWhile
\EndFor
\end{algorithmic}
\end{algorithm}`;

const dynaQLatex = S`\begin{algorithm}
\caption{The Dyna-Q algorithm for estimating $\pi\approx\pi^*$}
\begin{algorithmic}[1]
\Require Step size $\alpha\in(0,1]$; small $\epsilon>0$; integer $n$
\Ensure $Q\approx q^*$, which can then be used to find $\pi\approx\pi^*$
\State Initialize $Q(s,a)$ and $\operatorname{Model}(s,a)$ arbitrarily, $\forall s,a$
\State Initialize $S$ to a non-terminal state
\While{true}
  \State Choose $A$ at $S$ according to a policy derived from $Q$ using $\epsilon$-greedy
  \State Take action $A$; observe reward $R$ and next state $S'$
  \State $Q(S,A)\gets Q(S,A)+\alpha[R+\delta\max_aQ(S',a)-Q(S,A)]$
  \State $\operatorname{Model}(S,A)\gets(R,S')$
  \For{$n$ times}
    \State Sample $\widetilde S$ from states visited before
    \State Sample $\widetilde A$ from actions taken at $\widetilde S$ before
    \State $(\widetilde R,\widetilde S')\gets\operatorname{Model}(\widetilde S,\widetilde A)$
    \State $Q(\widetilde S,\widetilde A)\gets Q(\widetilde S,\widetilde A)+\alpha[\widetilde R+\delta\max_aQ(\widetilde S',a)-Q(\widetilde S,\widetilde A)]$
  \EndFor
\EndWhile
\end{algorithmic}
\end{algorithm}`;

const sarsaItems = [
  "First, recall that similar to MC methods, we need the action-value function in order to carry out the policy improvement step when we do not know the MDP model.",
  S`We use the following temporal difference update:` + display(S`Q(S_t,A_t)\gets Q(S_t,A_t)+\alpha[R_t+\delta Q(S_{t+1},A_{t+1})-Q(S_t,A_t)].`),
  S`Note how this update uses the whole sequence \((S_t,A_t,R_t,S_{t+1},A_{t+1})\) in its updates.`,
  '<span class="scarlet"><strong>SARSA!</strong></span>',
  "It only remains to add the policy improvement component, and we will have the SARSA (on-policy) TD control method."
];

const qItems = [
  S`SARSA converges (with probability 1) to an optimal policy as long as the step size is decayed appropriately, all state-action pairs are visited infinitely often, and the policy converges to greedy, e.g. \(\epsilon_t=1/t\).`,
  S`Instead of the SARSA updates, we could update the action-value functions to approximate \(q^*\), independent of the policy being followed.`,
  S`In particular:` + display(S`Q(S_t,A_t)\gets Q(S_t,A_t)+\alpha\left[R_t+\delta\max_a Q(S_{t+1},a)-Q(S_t,A_t)\right].`),
  S`This is the Q-learning algorithm. It converges (with probability 1) to the optimal policy as long as all state-action pairs are visited infinitely often, and with appropriately chosen \(\alpha\).`
];

const expectedItems = [
  S`Consider one more way of updating the action-value functions:` + display(S`Q(S_t,A_t)\gets Q(S_t,A_t)+\alpha\left[R_t+\delta\sum_a\pi(a\mid S_{t+1})Q(S_{t+1},a)-Q(S_t,A_t)\right].`),
  "Note how this algorithm updates the future action-value by considering how likely each action is according to the current policy.",
  S`It moves deterministically in the direction that SARSA moves in expectation \(\rightarrow\) <span class="scarlet">expected SARSA</span>.`,
  S`Comparisons with the other TD methods so far:<ul><li>Empirically does better than SARSA because it does not have randomness due to action choice.</li><li>Can subsume Q-learning as a special case if \(\pi\) is greedy.</li><li>Additional computational costs.</li></ul>`,
  S`<strong>On-policy or off-policy?</strong> Either. If the \(\pi\) in the target is the policy generating the data, Expected SARSA is <span class="scarlet">on-policy</span>; if it is a different policy - greedy, say - it is <span class="scarlet">off-policy</span>, and with \(\pi\) greedy it is exactly Q-learning.`
];

const bootstrapItems = [
  "So far we have seen two types of learning methods: MC methods and one-step TD methods.",
  "We are going to put the ideas from both together and look at <span class=\"scarlet\">\\(n\\)-step TD methods</span>: these are the spectrum of possible methods from one-step TD methods on one end to MC methods on the other end.",
  "As we will see later, the ideas form the basis for the popular family of <span class=\"scarlet\">TD(\\(\\lambda\\)) learning methods</span>.",
  S`As usual, the prediction problem first (given \(\pi\), what is \(v_\pi\)?). Then extend the ideas to control methods (given \(q_\pi\), find a \(\pi'\ge\pi\)?).`
];

const nStepPredictionItems = [
  S`Recall how we compared what Monte Carlo and Temporal Difference methods are trying to estimate:` + display(S`\begin{aligned}v_\pi(s)&=\mathbb E_\pi[G_t\mid S_t=s]\\&=\mathbb E_\pi[R_t+\delta v_\pi(S_{t+1})\mid S_t=s].\end{aligned}`),
  "What if we tried something in between?",
  S`For instance, go two steps using actual rewards observed during the episode, then bootstrap:` + display(S`v_\pi(s)=\mathbb E_\pi[R_t+\delta R_{t+1}+\delta^2v_\pi(S_{t+2})\mid S_t=s].`),
  S`\(n\)-step TD methods:` + display(S`V_{t+n}(S_t)=V_{t+n-1}(S_t)+\alpha\left[R_t+\delta R_{t+1}+\cdots+\delta^{n-1}R_{t+n-1}+\delta^nV_{t+n-1}(S_{t+n})-V_{t+n-1}(S_t)\right].`)
];

const nStepControlItems = [
  S`We can now take the \(n\)-step TD prediction algorithm just shown, add policy improvement along the way, and get a control method for finding an optimal policy.`,
  S`As usual, since this is a learning problem, work with action-value functions instead of value functions to enable greedy or \(\epsilon\)-greedy policy improvement.`,
  S`We will show <span class="scarlet">\(n\)-step SARSA</span>. \(n\)-step Expected SARSA is quite similar.`,
  S`How about the \(n\)-step version of Q-learning? It can be done. We will not go into the details today; instead, we will discuss \(Q(\lambda)\) later.`
];

const dynaIntro = [
  "We can use the data collected during interactions with the environment not just for trial-and-error learning, but also to build a model of the environment.",
  S`Dyna-Q: after each observed transition \(S_t,A_t\to R_t,S_{t+1}\), update` + display(S`\operatorname{Model}(S_t,A_t)\gets(R_t,S_{t+1}).`)
];

const dynaThree = [
  '<span class="scarlet"><strong>Planning:</strong></span> use the model to do one-step Q-planning.',
  '<span class="scarlet"><strong>Learning:</strong></span> use the collected experiences to do one-step Q-learning.',
  S`<span class="scarlet"><strong>Acting:</strong></span> similar to before, \(\epsilon\)-greedy with respect to Q-values.`
];

const dynaBody = k => ul([...dynaIntro, 'Then:' + ul(dynaThree.slice(0, k + 1))]);

const cliffExample =
  '<div class="cliff-figure">' +
  '<svg viewBox="0 0 856 316" role="img" aria-label="Cliff walking gridworld: four by twelve grid with start at bottom left, goal at bottom right, and a cliff along the bottom row">' +
    '<rect x="88" y="224" width="680" height="68" fill="#4a4a4a"></rect>' +
    '<rect x="292" y="156" width="68" height="68" fill="#f8dce3"></rect>' +
    '<rect x="360" y="156" width="68" height="68" fill="#f8dce3"></rect>' +
    '<g stroke="#888" stroke-width="2">' +
      '<path d="M20 20 V292 M88 20 V292 M156 20 V292 M224 20 V292 M292 20 V292 M360 20 V292 M428 20 V292 M496 20 V292 M564 20 V292 M632 20 V292 M700 20 V292 M768 20 V292 M836 20 V292"></path>' +
      '<path d="M20 20 H836 M20 88 H836 M20 156 H836 M20 224 H836 M20 292 H836"></path>' +
    '</g>' +
    '<rect x="20" y="20" width="816" height="272" fill="none" stroke="#555" stroke-width="4"></rect>' +
    '<text x="54" y="258" class="cliff-node">S</text>' +
    '<text x="802" y="258" class="cliff-node">G</text>' +
    '<text x="428" y="258" class="cliff-label">The Cliff</text>' +
    '<text x="326" y="190" class="cliff-node">X</text>' +
    '<text x="394" y="190" class="cliff-node">Y</text>' +
    '<text x="428" y="312" class="cliff-note">reward -1 per step; stepping into the cliff gives -100 and resets to S; delta = 1</text>' +
  '</svg>' +
  '</div>' +
  '<p class="cliff-caption">Take \\(\\alpha=0.5\\). Current estimates: \\(Q(X,\\text{right})=-6\\); at \\(Y\\), \\(Q(Y,\\text{right})=-5\\), \\(Q(Y,\\text{up})=-7\\), \\(Q(Y,\\text{left})=-8\\), \\(Q(Y,\\text{down})=-100\\). The agent takes <em>right</em> at \\(X\\), receives \\(-1\\), arrives at \\(Y\\) - and \\(\\epsilon\\)-greedy happens to explore, selecting <em>down</em>.</p>' +
  '<div class="table-fill"><table class="ex-table roomy cliff-table">' +
    '<tr><th>Update of \\(Q(X,\\text{right})\\)</th><th>TD target</th><th>New \\(Q(X,\\text{right})\\)</th></tr>' +
    '<tr><td>SARSA</td><td></td><td></td></tr>' +
    '<tr><td>Q-learning</td><td></td><td></td></tr>' +
  '</table></div>' +
  '<p class="footnote">Example 6.6 from SB</p>';

const ringGridSvg =
  '<svg viewBox="0 0 300 300" role="img" aria-label="Three by three grid with a blocked centre; eight states numbered clockwise, state 1 pays +1 and state 8 pays -1">' +
    '<rect x="105" y="105" width="90" height="90" fill="#1a1a1a"></rect>' +
    '<g stroke="#777" stroke-width="2">' +
      '<path d="M15 15 V285 M105 15 V285 M195 15 V285 M285 15 V285"></path>' +
      '<path d="M15 15 H285 M15 105 H285 M15 195 H285 M15 285 H285"></path>' +
    '</g>' +
    '<rect x="15" y="15" width="270" height="270" fill="none" stroke="#555" stroke-width="4"></rect>' +
    '<text x="29" y="43" class="qg-num">1</text><text x="70" y="76" class="qg-rew">+1</text>' +
    '<text x="119" y="43" class="qg-num">2</text>' +
    '<text x="209" y="43" class="qg-num">3</text>' +
    '<text x="29" y="133" class="qg-num">8</text><text x="70" y="166" class="qg-rew">-1</text>' +
    '<text x="209" y="133" class="qg-num">4</text>' +
    '<text x="29" y="223" class="qg-num">7</text>' +
    '<text x="119" y="223" class="qg-num">6</text>' +
    '<text x="209" y="223" class="qg-num">5</text>' +
  '</svg>';

const qTable =
  '<table class="q-table">' +
    '<tr><td>\\((1,c)\\)</td><td>\\((2,c)\\)</td><td>\\((3,c)\\)</td><td>\\((4,c)\\)</td><td>\\((5,c)\\)</td><td>\\((6,c)\\)</td><td>\\((7,c)\\)</td><td>\\((8,c)\\)</td></tr>' +
    '<tr class="q-val"><td>1</td><td>0.4</td><td>0.38</td><td>0.14</td><td>0.2</td><td>-0.8</td><td>-0.9</td><td>-1.2</td></tr>' +
    '<tr><td>\\((1,cc)\\)</td><td>\\((2,cc)\\)</td><td>\\((3,cc)\\)</td><td>\\((4,cc)\\)</td><td>\\((5,cc)\\)</td><td>\\((6,cc)\\)</td><td>\\((7,cc)\\)</td><td>\\((8,cc)\\)</td></tr>' +
    '<tr class="q-val"><td>0.9</td><td>0.85</td><td>0.78</td><td>0.34</td><td>0.3</td><td>-0.5</td><td>-0.34</td><td>-1</td></tr>' +
  '</table>';

const behaviorTargetTerms =
  ul([
    'Two policies are at work in any TD control method:',
    'The <span class="scarlet"><strong>behavior policy</strong></span> is the policy used to choose actions - for instance, the actions actually observed in a real system.',
    'The <span class="scarlet"><strong>target policy</strong></span> is the policy whose value function we are learning about.',
    '<strong>Off-policy learning:</strong> the target policy is different from the behavior policy.',
    '<strong>On-policy learning:</strong> the target policy is the same as the behavior policy.'
  ]);

const behaviorPolicySlide =
  '<p><strong>The behavior policy</strong> determines which action to take while the \\(Q\\)-values are still being learned.</p>' +
  ul([
    '<span class="scarlet"><strong>Pure exploitation:</strong></span> always take the greedy action,' +
      display(S`A_t=\arg\max_a Q(S_t,a).`),
    '<span class="scarlet"><strong>\\(\\epsilon\\)-greedy:</strong></span> take the greedy action with probability \\(1-\\epsilon\\), and a uniformly random action with probability \\(\\epsilon\\).',
    'Policies based on upper confidence bounding, Thompson sampling, the knowledge gradient, \\(\\ldots\\)'
  ]);

const targetPolicySlide =
  '<p>The <strong>target policy</strong> \\(\\pi\\) is the policy whose value function we are learning - the policy that the update target implicitly evaluates. In expectation the target is</p>' +
  display(S`R_t+\delta\sum_a\pi(a\mid S_{t+1})\,Q(S_{t+1},a),`) +
  '<p>so \\(\\pi\\) is read off from which action the target uses at \\(S_{t+1}\\).</p>';

const watkinsSlide =
  '<div class="theorem-box"><div class="theorem-name">Q-learning (off-policy)</div><div class="theorem-body">' +
    '<p>Given an experience (current state \\(S_t\\), action \\(A_t\\), reward \\(R_t\\), next state \\(S_{t+1}\\)), Q-learning updates \\(Q\\) as</p>' +
    display(S`\begin{aligned}Q(S_t,A_t)&\gets(1-\alpha)\,Q(S_t,A_t)+\alpha\bigl(R_t+\delta\max_a Q(S_{t+1},a)\bigr)\\&=Q(S_t,A_t)+\alpha\bigl(R_t+\delta\max_a Q(S_{t+1},a)-Q(S_t,A_t)\bigr).\end{aligned}`) +
  '</div></div>' +
  '<p>It is the sampled form of the Bellman optimality equation for \\(q^*\\):</p>' +
  display(S`q^*(s,a)=\bar r(s,a)+\delta\sum_{s'}p(s'\mid s,a)\,v^*(s')=\bar r(s,a)+\delta\sum_{s'}p(s'\mid s,a)\max_{a'}q^*(s',a').`) +
  '<p class="spaced-note">Q-learning is an <span class="scarlet"><strong>off-policy</strong></span> algorithm:</p>' +
  ul([
    '<strong>Behavior policy:</strong> \\(\\epsilon\\)-greedy with respect to \\(Q\\).',
    '<strong>Target policy:</strong> greedy with respect to \\(Q\\).'
  ]);

const qGridExample =
  '<div class="qgrid-layout">' +
    '<div>' + qTable +
      '<p class="qgrid-caption">States \\(1,\\ldots,8\\) run clockwise around the blocked centre; actions are \\(c\\) (clockwise) and \\(cc\\) (counter-clockwise).</p>' +
    '</div>' +
    '<div class="qgrid-fig">' + ringGridSvg + '</div>' +
  '</div>' +
  '<p class="qgrid-task">Given the experience \\(S_t=5,\\ A_t=c,\\ R_t=0,\\ S_{t+1}=6\\): <strong>how does Q-learning update \\(Q(5,c)\\)?</strong></p>';

const sarsaBoxSlide =
  '<div class="theorem-box"><div class="theorem-name">SARSA (on-policy)</div><div class="theorem-body">' +
    '<p>At step \\(t\\), choose \\(A_t\\in\\arg\\max_a Q(S_t,a)\\) with probability \\(1-\\epsilon_t\\), and choose \\(A_t\\) uniformly at random with probability \\(\\epsilon_t\\). Observe \\(R_t\\) and \\(S_{t+1}\\).</p>' +
    '<p>With the data \\((S_t,A_t,R_t,S_{t+1},A_{t+1})\\), update</p>' +
    display(S`\begin{aligned}Q(S_t,A_t)&\gets(1-\alpha)\,Q(S_t,A_t)+\alpha\bigl(R_t+\delta Q(S_{t+1},A_{t+1})\bigr)\\&=Q(S_t,A_t)+\alpha\bigl[R_t+\delta Q(S_{t+1},A_{t+1})-Q(S_t,A_t)\bigr].\end{aligned}`) +
    '<p>Choose \\(\\{\\epsilon_t\\}\\) so that \\(\\epsilon_t\\to0\\) as \\(t\\to\\infty\\).</p>' +
  '</div></div>' +
  '<p class="spaced-note">SARSA is an <span class="scarlet"><strong>on-policy</strong></span> algorithm:</p>' +
  ul([
    '<strong>Behavior policy:</strong> \\(\\epsilon\\)-greedy with respect to \\(Q\\).',
    '<strong>Target policy:</strong> \\(\\epsilon\\)-greedy with respect to \\(Q\\).'
  ]);

const sarsaGridExample =
  '<div class="qgrid-layout">' +
    '<div>' + qTable +
      '<p class="qgrid-caption">States \\(1,\\ldots,8\\) run clockwise around the blocked centre; actions are \\(c\\) (clockwise) and \\(cc\\) (counter-clockwise).</p>' +
    '</div>' +
    '<div class="qgrid-fig">' + ringGridSvg + '</div>' +
  '</div>' +
  '<p class="qgrid-task">Given the experience \\(S_t=5,\\ A_t=c,\\ R_t=0,\\ S_{t+1}=6\\), together with the action \\(A_{t+1}\\) that the \\(\\epsilon\\)-greedy policy selects at state \\(6\\): <strong>how does SARSA update \\(Q(5,c)\\)?</strong></p>';

const nStepNotesItems = [
  'The update for \\(S_t\\) cannot be made until time \\(t+n\\): it needs \\(R_t,\\ldots,R_{t+n-1}\\) and \\(S_{t+n}\\). The algorithm stores the last \\(n\\) rewards and states, and \\(\\tau=t-n+1\\) marks the state whose turn it is to be updated.',
  'Nothing is updated for the first \\(n-1\\) steps (\\(\\tau<0\\)); after the episode ends the loop keeps running until \\(\\tau=T-1\\) to apply the \\(n-1\\) pending updates.',
  'Near the end of an episode the return <span class="scarlet">truncates</span>: if \\(\\tau+n\\ge T\\) there is no bootstrap term and \\(G\\) is the full return, so the method behaves like MC on the tail.',
  '<strong>The two endpoints:</strong> \\(n=1\\) is TD(0), and \\(n\\ge T-t\\) is Monte Carlo.'
];

const dynaArchItems = [
  'Dyna runs three processes off the same \\(Q\\) update: <span class="scarlet"><strong>direct RL</strong></span> from real experience, <span class="scarlet"><strong>model learning</strong></span> from real experience, and <span class="scarlet"><strong>planning</strong></span> from simulated experience.',
  'Real experience therefore does double duty - it improves \\(Q\\) <em>directly</em>, and it improves the model, which improves \\(Q\\) <em>indirectly</em> through planning.',
  'The integer \\(n\\) sets the planning-to-acting ratio: \\(n=0\\) is plain Q-learning, while a larger \\(n\\) squeezes more out of every real step at the cost of computation per step. Indirect methods pay off when real interaction is expensive.',
  'Planning runs in the background in small increments, so it can be interrupted the moment the next real action is due.'
];

export const slides = [
  {kind:"title",title:course.lecture,body:`<div class="title-card"><div class="title-rule"></div><h1>${course.lecture}</h1><p class="course-line">${course.number} ${course.name}</p><p>${course.institution}</p><p>Autumn 2026</p><p class="professor">${course.professor}</p></div>`},
  {title:"Outline",body:ul([
    "Last time: Introduction to Temporal Difference (TD) methods and TD prediction",
    "Today: TD control<ul><li>SARSA</li><li>Q-learning</li><li>Expected SARSA</li></ul>",
    "Also today: combining MC and TD methods<ul><li>\\(n\\)-step TD</li><li>Dyna-Q</li></ul>"
  ])},

  {kind:"dense",title:"Behavior policies and target policies",body:behaviorTargetTerms},
  {kind:"dense",title:"The behavior policy",body:behaviorPolicySlide},
  {kind:"dense",title:"The target policy",body:targetPolicySlide},

  ...[0,1,2,3,4].map(i => ({kind:"dense",title:"Our first TD control method: SARSA",body:visible(sarsaItems,i)})),
  {kind:"dense",title:"SARSA (Rummery and Niranjan 1994)",body:sarsaBoxSlide},
  {kind:"algorithm algorithm-medium",title:"The SARSA algorithm",body:renderAlgorithm(sarsaLatex)},
  {kind:"dense qgrid-slide",title:"SARSA: a grid example",body:sarsaGridExample},

  ...[0,2,3].map(i => ({kind:"dense",title:"Another TD control method: Q-learning",body:visible(qItems,i)})),
  {kind:"dense",title:"Q-learning (Watkins 1989)",body:watkinsSlide},
  {kind:"algorithm algorithm-medium",title:"Q-learning",body:renderAlgorithm(qLearningLatex)},
  {kind:"dense qgrid-slide",title:"Q-learning: a grid example",body:qGridExample},
  {kind:"dense cliff-slide",title:"Example: cliff walking",body:cliffExample},

  ...[1,2,4].map(i => ({kind:"dense",title:"And one more TD method: Expected SARSA",body:visible(expectedItems,i)})),
  {kind:"dense",title:"TD methods: what we have seen so far",body:ul(["One-step, model-free, tabular TD methods."])},

  ...[2,3].map(i => ({kind:"dense",title:"\\(n\\)-step bootstrapping: combining TD and MC",body:visible(bootstrapItems,i)})),
  ...[1,2,3].map(i => ({kind:"dense",title:"The \\(n\\)-step TD prediction algorithm",body:visible(nStepPredictionItems,i)})),
  ...[0,1,2,3].map(i => ({kind:"dense",title:"Notes on \\(n\\)-step TD prediction algorithm",body:visible(nStepNotesItems,i)})),
  {kind:"algorithm algorithm-extra-long algorithm-nstep-td",title:"\\(n\\)-step TD prediction algorithm",body:renderAlgorithm(nStepTDLatex)},

  ...[1,2,3].map(i => ({kind:"dense",title:"\\(n\\)-step TD control",body:visible(nStepControlItems,i)})),
  {kind:"algorithm algorithm-extra-long algorithm-nstep-sarsa",title:"\\(n\\)-step SARSA algorithm",body:renderAlgorithm(nStepSarsaLatex)},

  {kind:"dense",title:"The methods we have learned so far for solving MDPs",body:ul([
    "Planning vs. learning methods",
    "Can we also combine the ideas from learning and planning methods?"
  ])},
  {kind:"dense",title:"Using models to generate simulated experience",body:
    "<p>Recall that when we first started talking about learning methods, we said: “you can use them even if you have a model, but decide to use the model to generate simulated experiences.”</p>"},
  {kind:"dense",title:"Using models to generate simulated experience",body:
    "<p>Recall that when we first started talking about learning methods, we said: “you can use them even if you have a model, but decide to use the model to generate simulated experiences.”</p>" +
    "<p>Here is this idea, illustrated as <span class=\"scarlet\">one-step Q-planning</span>:</p>" +
    S`<div class="latex-algorithm compact-plan"><div class="algorithm-caption"><strong>Algorithm</strong> Random-sample one-step tabular Q-planning for estimating \(q\approx q^*\)</div><div class="algorithmic">
      <div class="alg-row" style="--indent:0"><span class="alg-num">1</span><span>Select a state \(S\) and action \(A\) at random, ensuring each is selected with probability \(>0\).</span></div>
      <div class="alg-row" style="--indent:0"><span class="alg-num">2</span><span>Send \(S,A\) to the model; sample reward \(R\) and next state \(S'\).</span></div>
      <div class="alg-row" style="--indent:0"><span class="alg-num">3</span><span>\(Q(S,A)\gets Q(S,A)+\alpha[R+\delta\max_a Q(S',a)-Q(S,A)]\).</span></div>
    </div></div>`},

  {kind:"dense",title:"Integrated Planning, Learning, and Acting: Dyna-Q",body:ul(dynaIntro)},
  ...[0,1,2].map(k => ({kind:"dense",title:"Integrated Planning, Learning, and Acting: Dyna-Q",body:dynaBody(k)})),
  {kind:"algorithm algorithm-extra-long",title:"Tabular Dyna-Q Algorithm",body:renderAlgorithm(dynaQLatex)},
  ...[0,1,2,3].map(i => ({kind:"dense",title:"Notes on the general Dyna architecture",body:visible(dynaArchItems,i)})),
  {kind:"dense",title:"Next lecture",body:ul([
    "Wrap up and summary of tabular methods.",
    "No class on Thursday, 10/15."
  ])}
];
