import * as fs from "fs/promises";
import { ZH_CN_CHARACTER_TABLE } from "./constants";
import { Operator } from "./operator";

async function generateOperatorFiles() {
  const operators = Object.entries(ZH_CN_CHARACTER_TABLE).map(
    ([key, data]) => new Operator(key, data)
  );

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
  ]);
}

export async function generateDataFiles() {
  return Promise.all([generateOperatorFiles()]);
}
