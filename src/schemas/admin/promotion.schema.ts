import z from 'zod';

export const promotionSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    number_of_tickets: z.union([z.string(), z.number()]),
    new_value: z.union([z.string(), z.number()]),
    raffle_id: z.union([z.number(), z.string()]),
    expiration_date: z.string().optional(),
    state: z.union([z.number(), z.string()]).optional(),
});

export const promotion = promotionSchema.extend({
    id: z.number(),
    created_at: z.string().optional(),
});

export type Promotion = z.infer<typeof promotion>;
export type PromotionSchema = z.infer<typeof promotionSchema>;
