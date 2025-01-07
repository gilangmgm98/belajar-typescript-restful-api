import { z, ZodType } from "zod";

export class UserValidation {

    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(1, "username must not blank").max(100),
        password: z.string().min(1).max(100),
        name: z.string().min(1).max(100),
    })

    static readonly LOGIN: ZodType = z.object({
        username: z.string().min(1, "username must not blank").max(100),
        password: z.string().min(1).max(100),
    })

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(3, "name must more than 3 character").max(100).optional(),
        password: z.string().min(5, "password must more than 5 Character ").max(100).optional(),
    })

}