import { z, ZodType } from "zod";



export class AddressValidation {
    static readonly CREATE : ZodType = z.object({
        contactId : z.number().positive(),
        street : z.string().min(1, "street must be more than 1 character").max(100).optional(),
        city : z.string().min(1, "city must be more than 1 character").max(100).optional(),
        province : z.string().min(1, "province must be more than 1 character").max(100).optional(),
        country : z.string().min(1, "country must be more than 1").max(100),
        postal_code : z.string().min(1, "Postal Code is required").max(5)
    })


    static readonly GET : ZodType = z.object({
        contactId : z.number().positive(),
        id : z.number().positive(),
    })

    static readonly UPDATE : ZodType = z.object({
        id: z.number().positive(),
        contactId : z.number().positive(),
        street : z.string().min(1, "street must be more than 1 character").max(100).optional(),
        city : z.string().min(1, "city must be more than 1 character").max(100).optional(),
        province : z.string().min(1, "province must be more than 1 character").max(100).optional(),
        country : z.string().min(1, "country must be more than 1").max(100),
        postal_code : z.string().min(1, "Postal Code is required").max(5)
    })
}