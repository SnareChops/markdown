
# Minimal Markdown Parser (enhanced attributes)

This is a tiny, functional markdown to HTML parser that supports standard markdown plus
an additional, minimal attribute syntax which allows attaching raw HTML attributes to
elements using a `{...}` block placed directly after the markdown token.

> THIS LIBRARY DOES NOT SANITIZE OR FILTER OUT MALICIOUS CODE. DO NOT TRUST THIS WITH 3RD
> PARTY OR USER GENERATED CODE. ONLY TRUST THE OUTPUT IF YOU TRUST THE INPUT.

Key points
- Attributes are written inside `{}` immediately after the markdown notation.
- Attributes are inserted verbatim into the generated HTML tag. They are not validated
	or escaped by the parser, so supply valid HTML attributes.
- Inline code (backticks) does not accept attribute blocks.

Attribute syntax examples

- Exact examples requested

	- Markdown: `#{class="something"} Title`

		HTML: `<h1 class="something">Title</h1>`

	- Markdown: `**{class="yell"}hello**`

		HTML: `<strong class="yell">hello</strong>`

- Heading with attribute (alternative)

	Markdown: `#{class="title"} My heading`

	HTML: `<h1 class="title">My heading</h1>`

- Italic / emphasis with attribute

	Markdown: `*{style="color:red"}warning*`

	HTML: `<em style="color:red">warning</em>`

- Unordered list items with attribute

	Markdown:

	- `-{class="item"} one`
	- `- two`

	HTML:

	`<ul>`
	`<li class="item">one</li>`
	`<li>two</li>`
	`</ul>`

- Links with attribute (attributes placed between `]` and `(`)

	Markdown: `[click me]{target="_blank"}(https://example.com)`

	HTML: `<a href="https://example.com" target="_blank">click me</a>`

Supported elements
- Headings (# to ######)
- Paragraphs
- Bold (`**text**`)
- Italic (`*text*`)
- Unordered lists (`- item` or `* item`)
- Links (`[text]{...}(url)`)
- Blockquotes (`> quoted line`) — the blockquote can contain multiple lines and the
	inner content is parsed as markdown (so you can use headings, lists, emphasis, etc.)

Limitations and notes
- The parser is minimal and not a full CommonMark implementation.
- Attribute blocks must appear immediately after the markdown marker (no spaces in
	between the marker and the `{}`). For headings and inline elements the parser
	accepts an attribute block as shown in the examples above.
- Attributes are inserted verbatim; do not supply untrusted input inside attribute
	blocks.
- Inline code (`` `code` ``) does not accept attributes.

Quick test

To run the small test harness that prints HTML output:

```bash
node examples/example.js
```

