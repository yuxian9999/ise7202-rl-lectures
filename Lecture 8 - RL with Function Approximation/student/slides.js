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

const summaryItems = [
  "Same building blocks: evaluation/prediction and policy improvement work together to find an optimal policy.",
  "Differences in evaluation step: the “width” and “depth” of updates.",
  "Some other dimensions:<ul><li>State-values vs. action-values</li></ul>",
  "On-policy vs. off-policy methods.",
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
  m("If $\\operatorname{length}(\\mathbf w)\\ll|\\mathcal S|$, then we obtain <span class=\"scarlet\">generalization</span>."),
  "With fewer weights than states, making the estimate at one state accurate can inevitably make the estimate at other states inaccurate.",
  "A natural objective function is the <span class=\"scarlet\">Mean Squared Value Error</span>:" +
    display("\\overline{\\operatorname{VE}}(\\mathbf w)=\\sum_{s\\in\\mathcal S}\\left[v_\\pi(s)-\\hat v(s,\\mathbf w)\\right]^2."),
  "Include the state distribution in the error:" +
    display("\\overline{\\operatorname{VE}}(\\mathbf w)=\\sum_{s\\in\\mathcal S}\\mu(s)\\left[v_\\pi(s)-\\hat v(s,\\mathbf w)\\right]^2."),
  "Find the global, or at least a local, optimum so that this error is minimized.",
  "Many approaches are possible. We focus on function-approximation methods based on gradient principles."
];
const objectiveBody = stage => {
  const items = objectiveItems.slice(0, 2);
  items.push(stage === 1 ? objectiveItems[2] : stage >= 2 ? objectiveItems[3] : "");
  if (stage >= 3) items.push(objectiveItems[4]);
  if (stage >= 4) items.push(objectiveItems[5]);
  return ul(items.filter(Boolean));
};

const sgdIntro = [
  m("Consider $\\hat v(s,\\mathbf w)$ with weight vector $\\mathbf w=[w_1,w_2,\\ldots,w_d]^\\top$."),
  m("Let $\\mathbf w_t$ be the current weight vector."),
  m("To illustrate the idea, assume we can sample $v_\\pi(S_t)$, the true value of $S_t$, with samples drawn in proportion to $\\mu$. How should the weights be updated?")
];

const sgdNotes = [
  "Gradient descent because the update follows the negative gradient direction of the squared error.",
  "Stochastic because the update uses one stochastically selected sample.",
  m("If $\\alpha$ satisfies standard stochastic-approximation conditions, SGD is guaranteed to converge to a local optimum."),
  m("In learning, we do not know and cannot calculate $v_\\pi(S_t)$ exactly. Can an approximation still work?")
];

const gradientTargetItems = [
  m("Let $U_t$ denote an estimate of $v_\\pi(S_t)$, also called the target, and update") +
    display("\\mathbf w_{t+1}=\\mathbf w_t+\\alpha[U_t-\\hat v(S_t,\\mathbf w_t)]\\nabla_{\\mathbf w}\\hat v(S_t,\\mathbf w_t)."),
  m("<span class=\"scarlet\"><strong>Unbiased estimate:</strong></span> if $\\mathbb E[U_t\\mid S_t=s]=v_\\pi(s)$, this converges to a local optimum for an appropriately chosen $\\alpha$."),
  m("For example, let $U_t=G_t$, the return used in MC methods.")
];

const semiGradientItems = [
  m("If $U_t$ is a bootstrapping update, such as the $n$-step TD target or the DP target, then we do not obtain the same guarantees."),
  "One way to see this is by recalling the stochastic-gradient-descent update... [on the board].",
  "With bootstrapping targets, <span class=\"scarlet\">semi-gradient methods</span> are not gradient-descent methods and do not have the same convergence guarantees...",
  "...but the resulting methods still converge for some important cases."
];

