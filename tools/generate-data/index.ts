import * as fs from "fs/promises";
import * as constants from "./constants";
import { Operator } from "./operator";
import { CharacterTable } from "./tables";

async function generateOperatorFiles() {
  let enTLOperatorLocaleData: any = {};

  try {
    enTLOperatorLocaleData = require("../../locales/en-TL/operators-data.json");
  } catch {
    console.warn(
      "No en-TL/operators-data.json (translated) found. A new file will be created."
    );
  }

  const operators = Object.entries(
    constants.OPERATOR_TABLES[constants.ORIGINAL_LOCALE]
  ).map(([key, data]) => {
    const operator = new Operator(key, data);
    Object.entries(constants.OPERATOR_TABLES).forEach(
      // @ts-ignore
      ([locale, table]: [
        typeof constants.GAME_LOCALES[number],
        CharacterTable
      ]) => {
        if (locale === constants.ORIGINAL_LOCALE) return;
        if (table[key]) operator.addLocale(locale, table[key]);
      }
    );
    if (enTLOperatorLocaleData[key])
      operator.addLocale("en-TL", enTLOperatorLocaleData[key]);
    return operator;
  });
  const actualOperators = operators.filter(
    (operator) => operator.isActualOperator
  );
  const indexFileObject = actualOperators.map((operator) =>
    operator.toIndexData()
  );

  await fs.mkdir("data/operators", { recursive: true });

  return Promise.all([
    ...actualOperators.map((operator) =>
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
      const localeFileData: any = {};
      actualOperators.forEach(
        (operator) =>
          (localeFileData[operator.key] = operator.toLocaleFileData(locale))
      );
      return fs.writeFile(
        `locales/${locale}/operators-data.json`,
        JSON.stringify(localeFileData, null, 2),
        { encoding: "utf-8" }
      );
    }),
  ]);
}

async function generateLocaleFiles() {}

export async function generateDataFiles() {
  await Promise.all(
    constants.OUTPUT_LOCALES.map((locale) =>
      fs.mkdir(`locales/${locale}`, { recursive: true })
    )
  );
  return Promise.all([generateOperatorFiles(), generateLocaleFiles()]);
}
