// Professor-editable source. Edit HTML and LaTeX here, then run build.mjs.
export const course = {
  number: "ISE/ECE 7202", name: "Reinforcement Learning",
  lecture: "Lecture 8: RL with Function Approximation", professor: "Xian Yu",
  institution: "The Ohio State University"
};

const ul = items => "<ul>" + items.map(item => "<li>" + item + "</li>").join("") + "</ul>";
const visible = (items, active) => ul(items.slice(0, active + 1));
const display = latex => '<div class="display">\\[' + latex + '\\]</div>';
const escapeMath = math => math.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const inlineLatex = text => text.replace(/\$([^$]+)\$/g, (_, math) => "\\(" + escapeMath(math) + "\\)");
const m = inlineLatex;

// Editable LaTeX algorithm/algorithmic source is rendered natively as HTML + KaTeX.
const renderAlgorithm = source => {
  const lines = source.split("\n").map(line => line.trim()).filter(Boolean);
  let indent = 0, lineNumber = 1, caption = "", rows = "";
  const row = (content, numbered = true, role = "") => {
    rows += '<div class="alg-row ' + role + '" style="--indent:' + indent + '"><span class="alg-num">' +
      (numbered ? lineNumber++ : "") + "</span><span>" + inlineLatex(content) + "</span></div>";
  };
  for (const line of lines) {
    if (/^\\(?:begin|end)\{(?:algorithm|algorithmic)\}/.test(line)) continue;
    let match;
    if ((match = line.match(/^\\caption\{(.+)\}$/))) { caption = inlineLatex(match[1]); continue; }
    if ((match = line.match(/^\\Require\s+(.+)$/))) { row("<strong>Input:</strong> " + match[1], false, "alg-input"); continue; }
    if ((match = line.match(/^\\Ensure\s+(.+)$/))) { row("<strong>Output:</strong> " + match[1], false, "alg-output"); continue; }
    if (/^\\End(?:For|While|If)/.test(line)) { indent = Math.max(0, indent - 1); row("<strong>end</strong>", false, "alg-end"); continue; }
    if (/^\\Else$/.test(line)) { indent = Math.max(0, indent - 1); row("<strong>else</strong>", false, "alg-else"); indent++; continue; }
    if ((match = line.match(/^\\While\{(.+)\}$/))) { row("<strong>while</strong> " + match[1] + " <strong>do</strong>"); indent++; continue; }
    if ((match = line.match(/^\\ForAll\{(.+)\}$/))) { row("<strong>for each</strong> " + match[1] + " <strong>do</strong>"); indent++; continue; }
    if ((match = line.match(/^\\For\{(.+)\}$/))) { row("<strong>for</strong> " + match[1] + " <strong>do</strong>"); indent++; continue; }
    if ((match = line.match(/^\\If\{(.+)\}$/))) { row("<strong>if</strong> " + match[1] + " <strong>then</strong>"); indent++; continue; }
    if ((match = line.match(/^\\Statex\s+(.+)$/))) { row(match[1], false, "alg-section"); continue; }
    if ((match = line.match(/^\\State\s+(.+)$/))) row(match[1]);
  }
  return '<div class="latex-algorithm"><div class="algorithm-caption"><strong>Algorithm</strong> ' + caption +
    '</div><div class="algorithmic">' + rows + "</div></div>";
};

const gradientMCLatex = [
  "\\begin{algorithm}",
  "\\caption{Gradient MC prediction for estimating $\\hat v\\approx v_\\pi$}",
  "\\begin{algorithmic}[1]",
  "\\Require Policy $\\pi$; differentiable $\\hat v:\\mathcal S\\times\\mathbb R^d\\to\\mathbb R$; step size $\\alpha\\in(0,1]$",
  "\\Ensure $\\hat v\\approx v_\\pi$",
  "\\State Initialize $\\mathbf w\\in\\mathbb R^d$ arbitrarily",
  "\\ForAll{episodes}",
  "\\State Generate an episode $S_1,A_1,R_1,\\ldots,S_{T-1},A_{T-1},R_{T-1},S_T$ using $\\pi$",
  "\\For{$t=1,2,\\ldots,T-1$}",
  "\\State $\\mathbf w\\gets\\mathbf w+\\alpha[G_t-\\hat v(S_t,\\mathbf w)]\\nabla_{\\mathbf w}\\hat v(S_t,\\mathbf w)$",
  "\\EndFor",
  "\\EndFor",
  "\\end{algorithmic}",
  "\\end{algorithm}"
].join("\n");

const semiGradientTDLatex = [
  "\\begin{algorithm}",
  "\\caption{Semi-gradient TD(0) prediction for estimating $\\hat v\\approx v_\\pi$}",
  "\\begin{algorithmic}[1]",
  "\\Require Policy $\\pi$; differentiable $\\hat v:\\mathcal S\\times\\mathbb R^d\\to\\mathbb R$; step size $\\alpha\\in(0,1]$",
  "\\Ensure $\\hat v\\approx v_\\pi$",
  "\\State Initialize $\\mathbf w\\in\\mathbb R^d$ arbitrarily, e.g. $\\mathbf w=\\mathbf0$",
  "\\ForAll{episodes}",
  "\\State Initialize $S$",
  "\\While{$S$ is not terminal}",
  "\\State Choose action $A$ at $S$ according to $\\pi$",
  "\\State Take action $A$; observe reward $R$ and next state $S'$",
  "\\State $\\mathbf w\\gets\\mathbf w+\\alpha[R+\\delta\\hat v(S',\\mathbf w)-\\hat v(S,\\mathbf w)]\\nabla_{\\mathbf w}\\hat v(S,\\mathbf w)$",
  "\\State $S\\gets S'$",
  "\\EndWhile",
  "\\EndFor",
  "\\end{algorithmic}",
  "\\end{algorithm}"
].join("\n");

const semiGradientSarsaLatex = [
  "\\begin{algorithm}",
  "\\caption{Episodic semi-gradient SARSA for estimating $\\pi\\approx\\pi^*$}",
  "\\begin{algorithmic}[1]",
  "\\Require Differentiable $\\hat q:\\mathcal S\\times\\mathcal A\\times\\mathbb R^d\\to\\mathbb R$; step size $\\alpha\\in(0,1]$; small $\\epsilon>0$",
  "\\Ensure $\\hat q\\approx q^*$",
  "\\State Initialize $\\mathbf w\\in\\mathbb R^d$ arbitrarily, e.g. $\\mathbf w=\\mathbf0$",
  "\\ForAll{episodes}",
  "\\State Initialize $S$",
  "\\State Choose action $A$ at $S$ using an $\\epsilon$-greedy policy derived from $\\hat q$",
  "\\While{$S$ is not terminal}",
  "\\State Take action $A$; observe reward $R$ and next state $S'$",
  "\\If{$S'$ is terminal}",
  "\\State $\\mathbf w\\gets\\mathbf w+\\alpha[R-\\hat q(S,A,\\mathbf w)]\\nabla_{\\mathbf w}\\hat q(S,A,\\mathbf w)$",
  "\\State Go to the next episode",
  "\\EndIf",
  "\\State Choose action $A'$ at $S'$ using an $\\epsilon$-greedy policy derived from $\\hat q$",
  "\\State $\\mathbf w\\gets\\mathbf w+\\alpha[R+\\delta\\hat q(S',A',\\mathbf w)-\\hat q(S,A,\\mathbf w)]\\nabla_{\\mathbf w}\\hat q(S,A,\\mathbf w)$",
  "\\State $S\\gets S'$; $A\\gets A'$",
  "\\EndWhile",
  "\\EndFor",
  "\\end{algorithmic}",
  "\\end{algorithm}"
].join("\n");

