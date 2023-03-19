import data from "~/data/operators/index.json"
import type { GeneratedOperatorIndexData } from "~/tools/generate-data/operator"

export default function (): GeneratedOperatorIndexData[] {
  // Sort by rarity
  return <GeneratedOperatorIndexData[]>[...data].sort((a, b) => {
    const rarityComparison = b.rarity - a.rarity
    if (rarityComparison) return rarityComparison
    return data.indexOf(a) - data.indexOf(b)
  })
}
