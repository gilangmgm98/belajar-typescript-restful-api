import { z, ZodType } from "zod";

export class ContactValidation {

    static readonly CREATE: ZodType = z.object({
        first_name: z.string().min(1, "first_name must not be empty").max(100),
        last_name: z.string().min(1).max(100).optional(),
        email: z.string().email().optional(),
        phone: z.string().min(8).max(14).optional(),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        first_name: z.string().min(1, "first_name must not be empty").max(100).optional(),
        last_name: z.string().min(1).max(100).optional(),
        email: z.string().email().optional(),
        phone: z.string().min(8).max(14).optional(),
    })

    static readonly SEARCH: ZodType = z.object({
        name: z.string().optional(),
        // email: z.string().email().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        page: z.number().min(1).positive(),
        size: z.number().min(1).max(100).positive()

    })
}