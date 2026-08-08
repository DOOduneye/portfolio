import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const ROOTS = ["src/admin", "src/editor", "src/worker", "src/pages", "src/lib", "src/hooks"]
const ALLOWED = ["eslint", "@ts-", "oxlint", "biome", "prettier", "use client", "use strict"]

const walk = dir =>
  readdirSync(dir).flatMap(entry => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })

const offences = []

for (const root of ROOTS) {
  for (const path of walk(root).filter(p => /\.tsx?$/.test(p))) {
    readFileSync(path, "utf8")
      .split("\n")
      .forEach((line, index) => {
        const text = line.trim()
        const isComment = text.startsWith("//") || text.startsWith("/*") || text.startsWith("* ")
        if (isComment && !ALLOWED.some(allowed => text.includes(allowed))) {
          offences.push(`${path}:${index + 1}: ${text.slice(0, 72)}`)
        }
      })
  }
}

if (offences.length) {
  console.error(`Comments are not this repo's habit. Found ${offences.length}:\n`)
  console.error(offences.join("\n"))
  process.exit(1)
}
