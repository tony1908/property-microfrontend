import { z } from 'zod';

export const PropertySchema = z.object({
    id: z.number().int().positive({
        message: "El ID debe ser positivo"
    }),
    image: z.string().min(10, {
        message: "La imagen debe ser al menos de 10 caracteres"
    }).max(100, {
        message: "La imagen no debe ser mayor a 10 carcaters"
    }),
    title: z.string().min(1, {
        message: "Property title is required"
    }).max(100, {
       message: "Property title must be less than 100 characters"
    }),
    type: z.string().min(1, {
        message: "Property type is required"
    }),
    location: z.string().min(1, {
        message: "Property type is required"
    }),
    details: z.string().min(1, {
        message: "Property type is required"
    }),
    host: z.string().min(1, {
        message: "Property type is required"
    }),
    price: z.number().int().positive({
        message: "El ID debe ser positivo"
    }),
    rating: z.number().int().positive({
        message: "El ID debe ser positivo"
    }),
})


export type Property = z.infer<typeof PropertySchema>