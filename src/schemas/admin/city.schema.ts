import z from 'zod'

export const city = z.object({
    id: z.number(),
    name: z.string(),
    codigo: z.string(),
    state: z.number(),
    created_at: z.string(),
})

export type City = z.infer<typeof city>