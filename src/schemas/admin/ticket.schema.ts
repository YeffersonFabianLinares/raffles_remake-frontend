import z from 'zod';

export const paymentSchema = z.object({
    payment_method: z.string().min(1, 'El método de pago es requerido'),
    reference: z.string().optional(),
    amount: z.union([z.string(), z.number()]),
    expiration_date: z.string().optional(),
});

export const ticketSchema = z.object({
    number: z.array(z.string()).min(1, 'El número de boleta es requerido'),
    customer: z.union([z.number(), z.string()]),
    raffle: z.union([z.number(), z.string()]),
    value: z.union([z.string(), z.number()]),
    value_to_pay: z.union([z.string(), z.number()]),
    seller: z.union([z.number(), z.string()]).optional().nullable(),
    promotion_id: z.union([z.number(), z.string()]).optional().nullable(),
    origin: z.string().optional(),
    payments: z.array(paymentSchema).optional(),
});

export const ticket = z.object({
    id: z.number(),
    number: z.string(),
    value: z.union([z.string(), z.number()]),
    value_to_pay: z.union([z.string(), z.number()]),
    status: z.string(),
    state: z.number(),
    origin: z.string().optional().nullable(),
    created_at: z.string(),
    customer: z.object({
        id: z.number(),
        name: z.string(),
        phone: z.string().optional(),
        country_code: z.string().optional(),
        document: z.string().optional(),
        city: z.object({ name: z.string() }).optional(),
    }).optional(),
    seller: z.object({
        id: z.number(),
        name: z.string(),
        user: z.object({ email: z.string() }).optional(),
    }).optional().nullable(),
    raffle: z.object({
        id: z.number(),
        name: z.string(),
    }).optional(),
    payments: z.array(z.object({
        id: z.number(),
        payment_method: z.string(),
        reference: z.string().optional().nullable(),
        amount: z.union([z.string(), z.number()]),
        expiration_date: z.string().optional().nullable(),
    })).optional(),
});

export type Ticket = z.infer<typeof ticket>;
export type TicketSchema = z.infer<typeof ticketSchema>;
export type Payment = z.infer<typeof paymentSchema>;
