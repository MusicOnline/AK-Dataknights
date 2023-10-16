import * as z from "zod"

export const CharacterMetaTableSchema = z.object({
  spCharGroups: z.record(z.array(z.string())),
})
export type CharacterMetaTable = z.infer<typeof CharacterMetaTableSchema>
