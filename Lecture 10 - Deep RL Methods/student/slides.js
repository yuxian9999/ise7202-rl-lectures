// Professor-editable source. Edit HTML and LaTeX here, then run build.mjs.
export const course = {
  number: "ISE/ECE 7202", name: "Reinforcement Learning",
  lecture: "Lecture 10: Deep RL Methods", professor: "Xian Yu",
  institution: "The Ohio State University"
};

const ul = items => "<ul>" + items.map(item => "<li>" + item + "</li>").join("") + "</ul>";
const visible = (items, active) => ul(items.slice(0, active + 1));
const display = latex => '<div class="display">\\[' + latex + '\\]</div>';
const escapeMath = math => math.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const inlineLatex = text => text.replace(/\$([^$]+)\$/g, (_, math) => "\\(" + escapeMath(math) + "\\)");
const m = inlineLatex;
const figure = (src, alt, cls="source-figure") => '<figure class="' + cls + '"><img src="assets/' + src + '" alt="' + alt + '"></figure>';

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

const dqnLatex = [
  "\\begin{algorithm}",
  "\\caption{1: Deep Q-learning with experience replay}",
  "\\begin{algorithmic}[1]",
  "\\State Initialize replay memory $\\mathcal D$ to capacity $N$",
  "\\State Initialize action-value function $Q$ with random weights $\\theta$",
  "\\State Initialize target action-value function $Q'$ with weights $\\theta'=\\theta$",
  "\\For{$\\text{episode}=1,2,\\ldots,M$}",
  "\\State Initialize sequence $s_1=\\{x_1\\}$ and preprocessed sequence $\\phi_1=\\phi(s_1)$",
  "\\For{$t=1,2,\\ldots,T$}",
  "\\State With probability $\\epsilon$, select a random action $a_t$",
  "\\State Otherwise select $a_t=\\arg\\max_a Q(\\phi(s_t),a;\\theta)$",
  "\\State Execute $a_t$; observe reward $r_t$ and image $x_{t+1}$",
  "\\State Set $s_{t+1}=s_t,a_t,x_{t+1}$ and preprocess $\\phi_{t+1}=\\phi(s_{t+1})$",
  "\\State Store transition $(\\phi_t,a_t,r_t,\\phi_{t+1})$ in $\\mathcal D$",
  "\\State Sample a random minibatch $(\\phi_j,a_j,r_j,\\phi_{j+1})$ from $\\mathcal D$",
  "\\If{$\\phi_{j+1}$ is terminal}",
  "\\State $y_j\\gets r_j$",
  "\\Else",
  "\\State $y_j\\gets r_j+\\delta\\max_{a'}Q'(\\phi_{j+1},a';\\theta')$",
  "\\EndIf",
  "\\State Perform gradient descent on $\\big(y_j-Q(\\phi_j,a_j;\\theta)\\big)^2$ with respect to $\\theta$",
  "\\State Every $C$ steps, set $Q'=Q$",
  "\\EndFor",
  "\\EndFor",
  "\\end{algorithmic}",
  "\\end{algorithm}"
].join("\n");

const dqnItems = [
  "DQN addresses state representation, feature extraction, correlated data, and the divergence of Q-learning and other off-policy methods with nonlinear function approximators.",
  "<span class=\"scarlet\"><strong>Main idea: experience replay.</strong></span> The original paper used a replay memory of one million frames sampled uniformly at random.",
  "The learning target comes from a lagged Q-network.",
  m("Additional elements include preprocessing and stacking frames, and gradually reducing $\\epsilon$ from 1 to 0.1.")
];

const enhancementItems = [
  "<strong>Prioritized experience replay:</strong> replay experiences in proportion to their Bellman error.",
  "<strong>Double Q-learning:</strong> address maximization bias.",
  "<strong>Rainbow DQN:</strong> combine these and several other improvements over DQN."
];
const enhancementRefs = '<p class="reference-line">Schaul et al., “Prioritized Experience Replay,” ICLR, 2015. &nbsp; Van Hasselt et al., “Deep Reinforcement Learning with Double Q-Learning,” AAAI, 2016. &nbsp; Hessel et al., “Rainbow,” AAAI, 2018.</p>';

