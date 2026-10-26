export type IntroSegment = {
  text: string
  href?: string
}

const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

export function parseIntro(intro: string): IntroSegment[] {
  const segments: IntroSegment[] = []
  let last = 0

  for (const match of intro.matchAll(linkPattern)) {
    if (match.index > last) segments.push({ text: intro.slice(last, match.index) })
    segments.push({ text: match[1]!, href: match[2]! })
    last = match.index + match[0].length
  }

  if (last < intro.length) segments.push({ text: intro.slice(last) })
  return segments
}
