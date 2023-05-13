import { z, TypeOf } from "zod";

export const bookingSchema = z.object({
    body: z.object({
        vehicleId: z.string({
            required_error: "Please select a vehicle",
        }),
        startDate: z
            .string({
                required_error: "Please select a date and time",
            })
            .datetime({
                message: "That's not a valid date!",
            }),
        endDate: z
            .string({
                required_error: "Please select a date and time",
            })
            .datetime({
                message: "That's not a valid date!",
            }),
    }),
});

export type BookingSchema = TypeOf<typeof bookingSchema>["body"];
