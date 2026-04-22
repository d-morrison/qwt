<script>
const theoremLikeClasses = new Set([
  "thm",
  "theorem",
  "lem",
  "lemma",
  "cor",
  "corollary",
  "prp",
  "proposition",
  "cnj",
  "conjecture",
  "def",
  "definition",
  "exm",
  "example",
  "exr",
  "exercise",
  "proof",
  "remark",
  "solution"
]);
const inlineAnchorSeparator = "\u00A0";
const anchorIcon = "🔗";
const maxAnchorRetryAttempts = 5;
const anchorRetryDelayMs = 50;

const isTheoremLikeDiv = (div) =>
  Array.from(div.classList).some((className) => theoremLikeClasses.has(className));

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
  }
};

const addLevel1SectionAnchors = () => {
  for (const sectionHeading of window.document.querySelectorAll(
    "section.level1[id] > h1"
  )) {
    if (!sectionHeading.classList.contains("anchored")) {
      sectionHeading.classList.add("anchored");
    }

    if (!sectionHeading.dataset.anchorId) {
      sectionHeading.dataset.anchorId = sectionHeading.parentElement.id;
    }
  }
};

const updateAnchorIcons = () => {
  for (const anchorLink of window.document.querySelectorAll("a.anchorjs-link")) {
    if (anchorLink.textContent !== anchorIcon) {
      anchorLink.textContent = anchorIcon;
    }
  }
};

const moveTheoremDivAnchorsInline = () => {
  let hasPendingAnchors = false;

  for (const theoremDiv of window.document.querySelectorAll("div[id]")) {
    if (!isTheoremLikeDiv(theoremDiv)) {
      continue;
    }

    const theoremTitle = theoremDiv.querySelector(".theorem-title");
    if (!theoremTitle) {
      continue;
    }

    const anchorLink = Array.from(
      theoremDiv.querySelectorAll("a.anchorjs-link")
    ).find((link) => {
      const href = link.getAttribute("href") || "";
      return href === `#${theoremDiv.id}` || href.endsWith(`#${theoremDiv.id}`);
    });

    if (anchorLink && anchorLink.parentElement === theoremTitle) {
      continue;
    }

    if (!anchorLink) {
      hasPendingAnchors = true;
      continue;
    }

    theoremTitle.append(inlineAnchorSeparator);
    theoremTitle.append(anchorLink);
  }

  return hasPendingAnchors;
};

const moveTheoremDivAnchorsInlineWithRetry = (
  attemptsRemaining = maxAnchorRetryAttempts
) => {
  const hasPendingAnchors = moveTheoremDivAnchorsInline();
  if (hasPendingAnchors && attemptsRemaining > 0) {
    window.setTimeout(() => {
      moveTheoremDivAnchorsInlineWithRetry(attemptsRemaining - 1);
    }, anchorRetryDelayMs);
  }
};

if (window.document.readyState === "loading") {
  window.document.addEventListener("DOMContentLoaded", () => {
    addTheoremLikeDivAnchors();
    addLevel1SectionAnchors();
    moveTheoremDivAnchorsInlineWithRetry();
    updateAnchorIcons();
  });
} else {
  addTheoremLikeDivAnchors();
  addLevel1SectionAnchors();
  moveTheoremDivAnchorsInlineWithRetry();
  updateAnchorIcons();
}

window.addEventListener("load", () => {
  moveTheoremDivAnchorsInlineWithRetry();
  updateAnchorIcons();
});
</script>
