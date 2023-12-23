import { existsSync, readdirSync } from "fs";
import { basename, extname, join } from "path";

interface ImportDirOptions {
  include?: RegExp,
  exclude?: RegExp,
  nest?: boolean, // Has no effect if shallow = true
  shallow?: boolean
}

export interface UnknownObject {
  [key: string | number | symbol]: unknown
}

function _concat(obj: UnknownObject, ...objects: UnknownObject[]) {
  for (const o of objects) for (const k in o) obj[k] = o[k]
  return obj
}

// Imports a dir as an object
export async function importDir(dirPath: string, options: ImportDirOptions = {}) {
  const obj: UnknownObject = {}

  if (!existsSync(dirPath)) return obj

  const { include, exclude, nest, shallow } = options

  const dirEntries = readdirSync(dirPath, { withFileTypes: true })
  for (const entry of dirEntries) {
    const entryPath = join(dirPath, entry.name)
    if (include && !include.test(entryPath)) continue
    if (exclude?.test(entryPath)) continue
    if (entry.isDirectory()) {
      if (shallow) continue
      const subDir = await importDir(entryPath, options)
      if (nest) obj[entry.name] = subDir
      else _concat(obj, subDir)
    } else if ([".json", ".js", ".ts"].includes(extname(entry.name))) {
      obj[basename(entry.name, extname(entry.name))] = (await import(entryPath))?.default
    }
  }

  return obj
}
