// Professor-editable source. Edit HTML and LaTeX here, then run build.mjs.
export const course = {
  number: "ISE/ECE 7202", name: "Reinforcement Learning",
  lecture: "Lecture 5: Dynamic Programming", professor: "Xian Yu",
  institution: "The Ohio State University"
};

const S = String.raw;
const ul = items => `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
const visible = (items, active) => ul(items.slice(0, active + 1));
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
  \Statex $\textit{Policy Improvement}$
  \State $\text{policy-stable}\gets\text{True}$
  \ForAll{$s\in\mathcal S$}
    \State $\text{old-action}\gets\pi(s)$
    \State $\pi(s)\gets\arg\max_a\sum_{s'}p(s,a,s')\,[r(s,a)+\delta V(s')]$
    \If{$\text{old-action}\ne\pi(s)$}
      \State $\text{policy-stable}\gets\text{False}$
    \EndIf
  \EndFor
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
const policyIterationExample = S`
  <div class="pi-example">
    <div class="pi-mdp">
      <p><strong>MDP:</strong> \(\delta=0.9\); all transitions are deterministic.</p>
      <div class="pi-chain" aria-label="Two-state chain MDP">
        <span class="pi-state">A</span>
        <span class="pi-edge"><b>right, 0</b>→</span>
        <span class="pi-state">B</span>
        <span class="pi-edge"><b>right, 4</b>→</span>
        <span class="pi-terminal">terminal</span>
      </div>
      <p class="pi-alt">At A: <strong>quit</strong> → terminal, reward 1 &nbsp;•&nbsp; At B: <strong>left</strong> → A, reward 0</p>
    </div>
    <table class="pi-table">
      <thead><tr><th>Iteration</th><th>Policy evaluation</th><th>Greedy policy improvement</th></tr></thead>
      <tbody>
        <tr><td>Initial \(\pi_0\)</td><td>\(\pi_0(A)=\mathrm{quit},\ \pi_0(B)=\mathrm{left}\)<br>\(V_{\pi_0}(A)=1,\ V_{\pi_0}(B)=0.9\)</td><td>At A: \(\max\{1,0.9(0.9)\}\Rightarrow\mathrm{quit}\)<br>At B: \(\max\{4,0.9(1)\}\Rightarrow\)<span class="scarlet">right</span></td></tr>
        <tr><td>\(\pi_1\)</td><td>\(\pi_1(A)=\mathrm{quit},\ \pi_1(B)=\mathrm{right}\)<br>\(V_{\pi_1}(A)=1,\ V_{\pi_1}(B)=4\)</td><td>At A: \(\max\{1,0.9(4)\}\Rightarrow\)<span class="scarlet">right</span><br>At B: right remains greedy</td></tr>
        <tr><td>\(\pi_2\)</td><td>\(\pi_2(A)=\mathrm{right},\ \pi_2(B)=\mathrm{right}\)<br>\(V_{\pi_2}(A)=3.6,\ V_{\pi_2}(B)=4\)</td><td>No action changes: <strong>\(\pi_2=\pi^*\)</strong></td></tr>
      </tbody>
    </table>
  </div>`;
const contractionItems = [
  S`<strong>Definition:</strong> the Bellman operator \(T:\mathbb R^{|\mathcal S|}\to\mathbb R^{|\mathcal S|}\) maps an estimate of the value function to another value function.` + display(S`T(v)(s)=\max_a\sum_{s'\in\mathcal S}p(s,a,s')\bigl(r(s,a)+\delta v(s')\bigr).`),
  S`An operator \(T:\mathcal X\to\mathcal X\) is a <span class="scarlet">contraction mapping</span> if there exists a \(\lambda\in[0,1)\) such that for any \(x,y\in\mathcal X\), \(d(T(x),T(y))\le\lambda d(x,y)\), where \(d\) is a distance function.`,
  S`<strong>Banach Fixed-Point Theorem:</strong> If \(T:\mathcal X\to\mathcal X\) is a contraction mapping on a non-empty complete normed vector space \((\mathcal X,d)\), then \(T\) admits a unique fixed point \(x^*\) in \(\mathcal X\) (i.e., \(T(x^*)=x^*\)). Furthermore, the sequence defined by \(x_{k+1}=T(x_k)\), with \(x_0\) chosen arbitrarily, converges to \(x^*\).`
];
const fixedPointItems = [
  "The above follows from the Banach fixed-point theorem, and the fact that the Bellman operator is a contraction mapping.",
  S`This \(v_\infty\) is the unique solution to the Bellman optimality equation.`,
  S`To see why, note that if we start VI from a value function \(v\) that solves the BOE, we are going to stay at that same \(v\) (i.e., a \(v\) satisfying the BOE is a fixed point of the Bellman operator).`
];
const piOptimal = [
  S`We can show that the “Bellman equation” operator that is repeatedly applied in the policy evaluation loop is a contraction mapping. Policy iteration therefore does indeed return \(v_\pi\) for the current \(\pi\) (in the limit).`,
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

export const slides = [
  {kind:"title",title:course.lecture,body:`<div class="title-card"><div class="title-rule"></div><h1>${course.lecture}</h1><p class="course-line">${course.number} ${course.name}</p><p>${course.institution}</p><p>Autumn 2026</p><p class="professor">${course.professor}</p></div>`},
  {title:"Outline",body:ul([
    "Last time: The value function and Bellman equations<ul><li>Bellman equations</li><li>Bellman optimality equations</li></ul>",
    "Today: Introduction to Dynamic Programming<ul><li>Policy iteration</li><li>Value iteration</li><li>Linear programming (LP) method</li></ul>"
  ])},

  ...[0,1,2].map(i=>({kind:"dense",title:"Policy improvement",body:visible(policyImprovement,i)})),
  {title:"The policy improvement theorem",body:theorem("Theorem (Policy Improvement Theorem)",
    S`For any policy \(\pi\), if \(\pi'\) is the deterministic policy such that` +
    display(S`q_\pi(s,\pi'(s))\ge v_\pi(s),\qquad\forall s\in\mathcal S,`) +
    S`then \(\pi'\ge\pi\).`)},
  {title:"The stochastic version",body:theorem("Theorem (Policy Improvement Theorem for Stochastic Policies)",
    S`For any policy \(\pi\), if \(\pi'\) is such that` +
    display(S`\sum_{a\in\mathcal A}\pi'(a\mid s)q_\pi(s,a)\ge v_\pi(s),\qquad\forall s\in\mathcal S,`) +
    S`then \(\pi'\ge\pi\).`)},
  {kind:"dense proof-slide",title:"The policy improvement theorem",body:
    theorem("Theorem (Policy Improvement Theorem)",S`For any policy \(\pi\), if \(q_\pi(s,\pi'(s))\ge v_\pi(s)\), \(\forall s\in\mathcal S\), then \(\pi'\ge\pi\).`) +
    "<p><strong>Proof.</strong></p>" +
    display(S`\begin{aligned}
v_\pi(s)&\le q_\pi(s,\pi'(s))\\
&=\mathbb E_\pi[R_t+\delta v_\pi(S_{t+1})\mid S_t=s,A_t=\pi'(s)]\\
&=\mathbb E_{\pi'}[R_t+\delta v_\pi(S_{t+1})\mid S_t=s]\\
&\le\mathbb E_{\pi'}[R_t+\delta q_\pi(S_{t+1},\pi'(S_{t+1}))\mid S_t=s]\\
&=\mathbb E_{\pi'}[R_t+\delta\mathbb E_{\pi'}[R_{t+1}+\delta v_\pi(S_{t+2})\mid S_{t+1}]\mid S_t=s]\\
&\le\cdots=v_{\pi'}(s).
\end{aligned}`)},

  ...[0,2,3].map(i=>({kind:"dense",title:"Our first DP algorithm: Policy Iteration (PI)",body:visible(policyIteration,i)})),
  {kind:"algorithm algorithm-long",title:"Policy Iteration (PI)",body:renderAlgorithm(policyIterationLatex)},
  {kind:"dense pi-example-slide",title:"Policy iteration: a two-state example",body:policyIterationExample},
  ...[1,2].map(i=>({kind:"dense",title:"Another DP algorithm: Value Iteration (VI)",body:visible(valueIterationIntro,i)})),
  {kind:"algorithm",title:"Value Iteration (VI)",body:renderAlgorithm(valueIterationLatex)},

  {kind:"dense",title:"Mathematical guarantees for the VI algorithm",body:
    "<p>We will now prove that the VI algorithm can indeed find the optimal policy. We proceed as follows:</p>" +
    ul([S`We show (1): VI converges to a fixed point \(v_\infty\).`,S`We show (2): \(v_\infty\) is the unique solution to the Bellman optimality equation.`,"We show (3): Any policy found from a value function satisfying the Bellman optimality equations is an optimal policy."]) +
    "<p class=\"scarlet\">Together, these mean that VI finds an optimal policy.</p>"},
  ...[0,1,2].map(i=>({kind:"dense",title:"Contraction mappings",body:visible(contractionItems,i)})),
  {title:"The Bellman operator is a contraction mapping",body:
    theorem("Proposition",S`Assume \(\delta<1\). The Bellman operator \(T\) is a contraction mapping on \(\mathbb R^{|\mathcal S|}\) with` + display(S`d(v,v'):=\max_{s\in\mathcal S}|v(s)-v'(s)|.`))},
  ...[0,1,2].map(i=>({kind:"dense",title:"So VI converges to a unique fixed point",body:
    theorem("Proposition",S`Value iteration converges to a unique fixed point \(v_\infty\) for all MDPs with finite state and action sets, bounded rewards, and \(\delta<1\).`) +
    visible(fixedPointItems,i)})),
  {title:"And this fixed point gives us an optimal policy",body:
    theorem("Proposition",S`All MDPs with finite state and action sets, bounded rewards, and \(\delta<1\) have at least one optimal policy.`)},
  ...[false,true].map(()=>({title:"To summarize we formally showed...",body:
    ul(["The Bellman operator is a contraction mapping","So VI converges to a unique fixed point","And this fixed point gives us an optimal policy"]) +
    "<p class=\"scarlet\"><strong>VI gives us an optimal policy!</strong></p>"})),

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
    S`<p>The optimal value function \(v_*\) is the unique solution to this linear program.</p>`},
  ...[0,1,2,3,4].map(i=>({kind:"dense",title:"Efficiency of dynamic programming",body:visible(efficiencyItems,i)})),
  {title:"Next lecture",body:ul(["Our first learning algorithm: Monte Carlo methods.","Homework 3 will be posted soon. It will be due next Friday by 11:59pm ET."])}
];
