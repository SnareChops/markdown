// Minimal functional markdown -> html parser
// Exports a single function `parse` that takes a markdown string and returns html string.

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const parseParagraphs = (text) => 
   text .split(/\n{2,}/)
    .map((para) => {
      if (/<[h[1-6]|ul]*/.test(para.trim())) return para
      // if it's already a block element (like starts with <h[1-6]> or <ul>), leave
      return '<p>' + para.trim().replace(/\n/g, ' ') + '</p>'
    })
    .join('\n')

const parseHeadings = (text) =>
  text.replace(/^(#{1,6})(?:{([^}]*)})?\s+(.*)$/gm, (_, l, a, t) =>
    `<h${l.length}${a ? ' ' + a : ''}>${escapeHtml(t.trim())}</h${l.length}>`
  )

const parseBold = (text) =>
  text.replace(/\*\*(?:{([^}]*)})?(.+?)\*\*/g, (_, a, t) =>
    `<strong${a ? ' ' + a : ''}>${escapeHtml(t)}</strong>`
  )

const parseItalic = (text) =>
  text.replace(/\*(?:{([^}]*)})?(.+?)\*/g, (_, a, t) =>
    `<em${a ? ' ' + a : ''}>${escapeHtml(t)}</em>`
  )

const parseInlineCode = (text) =>
  text.replace(/`([^`]+?)`/g, (_, m) =>
    `<code>${escapeHtml(m)}</code>`
  )

const parseUnorderedLists = (text) =>
  // simple: consecutive lines starting with - or * become a <ul>
  text.replace(/(^|\n)((?:[ \t]*[-*](?:{([^}]*)})?\s+.+\n?)+)/g, (_, p, b) =>
    `<ul>\n${b.trim()
      .split(/\n/)
      .map((ln) => ln.replace(/^[ \t]*[-*]/, ''))
      .map((it) => it.replace(/^(?:{([^}]*)})?([^\n]*)/, (_, a, t) =>
        `<li${a ? ' ' + a : ''}>${escapeHtml(t.trim())}</li>`
      ))
      .join('\n')
    }\n</ul>`
  )

const parseLinks = (text) =>
  text.replace(/\[([^\]]+)\](?:{([^}]*)})?\(([^)]*)\)/g, (_, t, a, u) =>
    `<a href="${escapeHtml(u)}"${a ? ' ' + a : ''}>${escapeHtml(t)}</a>`
  )

// parse blockquotes: consecutive lines starting with > become a single <blockquote>
const parseBlockquotes = (text) =>
  text.replace(/(^|\n)((?:[ \t]*>.*\n?)+)/g, (whole, pre, block) => {
    // remove leading '>' and one optional space from each line
    let inner = block
      .split(/\n/)
      .map((ln) => ln.replace(/^[ \t]*>\s?/, ''))
      .join('\n')
      .trim()

    let attr = ''
    const match = /^{([^}]*)}/.exec(inner)
    if (match) {
      attr = match[1]
      inner = inner.replace(/^{[^}]*}/, '').trim()
    }

    // process inner markdown to HTML using the same block and inline transforms
    const innerPipeline = compose(
      parseHeadings,
      parseUnorderedLists,
      parseInlineCode,
      parseBold,
      parseItalic,
      parseLinks,
      parseParagraphs
    )

    const innerHtml = inner === '' ? '' : innerPipeline(inner)
    return pre + `<blockquote${attr ? ' ' + attr : ''}>\n${innerHtml}\n</blockquote>`
  })

// composition helper: chain transformations left-to-right
const compose = (...fns) => (input) => fns.reduce((acc, fn) => fn(acc), input)

const parse = (markdown) => {
  if (typeof markdown !== 'string') throw new TypeError('markdown must be a string')
  // normalize line endings
  const src = markdown.replace(/\r\n?/g, '\n').trim()

  const pipeline = compose(
    escapeLeadingTrailingWhitespace,
    parseBlockquotes,
    parseHeadings,
    parseUnorderedLists,
    parseInlineCode,
    parseBold,
    parseItalic,
    parseLinks,
    parseParagraphs
  )

  return pipeline(src)
}

// ensure we don't accidentally wrap empty string into <p></p>
const escapeLeadingTrailingWhitespace = (s) => s.trim() === '' ? '' : s

export default { parse }
