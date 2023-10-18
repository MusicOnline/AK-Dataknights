import { Blackboard } from "~/tools/generate-data/raw/common"

const VARIABLE_REGEX =
  /\{(?<sign>-)?(?<name>.+?)(?::(?<formatSpecifier>.+?))?\}/g

const BUILTIN_RICH_TEXT_TAG_TO_CLASS = {
  i: "italic",
  b: "text-bold",
}

const BUILTIN_CLASS_TO_RICH_TEXT_REGEX = Object.entries(
  BUILTIN_RICH_TEXT_TAG_TO_CLASS,
).reduce(
  (accumulator: { [key: string]: RegExp }, [richTextTag, englishClass]) => {
    accumulator[englishClass] = new RegExp(
      `<${richTextTag}>(.+?)</${richTextTag}>`,
      "g",
    )
    return accumulator
  },
  {},
)

// gamedata_const.json
const CUSTOM_RICH_TEXT_TAG_TO_ENGLISH = {
  // General
  kw: "keyword", // Arts Damage, Shift etc
  rem: "reminder", // Skill can be manually toggled etc
  vup: "value-increase",
  vdown: "value-decrease",
  talpu: "potential",
  // Status effects
  buffres: "status-resistance",
  debuff: "status-effect",
  stun: "stun",
  cold: "cold",
  frozen: "frozen",
  levitate: "levitate",
  root: "bind",
  sleep: "sleep",
  sluggish: "slow",
  inspire: "inspiration", // Bard trait
  invisible: "invisibility", // Firewatch S1
  camou: "camouflage", // April S2
  strong: "vigor", // Pallas's talent
  protect: "sanctuary", // Abjurer common talent
  fragile: "fragile", // Hexer common talent
  magicfragile: "arts-fragile", // Hibiscus the Purifier S2
  dying: "critically-wounded", // Saga & Luo Xiaohei's talent
  // Skill effects
  charged: "charged", // Charge SP second time
  overdrive: "overload", // Extended skill duration/ammo
  binding: "tied", // Kal'tsit
  // Enemy buffs
  float: "low-altitude-hovering",
  refraction: "refraction",
  // Barrier & shields
  barrier: "barrier", // Second HP bar (Penance)
  shield: "shield", // Block DMG instance (Mudrock)
  physhield: "physical-shield", // Whislash module
  // Damage type
  "dt.element": "elemental-damage",
  "dt.neural": "nervous-impairment",
  "dt.erosion": "corrosion-damage",
  "dt.burning": "burn-damage",
  "dt.apoptosis": "necrosis-damage",
}

const CUSTOM_CLASS_TO_RICH_TEXT_REGEX = Object.entries(
  CUSTOM_RICH_TEXT_TAG_TO_ENGLISH,
).reduce(
  (accumulator: { [key: string]: RegExp }, [richTextTag, englishClass]) => {
    accumulator[englishClass] = new RegExp(
      `<[#?](?:ba|cc)\\.${richTextTag.replace(/\./g, "\\.")}>(.+?)</>`,
      "g",
    )
    return accumulator
  },
  {},
)

export type ConvertRichTextOptions = {
  html?: boolean
  replace?:
    | {
        [name: string]: number
      }
    | Blackboard[]
  locale?: string
}

export function convertRichText(
  richText: string,
  options: ConvertRichTextOptions = {},
): string {
  const { locale = "en-US" } = options

  let transformedString = richText.replace(/\\n/g, "\n")
  if (options.html ?? true) {
    transformedString = transformedString
      .replace(/\n/g, "<br/>")
      .replace(/<</g, "&lt;")
      .replace(/>>/g, "&gt;")
    Object.entries(BUILTIN_CLASS_TO_RICH_TEXT_REGEX).forEach(
      ([targetClass, regex]) =>
        (transformedString = transformedString.replace(
          regex,
          `<span class="${targetClass}">$1</span>`,
        )),
    )
    Object.entries(CUSTOM_CLASS_TO_RICH_TEXT_REGEX).forEach(
      ([targetClass, regex]) =>
        (transformedString = transformedString.replace(
          regex,
          `<span class="ba-markup ba-${targetClass}">$1</span>`,
        )),
    )
  } else {
    Object.values(BUILTIN_CLASS_TO_RICH_TEXT_REGEX).forEach(
      (regex) => (transformedString = transformedString.replace(regex, "$1")),
    )
    Object.values(CUSTOM_CLASS_TO_RICH_TEXT_REGEX).forEach(
      (regex) => (transformedString = transformedString.replace(regex, "$1")),
    )
    transformedString = transformedString
      .replace(/<</g, "<")
      .replace(/>>/g, ">")
  }

  const matches = transformedString.matchAll(VARIABLE_REGEX)
  for (const match of matches) {
    const { sign, name, formatSpecifier } = match.groups!
    let value
    if (Array.isArray(options?.replace)) {
      // options.replace: Blackboard[]
      value = options.replace.find(({ key }) => key === name.toLowerCase())
        ?.value
    } else {
      value = options?.replace?.[name.toLowerCase()]
    }
    if (value === null || value === undefined) continue
    if (sign === "-") value = -value
    let replacedValue = value.toString()
    switch (formatSpecifier) {
      case "0":
      case "0%":
        replacedValue = value.toLocaleString(locale, {
          style: "percent",
          maximumFractionDigits: 0,
        })
        break
      case "0.0":
        replacedValue = value.toLocaleString(locale, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
        break
      case "0.0%":
        replacedValue = value.toLocaleString(locale, {
          style: "percent",
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
        break
    }
    transformedString = transformedString.replace(match[0], replacedValue)
  }
  return transformedString
}
