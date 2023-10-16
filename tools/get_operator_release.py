import json

import pandas as pd

TABLE_URL = "https://prts.wiki/w/%E5%B9%B2%E5%91%98%E4%B8%8A%E7%BA%BF%E6%97%B6%E9%97%B4%E4%B8%80%E8%A7%88"
NAME_TO_KEY_OVERRIDE = {
    "阿米娅": "amiya",
    "阿米娅(近卫)": "amiya-guard"
}

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

with open("locales/zh-CN/operators-data.json", encoding="utf-8") as f:
    data = json.load(f)
name_to_key = {record["name"]: key for key, record in data.items()}

name_to_key.update(NAME_TO_KEY_OVERRIDE)

def replace_cn_name_with_key(name: str) -> str | None:
    key = name_to_key.get(name, None)
    if key is None:
        print(f"Key not found in zh-CN/operators-data.json for operator {name}")
    return key

df["operator"] = df["operator"].apply(replace_cn_name_with_key)
df.dropna(subset=["operator"], inplace=True)
df.set_index("operator", inplace=True)

json_str = df.to_json(orient="index")
json_obj = json.loads(json_str)
with open("data/custom/operator-release.json", "w", encoding="utf-8") as f:
    json.dump(json_obj, f, ensure_ascii=False, indent=2)
