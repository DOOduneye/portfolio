import { readFileSync } from "node:fs"

const ROOTS = ["src/admin/", "src/editor/", "src/worker/", "src/pages/", "src/lib/", "src/hooks/"]
const ALLOWED = ["eslint", "@ts-", "oxlint", "biome", "prettier", "use client", "use strict"]

const input = JSON.parse(readFileSync(0, "utf8"))
const path = input.tool_input?.file_path ?? input.tool_response?.filePath ?? ""
const relative = path.replace(/^.*?\/portfolio\//, "")

if (!/\.tsx?$/.test(relative) || !ROOTS.some(root => relative.startsWith(root))) process.exit(0)

let source
try {
  source = readFileSync(path, "utf8")
} catch {
  process.exit(0)
}

const found = []
source.split("\n").forEach((line, index) => {
  const text = line.trim()
  const isComment = text.startsWith("//") || text.startsWith("/*") || text.startsWith("* ")
  if (isComment && !ALLOWED.some(allowed => text.includes(allowed))) {
    found.push(`  ${relative}:${index + 1}  ${text.slice(0, 70)}`)
  }
})

if (found.length === 0) process.exit(0)

console.error(
  `Comments are not this repo's habit. Remove these from ${relative}:\n${found.join("\n")}`
)
process.exit(2)
