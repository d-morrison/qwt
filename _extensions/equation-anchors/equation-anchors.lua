local function in_html_output()
  if quarto and quarto.doc and quarto.doc.is_format then
    return quarto.doc.is_format("html") or quarto.doc.is_format("revealjs")
  end

  return false
end

local function extract_latex_label(text)
  return text:match("\\label%s*%{([^}]+)%}")
end

local function extract_trailing_identifier(inline)
  if not inline or inline.t ~= "Str" then
    return nil
  end

  return inline.text:match("^%{#([%w%-%._:]+)%}$")
end

function Para(el)
  if not in_html_output() then
    return nil
  end

  if #el.content == 0 then
    return nil
  end

  local first = el.content[1]
  if first.t ~= "Math" or first.mathtype ~= "DisplayMath" then
    return nil
  end

  local label = extract_latex_label(first.text)
  local trailing_index = nil

  if not label then
    trailing_index = #el.content
    label = extract_trailing_identifier(el.content[trailing_index])
    if not label then
      trailing_index = nil
    end
  end

  if not label then
    return nil
  end

  local wrapped_content = {}
  for i, inline in ipairs(el.content) do
    if i ~= trailing_index then
      table.insert(wrapped_content, inline)
    end
  end

  local anchor = pandoc.RawInline(
    "html",
    '<a class="equation-anchor" href="#' ..
      label ..
      '" aria-label="Link to equation ' ..
      label .. '">#</a>'
  )
  table.insert(wrapped_content, pandoc.Space())
  table.insert(wrapped_content, anchor)

  return pandoc.Div(
    {pandoc.Para(wrapped_content)},
    pandoc.Attr(label, {"equation-with-anchor"})
  )
end
