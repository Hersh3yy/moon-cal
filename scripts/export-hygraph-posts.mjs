#!/usr/bin/env node
/**
 * Export every Hygraph blog post to content/posts/<slug>.md (Markdown + front matter) and
 * content/posts.json (the raw export including the rich-text AST). Use it as a backup and
 * as the source for importing the blog into VAMS.
 *
 *   yarn export:posts
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const ENDPOINT = process.env.NUXT_HYGRAPH_ENDPOINT || 'https://eu-west-2.cdn.hygraph.com/content/cm60s84ew02la07v0ryt7qagq/master'
const OUT = resolve(process.cwd(), 'content')

const QUERY = `{
  posts(orderBy: date_DESC, first: 100) {
    id title slug date publishedAt updatedAt excerpt tags referenceUrls
    content { json }
    coverImage { url width height }
    author { name }
    images { id url width height }
  }
}`

const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query: QUERY }) })
const { data, errors } = await res.json()
if (errors?.length) throw new Error(errors.map((e) => e.message).join('; '))

await mkdir(resolve(OUT, 'posts'), { recursive: true })
await writeFile(resolve(OUT, 'posts.json'), JSON.stringify(data.posts, null, 2) + '\n')

for (const post of data.posts) {
  const md = frontMatter(post) + '\n' + astToMarkdown(post.content?.json) + '\n'
  await writeFile(resolve(OUT, 'posts', `${post.slug}.md`), md)
  console.log(`exported ${post.slug}`)
}
console.log(`${data.posts.length} posts → content/`)

// ---------- helpers ----------

function frontMatter(post) {
  const tags = (post.tags ?? []).filter(Boolean)
  const lines = [
    '---',
    `title: ${yaml(post.title)}`,
    `slug: ${post.slug}`,
    `date: ${post.date}`,
    post.updatedAt ? `updatedAt: ${post.updatedAt}` : null,
    post.excerpt ? `excerpt: ${yaml(post.excerpt)}` : null,
    post.author?.name ? `author: ${yaml(post.author.name)}` : null,
    `tags: [${tags.map(yaml).join(', ')}]`,
    post.coverImage?.url ? `coverImage: ${post.coverImage.url}` : null,
    post.images?.length ? `images:\n${post.images.map((i) => `  - ${i.url}`).join('\n')}` : null,
    post.referenceUrls?.length ? `references:\n${post.referenceUrls.map((u) => `  - ${u}`).join('\n')}` : null,
    '---',
  ]
  return lines.filter(Boolean).join('\n')
}

function yaml(s) {
  return JSON.stringify(String(s ?? ''))
}

function astToMarkdown(json) {
  if (!json?.children) return ''
  return json.children.map((b) => block(b, 0)).filter(Boolean).join('\n\n')
}

function block(node, depth) {
  if (!node) return ''
  switch (node.type) {
    case 'paragraph': return inline(node.children)
    case 'heading-one': return `# ${inline(node.children)}`
    case 'heading-two': return `## ${inline(node.children)}`
    case 'heading-three': return `### ${inline(node.children)}`
    case 'heading-four': return `#### ${inline(node.children)}`
    case 'heading-five': return `##### ${inline(node.children)}`
    case 'heading-six': return `###### ${inline(node.children)}`
    case 'block-quote': return inline(node.children).split('\n').map((l) => `> ${l}`).join('\n')
    case 'code-block': return '```\n' + inline(node.children) + '\n```'
    case 'bulleted-list': return list(node.children, depth, () => '-')
    case 'numbered-list': return list(node.children, depth, (i) => `${i + 1}.`)
    case 'image': return `![${node.altText ?? ''}](${node.src})`
    case 'table': return table(node)
    case 'class': return (node.children ?? []).map((c) => block(c, depth)).join('\n\n')
    default: return (node.children ?? []).map((c) => (c.type ? block(c, depth) : inline([c]))).join('\n\n')
  }
}

function list(items, depth, marker) {
  const pad = '  '.repeat(depth)
  return (items ?? []).map((item, i) => {
    const parts = []
    for (const child of item.children ?? []) {
      if (child.type === 'list-item-child') {
        const texts = (child.children ?? []).filter((c) => !c.type || !c.type.endsWith('-list'))
        const nested = (child.children ?? []).filter((c) => c.type && c.type.endsWith('-list'))
        parts.push(inline(texts))
        for (const n of nested) parts.push(block(n, depth + 1))
      } else if (child.type && child.type.endsWith('-list')) {
        parts.push(block(child, depth + 1))
      } else {
        parts.push(inline([child]))
      }
    }
    const [first, ...rest] = parts
    return `${pad}${marker(i)} ${first ?? ''}${rest.length ? '\n' + rest.join('\n') : ''}`
  }).join('\n')
}

function table(node) {
  const rows = []
  for (const section of node.children ?? []) {
    for (const row of section.children ?? []) {
      if (row.type === 'table_row') rows.push((row.children ?? []).map((cell) => inline(cell.children).replace(/\|/g, '\\|').replace(/\n/g, ' ')))
    }
  }
  if (!rows.length) return ''
  const [head, ...body] = rows
  const line = (r) => `| ${r.join(' | ')} |`
  return [line(head), `| ${head.map(() => '---').join(' | ')} |`, ...body.map(line)].join('\n')
}

function inline(children) {
  return (children ?? []).map((c) => {
    if (c.type === 'link') return `[${inline(c.children)}](${c.href})`
    if (c.type) return block(c, 0)
    let t = c.text ?? ''
    if (!t) return ''
    if (c.code) t = `\`${t}\``
    if (c.bold) t = `**${t}**`
    if (c.italic) t = `*${t}*`
    if (c.underline) t = `<u>${t}</u>`
    return t
  }).join('')
}
