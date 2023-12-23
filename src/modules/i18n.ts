import { join } from "path"
import { importDir } from "./fs"
import { error } from "./logger"

const LOCALE = "en"
const MUSTACHE = ["{{", "}}"]

export interface Variables {
  [key: string]: string
}

export interface Locales {
  [key: string]: string | Locales
}

function _isLocales(x: unknown): x is Locales {
  if (!x || typeof x !== "object") return false

  for (const k in x) if (typeof k !== "string") return false
  const obj = x as Record<string, unknown>

  for (const k in obj) {
    const value = obj[k]
    if (typeof value !== "string" && !_isLocales(value)) return false
  }
  return true
}

let locales: Locales = {}
importDir(join(__dirname, "..", "..", "locales"), { nest: true }).then((m) => {
  if (!_isLocales(m)) throw new Error("Locales must have only strings and objects")
  else locales = m
})

function _isArray(value: unknown): value is Array<unknown> {
  return value instanceof Array;
}

function escape(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function mustacheRegex(str: string, [start, end]: Array<string> = MUSTACHE) {
  return new RegExp(escape(start + str + end), "g")
}

export function replaceVariables(str: string, variables: Variables, mustache: Array<string> = MUSTACHE) {
  for (const variable in variables) str = str.replace(
    mustacheRegex(escape(variable), mustache),
    variables[variable]
  )
  return str
}

export function t(path: string | string[], locale: string = LOCALE, variables: Variables = {}) {
  if (!Object.keys(locales).length) throw new Error("locales didn't load yet")
  if (!Object.hasOwn(locales, locale)) throw new Error(`locale ${locale} doesn't exist`)

  const p = _isArray(path) ? path : path.split(".")
  let s = locales[locale]

  for (const i of p) {
    if (typeof s === "string") throw new TypeError("Expected a Locales object but got a string instead")
    if (!Object.hasOwn(s, i)) {
      error(`no string for '${p.join(".")}' in '${locale}'`)
      return p.join(".")
    }
    s = s[i]
  }
  if (typeof s !== "string") throw new TypeError("Expected a string but got a Locales object instead")

  return replaceVariables(s, variables)
}
