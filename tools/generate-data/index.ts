import * as fs from "fs/promises";
import {
  LOCALES,
  ZH_CN_CHARACTER_TABLE,
  EN_US_CHARACTER_TABLE,
  JA_JP_CHARACTER_TABLE,
  KO_KR_CHARACTER_TABLE,
  ZH_TW_CHARACTER_TABLE,
} from "./constants";
import { Operator } from "./operator";

async function generateOperatorFiles() {
  const foreignLocales = {
    "en-US": EN_US_CHARACTER_TABLE,
    "ja-JP": JA_JP_CHARACTER_TABLE,
    "ko-KR": KO_KR_CHARACTER_TABLE,
    "zh-TW": ZH_TW_CHARACTER_TABLE,
  };

  let enTLOperatorLocaleData;

  try {
    enTLOperatorLocaleData = require("../../locales/en-TL/operators-data.json");
  } catch {
    console.warn(
      "No en-TL/operators-data.json (translated) found. A new file will be created."
    );
    enTLOperatorLocaleData = {};
  }

  const operators = Object.entries(ZH_CN_CHARACTER_TABLE).map(([key, data]) => {
    const operator = new Operator(key, data);
    Object.entries(foreignLocales).forEach(([locale, table]) => {
      if (table[key]) operator.addLocale(locale, table[key]);
    });
    if (enTLOperatorLocaleData[key])
      operator.addLocale("en-TL", enTLOperatorLocaleData[key]);
    return operator;
  });

  const indexFileObject = operators.map(({ key }) => key);
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
    ...LOCALES.map((locale) => {
      const localeFileData = {};
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

export async function generateDataFiles() {
  await Promise.all(
    LOCALES.map((locale) => fs.mkdir(`locales/${locale}`, { recursive: true }))
  );
  return Promise.all([generateOperatorFiles()]);
}
