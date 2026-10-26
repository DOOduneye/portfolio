export type LinkSegment = {
  text: string
  href?: string
}

const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

export function parseLinks(text: string): LinkSegment[] {
  const segments: LinkSegment[] = []
  let last = 0

  for (const match of text.matchAll(linkPattern)) {
    if (match.index > last) segments.push({ text: text.slice(last, match.index) })
    segments.push({ text: match[1]!, href: match[2]! })
    last = match.index + match[0].length
  }

  if (last < text.length) segments.push({ text: text.slice(last) })
  return segments
}
