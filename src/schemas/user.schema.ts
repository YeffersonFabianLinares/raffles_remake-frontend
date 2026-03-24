import z from 'zod';

export const user = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    is_superuser: z.boolean().optional(),
});

export type User = z.infer<typeof user>;
