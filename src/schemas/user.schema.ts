import { z, TypeOf } from "zod";

export const updateUserSchema = z.object({
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

        gender: z.enum(["male", "female", "other"], {
            required_error: "Gender is required",
        }),

        profileImage: z.string({
            required_error: "Full Name is required",
        }),
    }),
});

export const updateAddressSchema = z.object({
    body: z.object({
        province: z.string({
            required_error: "Province is required",
            invalid_type_error: "Province must be a string",
        }),

        district: z.string({
            required_error: "District is required",
            invalid_type_error: "District must be a string",
        }),

        municipality: z.string({
            required_error: "Municipality name is required",
            invalid_type_error: "Municipality name must be a string",
        }),

        city: z.string({
            required_error: "City Name is required",
            invalid_type_error: "City Name must be a string",
        }),

        street: z
            .string({
                invalid_type_error: "Street Name must be a string",
            })
            .optional(),
    }),
});

export const licenseDetailsSchema = z.object({
    body: z.object({
        licenseType: z.string({
            required_error: "License type is required",
        }),

        licenseNo: z.string({
            required_error: "License number is required",
        }),

        issueDate: z.string({
            required_error: "Issue date is required",
        }),

        citizenshipNo: z.string({
            required_error: "Citizenship number is required",
        }),

        contactNo: z.number({
            required_error: "Contact number is required",
        }),
    }),
});

export const updateLicenseSchema = z.object({
    body: z.object({
        licenseType: z.string().optional(),

        licenseNo: z
            .string({
                required_error: "License number is required",
            })
            .optional(),

        issueDate: z.string().optional(),

        citizenshipNo: z.string().optional(),

        contactNo: z.number().optional(),
    }),
});

export const postCitizenshipSchema = z.object({
    body: z.object({
        citizenshipFront: z.string({
            required_error: "Citizenship front image is required",
        }),
        citizenshipBack: z.string({
            required_error: "Citizenship back image is required",
        }),
        citizenshipNo: z.string({
            required_error: "Citizenship number is required",
        }),
        issuedDistrict: z.string({
            required_error: "Issued district is required",
        }),
        issuedDate: z
            .string({
                required_error: "Issued date is required",
            })
            .datetime({
                message: "That's not a valid date!",
            }),
    }),
});

export const updateCitizenshipSchema = z.object({
    body: z.object({
        citizenshipFront: z.string().optional(),
        citizenshipBack: z.string().optional(),
        citizenshipNo: z.string().optional(),
        issuedDistrict: z.string().optional(),
        issuedDate: z
            .string()
            .datetime({
                message: "That's not a valid date!",
            })
            .optional(),
    }),
});

export type UpdateUserSchema = TypeOf<typeof updateUserSchema>["body"];
export type UpdateAddressSchema = TypeOf<typeof updateAddressSchema>["body"];
export type LicenseDetailsSchema = TypeOf<typeof licenseDetailsSchema>["body"];
export type UpdateLicenseSchema = TypeOf<typeof updateLicenseSchema>["body"];
export type PostCitizenshipSchema = TypeOf<
    typeof postCitizenshipSchema
>["body"];
export type UpdateCitizenshipSchema = TypeOf<
    typeof updateCitizenshipSchema
>["body"];
