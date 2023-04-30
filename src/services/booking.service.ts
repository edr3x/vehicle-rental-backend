import { BookingSchema } from "../schemas/booking.schema";
import { CustomError } from "../utils/custom_error";
import { prisma } from "../utils/db";

export async function bookingService(
    localUser: any,
    bookingDetails: BookingSchema,
) {
    const vehicleDetails = await prisma.vehicle.findUnique({
        where: {
            id: bookingDetails.vehicleId,
        },
    });

    if (!vehicleDetails) {
        throw new CustomError(400, "Vehicle Not Found");
    }

    if (vehicleDetails.isBooked) {
        throw new CustomError(400, "Vehicle is Already Booked");
    }

    await prisma.$transaction([
        prisma.booking.create({
            data: {
                bookedById: localUser.id,
                vehicleId: bookingDetails.vehicleId,
                startDate: bookingDetails.startDate,
                endDate: bookingDetails.endDate,
                description: "booked",
            },
        }),
        prisma.vehicle.update({
            where: {
                id: bookingDetails.vehicleId,
            },
            data: {
                isBooked: true,
            },
        }),
    ]);

    return { msg: "Vehicle Booked" };
}

export async function cancelBookingService(bokingId: string, userdata: any) {}

export async function myBookingsService(userdata: any) {}

export async function myBookingRequestService(userdata: any) {}

export async function deleteExpiredBookingsService() {}
