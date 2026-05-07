local function in_pdf_output()
  return quarto.doc.is_format("pdf")
end

local function table_row_count(tbl)
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

  local rows = table_row_count(tbl)
  local lines_needed = math.max(rows + 4, 8)

  return {
    pandoc.RawBlock("latex", latex_pagebreak_guard(lines_needed)),
    tbl
  }
end
