import z from 'zod';

export const sellerSchema = z.object({
    name: z.string(),
    document_number: z.string(),
    country_code: z.string(),
    phone: z.string(),
});

export const seller = sellerSchema.extend({
    id: z.number(),
    created_at: z.string(),
})

export type Seller = z.infer<typeof seller>;
export type SellerSchema = z.infer<typeof sellerSchema>;