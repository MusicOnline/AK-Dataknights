import type { GeneratedOperatorIndexData } from "~/tools/generate-data/operator"

export default async function (): Promise<GeneratedOperatorIndexData[]> {
  const data = <GeneratedOperatorIndexData[]>(await import("../data/operators/index.json")).default

  // Sort by rarity
  return [...data].sort((a, b) => {
    const rarityComparison = b.rarity - a.rarity
    if (rarityComparison) return rarityComparison
    return data.indexOf(a) - data.indexOf(b)
  })
}
