import { z, TypeOf } from "zod";

export const addSubCategorySchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "Title is required",
            invalid_type_error: "Title must be a string",
        }),

        description: z.string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        }),

        logo: z
            .string({
                invalid_type_error: "Invalid Image",
            })
            .optional(),

        category: z.enum(["car", "bike", "bicycle"]),
    }),
});

export const updateSubCategorySchema = z.object({
    params: z.object({
        subCategoryId: z.string({
            required_error: "Category Id must be provided",
            invalid_type_error: "Category Id must be provided",
        }),
    }),

    body: z.object({
        title: z
            .string({
                invalid_type_error: "Title must be a string",
            })
            .optional(),

        description: z
            .string({
                invalid_type_error: "Description must be a string",
            })
            .optional(),

        logo: z
            .string({
                invalid_type_error: "Invalid Image",
            })
            .optional(),

        category: z.enum(["car", "bike", "bicycle"]).optional(),
    }),
});

export const addBrandSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "Title is required",
            invalid_type_error: "Title must be a string",
        }),

        description: z.string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        }),

        logo: z
            .string({
                invalid_type_error: "Invalid Image",
            })
            .optional(),
    }),
});

export const updateBrandSchema = z.object({
    params: z.object({
        brandId: z.string({
            required_error: "Brand must be provided",
            invalid_type_error: "Brand must be provided",
        }),
    }),
    body: z.object({
        title: z
            .string({
                required_error: "Title is required",
                invalid_type_error: "Title must be a string",
            })
            .optional(),

        description: z
            .string({
                required_error: "Description is required",
                invalid_type_error: "Description must be a string",
            })
            .optional(),

        logo: z
            .string({
                invalid_type_error: "Invalid Image",
            })
            .optional(),
    }),
});

export const vehicleFeatureSchema = z.object({
    color: z.string({
        required_error: "Vehicle Color is required",
        invalid_type_error: "Color must be a string",
    }),

    noOfSeats: z.number({
        required_error: "No. of seats is required",
        invalid_type_error: "No. of seats must be number",
    }),

    noOfDoors: z.number({
        required_error: "No. of doors is required",
        invalid_type_error: "No. of doors must be number",
    }),

    hasAC: z.boolean().optional(),
    hasABS: z.boolean().optional(),
    hasAirbag: z.boolean().optional(),
    hasSunRoof: z.boolean().optional(),
    hasPowerSteering: z.boolean().optional(),
    hasUSBPort: z.boolean().optional(),
    hasBluetooth: z.boolean().optional(),
    hasKeyLessEntry: z.boolean().optional(),
    hasHeatedSeats: z.boolean().optional(),
    hasBackCamera: z.boolean().optional(),
    hasParkingSensors: z.boolean().optional(),
    hasAutoDrive: z.boolean().optional(),
    transmission: z.enum(["automatic", "manual"]),
    gClearance: z.number().optional(),
    fuelTank: z.number().optional(),
});

export const addVehicleSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "title is required",
            invalid_type_error: "title must be a string",
        }),

        type: z.enum(["electric", "petrol", "diesel"]),

        category: z.enum(["car", "bike", "bicycle"]),

        subCategoryId: z.string({
            required_error: "subCategoryId is required",
            invalid_type_error: "subCategoryId must be a string",
        }),

        brandId: z.string({
            required_error: "brandId is required",
            invalid_type_error: "brandId must be a string",
        }),

        model: z.string({
            required_error: "Vehicle Model is required",
            invalid_type_error: "vehicle model must be a string",
        }),

        thumbnail: z.string({
            required_error: "thumbnail is required",
            invalid_type_error: "thumbnail must be a string",
        }),

        images: z
            .string({
                required_error: "Images is required",
                invalid_type_error: "Image is invalid",
            })
            .array()
            .optional(),

        bluebookPics: z
            .string({
                required_error: "Bluebook Images is required",
                invalid_type_error: "Bluebook Image is invalid",
            })
            .array()
            .optional(),

        vehicleNumber: z.string({
            required_error: "Vehicle Number is required",
            invalid_type_error: "Vehicle Number must be a string",
        }),

        description: z.string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        }),

        rentGuidelines: z.string({
            required_error: "Guidelines is required",
            invalid_type_error: "Guidelines must be a string",
        }),

        rate: z.string({
            required_error: "Rate is required",
            invalid_type_error: "Rate must be a /hr or /day",
        }),

        pickupAddress: z
            .string({
                required_error: "Pickup Address is required",
                invalid_type_error: "Pickup Address must be a string",
            })
            .array()
            .length(2),

        driveTrain: z.enum([
            "frontWheel",
            "rearWheel",
            "fourWheel",
            "allWheel",
        ]),

        insurancePaperPhoto: z
            .string({
                required_error: "Insurance Photo is required",
                invalid_type_error: "Insurance Photo is invalid",
            })
            .optional(),

        features: vehicleFeatureSchema,
    }),
});

export const findNearSchema = z.object({
    body: z.object({
        lat: z.string({
            required_error: "Latitude is required",
            invalid_type_error: "Latitude must be a string",
        }),
        lon: z.string({
            required_error: "Longitude is required",
            invalid_type_error: "Longitude must be a string",
        }),
        category: z.enum(["all", "car", "bike", "bicycle"]),
    }),
});

export type AddVehicleSchema = TypeOf<typeof addVehicleSchema>["body"];
export type AddSubCategorySchema = TypeOf<typeof addSubCategorySchema>["body"];
export type UpdateSubCategorySchema = TypeOf<typeof updateSubCategorySchema>;
export type AddBrandSchema = TypeOf<typeof addBrandSchema>["body"];
export type UpdateBrandSchema = TypeOf<typeof updateBrandSchema>;
export type FindVehicleNearMeSchema = TypeOf<typeof findNearSchema>["body"];
