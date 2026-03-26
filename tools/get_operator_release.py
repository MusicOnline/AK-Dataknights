import json
import os
import re
import unicodedata
from pathlib import Path

import pandas as pd

TABLE_URL = "https://prts.wiki/w/%E5%B9%B2%E5%91%98%E4%B8%8A%E7%BA%BF%E6%97%B6%E9%97%B4%E4%B8%80%E8%A7%88"

# Mirrors tools/generate-data/constants.ts
FALSE_POSITIVE_ACTUAL_OPERATORS = frozenset({"char_512_aprot"})
NON_OPERATOR_PROFESSIONS = frozenset({"TRAP", "TOKEN"})

NAME_TO_KEY_OVERRIDE = {
    "阿米娅": "amiya",
    "阿米娅(近卫)": "amiya-guard",
    "阿米娅(医疗)": "amiya-medic",
    # Wiki lists the summon separately; release aligns with Kal'tsit in site data.
    "Mon3tr": "kaltsit",
}


def _repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def _strip_combining_marks(s: str) -> str:
    return "".join(
        c
        for c in unicodedata.normalize("NFD", s)
        if unicodedata.category(c) != "Mn"
    )


def _slug_from_appellation(appellation: str, char_id: str) -> str:
    """Match Operator.slugFromUnnormalizedKey in tools/generate-data/operator/index.ts."""
    s = _strip_combining_marks(appellation.strip()).lower()
    for old, new in [(r"[.'()]", ""), (r"/", "-")]:
        s = re.sub(old, new, s)
    s = re.sub(r"[-\s]+", "-", s)
    s = re.sub(r"[^a-z0-9-]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    if not s:
        s = re.sub(r"^char_", "", char_id).replace("_", "-")
    return s


def _natural_key(char_id: str, appellation: str, overrides: dict[str, str]) -> str:
    if char_id in overrides:
        return overrides[char_id]
    return _slug_from_appellation(appellation, char_id)


def _cn_character_table_paths(root: Path) -> tuple[Path, Path] | None:
    """Resolve CN character_table.json and char_patch_table.json (unified or legacy Kengxxiao)."""
    candidates: list[Path] = []
    env_root = os.environ.get("GAME_DATA_ROOT_PATH")
    if env_root:
        base = Path(env_root)
        candidates.append(base / "cn" / "gamedata" / "excel" / "character_table.json")
    candidates.append(
        root / "ArknightsGamedata" / "cn" / "gamedata" / "excel" / "character_table.json"
    )
    candidates.append(
        root
        / "ArknightsGameData"
        / "zh_CN"
        / "gamedata"
        / "excel"
        / "character_table.json"
    )
    for char_path in candidates:
        patch_path = char_path.parent / "char_patch_table.json"
        if char_path.is_file() and patch_path.is_file():
            return char_path, patch_path
    return None


def _build_name_to_key_from_game_data(root: Path) -> dict[str, str]:
    """Map zh-CN display name -> site operator key (same rules as generate-data)."""
    paths = _cn_character_table_paths(root)
    if not paths:
        return {}
    char_path, patch_path = paths

    with char_path.open(encoding="utf-8") as f:
        character_table = json.load(f)
    with patch_path.open(encoding="utf-8") as f:
        patch_table = json.load(f)

    with (root / "data" / "custom" / "operator-key-override.json").open(
        encoding="utf-8"
    ) as f:
        key_overrides: dict[str, str] = json.load(f)

    name_to_key: dict[str, str] = {}

    def consider(char_id: str, entry: dict) -> None:
        if entry.get("profession") in NON_OPERATOR_PROFESSIONS:
            return
        if char_id in FALSE_POSITIVE_ACTUAL_OPERATORS:
            return
        name = entry.get("name")
        appellation = entry.get("appellation")
        if not name or not appellation:
            return
        key = _natural_key(char_id, appellation, key_overrides)
        if name not in name_to_key:
            name_to_key[name] = key

    for cid, data in character_table.items():
        if isinstance(data, dict):
            consider(cid, data)

    for cid, data in patch_table.get("patchChars", {}).items():
        if isinstance(data, dict):
            consider(cid, data)

    return name_to_key


def _strip_wiki_suffix(display_name: str) -> str:
    """e.g. 暮落(集成战略) -> 暮落"""
    return re.sub(r"[（(][^）)]*[）)]\s*$", "", display_name).strip()


def main() -> None:
    root = _repo_root()

    df = pd.read_html(TABLE_URL, header=0)[0]
    df.columns = [
        "operator",
        "rarity",
        "cnReleaseTime",
        "cnReleaseMethod",
        "mainAcquisitionMethod",
        "operatorPreview",
    ]
    df["cnReleaseTime"] = pd.to_datetime(
        df["cnReleaseTime"], format="%Y年%m月%d日 %H:%M"
    )
    df.drop(
        columns=[
            "rarity",
            "cnReleaseMethod",
            "mainAcquisitionMethod",
            "operatorPreview",
        ],
        inplace=True,
    )

    operators_path = root / "locales" / "zh-CN" / "operators-data.json"
    with operators_path.open(encoding="utf-8") as f:
        data = json.load(f)
    name_to_key = {record["name"]: key for key, record in data.items()}
    for cn_name, key in _build_name_to_key_from_game_data(root).items():
        if cn_name not in name_to_key:
            name_to_key[cn_name] = key
    name_to_key.update(NAME_TO_KEY_OVERRIDE)

    missing: list[str] = []

    def replace_cn_name_with_key(name: str) -> str | None:
        key = name_to_key.get(name)
        if key is None:
            stripped = _strip_wiki_suffix(name)
            if stripped != name:
                key = name_to_key.get(stripped)
        if key is None:
            missing.append(name)
        return key

    df["operator"] = df["operator"].apply(replace_cn_name_with_key)
    df.dropna(subset=["operator"], inplace=True)
    df = df.groupby("operator", as_index=True)["cnReleaseTime"].min().to_frame()

    out_path = root / "data" / "custom" / "operator-release.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # Keep cnReleaseTime as epoch milliseconds (OperatorReleaseData in tables.ts).
    from_wiki = {
        op: {"cnReleaseTime": int(pd.Timestamp(ts).value // 1_000_000)}
        for op, ts in df["cnReleaseTime"].items()
        if pd.notna(ts)
    }
    prior: dict[str, dict[str, int]] = {}
    if out_path.is_file():
        with out_path.open(encoding="utf-8") as f:
            prior = json.load(f)
    merged = {**prior, **from_wiki}
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
        f.write("\n")

    for name in missing:
        print(
            f"Key not found (locales/zh-CN/operators-data.json or game data) "
            f"for operator {name}"
        )


if __name__ == "__main__":
    main()
