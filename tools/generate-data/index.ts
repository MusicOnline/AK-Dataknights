import * as fs from "fs/promises"

import OPERATOR_RELEASE_ORDER from "../../data/custom/operator-release.json"
import * as constants from "./constants"
import { Operator } from "./operator"
import { CharacterTable } from "./raw/character"
import * as tables from "./tables"
import { LocaleObject } from "./utils"

async function readGameTables() {
  if (globalThis.GAME_TABLES) return

  globalThis.GAME_TABLES = await tables.requireAllGameTablesAsync()
}

async function generateOperatorFiles() {
  const promises = [readGameTables()]

  const translatedLocaleData: {
    [key in constants.TranslatedLocale]?: LocaleObject
  } = {}
  for (const locale of constants.TRANSLATED_LOCALES) {
    const promise = fs
      .readFile(`locales/${locale}/operators-data.json`, {
        encoding: "utf-8",
      })
      .then((data) => (translatedLocaleData[locale] = JSON.parse(data)))
    promises.push(promise)
  }
  await Promise.all(promises)

  const characterTable: CharacterTable =
    globalThis.GAME_TABLES!.Operator[constants.ORIGINAL_LOCALE]

  const operatorIdReleaseOrder: string[] = [
    ...OPERATOR_RELEASE_ORDER,
    ...Object.keys(characterTable).filter(
      (id) => !OPERATOR_RELEASE_ORDER.includes(id)
    ),
  ]

  const operators: Operator[] = operatorIdReleaseOrder.flatMap((id) => {
    // Get original data
    const data = characterTable[id]

    // Ignore certain data
    if (
      constants.NON_OPERATOR_CLASSES.includes(data.profession) ||
      constants.FALSE_POSITIVE_ACTUAL_OPERATORS.includes(id)
    )
      return []

    const operator = new Operator(id, data)
    operator.addTokenInformation(characterTable)

    // Add official locales
    Object.entries(globalThis.GAME_TABLES!.Operator).forEach(
      ([locale, table]) => {
        if (locale === constants.ORIGINAL_LOCALE) return
        operator.addLocale(<constants.GameLocale>locale, table)
      }
    )

    // Add custom locales
    Object.entries(translatedLocaleData).forEach(([locale, table]) =>
      operator.addLocaleTL(<constants.TranslatedLocale>locale, table)
    )

    return operator
  })

  const indexFileObject = operators.map((operator) => operator.toIndexData())

  await fs.mkdir("data/operators", { recursive: true })

  return Promise.all([
    ...operators.map((operator) =>
      fs.writeFile(
        `data/operators/${operator.key}.json`,
        JSON.stringify(operator.toData(), null, 2),
        { encoding: "utf-8" }
      )
    ),
    fs.writeFile(
      "data/operators/index.json",
      JSON.stringify(indexFileObject, null, 2),
      { encoding: "utf-8" }
    ),
    ...constants.OUTPUT_LOCALES.map((locale) => {
      const localeFileData: any = {}
      operators.forEach(
        (operator) =>
          (localeFileData[operator.key] = operator.toLocaleData(locale))
      )
      return fs.writeFile(
        `locales/${locale}/operators-data.json`,
        JSON.stringify(localeFileData, null, 2),
        { encoding: "utf-8" }
      )
    }),
  ])
}

export async function generateDataFiles() {
  console.time("Generate data files")
  await Promise.all(
    constants.OUTPUT_LOCALES.map((locale) =>
      fs.mkdir(`locales/${locale}`, { recursive: true })
    )
  )
  return Promise.all([generateOperatorFiles()]).then(() =>
    console.timeEnd("Generate data files")
  )
}
