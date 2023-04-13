import { z, TypeOf } from "zod";

export const licenseDetailsSchema = z.object({
    body: z.object({
        licenseType: z.string(),

        licenseNo: z.string({
            required_error: "License number is required",
        }),

        issueDate: z.string(),

        citizenshipNo: z.string(),

        contactNo: z.string(),
    }),
});

export type LicenseDetailsSchema = TypeOf<typeof licenseDetailsSchema>["body"];
