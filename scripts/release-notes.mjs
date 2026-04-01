import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const version = process.argv[2]

if (!version) {
  console.error('Usage: npm run release:notes -- <version>')
  process.exit(1)
}

const changelogPath = resolve(process.cwd(), 'CHANGELOG.md')
const source = readFileSync(changelogPath, 'utf8')

if (source.includes(`## [${version}] - `)) {
  console.error(`Entry for version ${version} already exists in CHANGELOG.md`)
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)
const entry = [
  `## [${version}] - ${today}`,
  '',
  '### Ajoute',
  '- ',
  '',
  '### Modifie',
  '- ',
  '',
  '### Corrige',
  '- ',
  '',
  '### Tests',
  '- ',
  '',
].join('\n')

const firstEntryIndex = source.indexOf('\n## [')

if (firstEntryIndex === -1) {
  const updated = `${source.trimEnd()}\n\n${entry}\n`
  writeFileSync(changelogPath, updated, 'utf8')
  console.log(`Created changelog entry for ${version}`)
  process.exit(0)
}

const header = source.slice(0, firstEntryIndex).trimEnd()
const rest = source.slice(firstEntryIndex + 1)
const updated = `${header}\n\n${entry}${rest}`

writeFileSync(changelogPath, updated, 'utf8')
console.log(`Created changelog entry for ${version}`)