const controlItems = [
  "To obtain a control algorithm: (1) change the updates to action-value updates, and (2) add policy improvement.",
  "We focus on on-policy semi-gradient SARSA for episodic tasks.",
  "On-policy SARSA for continuing tasks and off-policy control with function approximation require additional considerations that are not covered here."
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

export const slides = [
  {kind:"title",title:course.lecture,body:'<div class="title-card"><div class="title-rule"></div><h1>' + course.lecture +
    '</h1><p class="course-line">' + course.number + " " + course.name + '</p><p>' + course.institution +
    '</p><p>Autumn 2026</p><p class="professor">' + course.professor + "</p></div>"},
  {title:"Outline",body:ul([
    "A summary of tabular methods",
    "Function approximation in value space<ul><li>Overview and benefits</li><li>Prediction: Gradient MC and semi-gradient TD(0)</li><li>Control: semi-gradient SARSA</li><li>Linear approximation and feature construction</li><li>Mathematical analysis</li></ul>"
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

  {kind:"dense",title:"Stochastic gradient methods (I)",body:visible(sgdIntro,2) + "<p class=\"question-line\">How should we update the weights?</p>"},
  {kind:"dense",title:"Stochastic gradient methods (I)",body:visible(sgdIntro,2) +
    "<p class=\"question-line\">How should we update the weights?</p><p><span class=\"scarlet\"><strong>Stochastic gradient descent (SGD):</strong></span></p>" +
    display("\\begin{aligned}\\mathbf w_{t+1}&=\\mathbf w_t-\\tfrac12\\alpha\\nabla_{\\mathbf w}[v_\\pi(S_t)-\\hat v(S_t,\\mathbf w_t)]^2\\\\&=\\mathbf w_t+\\alpha[v_\\pi(S_t)-\\hat v(S_t,\\mathbf w_t)]\\nabla_{\\mathbf w}\\hat v(S_t,\\mathbf w_t).\\end{aligned}")},

  {kind:"dense",title:"Stochastic gradient methods (II)",body:
    display("\\mathbf w_{t+1}=\\mathbf w_t+\\alpha[v_\\pi(S_t)-\\hat v(S_t,\\mathbf w_t)]\\nabla_{\\mathbf w}\\hat v(S_t,\\mathbf w_t).") +
    visible(sgdNotes,2)},
  {kind:"dense",title:"Stochastic gradient methods (II)",body:
    display("\\mathbf w_{t+1}=\\mathbf w_t+\\alpha[v_\\pi(S_t)-\\hat v(S_t,\\mathbf w_t)]\\nabla_{\\mathbf w}\\hat v(S_t,\\mathbf w_t).") +
    visible(sgdNotes,3)},

  {kind:"dense",title:"Stochastic gradient methods (III)",body:visible(gradientTargetItems,1)},
  {kind:"dense inline-algorithm-slide",title:"Stochastic gradient methods (III)",body:visible(gradientTargetItems,2) + renderAlgorithm(gradientMCLatex)},

  ...[1,2,3].map(i => ({kind:"dense",title:"Stochastic semi-gradient methods",body:visible(semiGradientItems,i)})),
  {kind:"algorithm algorithm-medium",title:"Semi-gradient TD(0) prediction algorithm",body:renderAlgorithm(semiGradientTDLatex)},

  ...[0,2].map(i => ({kind:"dense",title:"On-policy control with approximation",body:visible(controlItems,i)})),
  {kind:"algorithm algorithm-extra-long algorithm-sarsa-fa",title:"Semi-gradient SARSA algorithm",body:renderAlgorithm(semiGradientSarsaLatex)},

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

  ...[0,1,2].map(i => ({kind:"dense",title:"Other approximations in value space",body:visible(otherApproxItems,i)})),

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
  {kind:"dense",title:"Next lecture",body:ul([
    "Policy gradient methods.",
    "Homework 4 will be posted soon and is due next week on Friday."
  ])}
];
