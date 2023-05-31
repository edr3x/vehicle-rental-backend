import { v4 as uuidv4 } from "uuid";

import { prisma } from "../utils/db";
import { CustomError } from "../utils/custom_error";

import {
    LicenseDetailsSchema,
    PostCitizenshipSchema,
    UpdateAddressSchema,
    UpdateCitizenshipSchema,
    UpdateLicenseSchema,
    UpdateUserSchema,
} from "../schemas/user.schema";
import { sendVerificationEmail } from "../utils/mailer";

export async function getAllUserService() {
    const users = await prisma.user.findMany({
        include: {
            address: true,
        },
    });

    let response: Array<any> = [];

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        response.push({
            ...user,
            phone: Number(user.phone.toString()),
        });
    }

    return response;
}

export async function getUserService(locaUserData: any) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: locaUserData.id,
            },
            select: {
                fullName: true,
                phone: true,
                email: true,
                gender: true,
                role: true,
                isProfileUpdated: true,
                isAddressUpdated: true,
                profileImage: true,
                address: {
                    select: {
                        province: true,
                        district: true,
                        municipality: true,
                        city: true,
                        street: true,
                    },
                },
            },
        });
        if (!user) {
            throw new CustomError(400, "User not found");
        }

        return {
            ...user,
            phone: Number(user.phone.toString()),
        };
    } catch (e: any) {
        throw new CustomError(400, e.message);
    }
}

export async function updateUserService(
    userDetails: UpdateUserSchema,
    localuserdata: any,
) {
    const { fullName, profileImage, gender, email } = userDetails;

    const dbUser = await prisma.user.findUnique({
        where: {
            id: localuserdata.id,
        },
    });

    if (!dbUser) {
        throw new CustomError(400, "User not found");
    }

    const isDuplicateEmail = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (dbUser.email !== email && isDuplicateEmail) {
        throw new CustomError(400, "Email already exists");
    }

    const user = await prisma.user.update({
        where: {
            id: localuserdata.id,
        },
        data: {
            fullName,
            profileImage,
            gender,
            email,
            isProfileUpdated: true,
        },
    });

    const verifyCode = uuidv4();

    const isotpEmail = await prisma.otp.findUnique({ where: { email } });
    if (isotpEmail) {
        await prisma.otp.update({
            where: {
                email,
            },
            data: {
                emailOtp: verifyCode,
            },
        });
    } else {
        await prisma.otp.create({
            data: {
                emailOtp: verifyCode,
                email,
            },
        });
    }

    await sendVerificationEmail({
        toEmail: email,
        code: verifyCode,
        subject: "Verify your email",
    });

    return {
        fullName: user.fullName,
        phone: Number(user.phone.toString()),
        email: user.email,
        gender: user.gender,
    };
}

export async function updateAddressService(
    address: UpdateAddressSchema,
    localuserdata: any,
) {
    const { province, district, municipality, city, street } = address;

    const message: string = "Address updated successfully";

    const addressExists = await prisma.address.findUnique({
        where: {
            userId: localuserdata.id,
        },
    });

    if (!addressExists) {
        await prisma.$transaction([
            prisma.address.create({
                data: {
                    province,
                    district,
                    municipality,
                    city,
                    street,
                    userId: localuserdata.id,
                },
            }),
            prisma.user.update({
                where: {
                    id: localuserdata.id,
                },
                data: {
                    isAddressUpdated: true,
                },
            }),
        ]);
        return message;
    }

    await prisma.address.update({
        where: {
            userId: localuserdata.id,
        },
        data: {
            province,
            district,
            municipality,
            city,
            street,
        },
    });

    return message;
}

export async function createLicenseDetailsService(
    licenseDetials: LicenseDetailsSchema,
    localUserData: any,
) {
    const user = await prisma.user.findUnique({
        where: {
            id: localUserData.id,
        },
    });

    if (!user) {
        throw new CustomError(400, "User not found");
    }

    const licenseDetailsExists = await prisma.drivingLicense.findUnique({
        where: {
            driverId: localUserData.id,
        },
    });

    if (licenseDetailsExists) {
        throw new CustomError(400, "License details already exists");
    }

    const license = await prisma.drivingLicense.create({
        data: {
            ...licenseDetials,
            driverId: localUserData.id,
        },
    });

    return {
        message: "License details created successfully",
        license,
    };
}

export async function updateLicenseDetailsService(
    licenseDetails: UpdateLicenseSchema,
    localUserData: any,
) {
    const message: string = "License details updated successfully";

    const user = await prisma.user.findUnique({
        where: {
            id: localUserData.id,
        },
    });

    if (!user) {
        throw new CustomError(400, "User not found");
    }

    const licenseDetailsExists = await prisma.drivingLicense.findUnique({
        where: {
            driverId: localUserData.id,
        },
    });

    if (!licenseDetailsExists) {
        throw new CustomError(400, "License details not found");
    }

    await prisma.drivingLicense.update({
        where: { driverId: localUserData.id },
        data: licenseDetails,
    });

    return message;
}

export async function deleteUserService(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new CustomError(400, "User not found");
    }

    await prisma.$transaction([
        prisma.address.delete({
            where: {
                userId: id,
            },
        }),
        prisma.drivingLicense.delete({
            where: {
                driverId: id,
            },
        }),
        prisma.user.delete({
            where: {
                id,
            },
        }),
    ]);

    return "User deleted successfully";
}

export async function userData() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            gender: true,
            address: {
                select: {
                    province: true,
                    district: true,
                    municipality: true,
                    city: true,
                    street: true,
                },
            },
            email: true,
            booking: {
                select: {
                    Vehicle: {
                        select: {
                            id: true,
                            title: true,
                            rate: true,
                            model: true,
                            thumbnail: true,
                            brand: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                            category: true,
                            features: {
                                select: {
                                    id: true,
                                    color: true,
                                    hasAirbag: true,
                                    hasAC: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return users;
}

export async function postCitizenshipService(
    userId: string,
    citizenshipDetails: PostCitizenshipSchema,
) {}

export async function updateCitizenshipService(
    userId: string,
    citizenshipDetails: UpdateCitizenshipSchema,
) {}
