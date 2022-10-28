import * as fs from "fs/promises";
import { ZH_CN_CHARACTER_TABLE } from "./constants";
import { Character } from "./character";

async function generateCharacterFiles() {
  const characters = Object.entries(ZH_CN_CHARACTER_TABLE).map(
    ([key, data]) => new Character(key, data)
  );

  const indexFileObject = characters.map(({ key }) => key);
  await fs.mkdir("data/characters", { recursive: true });
  return Promise.all([
    ...characters.map((character) =>
      fs.writeFile(
        `data/characters/${character.key}.json`,
        JSON.stringify(character.toData(), null, 2),
        { encoding: "utf-8" }
      )
    ),
    fs.writeFile(
      "data/characters/index.json",
      JSON.stringify(indexFileObject, null, 2),
      { encoding: "utf-8" }
    ),
  ]);
}

export async function generateDataFiles() {
  return Promise.all([generateCharacterFiles()]);
}