const varianceItems = [
  "Recall that Monte Carlo and TD methods lie at opposite ends of the variance-bias tradeoff.",
  "Experience replay restricts us to off-policy learning and increases memory requirements.",
  "Instead, use parallel actors with different exploration policies and different experiences to provide the stabilizing role of experience replay in DQN.",
  "This permits on-policy methods with nonlinear function approximators.",
  "The idea applies to one-step Q-learning, one-step SARSA, n-step Q-learning, and actor-critic; A3C is the actor-critic version."
];

const a3cItems = [
  m("The <span class=\"scarlet\"><strong>advantage function</strong></span> tells us how to move:") + display("\\theta_{t+1}=\\theta_t+\\alpha\\big(\\hat Q(S_t,A_t)-\\hat V(S_t)\\big)\\frac{\\nabla\\pi(A_t\\mid S_t,\\theta)}{\\pi(A_t\\mid S_t,\\theta)}."),
  m("Estimate $\\hat Q$ with a $k$-step return: $r_t+\\delta r_{t+1}+\\cdots+\\delta^k\\hat V(S_{t+k})$. This is also called $k$-step advantage estimation."),
  "Performance comparison: speed of learning versus sample efficiency.",
  m("<span class=\"scarlet\"><strong>GAE</strong></span> (Schulman et al., 2016) uses a weighted average of $n$-step returns—essentially the same idea as eligibility traces.")
];

const trustItems = [
  "Policy-gradient methods use a first-order approximation to identify an improving direction. But how far should the policy move? Step-size optimization or a conservative step size are possible choices.",
  m("<span class=\"scarlet\"><strong>Trust-region idea:</strong></span> maximize a surrogate objective while preventing the new policy from moving too far:") +
    display("\\begin{aligned}\\theta_{k+1}&=\\arg\\max_\\theta\\;\\mathbb E_{s,a\\sim\\pi_{\\theta_k}}\\!\\left[\\frac{\\pi_\\theta(a\\mid s)}{\\pi_{\\theta_k}(a\\mid s)}A_{\\pi_{\\theta_k}}(s,a)\\right]\\\\\\text{s.t. }&\\mathbb E_{s\\sim\\pi_{\\theta_k}}\\!\\left[D_{\\mathrm{KL}}\\big(\\pi_\\theta(\\cdot\\mid s)\\,\\|\\,\\pi_{\\theta_k}(\\cdot\\mid s)\\big)\\right]\\le\\epsilon.\\end{aligned}"),
  "TRPO uses second-order methods to solve this problem.",
  "PPO (Schulman et al., 2017) is motivated by the same idea but changes the optimization problem so it can be solved with first-order methods."
];

const marlUses = [
  "Multi-agent autonomous systems, such as teams of robots or unmanned aerial vehicles.",
  "Communication and imitation within a team of learners without human intervention or supervision—“learning to communicate.”",
  "Games such as chess, poker, and video games.",
  "Automated trading using software in electronic markets on behalf of a company or a person."
];

const modelSingle = m("With one agent, the sequential decision problem is modeled as an MDP $\\langle\\mathcal S,\\mathcal A,p,r,d_0,\\delta\\rangle$.");
const modelMultiple = "With multiple agents:<ul><li>Each agent takes its own action.</li><li>All agents’ actions affect state transitions.</li><li>All agents’ actions affect realized rewards.</li><li>Each agent may have a different reward function.</li></ul>";
const markovDefinition = m("Markov games, or stochastic games, generalize MDPs to the multi-agent setting:") +
  display("\\left\\langle\\mathcal S,\\{\\mathcal A_i\\}_{i=1}^{N},p,\\{r_i\\}_{i=1}^{N},d_0,\\delta\\right\\rangle,") +
  m("where $\\mathcal A:=\\mathcal A_1\\times\\cdots\\times\\mathcal A_N$, $p:\\mathcal S\\times\\mathcal A\\times\\mathcal S\\to[0,1]$, and $r_i:\\mathcal S\\times\\mathcal A\\to\\mathbb R$.");

const gameItems = [
  "Game theory mathematically models and analyzes the conflict and cooperation that arise when individual decision makers interact.",
  "It has been used to model oligopoly market outcomes, pricing, political competition, sustained cooperation, security, and other phenomena.",
  m("A strategic game consists of $N$ players or agents, each with an action space $\\mathcal A_i$ and utility function $u_i:\\mathcal A\\to\\mathbb R$."),
  "They are called Markov games because they combine strategic games with Markov decision processes."
];

