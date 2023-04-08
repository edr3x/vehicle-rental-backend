import { z, TypeOf } from "zod";

export const sendOTPSchema = z.object({
    params: z.object({
        phone: z.string().refine((value) => value.toString().length === 10, {
            message: "Phone Number must be 10 digits",
        }),
    }),
});

export const verifyOTPSchema = z.object({
    params: z.object({
        phone: z.string().refine((value) => value.toString().length === 10, {
            message: "Phone Number must be 10 digits",
        }),

        code: z.string(),
    }),
});

export const createUserSchema = z.object({
    body: z.object({
        fullName: z.string({
            required_error: "Full Name is required",
        }),

        email: z.string({
            required_error: "Email is required",
            invalid_type_error: "Author name must be a string",
        }),

        gender: z.enum(["male", "female", "other"]),

        phone: z.number({
            required_error: "Phone Number is required",
            invalid_type_error: "Phone Number must be a number",
        }),
    }),
});

export type SendOTPSchema = TypeOf<typeof sendOTPSchema>["params"];
export type VerifyOTPSchema = TypeOf<typeof verifyOTPSchema>["params"];
export type CreateUserSchema = TypeOf<typeof createUserSchema>["body"];
