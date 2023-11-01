import * as fs from "fs/promises"

import * as constants from "./constants"
import { Operator } from "./operator"
import type { CharacterTable } from "./raw/character"
import * as tables from "./tables"
import { LocaleString, purgeLocaleObject, type LocaleObject } from "./utils"

async function readData() {
  if (!globalThis.GAME_TABLES)
    globalThis.GAME_TABLES = await tables.requireAllGameTablesAsync()
  if (!globalThis.TRAIT_LOCALES)
    globalThis.TRAIT_LOCALES = await tables.requireTraitLocalesAsync()
  if (!globalThis.OPERATOR_RELEASE)
    globalThis.OPERATOR_RELEASE = await tables.requireOperatorRelease()
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

  const patchOperators: Operator[] = []

  const operators = Object.keys(characterTable).flatMap((id) => {
    // Get original data
    const data = characterTable[id]

    // Ignore certain data
    if (
      constants.NON_OPERATOR_CLASSES.includes(data.profession) ||
      constants.FALSE_POSITIVE_ACTUAL_OPERATORS.includes(id)
    )
      return []

    const operator = new Operator(id, data)

    // Add official locales
    Object.entries(globalThis.GAME_TABLES!.Operator).forEach(
      ([locale, table]) => {
        if (locale === constants.ORIGINAL_LOCALE) return
        operator.addLocale(<constants.GameLocale>locale, table)
      },
    )

    // Add custom locales
    Object.entries(translatedLocaleData).forEach(([locale, table]) =>
      operator.addLocaleTL(<constants.TranslatedLocale>locale, table),
    )

    operator.characterPatches?.forEach((patch) => {
      if (!patchOperators.includes(patch)) patchOperators.push(patch)
    })

    return operator
  })

  operators.forEach((operator) =>
    operator.addAlterOperatorInformation(operators),
  )

  return [...operators, ...patchOperators].sort((a, b) => {
    const aTime = a.cnReleaseTime ?? 9_999_999_999_999
    const bTime = b.cnReleaseTime ?? 9_999_999_999_999
    return aTime - bTime
  })
}

function getLocaleStringNumberOfTranslations(
  localeString: LocaleString,
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
      localeStrings[localeString.zh_CN],
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
    .reduce(
      (accumulator, current) => {
        accumulator[current] = localeStrings[current]
        return accumulator
      },
      <Record<string, LocaleString>>{},
    )

  return Promise.all(
    constants.GAME_LOCALES.flatMap((locale) => {
      if (locale === constants.ORIGINAL_LOCALE) return []
      return fs.writeFile(
        `locales/${locale.substring(0, 2)}-TL/traits.json`,
        JSON.stringify(
          Object.values(localeStrings).reduce(
            (accumulator, current) => {
              accumulator[current.zh_CN] =
                current.getString(locale) ??
                (<Record<string, string | null>>(
                  currentTranslationsByLang[locale]
                ))[current.zh_CN] ??
                null
              return accumulator
            },
            <Record<string, string | null>>{},
          ),
          null,
          2,
        ),
        {
          encoding: "utf-8",
        },
      )
    }),
  )
}

async function generateOperatorFiles(operators?: Operator[]) {
  if (!operators) operators = await getOperators()

  const indexFileObject = operators.map((operator) => operator.toIndexData())

  const generateTraitLocalesPromise = generateTraitLocales(operators)

  const requiredDirs = [
    "data/operators",
    ...constants.OUTPUT_LOCALES.map((locale) => `locales/${locale}/generated`),
  ]

  await Promise.all(
    requiredDirs.map((dir) => fs.mkdir(dir, { recursive: true })),
  )

  const generateIndividualOperatorDataPromiseList = operators.map((operator) =>
    fs.writeFile(
      `data/operators/${operator.key}.json`,
      JSON.stringify(operator.toData(), null, 2),
      { encoding: "utf-8" },
    ),
  )

  const generateOperatorsIndexDataPromise = fs.writeFile(
    "data/operators/index.json",
    JSON.stringify(indexFileObject, null, 2),
    { encoding: "utf-8" },
  )

  const generateOperatorsLocalesPromiseList = constants.OUTPUT_LOCALES.flatMap(
    (locale) => {
      const fullLocaleObj: LocaleObject = {}

      ;(<Operator[]>operators).forEach(
        (operator) =>
          (fullLocaleObj[operator.key] = operator.toLocaleData(locale)),
      )

      const generateFullLocalesPromise = fs.writeFile(
        `locales/${locale}/operators-data.json`,
        JSON.stringify(fullLocaleObj, null, 2),
        { encoding: "utf-8" },
      )

      const purgedLocaleObj: LocaleObject<string> = Object.entries(
        fullLocaleObj,
      ).reduce((accumulator: LocaleObject<string>, [key, value]) => {
        accumulator[key] = purgeLocaleObject(<LocaleObject>value)
        return accumulator
      }, {})

      const indexLocaleObj = Object.entries(purgedLocaleObj).reduce(
        (accumulator: LocaleObject<string>, [key, value]) => {
          accumulator[key] = { name: (<{ name: string }>value).name }
          return accumulator
        },
        {},
      )

      const generateIndexLocalePromise = fs.writeFile(
        `locales/${locale}/generated/_operators-index.json`,
        JSON.stringify(indexLocaleObj, null, 2),
        { encoding: "utf-8" },
      )

      const generateIndividualOperatorLocalePromiseList = Object.entries(
        purgedLocaleObj,
      ).map(([key, value]) => {
        return fs.writeFile(
          `locales/${locale}/generated/_${key}.json`,
          JSON.stringify({ [key]: value }, null, 2),
          { encoding: "utf-8" },
        )
      })

      return [
        generateFullLocalesPromise,
        generateIndexLocalePromise,
        ...generateIndividualOperatorLocalePromiseList,
      ]
    },
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
      fs.mkdir(`locales/${locale}`, { recursive: true }),
    ),
  )
  return Promise.all([generateOperatorFiles()]).then(() =>
    console.timeEnd("Generate data files"),
  )
}
