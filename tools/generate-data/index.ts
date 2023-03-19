import * as fs from "fs/promises"

import OPERATOR_RELEASE_ORDER from "../../data/custom/operator-release.json"
import * as constants from "./constants"
import { Operator } from "./operator"
import { CharacterTable } from "./tables"

async function generateOperatorFiles() {
  const translatedLocaleData: any = {}
  for (const locale of constants.TRANSLATED_LOCALES) {
    try {
      translatedLocaleData[locale] = fs
        .readFile(`locales/${locale}/operators-data.json`, {
          encoding: "utf-8",
        })
        .then((data) => JSON.parse(data))
    } catch {}
  }
  await Promise.all(Object.values(translatedLocaleData))

  const operatorIdReleaseOrder = [
    ...OPERATOR_RELEASE_ORDER,
    ...Object.keys(constants.OPERATOR_TABLES[constants.ORIGINAL_LOCALE]).filter(
      (id) => !OPERATOR_RELEASE_ORDER.includes(id)
    ),
  ]
  const operators = operatorIdReleaseOrder.flatMap((id) => {
    const data = constants.OPERATOR_TABLES[constants.ORIGINAL_LOCALE][id]
    if (
      ["TRAP", "TOKEN"].includes(data.profession) ||
      constants.FALSE_POSITIVE_ACTUAL_OPERATORS.includes(id)
    )
      return []
    const operator = new Operator(id, data)
    Object.entries(constants.OPERATOR_TABLES).forEach(
      // @ts-ignore
      ([locale, table]: [
        typeof constants.GAME_LOCALES[number],
        CharacterTable
      ]) => {
        if (locale === constants.ORIGINAL_LOCALE) return
        if (table[id]) operator.addLocale(locale, table[id])
      }
    )
    Object.entries(translatedLocaleData).forEach(
      // @ts-ignore
      ([locale, table]: [typeof constants.TRANSLATED_LOCALES[number], any]) => {
        if (table[operator.key])
          operator.addLocaleTL(locale, table[operator.key])
      }
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

async function generateLocaleFiles() {}

export async function generateDataFiles() {
  console.time("Generate data files")
  await Promise.all(
    constants.OUTPUT_LOCALES.map((locale) =>
      fs.mkdir(`locales/${locale}`, { recursive: true })
    )
  )
  return Promise.all([generateOperatorFiles(), generateLocaleFiles()]).then(
    () => console.timeEnd("Generate data files")
  )
}