const semiGradientQLatex = [
  "\\begin{algorithm}",
  "\\caption{Episodic semi-gradient Q-learning for estimating $\\hat q\\approx q^*$}",
  "\\begin{algorithmic}[1]",
  "\\Require Differentiable $\\hat q:\\mathcal S\\times\\mathcal A\\times\\mathbb R^d\\to\\mathbb R$; step size $\\alpha\\in(0,1]$; small $\\epsilon>0$",
  "\\Ensure $\\hat q\\approx q^*$",
  "\\State Initialize $\\mathbf w\\in\\mathbb R^d$ arbitrarily, e.g. $\\mathbf w=\\mathbf0$",
  "\\ForAll{episodes}",
  "\\State Initialize $S$",
  "\\While{$S$ is not terminal}",
  "\\State Choose action $A$ at $S$ using an $\\epsilon$-greedy policy derived from $\\hat q$",
  "\\State Take action $A$; observe reward $R$ and next state $S'$",
  "\\If{$S'$ is terminal}",
  "\\State $\\mathbf w\\gets\\mathbf w+\\alpha[R-\\hat q(S,A,\\mathbf w)]\\nabla_{\\mathbf w}\\hat q(S,A,\\mathbf w)$",
  "\\State Go to the next episode",
  "\\EndIf",
  "\\State $\\mathbf w\\gets\\mathbf w+\\alpha[R+\\delta\\max_{a}\\hat q(S',a,\\mathbf w)-\\hat q(S,A,\\mathbf w)]\\nabla_{\\mathbf w}\\hat q(S,A,\\mathbf w)$",
  "\\State $S\\gets S'$",
  "\\EndWhile",
  "\\EndFor",
  "\\end{algorithmic}",
  "\\end{algorithm}"
].join("\n");

const summaryItems = [
  "Same building blocks: evaluation/prediction and policy improvement work together to find an optimal policy.",
  "Differences in evaluation step: the “width” and “depth” of updates.",
  "Some other dimensions:<ul><li>State-values vs. action-values</li></ul>",
  "Differences in policy improvement step: on-policy v.s. off-policy methods.",
  m("Action exploration: greedy, $\\epsilon$-greedy, UCB."),
  "Real vs. simulated experience.",
  "One dimension orthogonal to all of these: <span class=\"scarlet\"><strong>Function Approximation!</strong></span>"
];

const whyItems = [
  "Think of using a tabular method in a problem with a large state space.<ul><li>Memory needed to store large tables</li><li>More importantly, data needed to fill every table entry</li></ul>",
  "Function approximation saves computational resources while allowing <span class=\"scarlet\">generalization</span>. Use “examples” from the desired function to build an approximation to the entire function.",
  "Function approximation can be done in both value space and policy space. We start with value-function approximation."
];

const objectiveItems = [
  m("If $\\dim(\\mathbf w)\\ll|\\mathcal S|$, then the complexity reduces significantly."),
  m("Learning $\\mathbf w$ also allows us to <span class=\"scarlet\">generalize</span> when facing new state-action pairs."),
  "With fewer weights than states, making the estimate at one state accurate can inevitably make the estimate at other states inaccurate.",
  "A natural objective function is the <span class=\"scarlet\">Mean Squared Value Error</span>:" +
    display("\\overline{\\operatorname{VE}}(\\mathbf w)=\\sum_{s\\in\\mathcal S}\\left[v_\\pi(s)-\\hat v(s,\\mathbf w)\\right]^2."),
  "Include the state distribution in the error:" +
    display("\\overline{\\operatorname{VE}}(\\mathbf w)=\\sum_{s\\in\\mathcal S}\\mu(s)\\left[v_\\pi(s)-\\hat v(s,\\mathbf w)\\right]^2."),
  "Find the global, or at least a local, optimum so that this error is minimized.",
  "Many approaches are possible. We focus on function-approximation methods based on gradient principles."
];
const objectiveBody = stage => {
  const items = objectiveItems.slice(0, 3);
  items.push(stage === 1 ? objectiveItems[3] : stage >= 2 ? objectiveItems[4] : "");
  if (stage >= 3) items.push(objectiveItems[5]);
  if (stage >= 4) items.push(objectiveItems[6]);
  return ul(items.filter(Boolean));
};

const sgdIntro = [
  m("Consider $\\hat v(s,\\mathbf w)$ with weight vector $\\mathbf w=[w_1,w_2,\\ldots,w_d]^\\top$."),
  m("Let $\\mathbf w_t$ be the current weight vector."),
  m("To illustrate the idea, assume we can sample $v_\\pi(S_t)$, the true value of $S_t$, with samples drawn in proportion to $\\mu$. How should the weights be updated?")
];

const sgdIntroAsk = [
  sgdIntro[0],
  sgdIntro[1],
  m("To illustrate the idea, assume we can sample $v_\\pi(S_t)$, the true value of $S_t$, with samples drawn in proportion to $\\mu$. ") +
    "<span class=\"scarlet\"><strong>How should the weights be updated?</strong></span>"
];

const sgdNotes = [
  "Gradient descent because the update follows the negative gradient direction of the squared error.",
  "Stochastic because the update uses one stochastically selected sample.",
  m("If $\\alpha$ satisfies standard stochastic-approximation conditions, SGD is guaranteed to converge to a local optimum."),
  m("In learning, we do not know and cannot calculate $v_\\pi(S_t)$ exactly. Can an approximation still work?")
];

const sgdConvergenceRefs =
  '<p class="footnote">Robbins and Monro, <em>Ann. Math. Statist.</em> 22(3):400-407, 1951. &nbsp;&middot;&nbsp; ' +
  'Bertsekas and Tsitsiklis, <em>SIAM J. Optim.</em> 10(3):627-642, 2000. &nbsp;&middot;&nbsp; ' +
  'Bottou, Curtis and Nocedal, <em>SIAM Review</em> 60(2):223-311, 2018, Sec. 4. &nbsp;&middot;&nbsp; ' +
  'Books: Kushner and Yin (2003); Borkar (2008).</p>';

const sgdConvergenceItems = [
  m('<span class="scarlet"><strong>Why these two conditions:</strong></span> $\\sum_t\\alpha_t=\\infty$ lets the iterates still travel arbitrarily far, so they are never stranded short of the optimum; $\\sum_t\\alpha_t^2<\\infty$ keeps the accumulated noise finite, so the sampling error averages out.'),
  m('<span class="scarlet"><strong>What is not promised:</strong></span> for nonconvex $J$, only a stationary point; and a constant $\\alpha$ settles into a neighborhood of radius $O(\\alpha\\sigma^2)$, not a point.'),
  m('<span class="scarlet"><strong>Why it matters here:</strong></span> the guarantee needs an <em>unbiased</em> gradient. Gradient MC ($U_t=G_t$) qualifies; bootstrapping targets do not - hence "semi-gradient".')
];

const sgdConvergenceSlide =
  m('<p>Minimize $J(\\mathbf w)=\\mathbb E_\\xi[f(\\mathbf w,\\xi)]$ by $\\mathbf w_{t+1}=\\mathbf w_t-\\alpha_t\\mathbf g_t$, where $\\mathbb E[\\mathbf g_t\\mid\\mathbf w_t]=\\nabla J(\\mathbf w_t)$.</p>') +
  '<div class="theorem-box"><div class="theorem-name">Convergence of SGD (informal)</div><div class="theorem-body">' +
  m('<p>Assume $J$ is bounded below with $L$-Lipschitz gradient, the noise satisfies $\\mathbb E\\lVert\\mathbf g_t-\\nabla J(\\mathbf w_t)\\rVert^2\\le\\sigma^2$, and the step sizes obey the <span class="scarlet">Robbins-Monro conditions</span> $\\sum_{t}\\alpha_t=\\infty$ and $\\sum_{t}\\alpha_t^2<\\infty$. Then $\\nabla J(\\mathbf w_t)\\to\\mathbf 0$ almost surely; if $J$ is also convex, $\\mathbf w_t$ converges to a global minimizer.</p>') +
  '</div></div>' + ul(sgdConvergenceItems) + sgdConvergenceRefs;

const gradientTargetItems = [
  m("Let $U_t$ denote an estimate of $v_\\pi(S_t)$, also called the target, and update") +
    display("\\mathbf w_{t+1}=\\mathbf w_t+\\alpha[U_t-\\hat v(S_t,\\mathbf w_t)]\\nabla_{\\mathbf w}\\hat v(S_t,\\mathbf w_t)."),
  m("<span class=\"scarlet\"><strong>Unbiased estimate:</strong></span> if $\\mathbb E[U_t\\mid S_t=s]=v_\\pi(s)$, this converges to a local optimum for an appropriately chosen $\\alpha$."),
  m("For example, let $U_t=G_t$, the return used in MC methods.")
];

const semiGradientItems = [
  m("If $U_t$ is a bootstrapping update, such as the $n$-step TD target or the DP target, then we do not obtain the same guarantees."),
  "One way to see this is by recalling the stochastic-gradient-descent update...",
  "With bootstrapping targets, <span class=\"scarlet\">semi-gradient methods</span> are not gradient-descent methods and do not have the same convergence guarantees...",
  "...but the resulting methods still converge for some important cases."
];

