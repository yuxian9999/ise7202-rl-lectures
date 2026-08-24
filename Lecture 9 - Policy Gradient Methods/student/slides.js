// Professor-editable source. Edit HTML and LaTeX here, then run build.mjs.
export const course = {
  number: "ISE/ECE 7202", name: "Reinforcement Learning",
  lecture: "Lecture 9: Policy Gradient Methods", professor: "Xian Yu",
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

const reinforceLatex = [
  "\\begin{algorithm}",
  "\\caption{1: REINFORCE: Monte Carlo policy gradient for estimating $\\pi_\\theta\\approx\\pi^*$}",
  "\\begin{algorithmic}[1]",
  "\\Require Differentiable policy $\\pi(a\\mid s,\\theta)$; step size $\\alpha>0$",
  "\\Ensure $\\pi_\\theta\\approx\\pi^*$",
  "\\State Initialize $\\theta\\in\\mathbb R^{d'}$ arbitrarily, e.g. $\\theta=\\mathbf0$",
  "\\ForAll{episodes}",
  "\\State Generate $S_1,A_1,R_1,\\ldots,S_{T-1},A_{T-1},R_{T-1},S_T$ using $\\pi(\\cdot\\mid\\cdot,\\theta)$",
  "\\For{$t=1,2,\\ldots,T-1$}",
  "\\State $G\\gets\\sum_{k=t}^{T-1}R_k$",
  "\\State $\\theta\\gets\\theta+\\alpha G\\nabla\\ln\\pi(A_t\\mid S_t,\\theta)$",
  "\\EndFor",
  "\\EndFor",
  "\\end{algorithmic}",
  "\\end{algorithm}"
].join("\n");

const reinforceBaselineLatex = [
  "\\begin{algorithm}",
  "\\caption{2: REINFORCE with baseline for estimating $\\pi_\\theta\\approx\\pi^*$}",
  "\\begin{algorithmic}[1]",
  "\\Require Differentiable policy $\\pi(a\\mid s,\\theta)$; differentiable $\\hat v(s,\\mathbf w)$; step sizes $\\alpha_\\theta,\\alpha_w>0$",
  "\\Ensure $\\pi_\\theta\\approx\\pi^*$",
  "\\State Initialize $\\theta\\in\\mathbb R^{d'}$ and $\\mathbf w\\in\\mathbb R^d$ arbitrarily",
  "\\ForAll{episodes}",
  "\\State Generate $S_0,A_0,R_0,\\ldots,S_{T-1},A_{T-1},R_{T-1},S_T$ using $\\pi(\\cdot\\mid\\cdot,\\theta)$",
  "\\For{$t=0,1,\\ldots,T-1$}",
  "\\State $G\\gets\\sum_{k=t}^{T-1}R_k$",
  "\\State $\\mathbf w\\gets\\mathbf w+\\alpha_w[G-\\hat v(S_t,\\mathbf w)]\\nabla\\hat v(S_t,\\mathbf w)$",
  "\\State $\\theta\\gets\\theta+\\alpha_\\theta[G-\\hat v(S_t,\\mathbf w)]\\nabla\\ln\\pi(A_t\\mid S_t,\\theta)$",
  "\\EndFor",
  "\\EndFor",
  "\\end{algorithmic}",
  "\\end{algorithm}"
].join("\n");

const actorCriticLatex = [
  "\\begin{algorithm}",
  "\\caption{3: Actor–critic with eligibility traces for estimating $\\pi_\\theta\\approx\\pi^*$}",
  "\\begin{algorithmic}[1]",
  "\\Require Differentiable $\\pi(a\\mid s,\\theta)$ and $\\hat v(s,\\mathbf w)$; $\\lambda_\\theta,\\lambda_w\\in[0,1]$; $\\alpha_\\theta,\\alpha_w>0$",
  "\\Ensure $\\pi_\\theta\\approx\\pi^*$",
  "\\State Initialize $\\theta,\\mathbf w$ arbitrarily and $S\\in\\mathcal S$; set $\\mathbf z_w\\gets\\mathbf0$, $\\mathbf z_\\theta\\gets\\mathbf0$",
  "\\While{true}",
  "\\Statex <strong>[Actor acts]</strong>",
  "\\State $A\\sim\\pi(\\cdot\\mid S,\\theta)$; take $A$, observe $R,S'$",
  "\\Statex <strong>[Critic updates value estimates]</strong>",
  "\\State $\\Delta\\gets R+\\delta\\hat v(S',\\mathbf w)-\\hat v(S,\\mathbf w)$",
  "\\State $\\mathbf z_w\\gets\\delta\\lambda_w\\mathbf z_w+\\nabla\\hat v(S,\\mathbf w)$",
  "\\State $\\mathbf w\\gets\\mathbf w+\\alpha_w\\Delta\\mathbf z_w$",
  "\\Statex <strong>[Update actor]</strong>",
  "\\State $\\mathbf z_\\theta\\gets\\delta\\lambda_\\theta\\mathbf z_\\theta+\\nabla\\ln\\pi(A\\mid S,\\theta)$",
  "\\State $\\theta\\gets\\theta+\\alpha_\\theta\\Delta\\mathbf z_\\theta$; $S\\gets S'$",
  "\\EndWhile",
  "\\end{algorithmic}",
  "\\end{algorithm}"
].join("\n");

const directPolicy = [
  m("Instead of using a value function to guide the search for an optimal policy, e.g. through $\\epsilon$-greedy, find a parameterized policy directly."),
  m("<span class=\"scarlet\"><strong>Parameterized policy:</strong></span>") + display("\\pi(a\\mid s,\\theta)=\\Pr(A_t=a\\mid S_t=s,\\theta_t=\\theta),\\qquad \\pi_\\theta(a\\mid s)."),
  m("Update $\\theta\\in\\mathbb R^{d'}$ so that the policy maximizes a performance measure $J(\\theta)$."),
  "How do you expect the parameter to be updated?"
];

const policyForm = [
  m("Any function $\\pi(a\\mid s,\\theta)$ is acceptable as long as it is differentiable."),
  m("To ensure exploration, choose a function that does not become deterministic: $\\pi(a\\mid s,\\theta)\\in(0,1)$ for all $a,s,\\theta$."),
  m("Most common choice for discrete action spaces: <span class=\"scarlet\"><strong>soft-max in action preference</strong></span>.") +
    display("\\pi(a\\mid s,\\theta)=\\frac{e^{h(s,a,\\theta)}}{\\sum_{b\\in\\mathcal A}e^{h(s,b,\\theta)}}."),
  m("Here $h(s,a,\\theta)$ is a parameterized numerical preference for action $a$ in state $s$. For example, $h(s,a,\\theta)=\\theta^\\top\\mathbf x(s,a)$."),
  "Does this look familiar?",
  m("A common choice for continuous action spaces is a <span class=\"scarlet\"><strong>Gaussian policy</strong></span>:") +
    display("\\pi(a\\mid s,\\theta)=\\frac{1}{\\sigma(s,\\theta)\\sqrt{2\\pi}}\\exp\\!\\left(-\\frac{(a-\\mu(s,\\theta))^2}{2\\sigma(s,\\theta)^2}\\right).")
];

const advantages = [
  "If the optimal policy is deterministic, a policy such as soft-max action preferences can approach it.",
  "Can learn stochastic policies.",
  "Works well in high-dimensional and continuous action spaces.",
  "A good way to add prior information about what the optimal policy may look like.",
  "Good theoretical guarantees."
];
const disadvantages = ["High variance (many works focus on variance reduction).", "Converges to a local rather than global optimum."];
const advantagesBody = stage => {
  const count = [1,2,5,5][stage];
  let body = '<h2 class="section-label">Advantages</h2>' + ul(advantages.slice(0,count));
  if (stage === 3) body += '<h2 class="section-label">Disadvantages</h2>' + ul(disadvantages);
  return body;
};

const performanceIntro = "<p>These measures remain closely related to expected return. For technical reasons, they differ between episodic and continuing tasks.</p>";
const episodic = m("<span class=\"scarlet\"><strong>Episodic case:</strong></span> value of the fixed start state of the episode.") + display("J(\\theta)=v_{\\pi_\\theta}(s_0).");
const continuing = m("<span class=\"scarlet\"><strong>Continuing case:</strong></span> average reward per time step.") + display("J(\\theta)=\\lim_{h\\to\\infty}\\frac1h\\sum_{t=1}^{h}\\mathbb E[R_t\\mid A_{1:t}\\sim\\pi_\\theta]=\\sum_s\\mu(s)\\sum_a\\pi(a\\mid s,\\theta)r(s,a).");

const theoremSetup = [
  m("Use gradient ascent to maximize the performance measure: $\\theta_{t+1}=\\theta_t+\\alpha\\nabla J(\\theta_t)$."),
  m("How can we find $\\nabla J(\\theta_t)$?"),
  "We know how changing the policy parameters changes action probabilities. In an unknown environment, however, we do not know how it changes the state distribution.",
  m("<span class=\"scarlet\"><strong>The answer: the Policy Gradient Theorem.</strong></span> It gives an analytic expression for $\\nabla J(\\theta)$ without the derivative of the state distribution.")
];

const reinforceIntro = [
  m("Recall the stochastic-gradient approach: obtain sample gradients to substitute for the full gradient $\\nabla J(\\theta)$."),
  m("It is sufficient for the samples to be proportional to the gradient:") + display("\\nabla J(\\theta)\\propto\\sum_s\\mu(s)\\sum_a q_\\pi(s,a)\\nabla\\pi(a\\mid s,\\theta)=\\mathbb E_\\pi\\!\\left[\\sum_a q_\\pi(S_t,a)\\nabla\\pi(a\\mid S_t,\\theta)\\right]."),
  "But can we also sample from the action?"
];

const reinforceDerivation = stage => {
  let body = m("Can we substitute observed actions $A_t$ to obtain sample gradients proportional to the true gradient?");
  if (stage === 0) body += display("\\nabla J(\\theta)\\propto\\mathbb E_\\pi\\!\\left[\\sum_a q_\\pi(S_t,a)\\nabla\\pi(a\\mid S_t,\\theta)\\right]") +
    display("\\nabla J(\\theta)\\propto\\mathbb E_\\pi\\!\\left[G_t\\frac{\\nabla\\pi(A_t\\mid S_t,\\theta)}{\\pi(A_t\\mid S_t,\\theta)}\\right].");
  else body += display("\\nabla J(\\theta)\\propto\\mathbb E_\\pi\\!\\left[G_t\\frac{\\nabla\\pi(A_t\\mid S_t,\\theta)}{\\pi(A_t\\mid S_t,\\theta)}\\right].");
  if (stage === 2) body += m("<p>Together, these yield the stochastic gradient-ascent update:</p>") +
    display("\\theta_{t+1}=\\theta_t+\\alpha G_t\\frac{\\nabla\\pi(A_t\\mid S_t,\\theta)}{\\pi(A_t\\mid S_t,\\theta)}=\\theta_t+\\alpha G_t\\nabla\\ln\\pi(A_t\\mid S_t,\\theta).");
  return body;
};

const baselineItems = [
  m("REINFORCE has good theoretical guarantees: its update follows the direction of $\\nabla J$, so an appropriate $\\alpha$ guarantees convergence to a local optimum."),
  "However, as a Monte Carlo method, it has high variance.",
  m("Introduce a baseline $b(s)$ in the Policy Gradient Theorem:") + display("\\nabla J(\\theta)\\propto\\sum_s\\mu(s)\\sum_a\\big(q_\\pi(s,a)-b(s)\\big)\\nabla\\pi(a\\mid s,\\theta)."),
  m("With a baseline, use the update") + display("\\theta_{t+1}=\\theta_t+\\alpha\\big(G_t-b(S_t)\\big)\\frac{\\nabla\\pi(A_t\\mid S_t,\\theta)}{\\pi(A_t\\mid S_t,\\theta)}.")
];

const actorCriticItems = [
  "Value-function approximation has now entered the algorithm, but so far it is used only to provide a baseline.",
  m("We can also bootstrap the return estimate with the value-function approximation instead of using the Monte Carlo return $G_t$. This gives the family of <span class=\"scarlet\"><strong>actor–critic methods</strong></span>."),
  m("For example, the policy update in a one-step actor–critic method is") + display("\\theta_{t+1}=\\theta_t+\\alpha\\big(R_t+\\hat v(S_{t+1},\\mathbf w)-\\hat v(S_t,\\mathbf w)\\big)\\frac{\\nabla\\pi(A_t\\mid S_t,\\theta)}{\\pi(A_t\\mid S_t,\\theta)}."),
  m("Any earlier TD method—one-step, $n$-step, offline $\\lambda$-return, or TD($\\lambda$) with eligibility traces—can be used to update $\\theta$ and $\\mathbf w$.")
];

export const slides = [
  {kind:"title",title:course.lecture,body:'<div class="title-card"><div class="title-rule"></div><h1>' + course.lecture +
    '</h1><p class="course-line">' + course.number + " " + course.name + '</p><p>' + course.institution +
    '</p><p>Autumn 2026</p><p class="professor">' + course.professor + "</p></div>"},
  {title:"Outline",body:ul([
    "Parameterized policies and performance measures",
    "The Policy Gradient Theorem",
    "The REINFORCE algorithm",
    "REINFORCE with baseline",
    "Actor–critic methods"
  ])},

  {kind:"dense",title:"Directly finding an optimal policy",body:visible(directPolicy,3)},
  {kind:"dense",title:"Directly finding an optimal policy",body:visible(directPolicy,3)},

  {kind:"dense",title:"Parameterized policy choices",body:visible(policyForm,2)},
  {kind:"dense",title:"Parameterized policy choices",body:visible(policyForm,3)},
  {kind:"dense",title:"Parameterized policy choices",body:visible([policyForm[0],policyForm[1],policyForm[2],policyForm[4]],3)},
  {kind:"dense",title:"Parameterized policy choices",body:visible([policyForm[0],policyForm[1],policyForm[2],policyForm[5]],3)},

  ...[0,1,2,3].map(i => ({kind:"dense",title:"Policy gradient: advantages and disadvantages",body:advantagesBody(i)})),

  {kind:"dense",title:"The performance measure",body:performanceIntro + ul([episodic])},
  {kind:"dense",title:"The performance measure",body:performanceIntro + ul([episodic,continuing])},

  {kind:"dense",title:"The Policy Gradient Theorem: motivation",body:visible(theoremSetup,2)},
  {kind:"dense",title:"The Policy Gradient Theorem: motivation",body:visible(theoremSetup,3)},
  {kind:"dense theorem-slide",title:"The Policy Gradient Theorem",body:
    '<div class="theorem-box"><div class="theorem-label">Theorem</div><p>For any differentiable parameterized policy ' +
    m('$\\pi(a\\mid s,\\theta)$') + ', and either performance measure ' + m('$J(\\theta)$') + ',</p>' +
    display("\\nabla J(\\theta)\\propto\\sum_s\\mu(s)\\sum_a q_\\pi(s,a)\\nabla\\pi(a\\mid s,\\theta).") +
    '</div><p class="board-note">[Proof on the board.]</p>'},

  {kind:"dense",title:"REINFORCE: stochastic gradients",body:visible(reinforceIntro,1)},
  {kind:"dense",title:"REINFORCE: stochastic gradients",body:visible(reinforceIntro,2)},
  {kind:"dense",title:"REINFORCE",body:reinforceDerivation(0)},
  {kind:"dense",title:"REINFORCE",body:reinforceDerivation(1)},
  {kind:"dense",title:"REINFORCE",body:reinforceDerivation(2)},
  {kind:"algorithm algorithm-medium",title:"The REINFORCE algorithm",body:renderAlgorithm(reinforceLatex)},

  {kind:"dense",title:"REINFORCE with baseline",body:visible(baselineItems,1)},
  {kind:"dense",title:"REINFORCE with baseline",body:visible(baselineItems,2)},
  {kind:"dense",title:"REINFORCE with baseline",body:visible(baselineItems,3)},
  {kind:"algorithm algorithm-medium",title:"REINFORCE with baseline",body:renderAlgorithm(reinforceBaselineLatex)},

  {kind:"dense",title:"Actor–critic methods",body:visible(actorCriticItems,1)},
  {kind:"dense",title:"Actor–critic methods",body:visible(actorCriticItems,2)},
  {kind:"dense",title:"Actor–critic methods",body:visible(actorCriticItems,3)},
  {title:"Next lecture",body:ul(["Overview of common deep reinforcement learning methods."])}
];
