import config from "../config/env";

import { prisma } from "../utils/db";
import { CustomError } from "../utils/custom_error";

import {
    LicenseDetailsSchema,
    UpdateAddressSchema,
    UpdateUserSchema,
} from "../schemas/user.schema";

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
            profileImage: `${config.HOST}/image/${user.profileImage}`,
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
                isProfileUpdated: true,
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
            profileImage: `${config.HOST}/image/${user.profileImage}`,
        };
    } catch (e: any) {
        throw new CustomError(400, e.message);
    }
}

export async function updateUserService(
    userDetails: UpdateUserSchema,
    localuserdata: any,
) {
    const { fullName, gender, email } = userDetails;

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
            gender,
            email,
            isProfileUpdated: true,
        },
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
                    isProfileUpdated: true,
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

// warn: incomplete function
export async function updateLicenseDetailsService(
    licenseDetails: LicenseDetailsSchema,
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
        await prisma.$transaction([
            prisma.drivingLicense.create({
                data: {
                    driverId: localUserData.id,
                    licenseNo: licenseDetails.licenseNo,
                    licenseType: licenseDetails.licenseType,
                    contactNo: licenseDetails.contactNo,
                    citizenshipNo: licenseDetails.citizenshipNo,
                    issueDate: licenseDetails.issueDate,
                },
            }),

            prisma.user.update({
                where: {
                    id: localUserData.id,
                },
                data: {
                    isProfileUpdated: true,
                },
            }),
        ]);

        return message;
    }
    //todo: update fields and many more

    return message;
}