const controlItems = [
  "To obtain a control algorithm: (1) change the updates to action-value updates, and (2) add policy improvement.",
  "We focus on semi-gradient SARSA and semi-gradient Q-learning for episodic tasks.",
  m("Both update the weights of $\\hat q$ in the same way, and differ only in the target $U_t$:") +
    display("\\mathbf w_{t+1}=\\mathbf w_t+\\alpha\\left[U_t-\\hat q(S_t,A_t,\\mathbf w_t)\\right]\\nabla_{\\mathbf w}\\hat q(S_t,A_t,\\mathbf w_t)."),
  m("<span class=\"scarlet\"><strong>Semi-gradient SARSA</strong></span> (on-policy): $U_t=R_t+\\delta\\,\\hat q(S_{t+1},A_{t+1},\\mathbf w_t)$, where $A_{t+1}$ is the action actually taken at $S_{t+1}$."),
  m("<span class=\"scarlet\"><strong>Semi-gradient Q-learning</strong></span> (off-policy): $U_t=R_t+\\delta\\max_{a}\\hat q(S_{t+1},a,\\mathbf w_t)$."),
  m("In both, policy improvement is implicit: actions are chosen $\\epsilon$-greedily with respect to the current $\\hat q$.")
];

const choiceItems = [
  m("So far, we have seen how to update the weights of a given function $\\hat v$ using gradient/semi-gradient methods."),
  m("What choices of $\\hat v$ are suitable for RL with these methods?"),
  m("Linear methods are among the most important classes:") +
    display("\\hat v(s,\\mathbf w)=\\mathbf w^\\top\\mathbf x(s)=\\sum_{i=1}^{d}w_i x_i(s)."),
  m("The vector $\\mathbf x$ is the <span class=\"scarlet\">feature vector</span>. Features may be defined in many ways.")
];

const tetrisFeatures = [
  "Board height and number of holes - 2 features (Tsitsiklis and Van Roy, 1996).",
  "Number of holes, height of each column, height differences between consecutive columns, and maximum board height - 22 features (Bertsekas and Ioffe, 1996).",
  "Landing height, eroded piece cells, row transitions, column transitions, holes, and board wells - 6 features (Dellacherie, 2003)."
];

const otherApproxItems = [
  "<strong>State aggregation:</strong> generalize by grouping states together.",
  "<strong>Nonlinear function approximation:</strong> artificial neural networks.<ul><li>Benefit: automated feature selection</li><li>Drawbacks: computational requirements, instability, and fewer theoretical guarantees</li></ul>",
  "<strong>Non-parametric function approximation:</strong> save and query training examples when needed. Examples include nearest neighbors and kernel regression."
];

const analysisItems = [
  m("For linear methods, $\\nabla_{\\mathbf w}\\hat v(s,\\mathbf w)=\\mathbf x(s)$."),
  m("The semi-gradient TD(0) update becomes") +
    display("\\begin{aligned}\\mathbf w_{t+1}&=\\mathbf w_t+\\alpha\\left(R_t+\\delta\\mathbf w_t^\\top\\mathbf x_{t+1}-\\mathbf w_t^\\top\\mathbf x_t\\right)\\mathbf x_t\\\\&=\\mathbf w_t+\\alpha\\left(R_t\\mathbf x_t-\\mathbf x_t(\\mathbf x_t-\\delta\\mathbf x_{t+1})^\\top\\mathbf w_t\\right).\\end{aligned}"),
  m("At steady state,") +
    display("\\mathbb E[\\mathbf w_{t+1}\\mid\\mathbf w_t]=\\mathbf w_t+\\alpha(\\mathbf b-\\mathbf A\\mathbf w_t),") +
    display("\\mathbf b:=\\mathbb E[R_t\\mathbf x_t],\\qquad \\mathbf A:=\\mathbb E[\\mathbf x_t(\\mathbf x_t-\\delta\\mathbf x_{t+1})^\\top]."),
  m("The TD fixed point is $\\mathbf w_{\\mathrm{TD}}=\\mathbf A^{-1}\\mathbf b$.")
];

const sgdConvSetup =
  "<p>Step back from reinforcement learning for a moment. The update on the previous slide is an instance of a general scheme: minimize a differentiable " +
  inlineLatex("$J:\\mathbb R^d\\to\\mathbb R$,</p>") +
  display("\\min_{\\mathbf w\\in\\mathbb R^d}\\;J(\\mathbf w),") +
  inlineLatex("<p>when only a <span class=\"scarlet\">noisy</span> gradient $\\mathbf g_t$ is available at each step:</p>") +
  display("\\mathbf w_{t+1}=\\mathbf w_t-\\alpha_t\\mathbf g_t,\\qquad t=0,1,2,\\ldots");

const sgdConvAssumptions = [
  m("<span class=\"scarlet\"><strong>(A1) Smoothness.</strong></span> $\\nabla J$ is $L$-Lipschitz, hence the descent lemma") +
    display("J(\\mathbf u)\\le J(\\mathbf w)+\\nabla J(\\mathbf w)^\\top(\\mathbf u-\\mathbf w)+\\tfrac{L}{2}\\lVert\\mathbf u-\\mathbf w\\rVert^2."),
  m("<span class=\"scarlet\"><strong>(A2) Unbiasedness.</strong></span> $\\mathbb E[\\mathbf g_t\\mid\\mathcal F_t]=\\nabla J(\\mathbf w_t)$, where $\\mathcal F_t$ collects the history up to time $t$."),
  m("<span class=\"scarlet\"><strong>(A3) Bounded variance.</strong></span> $\\mathbb E\\bigl[\\lVert\\mathbf g_t-\\nabla J(\\mathbf w_t)\\rVert^2\\mid\\mathcal F_t\\bigr]\\le\\sigma^2$."),
  m("<span class=\"scarlet\"><strong>(A4) Robbins-Monro step sizes.</strong></span> $\\sum_t\\alpha_t=\\infty$, $\\ \\sum_t\\alpha_t^2<\\infty$.")
];

const sgdTheoremBox =
  "<div class=\"theorem-box\"><div class=\"theorem-name\">Theorem (convergence of SGD)</div><div class=\"theorem-body\">" +
  inlineLatex("<p>Under (A1)-(A4), the iterates of $\\mathbf w_{t+1}=\\mathbf w_t-\\alpha_t\\mathbf g_t$ satisfy</p>") +
  display("\\sum_{t=0}^{\\infty}\\alpha_t\\,\\mathbb E\\lVert\\nabla J(\\mathbf w_t)\\rVert^2<\\infty \\qquad\\text{and}\\qquad \\min_{0\\le t\\le T-1}\\mathbb E\\lVert\\nabla J(\\mathbf w_t)\\rVert^2\\xrightarrow[T\\to\\infty]{}0.") +
  "</div></div>";

const sgdTheoremRemarks = [
  "The conclusion is convergence to a <span class=\"scarlet\">stationary point</span>, not a global minimum - which is exactly the \u201clocal optimum\u201d claim we made earlier.",
  m("If in addition $J$ is convex, the same argument gives $\\mathbb E[J(\\mathbf w_t)]\\to J^*$; if $J$ is strongly convex, $\\mathbf w_t\\to\\mathbf w^*$."),
  m("A supermartingale argument (Robbins-Siegmund) upgrades the conclusion to $\\lVert\\nabla J(\\mathbf w_t)\\rVert\\to0$ almost surely.")
];

const sgdProofStep1 = stage => {
  let body = "<p>Apply the descent lemma (A1) along the step " + inlineLatex("$\\mathbf w_{t+1}-\\mathbf w_t=-\\alpha_t\\mathbf g_t$:</p>") +
    display("J(\\mathbf w_{t+1})\\le J(\\mathbf w_t)-\\alpha_t\\nabla J(\\mathbf w_t)^\\top\\mathbf g_t+\\tfrac{L\\alpha_t^2}{2}\\lVert\\mathbf g_t\\rVert^2.");
  if (stage >= 1) body += "<p>Condition on " + inlineLatex("$\\mathcal F_t$. The cross term is handled by (A2), and (A2)-(A3) give $\\mathbb E[\\lVert\\mathbf g_t\\rVert^2\\mid\\mathcal F_t]\\le\\lVert\\nabla J(\\mathbf w_t)\\rVert^2+\\sigma^2$:</p>") +
    display("\\mathbb E[J(\\mathbf w_{t+1})\\mid\\mathcal F_t]\\le J(\\mathbf w_t)-\\alpha_t\\Bigl(1-\\tfrac{L\\alpha_t}{2}\\Bigr)\\lVert\\nabla J(\\mathbf w_t)\\rVert^2+\\tfrac{L\\sigma^2}{2}\\alpha_t^2.");
  if (stage >= 2) body += "<p>Since " + inlineLatex("$\\alpha_t\\le 1/L$ by (A5), we have $1-L\\alpha_t/2\\ge\\tfrac12$, so</p>") +
    display("\\mathbb E[J(\\mathbf w_{t+1})\\mid\\mathcal F_t]\\le J(\\mathbf w_t)-\\tfrac{\\alpha_t}{2}\\lVert\\nabla J(\\mathbf w_t)\\rVert^2+\\tfrac{L\\sigma^2}{2}\\alpha_t^2.");
  return body;
};

