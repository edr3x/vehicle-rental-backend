import { prisma } from "../utils/db";
import { CustomError } from "../utils/custom_error";

import { UpdateAddressSchema, UpdateUserSchema } from "../schemas/user.schema";

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
