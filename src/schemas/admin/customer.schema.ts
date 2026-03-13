import z from 'zod';
import { city } from './city.schema';

export const customerSchema = z.object({
    name: z.string(),
    document: z.string(),
    phone: z.string(),
    city_id: z.object({
        label: z.string(),
        value: z.number()
    }).or(z.string()),
    country_code: z.string(),
});

export const customer = customerSchema.extend({
    id: z.number(),
    created_at: z.string(),
    city: city
})

export type Customer = z.infer<typeof customer>;
export type CustomerSchema = z.infer<typeof customerSchema>;