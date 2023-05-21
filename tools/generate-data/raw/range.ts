import * as z from "zod"

export const GridSchema = z.object({
  row: z.number().int(),
  col: z.number().int(),
})
export type Grid = z.infer<typeof GridSchema>

export const RangeSchema = z.object({
  id: z.string(),
  // direction: z.number(),
  grids: z.array(GridSchema),
})
export type Range = z.infer<typeof RangeSchema>

export const RangeTableSchema = z.record(RangeSchema)
export type RangeTable = z.infer<typeof RangeTableSchema>
