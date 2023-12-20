import { existsSync, readdirSync } from "fs";
import { basename, extname, join } from "path";

interface ImportDirOptions {
  include?: RegExp,
  exclude?: RegExp,
  nest?: boolean, // Has no effect if shallow = true
  shallow?: boolean
}

function _concat(map: Map<unknown, unknown>, ...maps: Map<unknown, unknown>[]) {
  for (const m of maps) for (const [k, v] of m) map.set(k, v)
  return map
}

// Imports a dir as a map
export async function importDir(dirPath: string, options: ImportDirOptions = {}) {
  const map = new Map<string, unknown>()

  if (!existsSync(dirPath)) return map

  const { include, exclude, nest, shallow } = options

  const dir = readdirSync(dirPath, { withFileTypes: true })
  for (const entry of dir) {
    const entryPath = join(dirPath, entry.name)
    if (include && !include.test(entryPath)) continue
    if (exclude?.test(entryPath)) continue
    if (entry.isDirectory()) {
      if (shallow) continue
      const subDir = importDir(entryPath, options)
      if (nest) map.set(entry.name, subDir)
      else _concat(map, await subDir)
    } else if (extname(entry.name) === ".json") {
      map.set(
        basename(entry.name, extname(entry.name)),
        (await import(entryPath))?.default
      )
    }
  }

  return map
}