const sgdProofStep2 = stage => {
  let body = "<p>Take total expectations and sum the one-step inequality over " + inlineLatex("$t=0,\\ldots,T-1$; the $J$ terms telescope:</p>") +
    display("\\tfrac12\\sum_{t=0}^{T-1}\\alpha_t\\,\\mathbb E\\lVert\\nabla J(\\mathbf w_t)\\rVert^2\\le J(\\mathbf w_0)-\\mathbb E[J(\\mathbf w_T)]+\\tfrac{L\\sigma^2}{2}\\sum_{t=0}^{T-1}\\alpha_t^2.");
  if (stage >= 1) body += "<p>By (A4) " + inlineLatex("$\\mathbb E[J(\\mathbf w_T)]\\ge J^*$, and by (A5) $\\sum_t\\alpha_t^2<\\infty$. The right-hand side is therefore bounded by a constant $C$ that does not depend on $T$:</p>") +
    display("\\sum_{t=0}^{\\infty}\\alpha_t\\,\\mathbb E\\lVert\\nabla J(\\mathbf w_t)\\rVert^2\\le 2C:=2\\Bigl(J(\\mathbf w_0)-J^*+\\tfrac{L\\sigma^2}{2}\\sum_{t=0}^{\\infty}\\alpha_t^2\\Bigr)<\\infty.");
  if (stage >= 2) body += "<p>Finally, bounding the sum below by its smallest term gives</p>" +
    display("\\min_{0\\le t\\le T-1}\\mathbb E\\lVert\\nabla J(\\mathbf w_t)\\rVert^2\\le\\frac{\\sum_{t=0}^{T-1}\\alpha_t\\,\\mathbb E\\lVert\\nabla J(\\mathbf w_t)\\rVert^2}{\\sum_{t=0}^{T-1}\\alpha_t}\\le\\frac{2C}{\\sum_{t=0}^{T-1}\\alpha_t}\\longrightarrow 0,") +
    "<p>because " + inlineLatex("$\\sum_t\\alpha_t=\\infty$. $\\blacksquare$</p>");
  return body;
};

const sgdBackToRL = [
  m("Take $J(\\mathbf w)=\\tfrac12\\overline{\\operatorname{VE}}(\\mathbf w)$ and draw $S_t\\sim\\mu$. Then") +
    display("\\mathbf g_t=-\\bigl[v_\\pi(S_t)-\\hat v(S_t,\\mathbf w_t)\\bigr]\\nabla_{\\mathbf w}\\hat v(S_t,\\mathbf w_t)"),
  m("satisfies (A2), so the update two slides ago is exactly the scheme above and the theorem applies."),
  m("$\\alpha_t=1/t$ satisfies (A5); a <span class=\"scarlet\">constant</span> $\\alpha$ does not - it only reaches a neighbourhood of a stationary point of radius $O(\\alpha\\sigma^2)$, which is what we want for nonstationary problems."),
  "<span class=\"scarlet\"><strong>Warning:</strong></span> (A2) is precisely what fails once the target is <em>bootstrapped</em>. That is why the methods on the next slides are called <span class=\"scarlet\">semi-gradient</span> rather than gradient methods."
];


/* ---------- Deep Q-learning: adapted from ISE 7210, Value Function Approximations ---------- */

const nnNodes = (x, ys, r) => ys.map(y =>
  '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"></circle>').join("");
const nnEdges = (x1, ys1, x2, ys2) => ys1.map(a => ys2.map(b =>
  '<line x1="' + x1 + '" y1="' + a + '" x2="' + x2 + '" y2="' + b + '"></line>').join("")).join("");

const mlpSvg =
  '<div class="nn-figure"><svg viewBox="0 0 1660 440" role="img" aria-label="A three-layer network: inputs S, A and a constant, a hidden layer computing z and sigma of z, and an output giving the action value">' +
    '<defs><marker id="nn-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>' +
    '<g class="nn-edges">' +
      '<line x1="132" y1="110" x2="378" y2="110" marker-end="url(#nn-head)"></line>' +
      '<line x1="132" y1="122" x2="384" y2="234" marker-end="url(#nn-head)"></line>' +
      '<line x1="132" y1="238" x2="384" y2="126" marker-end="url(#nn-head)"></line>' +
      '<line x1="132" y1="250" x2="378" y2="250" marker-end="url(#nn-head)"></line>' +
      '<line x1="122" y1="368" x2="390" y2="137" marker-end="url(#nn-head)"></line>' +
      '<line x1="126" y1="380" x2="384" y2="266" marker-end="url(#nn-head)"></line>' +
      '<line x1="462" y1="110" x2="714" y2="110" marker-end="url(#nn-head)"></line>' +
      '<line x1="456" y1="128" x2="714" y2="243" marker-end="url(#nn-head)"></line>' +
      '<line x1="456" y1="232" x2="714" y2="117" marker-end="url(#nn-head)"></line>' +
      '<line x1="462" y1="250" x2="714" y2="250" marker-end="url(#nn-head)"></line>' +
      '<line x1="452" y1="362" x2="714" y2="125" marker-end="url(#nn-head)"></line>' +
      '<line x1="456" y1="374" x2="714" y2="258" marker-end="url(#nn-head)"></line>' +
      '<line x1="1080" y1="110" x2="1138" y2="110" marker-end="url(#nn-head)"></line>' +
      '<line x1="1080" y1="250" x2="1138" y2="250" marker-end="url(#nn-head)"></line>' +
      '<line x1="1338" y1="112" x2="1424" y2="160" marker-end="url(#nn-head)"></line>' +
      '<line x1="1338" y1="248" x2="1424" y2="200" marker-end="url(#nn-head)"></line>' +
      '<line x1="1270" y1="362" x2="1430" y2="208" marker-end="url(#nn-head)"></line>' +
      '<line x1="1502" y1="180" x2="1596" y2="180" marker-end="url(#nn-head)"></line>' +
    '</g>' +
    '<g class="nn-boxes">' +
      '<rect class="nn-box" x="720" y="78" width="360" height="64"></rect>' +
      '<rect class="nn-box" x="720" y="218" width="360" height="64"></rect>' +
      '<ellipse class="nn-ell" cx="1240" cy="110" rx="96" ry="34"></ellipse>' +
      '<ellipse class="nn-ell" cx="1240" cy="250" rx="96" ry="34"></ellipse>' +
    '</g>' +
    '<g class="nn-nodes">' +
      '<circle cx="420" cy="110" r="40"></circle><circle cx="420" cy="250" r="40"></circle><circle cx="1460" cy="180" r="40"></circle>' +
    '</g>' +
    '<g class="nn-unit">' +
      '<text x="90" y="110">S</text><text x="90" y="250">A</text><text x="90" y="390">1</text>' +
      '<text x="420" y="110">y\u2080\u2081</text><text x="420" y="250">y\u2080\u2082</text><text x="420" y="390">1</text>' +
      '<text x="1240" y="390">1</text>' +
    '</g>' +
    '<g class="nn-expr">' +
      '<text x="900" y="110">w\u2081\u2081\u2081y\u2080\u2081 + w\u2081\u2082\u2081y\u2080\u2082 + b\u2081\u2081 = z\u2081\u2081</text>' +
      '<text x="900" y="250">w\u2081\u2081\u2082y\u2080\u2081 + w\u2081\u2082\u2082y\u2080\u2082 + b\u2081\u2082 = z\u2081\u2082</text>' +
      '<text x="1240" y="110">\u03c3(z\u2081\u2081) = y\u2081\u2081</text>' +
      '<text x="1240" y="250">\u03c3(z\u2081\u2082) = y\u2081\u2082</text>' +
    '</g>' +
    '<g class="nn-wt">' +
      '<text x="256" y="94">w\u2080\u2081\u2081</text>' +
      '<text x="214" y="154">w\u2080\u2081\u2082</text>' +
      '<text x="214" y="206">w\u2080\u2082\u2081</text>' +
      '<text x="256" y="238">w\u2080\u2082\u2082</text>' +
      '<text x="206" y="292">b\u2080\u2081</text>' +
      '<text x="300" y="330">b\u2080\u2082</text>' +
      '<text x="588" y="94">w\u2081\u2081\u2081</text>' +
      '<text x="542" y="162">w\u2081\u2081\u2082</text>' +
      '<text x="542" y="200">w\u2081\u2082\u2081</text>' +
      '<text x="588" y="238">w\u2081\u2082\u2082</text>' +
      '<text x="524" y="296">b\u2081\u2081</text>' +
      '<text x="624" y="320">b\u2081\u2082</text>' +
      '<text x="1394" y="118">w\u2082\u2081\u2081</text>' +
      '<text x="1394" y="242">w\u2082\u2082\u2081</text>' +
      '<text x="1356" y="302">b\u2082\u2081</text>' +
    '</g>' +
    '<g class="nn-text">' +
      '<text x="420" y="32" class="nn-cap">Layer-0 (input layer)</text>' +
      '<text x="900" y="32" class="nn-cap">Layer-1</text>' +
      '<text x="1460" y="32" class="nn-cap">Layer-2 (output layer)</text>' +
      '<text x="1550" y="148" class="nn-out">q\u0302(S, A, w)</text>' +
    '</g>' +
  '</svg></div>';

