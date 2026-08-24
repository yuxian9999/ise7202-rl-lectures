import { course, slides } from "./slides.js";

const deck = document.getElementById("deck");
const counter = document.getElementById("counter");
let current = Math.min(slides.length, Math.max(1, Number(location.hash.slice(1)) || 1));

function render() {
  const data = slides[current - 1];
  deck.innerHTML = `
    <article class="slide ${data.kind || "content"}">
      <header><h1>${data.title}</h1></header>
      <section class="body">${data.body}</section>
      <footer>
        <span>${course.number} ${course.name}</span>
        <span>${course.professor}</span>
        <span>${course.institution}</span>
      </footer>
    </article>`;
  counter.textContent = `${current} / ${slides.length}`;
  history.replaceState(null, "", `#${current}`);
  if (window.renderMathInElement) {
    renderMathInElement(deck, {
      delimiters: [
        {left: "\\[", right: "\\]", display: true},
        {left: "\\(", right: "\\)", display: false}
      ],
      throwOnError: true,
      strict: "warn"
    });
  }
}

function move(delta) {
  current = Math.min(slides.length, Math.max(1, current + delta));
  render();
}

document.getElementById("prev").addEventListener("click", () => move(-1));
document.getElementById("next").addEventListener("click", () => move(1));
document.getElementById("full").addEventListener("click", async () => {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
});
document.addEventListener("keydown", event => {
  if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); move(1); }
  if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); move(-1); }
  if (event.key === "Home") { current = 1; render(); }
  if (event.key === "End") { current = slides.length; render(); }
  if (event.key.toLowerCase() === "f") document.getElementById("full").click();
});
window.addEventListener("load", render);
