import { z } from 'zod'

export const MessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  isUserMessage: z.boolean(),
})

// array validator
// we will pass some array of meassages to the backEnd  

export const MessageArraySchema = z.array(MessageSchema)

export type Message = z.infer<typeof MessageSchema>