const replaySvg =
  '<div class="replay-figure"><svg viewBox="0 0 1080 215" role="img" aria-label="A first-in first-out replay buffer with experiences sampled at random">' +
    '<g class="rp-cells">' +
      [0,1,2,3,4].map(i => '<rect x="' + (250 + i*112) + '" y="20" width="112" height="66"></rect>').join("") +
    '</g>' +
    '<g class="rp-text">' +
      ['EXP(2)','EXP(3)','EXP(4)','','EXP(k)'].map((t,i) => '<text x="' + (306 + i*112) + '" y="62">' + t + '</text>').join("") +
      '<text x="96" y="62">EXP(1)</text><text x="985" y="62">EXP(k+1)</text>' +
      '<text x="530" y="196" class="rp-cap">sample m experiences uniformly at random</text>' +
    '</g>' +
    '<g class="rp-arrows">' +
      '<line x1="242" y1="53" x2="164" y2="53" marker-end="url(#rp-head)"></line>' +
      '<line x1="905" y1="53" x2="822" y2="53" marker-end="url(#rp-head)"></line>' +
      '<line x1="306" y1="152" x2="306" y2="94" marker-end="url(#rp-head)"></line>' +
      '<line x1="530" y1="152" x2="530" y2="94" marker-end="url(#rp-head)"></line>' +
      '<line x1="754" y1="152" x2="754" y2="94" marker-end="url(#rp-head)"></line>' +
    '</g>' +
    '<defs><marker id="rp-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>' +
  '</svg></div>';

const archSvg =
  '<div class="arch-figure"><svg viewBox="0 0 1180 300" role="img" aria-label="Two network layouts: one output for a state-action pair, versus one output per action">' +
    '<g class="nn-edges">' +
      nnEdges(110, [105, 185], 252, [55, 120, 185, 250]) +
      nnEdges(288, [55, 120, 185, 250], 410, [140]) +
      nnEdges(760, [145], 882, [55, 120, 185, 250]) +
      nnEdges(918, [55, 120, 185, 250], 1020, [105]) +
      nnEdges(918, [55, 120, 185, 250], 1020, [195]) +
    '</g>' +
    '<g class="nn-nodes">' +
      nnNodes(90, [105, 185], 20) + nnNodes(270, [55, 120, 185, 250], 18) + nnNodes(430, [140], 20) +
      nnNodes(740, [145], 20) + nnNodes(900, [55, 120, 185, 250], 18) + nnNodes(1040, [105, 195], 20) +
    '</g>' +
    '<g class="nn-text">' +
      '<text x="56" y="113" class="nn-in">S</text><text x="56" y="193" class="nn-in">A</text>' +
      '<text x="460" y="148" class="nn-out">q\u0302(S,A,w)</text>' +
      '<text x="706" y="153" class="nn-in">S</text>' +
      '<text x="1070" y="113" class="nn-out">q\u0302(S,1,w)</text>' +
      '<text x="1070" y="203" class="nn-out">q\u0302(S,2,w)</text>' +
      '<text x="260" y="292" class="nn-cap">one output per state-action pair</text>' +
      '<text x="890" y="292" class="nn-cap">one output per action</text>' +
    '</g>' +
  '</svg></div>';

const deepQItems = [
  m("Nothing in the semi-gradient updates requires $\\hat q$ to be linear: it may be any differentiable function of $\\mathbf w$, for instance a neural network."),
  m("As in the linear case, we look for the weights that minimize the <span class=\"scarlet\">expected</span> squared temporal-difference error") +
    display("\\min_{\\mathbf w}\\;\\tfrac12\\,\\mathbb E\\Bigl[\\bigl(R+\\delta\\max_{a}\\hat q(S',a,\\mathbf w)-\\hat q(S,A,\\mathbf w)\\bigr)^2\\Bigr]."),
  m("The expectation is not available, so we sample it. Given one experience $(S_t,A_t,R_t,S_{t+1})$, write") +
    display("\\tfrac12\\Delta_t^2(\\mathbf w)=\\tfrac12\\Bigl[R_t+\\delta\\max_{a}\\hat q(S_{t+1},a,\\mathbf w)-\\hat q(S_t,A_t,\\mathbf w)\\Bigr]^2."),
  m("Taking the <span class=\"scarlet\">semi-gradient</span> - that is, holding the target fixed - gives") +
    display("-\\tfrac12\\tilde\\nabla_{\\mathbf w}\\Delta_t^2(\\mathbf w)=\\Delta_t(\\mathbf w)\\,\\nabla_{\\mathbf w}\\hat q(S_t,A_t,\\mathbf w),"),
  m("so the weight update is") +
    display("\\mathbf w\\gets\\mathbf w+\\alpha\\,\\Delta_t(\\mathbf w)\\,\\nabla_{\\mathbf w}\\hat q(S_t,A_t,\\mathbf w).")
];

const deepQComputeItems = [
  m("$R_t$ comes from the sample."),
  m("$\\hat q(S_t,A_t,\\mathbf w)$ and $\\max_a\\hat q(S_{t+1},a,\\mathbf w)$ are forward passes through the network."),
  m("<span class=\"scarlet\"><strong>Question:</strong></span> how do we compute $\\nabla_{\\mathbf w}\\hat q(S_t,A_t,\\mathbf w)$? By <span class=\"scarlet\">backpropagation</span> - the chain rule applied layer by layer.")
];

const deepQIssues = [
  "No theoretical guarantee of optimality or convergence.",
  "Training is often unstable in practice.",
  "The next few slides introduce three ideas that make deep reinforcement learning more stable."
];

const supervisedItems = [
  m("Pretend, for a moment, that we face an ordinary supervised learning problem:") +
    display("\\min_{\\mathbf w}\\;\\tfrac12\\sum_{b}\\bigl[U_b-\\hat q(S_b,A_b,\\mathbf w)\\bigr]^2,"),
  m("where $U_b=R_b+\\delta\\max_a\\hat q(S_b',a,\\mathbf w)$ is the <span class=\"scarlet\">label</span> of the sample $(S_b,A_b)$. As in the linear case, we ignore the fact that $U_b$ itself depends on $\\mathbf w$."),
  m("One stochastic gradient step is then exactly the update from the previous slide:") +
    display("\\mathbf w\\gets\\mathbf w+\\alpha\\bigl[U_b-\\hat q(S_b,A_b,\\mathbf w)\\bigr]\\nabla_{\\mathbf w}\\hat q(S_b,A_b,\\mathbf w).")
];

const iidItems = [
  "Deep networks trained by SGD perform well when the training samples are <span class=\"scarlet\">independent and identically distributed</span>.",
  m("But the samples produced by an agent arrive along a trajectory,") +
    display("\\bigl(U_1,(S_1,A_1)\\bigr)\\to\\bigl(U_2,(S_2,A_2)\\bigr)\\to\\bigl(U_3,(S_3,A_3)\\bigr)\\to\\cdots"),
  "and consecutive experiences are highly correlated - successive states differ by one transition, and the labels are produced by the very network being trained."
];

