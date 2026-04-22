<script>
const addTheoremAnchors = () => {
  for (const theoremDiv of window.document.querySelectorAll("div.theorem[id]")) {
    if (!theoremDiv.classList.contains("anchored")) {
      theoremDiv.classList.add("anchored");
    }

    if (!theoremDiv.dataset.anchorId) {
      theoremDiv.dataset.anchorId = theoremDiv.id;
    }

    const anchorTarget =
      theoremDiv.querySelector(".theorem-title") || theoremDiv.querySelector("p");

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
  window.document.addEventListener("DOMContentLoaded", addTheoremAnchors);
} else {
  addTheoremAnchors();
}
</script>
