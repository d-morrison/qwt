<script>
const theoremLikeClassPairs = [
  ["thm", "theorem"],
  ["lem", "lemma"],
  ["cor", "corollary"],
  ["prp", "proposition"],
  ["cnj", "conjecture"],
  ["def", "definition"],
  ["exm", "example"],
  ["exr", "exercise"],
  ["proof"],
  ["remark"],
  ["solution"]
];

const theoremLikeClasses = theoremLikeClassPairs.flat();

const isTheoremLikeClass = (className) =>
  theoremLikeClasses.some(
    (theoremLikeClass) =>
      className === theoremLikeClass ||
      className.startsWith(`${theoremLikeClass}-`)
  );

const isTheoremLikeDiv = (div) =>
  Array.from(div.classList).some(isTheoremLikeClass);

const addTheoremLikeDivAnchors = () => {
  for (const theoremDiv of window.document.querySelectorAll("div[id]")) {
    if (!isTheoremLikeDiv(theoremDiv)) {
      continue;
    }

    if (!theoremDiv.classList.contains("anchored")) {
      theoremDiv.classList.add("anchored");
    }

    if (!theoremDiv.dataset.anchorId) {
      theoremDiv.dataset.anchorId = theoremDiv.id;
    }

    const anchorTarget =
      theoremDiv.querySelector(".theorem-title") ||
      theoremDiv.querySelector("p:first-of-type");

    if (!anchorTarget || anchorTarget.querySelector("a.anchorjs-link")) {
      continue;
    }

    const anchorLink = window.document.createElement("a");
    anchorLink.className = "anchorjs-link";
    anchorLink.setAttribute("aria-label", "Anchor");
    anchorLink.setAttribute("href", `#${theoremDiv.id}`);
    anchorLink.textContent = "";
    anchorTarget.appendChild(anchorLink);
  }
};

if (window.document.readyState === "loading") {
  window.document.addEventListener("DOMContentLoaded", addTheoremLikeDivAnchors);
} else {
  addTheoremLikeDivAnchors();
}
</script>
