// gamedata_const.json
export const RICH_TEXT_TAG_TO_ENGLISH = {
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
  protect: "shelter", // Abjurer common talent
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
};

export const ENGLISH_CLASS_TO_RICH_TEXT_REGEX = Object.entries(
  RICH_TEXT_TAG_TO_ENGLISH
).reduce(
  (accumulator: { [key: string]: RegExp }, [richTextTag, englishClass]) => {
    accumulator[englishClass] = new RegExp(
      `<[@$]ba.${richTextTag.replace(/\./g, "\\.")}>(.+?)</>`,
      "g"
    );
    return accumulator;
  },
  {}
);

export interface ConvertRichTextOptions {
  html: boolean;
}

export function convertRichText(
  richText: string,
  options: ConvertRichTextOptions = { html: true }
): string {
  let transformedString = richText.replace(/\\n/g, "\n");
  if (options.html) {
    transformedString = transformedString.replace(/\n/g, "<br/>");
    Object.entries(ENGLISH_CLASS_TO_RICH_TEXT_REGEX).forEach(
      ([targetClass, regex]) =>
        (transformedString = transformedString.replace(
          regex,
          `<span class="ba-markup ba-${targetClass}">$1</span>`
        ))
    );
  } else {
    Object.values(ENGLISH_CLASS_TO_RICH_TEXT_REGEX).forEach(
      (regex) => (transformedString = transformedString.replace(regex, "$1"))
    );
  }
  return transformedString;
}
