import type { GeneratedOperatorData } from "~/tools/generate-data/operator";

export default async function (key: string): Promise<GeneratedOperatorData> {
  return (await import(`../data/operators/${key}.json`)).default;
}
