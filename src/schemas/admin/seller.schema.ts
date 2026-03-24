import z from 'zod';

export const sellerSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    document_number: z.string().min(1, 'El documento es requerido'),
    country_code: z.string().min(1, 'El código de país es requerido'),
    phone: z.string().min(1, 'El teléfono es requerido'),
    email: z.string().email('Email inválido'),
    password: z.string().optional(),
    is_superuser: z.boolean().optional(),
});

export const seller = sellerSchema.extend({
    id: z.number(),
    state: z.number().optional(),
    created_at: z.string(),
    user: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        is_superuser: z.boolean().optional(),
    }).optional(),
});

export type Seller = z.infer<typeof seller>;
export type SellerSchema = z.infer<typeof sellerSchema>;
