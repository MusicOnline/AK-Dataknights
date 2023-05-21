import * as z from "zod"

export const BlackboardSchema = z.object({
  key: z.string(),
  value: z.number(),
  valueStr: z.string().nullish(), // CN 2.0 vs EJK
})
export type Blackboard = z.infer<typeof BlackboardSchema>
