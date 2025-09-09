import parser from '../src/parser'

const md = `#{id="heading"} Title

## Subtitle

This is a paragraph with **{class="blue"}bold** and *{class="green"}italic* text, a [link]{class="link"}(https://example.com), and 
inline ` + "`code`" + `.

-{class="active"} item one
- item two

>{class="quotable"} Test blockquote

> Another **blockquote** with *italic* text and a list:
>
> - some item
> -{class="active"} other item
`

const out = parser.parse(md)
console.log(out)
