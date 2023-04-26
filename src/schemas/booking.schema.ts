import { z, TypeOf } from "zod";

export const bookingSchema = z.object({
    body: z.object({
        vehicleId: z.string({
            required_error: "Please select a vehicle",
        }),
        startDate: z.date({
            required_error: "Please select a date and time",
            invalid_type_error: "That's not a date!",
        }),
        endDate: z.date({
            required_error: "Please select a date and time",
            invalid_type_error: "That's not a date!",
        }),
    }),
});

export type BookingSchema = TypeOf<typeof bookingSchema>["body"];
