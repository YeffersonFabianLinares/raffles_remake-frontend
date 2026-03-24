import z from 'zod';

export const awardSchema = z.object({
    id: z.number().optional(),
    award: z.string().min(1, 'El nombre del premio es requerido'),
    date: z.string().optional(),
    type_award: z.string().optional(),
    image: z.string().optional(),
});

export const raffleSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    value_ticket: z.union([z.string(), z.number()]),
    start_number: z.union([z.string(), z.number()]),
    final_number: z.union([z.string(), z.number()]),
    raffle_date: z.string().optional(),
    description: z.string().optional(),
    paymentall: z.union([z.string(), z.number()]).optional(),
    paymentfirst: z.union([z.string(), z.number()]).optional(),
    paymentticket: z.union([z.string(), z.number()]).optional(),
    logo: z.string().optional(),
    format_ticket: z.string().optional(),
    awards: z.array(awardSchema).optional(),
});

export const raffle = raffleSchema.extend({
    id: z.number(),
    created_at: z.string().optional(),
    awards: z.array(awardSchema.extend({ id: z.number() })).optional(),
});

export type Raffle = z.infer<typeof raffle>;
export type RaffleSchema = z.infer<typeof raffleSchema>;
export type Award = z.infer<typeof awardSchema>;
