import path from "path";
import * as fs from "fs/promises";
import * as constants from "./constants";
import { Operator } from "./operator";

async function generateOperatorFiles() {
  const originalOperatorTable: { [x: string]: any } = require(path.join(
    process.env.GAME_DATA_ROOT_PATH!,
    "zh_CN",
    constants.OPERATOR_TABLE_RELATIVE_PATH
  ));

  const foreginOperatorTables: { [x: string]: any } = [
    "en-US",
    "ja-JP",
    "ko-KR",
    "zh-TW",
  ].reduce((accumulator: any, locale) => {
    accumulator[locale] = require(path.join(
      process.env.GAME_DATA_ROOT_PATH!,
      locale.replace("-", "_"),
      constants.OPERATOR_TABLE_RELATIVE_PATH
    ));
    return accumulator;
  }, {});

  let enTLOperatorLocaleData: any = {};

  try {
    enTLOperatorLocaleData = require("../../locales/en-TL/operators-data.json");
  } catch {
    console.warn(
      "No en-TL/operators-data.json (translated) found. A new file will be created."
    );
  }

  const operators = Object.entries(originalOperatorTable).map(([key, data]) => {
    const operator = new Operator(key, data);
    Object.entries(foreginOperatorTables).forEach(([locale, table]) => {
      if (table[key]) operator.addLocale(locale, table[key]);
    });
    if (enTLOperatorLocaleData[key])
      operator.addLocale("en-TL", enTLOperatorLocaleData[key]);
    return operator;
  });

  const indexFileObject = operators.flatMap((operator) => {
    if (!operator.isActualOperator) return [];
    return operator.toIndexData();
  });
  await fs.mkdir("data/operators", { recursive: true });

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
    ...constants.LOCALES.map((locale) => {
      const localeFileData: any = {};
      operators.forEach(
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
    constants.LOCALES.map((locale) =>
      fs.mkdir(`locales/${locale}`, { recursive: true })
    )
  );
  return Promise.all([generateOperatorFiles(), generateLocaleFiles()]);
}
