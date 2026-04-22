local function in_html_output()
  if quarto and quarto.doc and quarto.doc.is_format then
    return quarto.doc.is_format("html") or quarto.doc.is_format("revealjs")
  end

  return false
end

local function anchor_script()
  return [[
<script>
document.addEventListener("DOMContentLoaded", function () {
  const equations = document.querySelectorAll("span[id^='eq-']");
  equations.forEach(function (equation) {
    if (equation.querySelector(".equation-anchor")) {
      return;
    }

    if (!equation.querySelector(".math.display")) {
      return;
    }

    const id = equation.getAttribute("id");
    if (!id) {
      return;
    }

    equation.classList.add("equation-anchor-target");

    const anchor = document.createElement("a");
    anchor.className = "equation-anchor";
    anchor.href = "#" + id;
    anchor.setAttribute("aria-label", "Permalink to this equation");
    anchor.textContent = "#";
    equation.appendChild(anchor);
  });
});
</script>
]]
end

function Pandoc(doc)
  if not in_html_output() then
    return nil
  end

  table.insert(doc.blocks, pandoc.RawBlock("html", anchor_script()))
  return doc
end
