import * as fs from "fs/promises"

import OPERATOR_RELEASE_ORDER from "../../data/custom/operator-release.json"
import * as constants from "./constants"
import { Operator } from "./operator"
import { CharacterTable } from "./raw/character"
import * as tables from "./tables"
import { LocaleObject, LocaleString } from "./utils"

async function readData() {
  if (!globalThis.GAME_TABLES)
    globalThis.GAME_TABLES = await tables.requireAllGameTablesAsync()
  if (!globalThis.TRAIT_LOCALES)
    globalThis.TRAIT_LOCALES = await tables.requireTraitLocalesAsync()
}

async function getOperators(): Promise<Operator[]> {
  const promises = [readData()]

  const translatedLocaleData: {
    [key in constants.TranslatedLocale]?: LocaleObject
  } = {}
  for (const locale of constants.TRANSLATED_LOCALES) {
    const promise = fs
      .readFile(`locales/${locale}/operators-data.json`, {
        encoding: "utf-8",
      })
      .then((data) => (translatedLocaleData[locale] = JSON.parse(data)))
      .catch(() => (translatedLocaleData[locale] = {}))
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

  return operatorIdReleaseOrder.flatMap((id) => {
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
}

function getLocaleStringNumberOfTranslations(
  localeString: LocaleString
): number {
  return constants.GAME_LOCALES.reduce((accumulator, current) => {
    if (localeString.getString(current)) accumulator++
    return accumulator
  }, 0)
}

async function generateTraitLocales(operators?: Operator[]) {
  if (!operators) operators = await getOperators()
  let localeStrings: Record<string, LocaleString> = {}

  const currentTranslationsByLang: {
    [key in constants.GameLocale]?: Record<string, string | null>
  } = {}
  for (const locale of constants.GAME_LOCALES) {
    if (locale === constants.ORIGINAL_LOCALE) continue
    currentTranslationsByLang[locale] =
      globalThis.TRAIT_LOCALES![
        <keyof tables.TraitLocalesMap>`${locale.substring(0, 2)}-TL`
      ]
  }

  function addTranslation(localeString: LocaleString) {
    if (!localeStrings.hasOwnProperty(localeString.zh_CN)) {
      localeStrings[localeString.zh_CN] = localeString
      return
    }
    const newNumber = getLocaleStringNumberOfTranslations(localeString)
    const oldNumber = getLocaleStringNumberOfTranslations(
      localeStrings[localeString.zh_CN]
    )
    if (newNumber > oldNumber) localeStrings[localeString.zh_CN] = localeString
  }

  for (const operator of operators) {
    // TODO: Consider trait of token summons
    if (operator.description) addTranslation(operator.description)
    operator.traitCandidates.forEach(({ description }) => {
      if (description) addTranslation(description)
    })
    operator.modules?.forEach(({ stages }) => {
      if (!stages) return
      const firstStage = stages.find((stage) => stage.stage === 1)
      if (firstStage?.traitUpgrade.additionalDescription)
        addTranslation(firstStage.traitUpgrade.additionalDescription)
      if (firstStage?.traitUpgrade.overrideDescription)
        addTranslation(firstStage.traitUpgrade.overrideDescription)
    })
  }

  localeStrings = Object.keys(localeStrings)
    .sort()
    .reduce((accumulator, current) => {
      accumulator[current] = localeStrings[current]
      return accumulator
    }, <Record<string, LocaleString>>{})

  return Promise.all(
    constants.GAME_LOCALES.flatMap((locale) => {
      if (locale === constants.ORIGINAL_LOCALE) return []
      return fs.writeFile(
        `locales/${locale.substring(0, 2)}-TL/traits.json`,
        JSON.stringify(
          Object.values(localeStrings).reduce((accumulator, current) => {
            accumulator[current.zh_CN] =
              current.getString(locale) ??
              (<Record<string, string | null>>(
                currentTranslationsByLang[locale]
              ))[current.zh_CN] ??
              null
            return accumulator
          }, <Record<string, string | null>>{}),
          null,
          2
        ),
        {
          encoding: "utf-8",
        }
      )
    })
  )
}

async function generateOperatorFiles(operators?: Operator[]) {
  if (!operators) operators = await getOperators()

  const indexFileObject = operators.map((operator) => operator.toIndexData())

  const generateTraitLocalesPromise = generateTraitLocales(operators)

  await fs.mkdir("data/operators", { recursive: true })

  const generateIndividualOperatorDataPromiseList = operators.map((operator) =>
    fs.writeFile(
      `data/operators/${operator.key}.json`,
      JSON.stringify(operator.toData(), null, 2),
      { encoding: "utf-8" }
    )
  )

  const generateOperatorsIndexDataPromise = fs.writeFile(
    "data/operators/index.json",
    JSON.stringify(indexFileObject, null, 2),
    { encoding: "utf-8" }
  )

  const generateOperatorsLocalesPromiseList = constants.OUTPUT_LOCALES.flatMap(
    (locale) => {
      const localeFileData: any = {}

      ;(<Operator[]>operators).forEach(
        (operator) =>
          (localeFileData[operator.key] = operator.toLocaleData(locale))
      )

      const generateFullLocalesPromise = fs.writeFile(
        `locales/${locale}/operators-data.json`,
        JSON.stringify(localeFileData, null, 2),
        { encoding: "utf-8" }
      )

      function removeNullishValues(item: LocaleObject): LocaleObject<string> {
        return Object.entries(item).reduce(
          (accumulator: LocaleObject<string>, [key, value]) => {
            if (value && typeof value === "object") {
              const purgedObj = removeNullishValues(value)
              if (Object.keys(purgedObj).length !== 0)
                accumulator[key] = removeNullishValues(value)
            } else if (typeof value === "string") {
              accumulator[key] = value
            }
            return accumulator
          },
          {}
        )
      }

      const generateLocalesWithoutNullPromise = fs.writeFile(
        `locales/${locale}/_operators-data.json`,
        JSON.stringify(removeNullishValues(localeFileData), null, 2),
        { encoding: "utf-8" }
      )

      return [generateFullLocalesPromise, generateLocalesWithoutNullPromise]
    }
  )

  return Promise.all([
    generateTraitLocalesPromise,
    ...generateIndividualOperatorDataPromiseList,
    generateOperatorsIndexDataPromise,
    ...generateOperatorsLocalesPromiseList,
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
