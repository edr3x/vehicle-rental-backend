import { z, TypeOf } from "zod";

export const sendOTPSchema = z.object({
    body: z.object({
        phone: z
            .number({
                required_error: "Phone Number is required",
                invalid_type_error: "Phone Number must be a number",
            })
            .refine((value) => value.toString().length === 10, {
                message: "Phone Number must be 10 digits",
            }),
    }),
});

export const verifyOTPSchema = z.object({
    body: z.object({
        phone: z
            .number({
                required_error: "Phone Number is required",
                invalid_type_error: "Phone Number must be a number",
            })
            .refine((value) => value.toString().length === 10, {
                message: "Phone Number must be 10 digits",
            }),
        code: z
            .number({
                required_error: "Code is required",
                invalid_type_error: "Code must be a number",
            })
            .refine((value) => value.toString().length === 6, {
                message: "Code must be 6 digits",
            }),
    }),
});

export const createUserSchema = z.object({
    body: z.object({
        fullName: z.string({
            required_error: "Full Name is required",
        }),

        email: z
            .string({
                required_error: "Email is required",
                invalid_type_error: "Email must be a string",
            })
            .email("Not a valid email"),

        gender: z.enum(["male", "female", "other"]),
    }),
});

export type SendOTPSchema = TypeOf<typeof sendOTPSchema>["body"];
export type VerifyOTPSchema = TypeOf<typeof verifyOTPSchema>["body"];
export type CreateUserSchema = TypeOf<typeof createUserSchema>["body"];