export const slides = [
  {kind:"title",title:course.lecture,body:'<div class="title-card"><div class="title-rule"></div><h1>' + course.lecture +
    '</h1><p class="course-line">' + course.number + " " + course.name + '</p><p>' + course.institution +
    '</p><p>Autumn 2026</p><p class="professor">' + course.professor + "</p></div>"},
  {title:"Outline",body:ul([
    "Deep Q-Networks (DQN)",
    "A3C and generalized advantage estimation (GAE)",
    "Trust Region Policy Optimization (TRPO) and Proximal Policy Optimization (PPO)",
    "Introduction to multi-agent reinforcement learning"
  ])},

  ...[0,1,2,3].map(i => ({kind:"dense",title:"DQN: nonlinear Q-learning",body:visible(dqnItems,i)})),
  {kind:"algorithm algorithm-extra-long dqn-algorithm",title:"The DQN algorithm",body:renderAlgorithm(dqnLatex)},

  {kind:"dense",title:"Enhancements over DQN",body:visible(enhancementItems,0) + enhancementRefs},
  {kind:"dense",title:"Enhancements over DQN",body:visible(enhancementItems,1) + enhancementRefs},
  {kind:"dense split-figure-slide",title:"Enhancements over DQN",body:'<div class="split-figure"><div>' + visible(enhancementItems,2) + enhancementRefs + '</div>' + figure("rainbow-comparison.png","Performance comparison of DQN enhancements","side-figure") + '</div>'},

  {kind:"image-slide",title:"REINFORCE: a small-corridor example",body:figure("small-corridor.png","Small corridor gridworld","corridor-figure")},
  {kind:"image-slide",title:"REINFORCE: a small-corridor example",body:figure("reinforce-example.png","REINFORCE under different step sizes and initializations")},

  {kind:"dense",title:"Variance reduction with function approximation",body:visible(varianceItems,0) + '<p class="reference-line">Mnih et al., “Asynchronous Methods for Deep Reinforcement Learning,” ICML, 2016.</p>'},
  {kind:"dense",title:"Variance reduction with function approximation",body:visible(varianceItems,2) + '<p class="reference-line">Mnih et al., “Asynchronous Methods for Deep Reinforcement Learning,” ICML, 2016.</p>'},
  {kind:"dense",title:"Variance reduction with function approximation",body:visible(varianceItems,4) + '<p class="reference-line">Mnih et al., “Asynchronous Methods for Deep Reinforcement Learning,” ICML, 2016.</p>'},

  {kind:"dense",title:"A3C",body:visible(a3cItems,0)},
  {kind:"dense",title:"A3C",body:visible(a3cItems,1)},
  {kind:"dense a3c-figure-slide",title:"A3C",body:visible(a3cItems,2) + figure("a3c-performance.png","A3C learning speed comparison","a3c-figure")},
  {kind:"dense a3c-figure-slide",title:"A3C and generalized advantage estimation",body:visible(a3cItems,3) + figure("a3c-performance.png","A3C learning speed comparison","a3c-figure")},

  ...[0,1,2,3].map(i => ({kind:"dense",title:"Trust-region policy optimization",body:visible(trustItems,i) + '<p class="reference-line">Schulman et al., “Trust Region Policy Optimization,” ICML, 2015.</p>'})),

  {kind:"dense",title:"Sequential learning with multiple learners",body:visible(marlUses,3)},
  {kind:"dense",title:"From MDPs to Markov games",body:ul([modelSingle])},
  {kind:"dense",title:"From MDPs to Markov games",body:ul([modelSingle,modelMultiple])},
  {kind:"dense",title:"From MDPs to Markov games",body:ul([modelSingle,markovDefinition])},
  {kind:"dense",title:"MARL classes by reward structure",body:ul([
    m("<span class=\"scarlet\"><strong>Cooperative:</strong></span> $r_1=r_2=\\cdots=r_N=r$."),
    m("<span class=\"scarlet\"><strong>Competitive or zero-sum:</strong></span> $\\sum_{i=1}^{N}r_i=0$; commonly two agents with $r_1=-r_2$."),
    "<span class=\"scarlet\"><strong>Mixed:</strong></span> general-sum games."
  ])},
  {kind:"dense",title:"What are games?",body:visible(gameItems,1)},
  {kind:"dense",title:"What are games?",body:visible(gameItems,2)},
  {kind:"dense",title:"What are games?",body:visible(gameItems,3)}
];
