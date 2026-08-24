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
  \State Initialize and store $S_0$
  \State $T\gets\infty$; $t\gets0$; $\tau$ arbitrary
  \While{$\tau\ne T-1$}
    \If{$t<T$}
      \State Take action $A$ at $S_t$ according to $\pi$
      \State Observe and store reward $R_t$ and next state $S_{t+1}$
      \If{$S_{t+1}$ is terminal}
        \State $T\gets t+1$
      \EndIf
    \EndIf
    \State $\tau\gets t-n+1$
    \If{$\tau\ge0$}
      \State $G\gets\sum_{i=\tau+1}^{\min\{\tau+n,T\}}\delta^{i-\tau-1}R_i$
      \If{$\tau+n<T$}
        \State $G\gets G+\delta^nV(S_{\tau+n})$
      \EndIf
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
\State Initialize $Q(s,a)$ arbitrarily, except $Q(\text{terminal},a)=0$, $\forall a$
\State Initialize $\pi(s)$ arbitrarily, $\forall s$
\ForAll{episodes}
  \State Initialize and store $S_0$; select and store $A_0$ according to $\pi$ at $S_0$
  \State $T\gets\infty$; $t\gets0$; $\tau$ arbitrary
  \While{$\tau\ne T-1$}
    \If{$t<T$}
      \State Take action $A_t$ at $S_t$ according to $\pi$
      \State Observe and store reward $R_t$ and next state $S_{t+1}$
      \If{$S_{t+1}$ is terminal}
        \State $T\gets t+1$
      \Else
        \State Select and store $A_{t+1}$ at $S_{t+1}$ according to $\pi$
      \EndIf
    \EndIf
    \State $\tau\gets t-n+1$
    \If{$\tau\ge0$}
      \State $G\gets\sum_{i=\tau+1}^{\min\{\tau+n,T\}}\delta^{i-\tau-1}R_i$
      \If{$\tau+n<T$}
        \State $G\gets G+\delta^nQ(S_{\tau+n},A_{\tau+n})$
      \EndIf
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
  S`Comparisons with the other TD methods so far:<ul><li>Empirically does better than SARSA because it does not have randomness due to action choice.</li><li>Can subsume Q-learning as a special case if \(\pi\) is greedy.</li><li>Additional computational costs.</li></ul>`
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
  S`\(n\)-step TD methods:` + display(S`V_{t+n}(S_t)=V_{t+n-1}(S_t)+\alpha\left[R_t+\delta R_{t+1}+\cdots+\delta^{n-1}R_{t+n}+\delta^nV_{t+n-1}(S_{t+n})-V_{t+n-1}(S_t)\right].`)
];

const nStepControlItems = [
  S`We can now take the \(n\)-step TD prediction algorithm just shown, add policy improvement along the way, and get a control method for finding an optimal policy.`,
  S`As usual, since this is a learning problem, work with action-value functions instead of value functions to enable greedy or \(\epsilon\)-greedy policy improvement.`,
  S`We will show <span class="scarlet">\(n\)-step SARSA</span>. \(n\)-step Expected SARSA is quite similar.`,
  S`How about the \(n\)-step version of Q-learning? It can be done. We will not go into the details today; instead, we will discuss \(Q(\lambda)\) later.`
];

const dynaItems = [
  "We can use the data collected during interactions with the environment not just for trial-and-error learning, but also to build a model of the environment.",
  S`Dyna-Q: after each observed transition \(S_t,A_t\to R_t,S_{t+1}\), update` + display(S`\operatorname{Model}(S_t,A_t)\gets(R_t,S_{t+1}).`),
  "Then:<ul><li><span class=\"scarlet\"><strong>Planning:</strong></span> use the model to do one-step Q-planning.</li></ul>",
  "<strong>Learning:</strong> use the collected experiences to do one-step Q-learning.",
  S`<strong>Acting:</strong> similar to before, \(\epsilon\)-greedy with respect to Q-values.`
];

export const slides = [
  {kind:"title",title:course.lecture,body:`<div class="title-card"><div class="title-rule"></div><h1>${course.lecture}</h1><p class="course-line">${course.number} ${course.name}</p><p>${course.institution}</p><p>Autumn 2026</p><p class="professor">${course.professor}</p></div>`},
  {title:"Outline",body:ul([
    "Last time: Introduction to Temporal Difference (TD) methods and TD prediction",
    "Today: TD control<ul><li>SARSA</li><li>Q-learning</li><li>Expected SARSA</li></ul>",
    "Also today: combining MC and TD methods<ul><li>\\(n\\)-step TD</li><li>Dyna-Q</li></ul>"
  ])},

  ...[0,1,2,3,4].map(i => ({kind:"dense",title:"Our first TD control method: SARSA",body:visible(sarsaItems,i)})),
  {kind:"algorithm algorithm-medium",title:"The SARSA algorithm",body:renderAlgorithm(sarsaLatex)},

  ...[0,2,3].map(i => ({kind:"dense",title:"Another TD control method: Q-learning",body:visible(qItems,i)})),
  {kind:"algorithm algorithm-medium",title:"Q-learning",body:renderAlgorithm(qLearningLatex)},

  ...[1,2,3].map(i => ({kind:"dense",title:"And one more TD method: Expected SARSA",body:visible(expectedItems,i)})),
  {kind:"dense",title:"TD methods: what we have seen so far",body:ul(["One-step, model-free, tabular TD methods."])},

  ...[2,3].map(i => ({kind:"dense",title:"\\(n\\)-step bootstrapping: combining TD and MC",body:visible(bootstrapItems,i)})),
  ...[1,2,3].map(i => ({kind:"dense",title:"The \\(n\\)-step TD prediction algorithm",body:visible(nStepPredictionItems,i)})),
  {kind:"dense",title:"Notes on \\(n\\)-step TD prediction algorithm",body:"<p class=\"board-note\">[On the board.]</p>"},
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

  ...[1,2,3,4].map(i => ({kind:"dense",title:"Integrated Planning, Learning, and Acting: Dyna-Q",body:visible(dynaItems,i)})),
  {kind:"algorithm algorithm-extra-long",title:"Tabular Dyna-Q Algorithm",body:renderAlgorithm(dynaQLatex)},
  {kind:"dense",title:"Notes on the general Dyna architecture",body:"<p class=\"board-note\">[On the board.]</p>"},
  {kind:"dense",title:"Next lecture",body:ul([
    "Wrap up and summary of tabular methods.",
    "Interim project report due next Friday, 10/21.",
    "NO CLASS on TUESDAY 10/18."
  ])}
];