const replayItems = [
  m("<span class=\"scarlet\"><strong>Idea 1 - replay buffer.</strong></span> Store each experience $(S,A,R,S')$ in a first-in-first-out buffer $\\mathcal D$ of capacity $N$, then train on experiences drawn from it at random rather than in the order they arrived."),
  "Random draws break the correlation between consecutive samples, and each experience can be reused many times.",
  m("The update becomes a <span class=\"scarlet\">minibatch</span> step over $m$ sampled experiences:") +
    display("\\mathbf w\\gets\\mathbf w+\\alpha\\sum_{b=1}^{m}\\bigl[U_b-\\hat q(S_b,A_b,\\mathbf w)\\bigr]\\nabla_{\\mathbf w}\\hat q(S_b,A_b,\\mathbf w).")
];

const targetNetItems = [
  m("From the supervised point of view, the label $U_b=R_b+\\delta\\max_a\\hat q(S_b',a,\\mathbf w)$ ought not to depend on $\\mathbf w$ - yet it moves every time we take a step."),
  m("<span class=\"scarlet\"><strong>Idea 2 - target network.</strong></span> Keep a second copy of the weights $\\mathbf w^-$, copy $\\mathbf w^-\\gets\\mathbf w$ once every $C$ iterations, and build the labels from it:") +
    display("U_b=R_b+\\delta\\max_a\\hat q(S_b',a,\\mathbf w^-)."),
  m("Between copies the regression problem is stationary, which is what the supervised view assumed in the first place.")
];

const archItems = [
  m("<span class=\"scarlet\"><strong>Idea 3 - one output per action.</strong></span> Rather than feeding the pair $(S,A)$ in and reading one number out, feed in the state alone and let the network produce $|\\mathcal A|$ outputs."),
  m("This couples the estimates of $\\hat q(S,a,\\mathbf w)$ across actions at the same state, and a single forward pass yields $\\max_a\\hat q(S,a,\\mathbf w)$ and the greedy action.")
];

const dqnLoopItems = [
  m("<span class=\"scarlet\"><strong>Sampling.</strong></span> Act $\\epsilon$-greedily with respect to $\\hat q(\\cdot,\\cdot,\\mathbf w)$ and push each experience $(S,A,R,S')$ into $\\mathcal D$."),
  m("<span class=\"scarlet\"><strong>Training.</strong></span> Draw a minibatch from $\\mathcal D$, form the labels $U_b$ with the target network, and take one gradient step on") +
    display("L(\\mathbf w)=\\sum_{b=1}^{m}\\bigl[\\hat q(S_b,A_b,\\mathbf w)-U_b\\bigr]^2."),
  m("Every $C$ steps, refresh the target network: $\\mathbf w^-\\gets\\mathbf w$.")
];

const dqnLatex = [
  "\\begin{algorithm}",
  "\\caption{Deep Q-network (DQN)}",
  "\\begin{algorithmic}[1]",
  "\\Require Buffer capacity $N$; minibatch size $m$; target period $C$; step size $\\alpha$; small $\\epsilon>0$",
  "\\Ensure $\\hat q\\approx q^*$",
  "\\State Initialize the replay buffer $\\mathcal D$ to capacity $N$",
  "\\State Initialize the action-value function $\\hat q$ with random weights $\\mathbf w$",
  "\\State Initialize the target action-value function $\\hat q$ with weights $\\mathbf w^-\\gets\\mathbf w$",
  "\\ForAll{episodes}",
  "\\State Initialize $S$",
  "\\While{$S$ is not terminal}",
  "\\State Choose $A$ at $S$ using an $\\epsilon$-greedy policy derived from $\\hat q(\\cdot,\\cdot,\\mathbf w)$",
  "\\State Take action $A$; observe $R$ and $S'$; store $(S,A,R,S')$ in $\\mathcal D$",
  "\\State Sample a minibatch $(S_b,A_b,R_b,S_b')$, $b=1,\\ldots,m$, uniformly from $\\mathcal D$",
  "\\State $U_b\\gets R_b$ if $S_b'$ is terminal, and $U_b\\gets R_b+\\delta\\max_a\\hat q(S_b',a,\\mathbf w^-)$ otherwise",
  "\\State $\\mathbf w\\gets\\mathbf w+\\alpha\\sum_{b=1}^{m}[U_b-\\hat q(S_b,A_b,\\mathbf w)]\\nabla_{\\mathbf w}\\hat q(S_b,A_b,\\mathbf w)$",
  "\\State $S\\gets S'$, and set $\\mathbf w^-\\gets\\mathbf w$ every $C$ steps",
  "\\EndWhile",
  "\\EndFor",
  "\\end{algorithmic}",
  "\\end{algorithm}"
].join("\n");


const atariItems = [
  m('<span class="scarlet"><strong>Atari 2600 (Mnih et al., <em>Nature</em>, 2015).</strong></span> One agent learned to play 49 different games directly from screen pixels, using the <em>same</em> network, hyperparameters, and learning rule for every game.'),
  m("<strong>State:</strong> the last four $84\\times84$ grayscale frames, stacked, so that motion is observable from a single input."),
  m("<strong>Actions:</strong> the 4-18 joystick/button combinations of the game. <strong>Reward:</strong> the change in score, clipped to $\\{-1,0,+1\\}$ so that one step size works across games with very different scales."),
  m("<strong>Network:</strong> three convolutional layers followed by a fully connected layer, with <em>one output per action</em>, so a single forward pass gives $\\hat q(S,a,\\mathbf w)$ for all $a$."),
  m("<strong>Training:</strong> a replay buffer of $10^6$ transitions, a target network refreshed every $10^4$ updates, and $\\epsilon$ annealed from $1$ to $0.1$ over the first million frames."),
  "<strong>Result:</strong> at least 75% of a professional human tester&#39;s score on 29 of the 49 games, with no game-specific feature engineering."
];

const dqnVariantItems = [
  "<span class=\"scarlet\"><strong>Double DQN</strong></span> (van Hasselt et al., 2016): select the greedy action with the online weights but evaluate it with the target weights, which removes much of the maximization bias.",
  "<span class=\"scarlet\"><strong>Dueling DQN</strong></span> (Wang et al., 2016): split the network into a state-value stream and an advantage stream, which helps when many actions have similar values.",
  "<span class=\"scarlet\"><strong>Prioritized replay</strong></span> (Schaul et al., 2016): sample transitions with large TD errors more often instead of uniformly.",
  "<span class=\"scarlet\"><strong>Rainbow</strong></span> (Hessel et al., 2018): combine these and several other refinements into a single agent."
];

const dqnAppItems = [
  "<strong>Inventory and supply chain:</strong> replenishment policies for many products with joint capacity and lead times.",
  "<strong>Revenue management:</strong> dynamic pricing and admission control when demand is learned from data.",
  "<strong>Transportation:</strong> dispatching and repositioning of vehicles in ride-hailing and logistics networks.",
  "<strong>Energy:</strong> storage arbitrage and demand response under uncertain prices and renewable generation.",
  "<strong>Operations of computing systems:</strong> job scheduling, caching, and traffic signal control.",
  m('<span class="scarlet"><strong>A caution:</strong></span> in these settings the state is often structured rather than visual, so a tabular, linear, or small network baseline is worth trying before a deep one.')
];


