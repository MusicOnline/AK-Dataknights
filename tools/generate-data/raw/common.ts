import * as z from "zod"

export const BlackboardSchema = z.object({
  key: z.string(),
  value: z.number(),
  valueStr: z.string().nullish(),
})
export type Blackboard = z.infer<typeof BlackboardSchema>
