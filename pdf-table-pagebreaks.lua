-- Reserve extra baselines for caption/separators around the table body.
local EXTRA_LINES_FOR_CAPTION = 4
-- Protect very small tables when they appear near the bottom of a page.
local MINIMUM_LINES_PROTECTED = 8

local function in_pdf_output()
  return quarto.doc.is_format("pdf")
end

local function count_table_rows(tbl)
  local rows = 0

  if tbl.head and tbl.head.rows then
    rows = rows + #tbl.head.rows
  end

  if tbl.bodies then
    for _, body in ipairs(tbl.bodies) do
      if body.head then
        rows = rows + #body.head
      end

      if body.body then
        rows = rows + #body.body
      end
    end
  end

  if tbl.foot and tbl.foot.rows then
    rows = rows + #tbl.foot.rows
  end

  return rows
end

local function latex_pagebreak_guard(lines_needed)
  -- Generate LaTeX that checks remaining vertical space against the table's
  -- estimated line budget and forces \newpage when space is insufficient.
  -- \pagegoal is the target page height, \pagetotal is used height, and
  -- \dimen0 stores the remaining space before the table starts.
  return string.format([[
\par
\begingroup
\dimen0=\pagegoal
\advance\dimen0 by -\pagetotal
\ifdim\dimen0<%d\baselineskip
\newpage
\fi
\endgroup
]], lines_needed)
end

function Table(tbl)
  if not in_pdf_output() then
    return nil
  end

  -- Pandoc Table filter: prepend a LaTeX page-space guard before each table
  -- so short tables move to the next page instead of splitting.
  local rows = count_table_rows(tbl)
  local lines_needed = math.max(
    rows + EXTRA_LINES_FOR_CAPTION,
    MINIMUM_LINES_PROTECTED
  )

  return {
    pandoc.RawBlock("latex", latex_pagebreak_guard(lines_needed)),
    tbl
  }
end