const dqnArchSvg =
  '<div class="dqnarch-figure"><svg viewBox="0 0 1420 350" role="img" aria-label="A convolutional network mapping four stacked game frames through three convolutional layers and a fully connected layer to one action value per action">' +
    '<defs><marker id="da-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>' +
    '<g class="da-frame">' +
      '<rect x="20" y="62" width="104" height="104" rx="4"></rect>' +
      '<rect x="36" y="78" width="104" height="104" rx="4"></rect>' +
      '<rect x="52" y="94" width="104" height="104" rx="4"></rect>' +
      '<rect x="68" y="110" width="104" height="104" rx="4"></rect>' +
    '</g>' +
    '<g class="da-box">' +
      '<rect x="230" y="60" width="190" height="190" rx="6"></rect>' +
      '<rect x="480" y="60" width="190" height="190" rx="6"></rect>' +
      '<rect x="730" y="60" width="190" height="190" rx="6"></rect>' +
      '<rect x="980" y="60" width="150" height="190" rx="6"></rect>' +
    '</g>' +
    '<g class="da-flow">' +
      '<line x1="176" y1="155" x2="222" y2="155" marker-end="url(#da-head)"></line>' +
      '<line x1="424" y1="155" x2="472" y2="155" marker-end="url(#da-head)"></line>' +
      '<line x1="674" y1="155" x2="722" y2="155" marker-end="url(#da-head)"></line>' +
      '<line x1="924" y1="155" x2="972" y2="155" marker-end="url(#da-head)"></line>' +
      '<line x1="1134" y1="155" x2="1186" y2="155" marker-end="url(#da-head)"></line>' +
    '</g>' +
    '<g class="da-nodes">' +
      '<circle cx="1210" cy="95" r="17"></circle>' +
      '<circle cx="1210" cy="155" r="17"></circle>' +
      '<circle cx="1210" cy="215" r="17"></circle>' +
    '</g>' +
    '<g class="da-text">' +
      '<text x="92" y="258" class="da-cap">84 x 84 x 4 frames</text>' +
      '<text x="325" y="125">Conv 1</text>' +
      '<text x="325" y="165">32 filters, 8x8</text>' +
      '<text x="325" y="205">stride 4, ReLU</text>' +
      '<text x="575" y="125">Conv 2</text>' +
      '<text x="575" y="165">64 filters, 4x4</text>' +
      '<text x="575" y="205">stride 2, ReLU</text>' +
      '<text x="825" y="125">Conv 3</text>' +
      '<text x="825" y="165">64 filters, 3x3</text>' +
      '<text x="825" y="205">stride 1, ReLU</text>' +
      '<text x="1055" y="125">Dense</text>' +
      '<text x="1055" y="165">512 units</text>' +
      '<text x="1055" y="205">ReLU</text>' +
      '<text x="1244" y="102" class="da-out">q̂(S, a₁, w)</text>' +
      '<text x="1244" y="162" class="da-out">q̂(S, a₂, w)</text>' +
      '<text x="1244" y="222" class="da-out">q̂(S, a₃, w)</text>' +
      '<text x="1210" y="286" class="da-cap">one output per action</text>' +
    '</g>' +
  '</svg></div>';

const atariChartSvg =
  '<div class="atari-figure"><svg viewBox="0 0 1400 474" role="img" aria-label="Bar chart of DQN score as a percentage of a human tester score for eight Atari games">' +
    '<g class="at-bars">' +
      '<rect x="300" y="40" width="937.5" height="28" rx="2"></rect>' +
      '<rect x="300" y="84" width="630.3" height="28" rx="2"></rect>' +
      '<rect x="300" y="128" width="490.0" height="28" rx="2"></rect>' +
      '<rect x="300" y="172" width="48.7" height="28" rx="2"></rect>' +
      '<rect x="300" y="216" width="44.7" height="28" rx="2"></rect>' +
      '<rect x="300" y="260" width="9.2" height="28" rx="2"></rect>' +
      '<rect x="300" y="304" width="4.8" height="28" rx="2"></rect>' +
      '<rect x="300" y="348" width="3.0" height="28" rx="2"></rect>' +
    '</g>' +
    '<g class="at-human">' +
      '<line x1="336.9" y1="22" x2="336.9" y2="392"></line>' +
      '<text x="346.9" y="16">100% = human tester</text>' +
    '</g>' +
    '<g class="at-axis"><line x1="300" y1="392" x2="1260" y2="392"></line></g>' +
    '<g class="at-text">' +
      '<text x="284" y="61" class="at-name">Video Pinball</text>' +
      '<text x="1247.5" y="61" class="at-val">2539%</text>' +
      '<text x="284" y="105" class="at-name">Boxing</text>' +
      '<text x="940.3" y="105" class="at-val">1707%</text>' +
      '<text x="284" y="149" class="at-name">Breakout</text>' +
      '<text x="800.0" y="149" class="at-val">1327%</text>' +
      '<text x="284" y="193" class="at-name">Pong</text>' +
      '<text x="358.7" y="193" class="at-val">132%</text>' +
      '<text x="284" y="237" class="at-name">Space Invaders</text>' +
      '<text x="354.7" y="237" class="at-val">121%</text>' +
      '<text x="284" y="281" class="at-name">Seaquest</text>' +
      '<text x="350.9" y="281" class="at-val">25%</text>' +
      '<text x="284" y="325" class="at-name">Ms. Pac-Man</text>' +
      '<text x="350.9" y="325" class="at-val">13%</text>' +
      '<text x="284" y="369" class="at-name">Montezuma&#39;s Revenge</text>' +
      '<text x="350.9" y="369" class="at-val">0%</text>' +
      '<text x="300.0" y="420" class="at-tick">0</text>' +
      '<text x="484.6" y="420" class="at-tick">500</text>' +
      '<text x="669.2" y="420" class="at-tick">1000</text>' +
      '<text x="853.8" y="420" class="at-tick">1500</text>' +
      '<text x="1038.5" y="420" class="at-tick">2000</text>' +
      '<text x="1223.1" y="420" class="at-tick">2500</text>' +
      '<text x="780" y="464" class="at-cap">DQN score as a percentage of the human tester score</text>' +
    '</g>' +
  '</svg></div>';

