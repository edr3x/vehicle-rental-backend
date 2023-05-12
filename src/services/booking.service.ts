import { BookingSchema } from "../schemas/booking.schema";
import { CustomError } from "../utils/custom_error";
import { prisma } from "../utils/db";

export async function bookingService(
    localUser: any,
    bookingDetails: BookingSchema,
) {
    const user = await prisma.user.findUnique({ where: { id: localUser.id } });

    if (!user) throw new CustomError(400, "User Not Found");

    const vehicleDetails = await prisma.vehicle.findUnique({
        where: {
            id: bookingDetails.vehicleId,
        },
    });

    if (!vehicleDetails) throw new CustomError(400, "Vehicle Not Found");

    if (vehicleDetails.isBooked) {
        throw new CustomError(406, "Vehicle is Already Booked");
    }

    const message = `Booking requested for ${vehicleDetails.title} from ${bookingDetails.startDate} to ${bookingDetails.endDate} by ${user.fullName}`;

    await prisma.booking.create({
        data: {
            bookedById: localUser.id,
            vehicleId: bookingDetails.vehicleId,
            startDate: bookingDetails.startDate,
            endDate: bookingDetails.endDate,
            description: message,
        },
    });

    return { msg: message };
}

export async function cancelBookingService(bokingId: string, userdata: any) {}

export async function myBookingsService(userdata: any) {}

export async function myBookingRequestService(userdata: any) {}

export async function deleteExpiredBookingsService() {}
