import * as z from 'zod';

export const stateSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().min(1, 'La descripción es requerida'),
    active: z.boolean().default(true),
});

export type StateFormValues = z.infer<typeof stateSchema>; 