export const slides = [
  {kind:"title",title:course.lecture,body:'<div class="title-card"><div class="title-rule"></div><h1>' + course.lecture +
    '</h1><p class="course-line">' + course.number + " " + course.name + '</p><p>' + course.institution +
    '</p><p>Autumn 2026</p><p class="professor">' + course.professor + "</p></div>"},
  {title:"Outline",body:ul([
    "A summary of tabular methods",
    "Function approximation in value space<ul><li>Overview and benefits</li><li>Prediction: Gradient MC and semi-gradient TD(0)</li><li>Control: semi-gradient SARSA and Q-learning</li><li>Linear approximation and feature construction</li><li>Mathematical analysis</li><li>Q-learning with nonlinear function approximation</li></ul>"
  ])},

  ...[0,1,2,3,4,5,6].map(i => ({kind:"dense",title:"Summary of tabular RL methods",body:
    "<p>Let us review the dimensions spanned by the methods seen so far:</p>" + visible(summaryItems,i)})),

  ...[0,1,2].map(i => ({kind:"dense",title:"Function approximation: what is it, and why use it?",body:visible(whyItems,i)})),

  {kind:"dense",title:"Parametric approximation in value space: prediction",body:ul([
    m("As usual, start with prediction: given $\\pi$, find $v_\\pi$."),
    m("Tabular methods update $V(s)$ for every state to obtain $V(s)\\approx v_\\pi(s)$."),
    m("Now update weights $\\mathbf w$ in a function $\\hat v$ so that $\\hat v(s,\\mathbf w)\\approx v_\\pi(s)$."),
    m("We must specify the functional form of $\\hat v$ and how to update $\\mathbf w$.")
  ])},

  ...[0,1,2,3,4].map(i => ({kind:"dense",title:"Choosing the function and weight updates",body:objectiveBody(i)})),

  {kind:"dense",title:"Stochastic gradient methods (I)",body:visible(sgdIntroAsk,2)},
  {kind:"dense",title:"Stochastic gradient methods (I)",body:visible(sgdIntroAsk,2) +
    "<p><span class=\"scarlet\"><strong>Stochastic gradient descent (SGD):</strong></span></p>" +
    display("\\begin{aligned}\\mathbf w_{t+1}&=\\mathbf w_t-\\tfrac12\\alpha\\nabla_{\\mathbf w}[v_\\pi(S_t)-\\hat v(S_t,\\mathbf w_t)]^2\\\\&=\\mathbf w_t+\\alpha[v_\\pi(S_t)-\\hat v(S_t,\\mathbf w_t)]\\nabla_{\\mathbf w}\\hat v(S_t,\\mathbf w_t).\\end{aligned}")},

  {kind:"dense",title:"Stochastic gradient methods (II)",body:
    display("\\mathbf w_{t+1}=\\mathbf w_t+\\alpha[v_\\pi(S_t)-\\hat v(S_t,\\mathbf w_t)]\\nabla_{\\mathbf w}\\hat v(S_t,\\mathbf w_t).") +
    visible(sgdNotes,2)},
  {kind:"dense",title:"Stochastic gradient methods (II)",body:
    display("\\mathbf w_{t+1}=\\mathbf w_t+\\alpha[v_\\pi(S_t)-\\hat v(S_t,\\mathbf w_t)]\\nabla_{\\mathbf w}\\hat v(S_t,\\mathbf w_t).") +
    visible(sgdNotes,3)},

  {kind:"dense analysis-slide",title:"Convergence of SGD: the general setting",body:sgdConvSetup + "<p>We assume throughout:</p>" + ul(sgdConvAssumptions.slice(0,2))},
  {kind:"dense analysis-slide",title:"Convergence of SGD: the general setting",body:sgdConvSetup + "<p>We assume throughout:</p>" + ul(sgdConvAssumptions)},
  ...[0,1,2].map(i => ({kind:"dense proof-slide",title:"Convergence of SGD",body:sgdTheoremBox + visible(sgdTheoremRemarks,i)})),

  {kind:"dense",title:"Stochastic gradient methods (III)",body:visible(gradientTargetItems,1)},
  {kind:"dense inline-algorithm-slide",title:"Stochastic gradient methods (III)",body:visible(gradientTargetItems,2) + renderAlgorithm(gradientMCLatex)},

  ...[1,2,3].map(i => ({kind:"dense",title:"Stochastic semi-gradient methods",body:visible(semiGradientItems,i)})),
  {kind:"algorithm algorithm-medium",title:"Semi-gradient TD(0) prediction algorithm",body:renderAlgorithm(semiGradientTDLatex)},

  ...[0,2,3,4,5].map(i => ({kind:"dense",title:"Control with function approximation",body:visible(controlItems,i)})),
  {kind:"algorithm algorithm-extra-long algorithm-sarsa-fa",title:"Semi-gradient SARSA algorithm",body:renderAlgorithm(semiGradientSarsaLatex)},
  {kind:"algorithm algorithm-extra-long algorithm-sarsa-fa",title:"Semi-gradient Q-learning algorithm",body:renderAlgorithm(semiGradientQLatex)},

  ...[1,3].map(i => ({kind:"dense",title:"Now, onto the choice of the value function",body:visible(choiceItems,i)})),
  {kind:"dense",title:"Choice of features in linear methods",body:ul([
    "Linear methods provide some convergence guarantees.",
    "They can also be efficient in data and computation when states are represented with suitable features.",
    "Feature choice lets us add prior domain knowledge to the learning task.",
    "Next, consider general ways of choosing features."
  ])},
  {kind:"dense tetris-image-slide",title:"Choosing features from domain knowledge: Tetris",body:
    '<figure class="tetris-figure"><img src="assets/tetris-board.png" alt="Tetris board used to illustrate feature selection"><figcaption>A state can be represented using compact, domain-informed features.</figcaption></figure>'},
  {kind:"dense",title:"Choosing features from domain knowledge: Tetris",body:
    "<p>Feature choices adopted in the literature include:</p>" + ul(tetrisFeatures) +
    '<p class="footnote">Gabillon et al., “Approximate Dynamic Programming Finally Performs Well in the Game of Tetris,” NeurIPS 2013.</p>'},
  {kind:"dense",title:"Choosing features from domain knowledge: Tetris",body:
    "<p>Feature choices adopted in the literature include:</p>" + ul(tetrisFeatures) +
    '<p class="scarlet"><strong>Performance varies greatly across feature choices and also depends on the learning algorithm.</strong></p>' +
    '<p class="footnote">Gabillon et al., “Approximate Dynamic Programming Finally Performs Well in the Game of Tetris,” NeurIPS 2013.</p>'},

  {kind:"dense",title:"Some feature-construction options",body:
    m("Assume a $k$-dimensional state $\\mathbf s=(s_1,s_2,\\ldots,s_k)^\\top$.") + ul([
      "<strong>Polynomials:</strong>" + display("x_i(\\mathbf s)=\\prod_{j=1}^{k}s_j^{c_{ij}}."),
      "<strong>Fourier basis:</strong>" + display("x_i(\\mathbf s)=\\cos(\\pi\\mathbf s^\\top\\mathbf c_i)."),
      "<strong>Radial basis:</strong>" + display("x_i(\\mathbf s)=\\exp\\!\\left(-\\frac{\\lVert\\mathbf s-\\mathbf c_i\\rVert^2}{2\\sigma_i^2}\\right).")
    ])},
  {kind:"dense",title:"Some feature-construction options",body:
    m("Assume a $k$-dimensional state $\\mathbf s=(s_1,s_2,\\ldots,s_k)^\\top$.") + ul([
      "<strong>Polynomials:</strong>" + display("x_i(\\mathbf s)=\\prod_{j=1}^{k}s_j^{c_{ij}}."),
      "<strong>Fourier basis:</strong>" + display("x_i(\\mathbf s)=\\cos(\\pi\\mathbf s^\\top\\mathbf c_i)."),
      "<strong>Radial basis:</strong>" + display("x_i(\\mathbf s)=\\exp\\!\\left(-\\frac{\\lVert\\mathbf s-\\mathbf c_i\\rVert^2}{2\\sigma_i^2}\\right)."),
      "See also <span class=\"scarlet\"><strong>tile coding</strong></span>."
    ])},


  ...[1,2,3].map(i => ({kind:"dense analysis-slide long-title",title:"Mathematical analysis of gradient methods with linear functions (I)",body:visible(analysisItems,i)})),
  {kind:"dense long-title",title:"Mathematical analysis of gradient methods with linear functions (II)",body:ul([
    m("TD(0) can be shown to converge to $\\mathbf w_{\\mathrm{TD}}=\\mathbf A^{-1}\\mathbf b$."),
    "Methods such as LSTD estimate the system from experience and use it to update the parameters.",
    m("In addition,") + display("\\overline{\\operatorname{VE}}(\\mathbf w_{\\mathrm{TD}})\\le\\frac{1}{1-\\delta}\\min_{\\mathbf w}\\overline{\\operatorname{VE}}(\\mathbf w).")
  ])},
  {kind:"dense long-title",title:"Mathematical analysis of gradient methods with linear functions (II)",body:ul([
    m("TD(0) can be shown to converge to $\\mathbf w_{\\mathrm{TD}}=\\mathbf A^{-1}\\mathbf b$."),
    "Methods such as LSTD estimate the system from experience and use it to update the parameters.",
    m("In addition,") + display("\\overline{\\operatorname{VE}}(\\mathbf w_{\\mathrm{TD}})\\le\\frac{1}{1-\\delta}\\min_{\\mathbf w}\\overline{\\operatorname{VE}}(\\mathbf w)."),
    "Similar convergence results can be established for other bootstrapping methods, action-value methods, and episodic tasks."
  ])},
  ...[0,1,2].map(i => ({kind:"dense",title:"Other approximations in value space",body:visible(otherApproxItems,i)})),

  ...[1,2,4].map(i => ({kind:"dense",title:"Q-learning with nonlinear function approximation",body:visible(deepQItems,i)})),
  {kind:"dense nn-slide",title:"Q-learning with a neural network",body:ul(deepQComputeItems) + mlpSvg},
  {kind:"dense nn-slide nn-board-slide",title:"Q-learning with a neural network",body:mlpSvg},
  {kind:"dense",title:"Issues of nonlinear function approximation",body:ul(deepQIssues)},

  ...[1,2].map(i => ({kind:"dense",title:"Pretend it is supervised learning",body:visible(supervisedItems,i)})),
  {kind:"dense",title:"Why the i.i.d. assumption matters",body:ul(iidItems)},

  {kind:"dense replay-slide",title:"Replay buffer",body:ul(replayItems.slice(0,2)) + replaySvg},
  {kind:"dense replay-slide",title:"Replay buffer",body:ul(replayItems) + replaySvg},

  ...[1,2].map(i => ({kind:"dense",title:"Target network",body:visible(targetNetItems,i)})),

  {kind:"dense arch-slide",title:"Deep Q-network: one output per action",body:ul(archItems) + archSvg},
  ...[1,2].map(i => ({kind:"dense",title:"Deep Q-network: the training loop",body:visible(dqnLoopItems,i)})),
  {kind:"algorithm algorithm-extra-long dqn-algorithm",title:"The DQN algorithm",body:renderAlgorithm(dqnLatex)},

  ...[0,2,4,5].map(i => ({kind:"dense",title:"Example: DQN on the Atari 2600 games",body:visible(atariItems,i)})),
  {kind:"dense dqnarch-slide",title:"The network used on Atari",body:
    "<p>" + m("Each frame is reduced to an $84\\times84$ grayscale image, and four of them are stacked so that motion is visible. The convolutional layers learn the features that a linear method would have required us to design by hand.") + "</p>" + dqnArchSvg},
  {kind:"dense atari-slide",title:"How well did it do?",body:
    atariChartSvg +
    "<p class=\"chart-note\">Scores are normalized so that a professional human tester scores 100% and a random player scores 0%. DQN beats the human tester on many games, but fails where a reward follows only after a long, deliberate sequence of actions.</p>"},
  {kind:"dense",title:"Refinements of DQN",body:ul(dqnVariantItems)},
  {kind:"dense",title:"Where DQN-style methods are used",body:ul(dqnAppItems)},

  {kind:"dense",title:"Next lecture",body:ul([
    m("TD($\\lambda$) methods.")
  ])}
];
