import { fetchUsedCharacterArts } from "./fetch-used-character-arts"

/** Called from nuxt.config build:before after operator JSON exists. */
export async function bundleArkdataImages(): Promise<void> {
  if (process.env.SKIP_BUNDLE_ARKDATA === "1") {
    console.log("[arkdata images] SKIP_BUNDLE_ARKDATA=1, skipping fetch")
    return
  }
  await fetchUsedCharacterArts({
    skipExisting: process.env.FORCE_REFETCH_ARKDATA !== "1",
  })
}
