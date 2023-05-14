import { BookingSchema } from "../schemas/booking.schema";
import { CustomError } from "../utils/custom_error";
import { prisma } from "../utils/db";

export async function bookingService(
    localUser: any,
    bookingDetails: BookingSchema,
) {
    const user = await prisma.user.findUnique({ where: { id: localUser.id } });

    if (!user) throw new CustomError(400, "User Not Found");

    const booking = await prisma.booking.findMany({
        where: {
            AND: [
                {
                    vehicleId: bookingDetails.vehicleId,
                },
                {
                    bookedBy: {
                        id: localUser.id,
                    },
                },
                {
                    status: "pending",
                },
            ],
        },
    });

    if (booking.length !== 0) {
        throw new CustomError(
            406,
            "You have already requested to book this Vehicle",
        );
    }

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

export async function cancelBookingService(bookingId: string, userdata: any) {
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
    });

    if (!booking) throw new CustomError(404, "Booking ID Not Found");

    if (booking.bookedById !== userdata.id) {
        throw new CustomError(
            403,
            "You are not allowed to cancel this booking",
        );
    }

    await prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status: "cancelled",
        },
    });

    return { msg: "Booking Successfully Cancelled" };
}

export async function myBookingsService(userdata: any) {
    const bookings = await prisma.booking.findMany({
        where: {
            bookedById: userdata.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            Vehicle: {
                select: {
                    title: true,
                    thumbnail: true,
                },
            },
        },
    });

    return bookings;
}

export async function getBookingDetailsService(bookingId: string) {
    const bookings = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
        include: {
            Vehicle: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    isBooked: true,
                    thumbnail: true,
                    rate: true,
                    type: true,
                    brand: true,
                    model: true,
                    addedBy: {
                        select: {
                            fullName: true,
                            phone: true,
                            email: true,
                            address: true,
                        },
                    },
                },
            },
            bookedBy: {
                select: {
                    phone: true,
                    profileImage: true,
                    fullName: true,
                    email: true,
                    address: true,
                },
            },
        },
    });

    return { msg: `Booking Details fetched`, bookings };
}

// NOTE: For Vehicle Uploader
export async function myBookingRequestService(userdata: any) {
    const bookings = await prisma.booking.findMany({
        where: {
            AND: [
                {
                    Vehicle: {
                        addedById: userdata.id,
                    },
                },
                {
                    status: "pending",
                },
            ],
        },
        include: {
            bookedBy: {
                select: {
                    profileImage: true,
                    fullName: true,
                    phone: true,
                    email: true,
                    address: true,
                    gender: true,
                    drivingLicense: true,
                },
            },
        },
    });

    return { msg: `Booking Requests fetched`, bookings };
}

// NOTE: For Vehicle Uploader
export async function bookingRequestHandlerService(
    userData: any,
    bookingId: string,
    action: string, //NOTE: can only be accept or "reject"
) {
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
        include: {
            Vehicle: {
                select: {
                    id: true,
                    addedBy: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });

    if (!booking) throw new CustomError(404, "Booking ID Not Found");

    if (booking.Vehicle.addedBy.id !== userData.id) {
        throw new CustomError(
            403,
            "You are not allowed to perform this action",
        );
    }

    if (action === "accept") {
        await prisma.$transaction([
            prisma.booking.update({
                where: {
                    id: bookingId,
                },
                data: {
                    status: "active",
                },
            }),

            prisma.booking.updateMany({
                where: {
                    AND: [
                        {
                            vehicleId: booking.Vehicle.id,
                        },
                        {
                            status: "pending",
                        },
                    ],
                },
                data: {
                    status: "cancelled",
                },
            }),

            prisma.vehicle.update({
                where: {
                    id: booking.Vehicle.id,
                },
                data: {
                    isBooked: true,
                },
            }),
        ]);
    } else if (action === "reject") {
        await prisma.booking.update({
            where: {
                id: bookingId,
            },
            data: {
                status: "rejected",
            },
        });
    } else {
        throw new CustomError(400, "Invalid Action");
    }

    return { msg: `Booking Request ${action}ed` };
}

export async function deleteExpiredBookingsService() {}
