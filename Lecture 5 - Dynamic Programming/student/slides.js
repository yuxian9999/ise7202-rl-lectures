// Professor-editable source. Edit HTML and LaTeX here, then run build.mjs.
export const course = {
  number: "ISE/ECE 7202", name: "Reinforcement Learning",
  lecture: "Lecture 5: Dynamic Programming", professor: "Xian Yu",
  institution: "The Ohio State University"
};

const S = String.raw;
const ul = items => `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
const visible = (items, active) => ul(items.slice(0, active + 1));
const reveal = (items, active) => `<ul>${items.map((item,i)=>`<li class="${i<=active?"":"muted"}">${item}</li>`).join("")}</ul>`;
const sequence = (items, active, noBullets=[]) => `<ul>${items.map((item,i)=>`<li class="${i<=active?"":"muted"} ${noBullets.includes(i)?"no-bullet":""}">${item}</li>`).join("")}</ul>`;
const display = latex => `<div class="display">\\[${latex}\\]</div>`;
const theorem = (name, body) => `<div class="theorem-box"><div class="theorem-name">${name}</div><div class="theorem-body">${body}</div></div>`;

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
    if (/^\\StartBox$/.test(line)) { rows += `<div class="alg-box">`; continue; }
    if (/^\\EndBox$/.test(line)) { rows += "</div>"; continue; }
    if (/^\\End(?:For|While|If)/.test(line)) { indent=Math.max(0,indent-1); row("<strong>end</strong>",false,"alg-end"); continue; }
    if ((match=line.match(/^\\While\{(.+)\}$/))) { row(`<strong>while</strong> ${match[1]} <strong>do</strong>`); indent++; continue; }
    if ((match=line.match(/^\\ForAll\{(.+)\}$/))) { row(`<strong>for each</strong> ${match[1]} <strong>do</strong>`); indent++; continue; }
    if ((match=line.match(/^\\If\{(.+)\}$/))) { row(`<strong>if</strong> ${match[1]} <strong>then</strong>`); indent++; continue; }
    if ((match=line.match(/^\\Statex\s+(.+)$/))) { row(match[1],false,"alg-section"); continue; }
    if ((match=line.match(/^\\State\s+(.+)$/))) row(match[1]);
  }
  return `<div class="latex-algorithm"><div class="algorithm-caption"><strong>Algorithm</strong> ${caption}</div><div class="algorithmic">${rows}</div></div>`;
};

const policyIterationLatex = S`\begin{algorithm}
\caption{Policy iteration for estimating $\pi\approx\pi^*$}
\begin{algorithmic}[1]
\Require $\theta>0$
\Ensure $\pi\approx\pi^*$
\State Initialize $V(s)$, except $V(\text{terminal})=0$, and $\pi(s)\in\mathcal A$ arbitrarily
\State $\text{policy-stable}\gets\text{False}$
\While{$\text{policy-stable}=\text{False}$}
  \StartBox
  \Statex $\textit{Policy Evaluation}$
  \State Choose $\Delta>\theta$
  \While{$\Delta>\theta$}
    \State $\Delta\gets0$
    \ForAll{$s\in\mathcal S$}
      \State $v\gets V(s)$
      \State $V(s)\gets\sum_a\pi(a\mid s)\sum_{s'}p(s,a,s')\,[r(s,a)+\delta V(s')]$
      \State $\Delta\gets\max(\Delta,\lvert v-V(s)\rvert)$
    \EndFor
  \EndWhile
  \EndBox
  \StartBox
  \Statex $\textit{Policy Improvement}$
  \State $\text{policy-stable}\gets\text{True}$
  \ForAll{$s\in\mathcal S$}
    \State $\text{old-action}\gets\pi(s)$
    \State $\pi(s)\gets\arg\max_a\sum_{s'}p(s,a,s')\,[r(s,a)+\delta V(s')]$
    \If{$\text{old-action}\ne\pi(s)$}
      \State $\text{policy-stable}\gets\text{False}$
    \EndIf
  \EndFor
  \EndBox
\EndWhile
\end{algorithmic}
\end{algorithm}`;

const valueIterationLatex = S`\begin{algorithm}
\caption{Value iteration for estimating $\pi\approx\pi^*$}
\begin{algorithmic}[1]
\Require $\theta>0$
\Ensure $\pi\approx\pi^*$
\State Initialize $V(s)$ arbitrarily, except $V(\text{terminal})=0$
\State Choose $\Delta>\theta$
\While{$\Delta>\theta$}
  \State $\Delta\gets0$
  \ForAll{$s\in\mathcal S$}
    \State $v\gets V(s)$
    \State $V(s)\gets\max_a\sum_{s'}p(s,a,s')\,[r(s,a)+\delta V(s')]$
    \State $\Delta\gets\max(\Delta,\lvert v-V(s)\rvert)$
  \EndFor
\EndWhile
\State Output a deterministic policy $\pi$ such that
\State $\pi(s)=\arg\max_a\sum_{s'}p(s,a,s')\,[r(s,a)+\delta V(s')]$
\end{algorithmic}
\end{algorithm}`;

const policyImprovement = [
  S`Given that I have evaluated \(v_\pi\) for a policy \(\pi\), how can I update the policy to get a \(\pi'\) that is at least as good as \(\pi\)?`,
  S`Once you have \(v_\pi\), you can find:` + display(S`q_\pi(s,a)=\sum_{s'}p(s,a,s')\bigl(r(s,a)+\delta v_\pi(s')\bigr).`),
  S`What if you pick the new policy to be the (deterministic) <span class="scarlet">greedy policy</span> with respect to these \(q\) values?` + display(S`\pi'(s)=\arg\max_{a\in\mathcal A}q_\pi(s,a).`)
];
const policyIteration = [
  S`So far, given a policy \(\pi\), we know how to find \(v_\pi\), and then how to use \(v_\pi\) to get an improved policy \(\pi'\).`,
  S`We could then repeat these steps on policy \(\pi'\) to get an improved policy \(\pi''\), then repeat on \(\pi''\), ...`,
  S`This way of finding the optimal policy is called <span class="scarlet">policy iteration (PI)</span>.` + display(S`\pi\xrightarrow{E}v_\pi\xrightarrow{I}\pi'\xrightarrow{E}v_{\pi'}\xrightarrow{I}\pi''\longrightarrow\cdots`),
  "PI converges to the optimal policy in a finite number of iterations because there are finitely many policies."
];
const valueIterationIntro = [
  "A potential drawback of PI is that each of its iterations involves a full-backup policy evaluation loop. This only converges in the limit.",
  "The example we just saw suggests that the policy evaluation step can be truncated, and that using the truncated value, we can still converge to the optimal policy.",
  "One important special case is truncating after just one sweep; this is the <span class=\"scarlet\">value iteration (VI)</span> algorithm."
];
const piMdpFigure = S`
    <div class="pi-mdp">
      <p><strong>MDP:</strong> \(\delta=0.9\); all transitions are deterministic.</p>
      <svg class="pi-fig" viewBox="0 0 1000 258" role="img" aria-label="Two-state chain MDP: from A, right gives reward 0 and moves to B, quit gives reward 1 and moves to terminal; from B, right gives reward 4 and moves to terminal, left gives reward 0 and moves back to A.">
        <defs>
          <marker id="piArrow" viewBox="0 0 10 10" refX="9.2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#555"></path>
          </marker>
        </defs>
        <path class="pi-arc" d="M130,132 C 300,52 700,52 862,138" marker-end="url(#piArrow)"></path>
        <line class="pi-arc" x1="174" y1="160" x2="426" y2="160" marker-end="url(#piArrow)"></line>
        <line class="pi-arc" x1="426" y1="200" x2="174" y2="200" marker-end="url(#piArrow)"></line>
        <line class="pi-arc" x1="522" y1="180" x2="754" y2="180" marker-end="url(#piArrow)"></line>
        <rect class="pi-term-box" x="762" y="146" width="206" height="68" rx="6"></rect>
        <text class="pi-term-lbl" x="865" y="181" text-anchor="middle" dominant-baseline="central">terminal</text>
        <circle class="pi-node" cx="130" cy="180" r="48"></circle>
        <text class="pi-node-lbl" x="130" y="181" text-anchor="middle" dominant-baseline="central">A</text>
        <circle class="pi-node" cx="470" cy="180" r="48"></circle>
        <text class="pi-node-lbl" x="470" y="181" text-anchor="middle" dominant-baseline="central">B</text>
        <rect class="pi-lbl-bg" x="430" y="51" width="132" height="42"></rect>
        <text class="pi-lbl" x="496" y="72" text-anchor="middle" dominant-baseline="central">quit, 1</text>
        <text class="pi-lbl" x="300" y="132" text-anchor="middle" dominant-baseline="central">right, 0</text>
        <text class="pi-lbl" x="300" y="228" text-anchor="middle" dominant-baseline="central">left, 0</text>
        <rect class="pi-lbl-bg" x="562" y="158" width="152" height="42"></rect>
        <text class="pi-lbl" x="638" y="180" text-anchor="middle" dominant-baseline="central">right, 4</text>
      </svg>
    </div>`;
const piTableHead = `<thead><tr><th>Iteration</th><th>Policy evaluation</th><th>Greedy policy improvement</th></tr></thead>`;
const piExampleSlide = (rows, extraClass="") => S`
  <div class="pi-example">
    <div class="pi-mdp">
      <p><strong>MDP:</strong> \(\delta=0.9\); all transitions are deterministic.</p>
      <svg class="pi-fig" viewBox="0 0 1000 258" role="img" aria-label="Two-state chain MDP: from A, right gives reward 0 and moves to B, quit gives reward 1 and moves to terminal; from B, right gives reward 4 and moves to terminal, left gives reward 0 and moves back to A.">
        <defs>
          <marker id="piArrow" viewBox="0 0 10 10" refX="9.2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#555"></path>
          </marker>
        </defs>
        <path class="pi-arc" d="M130,132 C 300,52 700,52 862,138" marker-end="url(#piArrow)"></path>
        <line class="pi-arc" x1="174" y1="160" x2="426" y2="160" marker-end="url(#piArrow)"></line>
        <line class="pi-arc" x1="426" y1="200" x2="174" y2="200" marker-end="url(#piArrow)"></line>
        <line class="pi-arc" x1="522" y1="180" x2="754" y2="180" marker-end="url(#piArrow)"></line>
        <rect class="pi-term-box" x="762" y="146" width="206" height="68" rx="6"></rect>
        <text class="pi-term-lbl" x="865" y="181" text-anchor="middle" dominant-baseline="central">terminal</text>
        <circle class="pi-node" cx="130" cy="180" r="48"></circle>
        <text class="pi-node-lbl" x="130" y="181" text-anchor="middle" dominant-baseline="central">A</text>
        <circle class="pi-node" cx="470" cy="180" r="48"></circle>
        <text class="pi-node-lbl" x="470" y="181" text-anchor="middle" dominant-baseline="central">B</text>
        <rect class="pi-lbl-bg" x="430" y="51" width="132" height="42"></rect>
        <text class="pi-lbl" x="496" y="72" text-anchor="middle" dominant-baseline="central">quit, 1</text>
        <text class="pi-lbl" x="300" y="132" text-anchor="middle" dominant-baseline="central">right, 0</text>
        <text class="pi-lbl" x="300" y="228" text-anchor="middle" dominant-baseline="central">left, 0</text>
        <rect class="pi-lbl-bg" x="562" y="158" width="152" height="42"></rect>
        <text class="pi-lbl" x="638" y="180" text-anchor="middle" dominant-baseline="central">right, 4</text>
      </svg>
    </div>
    <table class="pi-table ${extraClass}">${piTableHead}<tbody>${rows}</tbody></table>
  </div>`;
const piRowInitial = S`<tr><td>Initial \(\pi_0\)</td><td>\(\pi_0(A)=\mathrm{quit},\ \pi_0(B)=\mathrm{left}\)<br>\(v_{\pi_0}(A)=1,\ v_{\pi_0}(B)=0.9\)</td><td></td></tr>`;
const piRowsNext = S`<tr><td>\(\pi_1\)</td><td></td><td></td></tr><tr><td>\(\pi_2\)</td><td></td><td></td></tr>`;
const contractionItems = [
  S`<strong>Definition:</strong> the <span class="scarlet">Bellman optimality operator</span> \(T:\mathbb R^{|\mathcal S|}\to\mathbb R^{|\mathcal S|}\) maps an estimate of the value function to another value function.` + display(S`T(v)(s)=\max_a\sum_{s'\in\mathcal S}p(s,a,s')\bigl(r(s,a)+\delta v(s')\bigr).`),
  S`An operator \(T:\mathcal X\to\mathcal X\) is a <span class="scarlet">contraction mapping</span> if there exists a \(\lambda\in[0,1)\) such that for any \(x,y\in\mathcal X\), \(d(T(x),T(y))\le\lambda d(x,y)\), where \(d\) is a distance function.`,
  S`<strong>Banach Fixed-Point Theorem:</strong> If \(T:\mathcal X\to\mathcal X\) is a contraction mapping on a non-empty complete normed vector space \((\mathcal X,d)\), then \(T\) admits a unique fixed point \(x^*\) in \(\mathcal X\) (i.e., \(T(x^*)=x^*\)). Furthermore, the sequence defined by \(x_{k+1}=T(x_k)\), with \(x_0\) chosen arbitrarily, converges to \(x^*\).`
];
const fixedPointItems = [
  "The above follows from the Banach fixed-point theorem, and the fact that the Bellman operator is a contraction mapping.",
  S`This \(v_\infty\) is the unique solution to the Bellman optimality equation.`,
  S`To see why, note that if we start VI from a value function \(v\) that solves the BOE, we are going to stay at that same \(v\) (i.e., a \(v\) satisfying the BOE is a fixed point of the Bellman operator).`
];
const piOptimal = [
  S`Recall that the Bellman evaluation operator is a contraction mapping. As a result, the policy evaluation step returns \(v_\pi\) for the current \(\pi\) (in the limit).`,
  S`We also know from the policy improvement theorem that (deterministic) greedy policy improvement returns a policy \(\pi'\) that is at least as good as policy \(\pi\).`,
  "These together mean that there cannot be a cycle of policies."
];
const asyncItems = [
  "Both PI and VI go over the entire state space in each of their respective loops. When the state space is large, this can take very long. Can this be truncated?",
  "<span class=\"scarlet\">Asynchronous DP:</span> Update the value functions in any order, using whatever values of the other states happen to be available.",
  "Convergence guaranteed only given that all states are visited infinitely often.",
  "Benefits: typically (but not necessarily) faster convergence; parallel and distributed asynchronous computation; we can intermix computation and real-time interaction."
];
const gpiItems = [
  "So far, we have seen that PI lets the two processes of policy evaluation and policy improvement alternate.",
  "Then, in VI, we said this is not necessary. You could do just one iteration of policy evaluation between each policy improvement.",
  "Asynchronous DP allows these processes to alternate at an even finer level.",
  "<span class=\"scarlet\">Generalized policy iteration:</span> “letting policy evaluation and policy improvement interact, independent of the granularity and other details of the two processes”.",
  "Same convergence properties as VI and PI."
];
const multistepItems = [
  "Both PI and VI do only a <span class=\"scarlet\">one-step lookahead</span> when doing policy improvement (i.e., greedy improvement). It seems that doing a multi-step improvement could help us do better (especially if the policy evaluation phase itself has errors).",
  S`<span class="scarlet">PI with multi-step lookahead:</span> For the current policy \(\pi\), conduct policy evaluation the same as before; get a \(V_\pi\). Now to find an improved \(\pi'\), do an \(l\)-step lookahead as follows:` + display(S`\begin{aligned}(a_1^*,a_2^*,\ldots,a_l^*)&=\arg\max_{a_1,\ldots,a_l}\mathbb E_\pi\!\left[r(S_1,a_1)+\delta r(S_2,a_2)+\cdots\right.\\&\quad\left.+\delta^{l-1}r(S_l,a_l)+\delta^lV_\pi(S_{l+1})\mid S_1=s\right].\end{aligned}`) + S`Then, let \(\pi'(s)=a_1^*\) attained above.`,
  "Convergence guaranteed under the same conditions as PI."
];
const efficiencyItems = [
  "DP methods are in general better than several other methods for solving MDPs.",
  "Exponentially faster than direct search in the policy space (in order to provide the same guarantees as DP, exhaustive search of the policy space is needed).",
  "Linear programming methods can be used too, and have better worst-case guarantees than DP in some cases, but become impractical at smaller problems than DP does.",
  "That said, DP methods are not practical for solving large MDPs (curse of dimensionality).",
  "Recall also that they need full information about the MDP."
];


// ---- Review material carried over from Lecture 4 (its pages 50-63) ----
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
const optimalViaValue = [
  S`Value functions provide a partial ordering over policies. A policy \(\pi\) is better than \(\pi'\) if and only if \(v_\pi(s)\ge v_{\pi'}(s),\ \forall s\in\mathcal S\).`,
  S`Let \(\pi^*\) denote the optimal policy, that is, the policy (or policies) \(\pi^*\ge\pi,\ \forall\pi\in\Pi\). How can we find it?`,
  S`${display(S`\pi^*\ge\pi\quad\text{iff}\quad v_{\pi^*}(s)\ge v_\pi(s),\ \forall s\in\mathcal S.`)}`,
  `Note: How is this different from our earlier definition of the optimal policy? Which one is stricter?`,
  S`Denote the optimal state-value function \(v^*(s)=\max_\pi v_\pi(s)\), and the optimal action-value function \(q^*(s,a)=\max_\pi q_\pi(s,a)\). If I can find a policy \(\pi^*\) for which \(v_{\pi^*}(s)=v^*(s),\forall s\), then I have found an optimal policy.`
];
const bellmanOptimality = S`<ul><li><strong>Fix the first action.</strong> If the agent chooses \(a\) in state \(s\) and behaves optimally thereafter, its expected return is${display(S`\begin{aligned}&\mathbb E\!\left[R_t+\delta v^*(S_{t+1})\mid S_t=s,A_t=a\right]\\&\qquad=\sum_{s'}p(s,a,s')\bigl(r(s,a)+\delta v^*(s')\bigr).\end{aligned}`)}</li><li><strong>Choose the best first action.</strong> Therefore,${display(S`\boxed{v^*(s)=\max_a\sum_{s'}p(s,a,s')\bigl(r(s,a)+\delta v^*(s')\bigr).}`)}</li><li><strong>Why is the continuation optimal?</strong> If it were not optimal after some \(s'\), replacing it with an optimal continuation would improve the return, contradicting the definition of \(v^*(s)\).</li></ul>`;
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

const policyImprovementTheorem = theorem("Theorem (Policy Improvement Theorem)",
  S`For any policy \(\pi\), if \(\pi'\) is the deterministic policy such that` +
  display(S`q_\pi(s,\pi'(s))\ge v_\pi(s),\qquad\forall s\in\mathcal S,`) +
  S`then \(\pi'\ge\pi\).`);

const evalOperatorItems = [
  S`<strong>Definition:</strong> the <span class="scarlet">Bellman evaluation operator</span> \(T_\pi:\mathbb R^{|\mathcal S|}\to\mathbb R^{|\mathcal S|}\) for a fixed policy \(\pi\) maps an estimate of the value function to another value function.` + display(S`T_\pi(v)(s)=\sum_a\pi(a\mid s)\sum_{s'\in\mathcal S}p(s,a,s')\bigl(r(s,a)+\delta v(s')\bigr).`),
  S`An operator \(T:\mathcal X\to\mathcal X\) is a <span class="scarlet">contraction mapping</span> if there exists a \(\lambda\in[0,1)\) such that for any \(x,y\in\mathcal X\), \(d(T(x),T(y))\le\lambda d(x,y)\), where \(d\) is a distance function.`,
  S`<strong>Banach Fixed-Point Theorem:</strong> If \(T:\mathcal X\to\mathcal X\) is a contraction mapping on a non-empty complete normed vector space \((\mathcal X,d)\), then \(T\) admits a unique fixed point \(x^*\) in \(\mathcal X\) (i.e., \(T(x^*)=x^*\)). Furthermore, the sequence defined by \(x_{k+1}=T(x_k)\), with \(x_0\) chosen arbitrarily, converges to \(x^*\).`
];

const fourStateFigure = S`<figure><svg class="fs-fig" viewBox="0 0 420 400" role="img" aria-label="Four-state diamond MDP: state 0 at the top with reward plus one, state 1 on the right, state 2 at the bottom with reward minus one, state 3 on the left; neighbouring states are connected in a cycle.">
        <line class="fs-edge" x1="176" y1="86" x2="102" y2="176"></line>
        <line class="fs-edge" x1="224" y1="86" x2="298" y2="176"></line>
        <line class="fs-edge" x1="298" y1="224" x2="224" y2="314"></line>
        <line class="fs-edge" x1="102" y1="224" x2="176" y2="314"></line>
        <circle class="fs-node" cx="200" cy="62" r="32"></circle>
        <text class="fs-node-lbl" x="200" y="63" text-anchor="middle" dominant-baseline="central">0</text>
        <text class="fs-rew" x="248" y="63" dominant-baseline="central">+1</text>
        <circle class="fs-node" cx="330" cy="200" r="32"></circle>
        <text class="fs-node-lbl" x="330" y="201" text-anchor="middle" dominant-baseline="central">1</text>
        <circle class="fs-node" cx="200" cy="338" r="32"></circle>
        <text class="fs-node-lbl" x="200" y="339" text-anchor="middle" dominant-baseline="central">2</text>
        <text class="fs-rew" x="248" y="339" dominant-baseline="central">&#8722;1</text>
        <circle class="fs-node" cx="70" cy="200" r="32"></circle>
        <text class="fs-node-lbl" x="70" y="201" text-anchor="middle" dominant-baseline="central">3</text>
      </svg></figure>`;
const fourStateItems = [`<strong>Actions:</strong> clockwise (c) or counter-clockwise (cc).`,`An action is executed correctly with probability \\(0.6\\), and moves in the opposite direction with probability \\(0.4\\).`,`<strong>Rewards:</strong> \\(+1\\) after arriving in state 0 and \\(-1\\) after arriving in state 2; \\(0\\) otherwise.`,`<strong>Discount factor</strong> \\(\\delta=0.9\\).`];
const fourStateExample = extra => S`<div class="grid-answer-layout">` + fourStateFigure + `<div>${ul(fourStateItems.concat(extra||[]))}</div></div>`;

export const slides = [
  {kind:"title",title:course.lecture,body:`<div class="title-card"><div class="title-rule"></div><h1>${course.lecture}</h1><p class="course-line">${course.number} ${course.name}</p><p>${course.institution}</p><p>Autumn 2026</p><p class="professor">${course.professor}</p></div>`},
  {title:"Outline",body:ul([
    "Last time: The value function and Bellman equations<ul><li>Bellman equations</li><li>Bellman optimality equations</li></ul>",
    "Today: Introduction to Dynamic Programming<ul><li>Policy iteration</li><li>Value iteration</li><li>Linear programming (LP) method</li></ul>"
  ])},

  // ---- Review from Lecture 4 (its pages 50-63) ----
  {kind:"dense",title:"Using value functions to find the optimal policy",body:sequence(optimalViaValue,4,[2])},
  {kind:"dense",title:"The Bellman optimality equation",body:bellmanOptimality},
  ...[1,2].map(i=>({kind:"dense",title:"Why the Bellman optimality equation?",body:`<p>Why is this “Bellman optimality equation” useful?</p>`+reveal(whyOptimality,i)})),
  ...[2,3].map(i=>({title:"Considerations in solving the Bellman optimality equation",body:reveal([`Computational power`,`Full and accurate MDP knowledge`,`Markov property`,`Note: Optimality and approximations`],i)})),
  ...[0,1,2,3].map(i=>({kind:"dense",title:"Dynamic Programming",body:visible(dpItems,i)})),
  ...[0,1].map(i=>({kind:"dense",title:"Policy evaluation",body:reveal(policyEval,i)})),
  {kind:"dense",title:"Policy evaluation",body:reveal(policyEval,2) +
    S`<p><span class="scarlet">Question:</span> does this iterative solution method converge? If so, where does it converge to?</p>`},
  ...[0,1,2].map(i=>({kind:"dense",title:"The Bellman evaluation operator",body:visible(evalOperatorItems,i)})),
  {title:"The evaluation operator is a contraction mapping",body:
    theorem("Proposition",S`Assume \(\delta<1\). For every policy \(\pi\), the Bellman evaluation operator \(T_\pi\) is a contraction mapping on \(\mathbb R^{|\mathcal S|}\) with` + display(S`d(v,v'):=\max_{s\in\mathcal S}\lvert v(s)-v'(s)\rvert.`))},
  {kind:"algorithm",title:"Iterative policy evaluation algorithm",body:renderAlgorithm(policyEvaluationAlgorithmLatex)},
  {kind:"dense",title:"Example: a four-state MDP",body:fourStateExample([`<strong>Policy to evaluate:</strong> \\(\\pi\\) always moves clockwise, i.e. \\(\\pi(s)=c\\) for every state \\(s\\).`])},
  {kind:"note-slide",title:"Policy evaluation algorithm",body:S`<p><span class="scarlet">Question:</span> If the initial value function is \(V_0=(+1,0,-1,0)^{\mathsf T}\), what are the updated state values after two iterations of policy evaluation?</p>`},
  // ---- End of Lecture 4 review ----

  ...[0,1,2].map(i=>({kind:"dense",title:"Policy improvement",body:visible(policyImprovement,i)})),
  {title:"The policy improvement theorem",body:policyImprovementTheorem},
  {kind:"dense proof-slide",title:"The policy improvement theorem",body:
    policyImprovementTheorem +
    "<p><strong>Proof.</strong></p>" +
    display(S`\begin{aligned}
v_\pi(s)&\le q_\pi(s,\pi'(s))\\
&=\mathbb E_\pi[R_t+\delta v_\pi(S_{t+1})\mid S_t=s,A_t=\pi'(s)]\\
&=\mathbb E_{\pi'}[R_t+\delta v_\pi(S_{t+1})\mid S_t=s]\\
&\le\mathbb E_{\pi'}[R_t+\delta q_\pi(S_{t+1},\pi'(S_{t+1}))\mid S_t=s]\\
&=\mathbb E_{\pi'}[R_t+\delta\mathbb E_{\pi'}[R_{t+1}+\delta v_\pi(S_{t+2})\mid S_{t+1}]\mid S_t=s]\\
&\le\cdots=v_{\pi'}(s).
\end{aligned}`)},
  {title:"The stochastic version",body:theorem("Theorem (Policy Improvement Theorem for Stochastic Policies)",
    S`For any policy \(\pi\), if \(\pi'\) is such that` +
    display(S`\sum_{a\in\mathcal A}\pi'(a\mid s)q_\pi(s,a)\ge v_\pi(s),\qquad\forall s\in\mathcal S,`) +
    S`then \(\pi'\ge\pi\).`)},

  ...[0,2,3].map(i=>({kind:"dense",title:"Our first DP algorithm: Policy Iteration (PI)",body:visible(policyIteration,i)})),
  {kind:"algorithm algorithm-long",title:"Policy Iteration (PI)",body:renderAlgorithm(policyIterationLatex)},
  {kind:"dense pi-example-slide",title:"Policy iteration: a two-state example",body:piExampleSlide(piRowInitial,"pi-table-tall")},
  {kind:"dense pi-example-slide",title:"Policy iteration: a two-state example",body:piExampleSlide(piRowsNext)},
  ...[1,2].map(i=>({kind:"dense",title:"Another DP algorithm: Value Iteration (VI)",body:visible(valueIterationIntro,i)})),
  {kind:"dense collapse-slide",title:"One sweep collapses PI into VI",body:
    S`<p>Let \(V_k\) be the current estimate and \(\pi_{k+1}\) greedy w.r.t. \(V_k\). Run <em>one</em> evaluation sweep under \(\pi_{k+1}\):</p>` +
    `<div class="display collapse-eq">\\[` + S`\begin{aligned}
V_{k+1}(s)&=\sum_a\pi_{k+1}(a\mid s)\sum_{s'}p(s,a,s')\bigl[r(s,a)+\delta V_k(s')\bigr]&&\text{one evaluation sweep}\\[2pt]
&=\sum_{s'}p\bigl(s,\pi_{k+1}(s),s'\bigr)\bigl[r(s,\pi_{k+1}(s))+\delta V_k(s')\bigr]&&\pi_{k+1}\text{ is deterministic}\\[2pt]
&=\max_a\sum_{s'}p(s,a,s')\bigl[r(s,a)+\delta V_k(s')\bigr]&&\pi_{k+1}(s)\text{ attains the max}
\end{aligned}` + `\\]</div>` +
    `<div class="principle"><h2>The collapse</h2>` +
    S`<p>The \(\max_a\) does both jobs at once: picking the maximizer <em>is</em> the improvement step, and evaluating it <em>is</em> the evaluation sweep. So VI never stores \(\pi\) &mdash; it is implicit in \(V\), recovered by one final \(\arg\max\).</p></div>`},
  {kind:"algorithm",title:"Value Iteration (VI)",body:renderAlgorithm(valueIterationLatex)},
  {kind:"dense",title:"Example: a four-state MDP",body:fourStateExample()},
  {kind:"note-slide",title:"Value iteration algorithm",body:S`<p><span class="scarlet">Question:</span> If the initial value function is \(V_0=(+1,0,-1,0)^{\mathsf T}\), what are the updated state values after two iterations of value iteration?</p>`},

  {kind:"dense",title:"Mathematical guarantees for the VI algorithm",body:
    "<p>We will now prove that the VI algorithm can indeed find the optimal policy. We proceed as follows:</p>" +
    ul([S`We show (1): VI converges to a fixed point \(v_\infty\).`,S`We show (2): \(v_\infty\) is the unique solution to the Bellman optimality equation.`,"We show (3): Any policy found from a value function satisfying the Bellman optimality equations is an optimal policy."]) +
    "<p class=\"scarlet\">Together, these mean that VI finds an optimal policy.</p>"},
  ...[0,1,2].map(i=>({kind:"dense",title:"Contraction mappings",body:visible(contractionItems,i)})),
  {title:"The Bellman optimality operator is a contraction mapping",body:
    theorem("Proposition",S`Assume \(\delta<1\). The Bellman optimality operator \(T\) is a contraction mapping on \(\mathbb R^{|\mathcal S|}\) with` + display(S`d(v,v'):=\max_{s\in\mathcal S}|v(s)-v'(s)|.`))},
  ...[0,1,2].map(i=>({kind:"dense",title:"So VI converges to a unique fixed point",body:
    theorem("Proposition",S`Value iteration converges to a unique fixed point \(v_\infty\) for all MDPs with finite state and action sets, bounded rewards, and \(\delta<1\).`) +
    visible(fixedPointItems,i)})),
  {title:"And this fixed point gives us an optimal policy",body:
    theorem("Proposition",S`Let \(v_\infty\) be the unique fixed point of \(T\), and let \(\pi^*\) be greedy with respect to \(v_\infty\). Then \(v_\infty=v_{\pi^*}=v^*\) and \(\pi^*\) is optimal. In particular, every MDP with finite \(\mathcal S,\mathcal A\), bounded rewards and \(\delta<1\) has an optimal deterministic stationary policy.`)},
  {title:"To summarize we formally showed...",body:
    ul(["The Bellman optimality operator is a contraction mapping","So VI converges to a unique fixed point","And this fixed point gives us an optimal policy"]) +
    "<p class=\"scarlet\"><strong>VI gives us an optimal policy!</strong></p>"},

  ...[0,2].map(i=>({kind:"dense",title:"Does PI also give us an optimal policy?",body:visible(piOptimal,i)})),
  {title:"No cycles in the policy iteration algorithm",body:
    theorem("Proposition",S`It cannot be that \(\pi_j=\pi_k\) for some \(k>j\) in PI.`)},
  {kind:"dense",title:"More dynamic programming methods",body:ul([
    "Recall how dynamic programming algorithms consist of two building blocks: policy evaluation and policy improvement.",
    "We have seen two main ways of combining these building blocks: policy iteration (PI) and value iteration (VI).",
    "How can we extend/improve upon these, using the same principles? We discuss three ideas:<ul><li>Asynchronous DP</li><li>Generalized (or optimistic) policy iteration</li><li>Multi-step lookahead</li></ul>"
  ])},
  {kind:"dense",title:"More dynamic programming methods",body:ul([
    "Recall how dynamic programming algorithms consist of two building blocks: policy evaluation and policy improvement.",
    "We have seen two main ways of combining these building blocks: policy iteration (PI) and value iteration (VI).",
    "How can we extend/improve upon these, using the same principles? We discuss three ideas:<ul><li>Asynchronous DP <span class=\"scarlet\">(a change in policy evaluation order and frequency)</span></li><li>Generalized (or optimistic) policy iteration <span class=\"scarlet\">(changes in either policy evaluation or policy improvement orders and frequencies)</span></li><li>Multi-step lookahead <span class=\"scarlet\">(change in policy improvement)</span></li></ul>"
  ])},
  ...[0,1,2,3].map(i=>({kind:"dense",title:"Asynchronous dynamic programming",body:visible(asyncItems,i)})),
  ...[2,3,4].map(i=>({kind:"dense",title:"Generalized Policy Iteration (GPI)",body:visible(gpiItems,i)})),
  ...[0,1,2].map(i=>({kind:"dense",title:"Multi-step lookahead",body:visible(multistepItems,i)})),
  {kind:"dense",title:"An alternative to DP: a LP formulation",body:
    S`<p>Take an MDP \(\langle\mathcal S,\mathcal A,p,r,d_0,\delta\rangle\).</p><p>Consider the following linear program, with variables \(V\in\mathbb R^{|\mathcal S|}\):</p>` +
    display(S`\begin{aligned}\min_V\quad&\sum_s d_0(s)V(s)\\\text{s.t.}\quad&V(s)\ge\sum_{s'}p(s,a,s')\bigl(r(s,a)+\delta V(s')\bigr),\\&\hspace{8em}\forall a\in\mathcal A,\ s\in\mathcal S.\end{aligned}`)},
  {kind:"dense",title:"An alternative to DP: a LP formulation",body:
    S`<p>Take an MDP \(\langle\mathcal S,\mathcal A,p,r,d_0,\delta\rangle\).</p><p>Consider the following linear program, with variables \(V\in\mathbb R^{|\mathcal S|}\):</p>` +
    display(S`\begin{aligned}\min_V\quad&\sum_s d_0(s)V(s)\\\text{s.t.}\quad&V(s)\ge\sum_{s'}p(s,a,s')\bigl(r(s,a)+\delta V(s')\bigr),\\&\hspace{8em}\forall a\in\mathcal A,\ s\in\mathcal S.\end{aligned}`) +
    S`<p>The optimal value function \(v^*\) is the unique solution to this linear program.</p>`},
  ...[0,1,2,3,4].map(i=>({kind:"dense",title:"Efficiency of dynamic programming",body:visible(efficiencyItems,i)})),
  {title:"Next lecture",body:ul(["Our first learning algorithm: Monte Carlo methods."])}
];
