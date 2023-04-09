import { prisma } from "../utils/db";
import { sendSMS } from "../utils/sms";
import { CustomError } from "../utils/custom_error";
import { verificationCodeGen } from "../utils/codegen";

import { CreateUserSchema } from "../schemas/auth.schema";

export async function sendOTP(phone: number) {
    const code = verificationCodeGen();

    await prisma.otp.create({
        data: {
            phone,
            otp: code,
        },
    });

    // const message: string = `Your verification code is ${code}.`;

    // await sendSMS(phone, message);

    return "Verification code sent to your phone number";
}

export async function verifyOTP(phone: number, otp: number) {
    const checkOTP = await prisma.otp.findUnique({
        where: {
            phone,
        },
    });

    if (!checkOTP) {
        throw new CustomError(400, "Invalid OTP");
    }

    if (checkOTP.otp !== otp) {
        throw new CustomError(400, "Invalid OTP");
    }

    const [user, verifyotp] = await prisma.$transaction([
        prisma.user.create({
            data: {
                phone,
                phoneVerified: true,
            },
        }),
        prisma.otp.delete({
            where: {
                phone,
            },
        }),
    ]);

    if (!user || !verifyotp) {
        throw new CustomError(500, "Unexpected Server ERROR");
    }

    return "verified successfully";
}

export async function createUserService(userDetails: CreateUserSchema) {
    // TODO:: all this chunk

    // const { fullName, gender, email, phone } = userDetails;

    // const checkUser = await prisma.user.findUnique({
    //     where: {
    //         phone,
    //     },
    // });

    // if (checkUser) {
    //     throw new CustomError(400, "User already exists login instead");
    // }

    // const [user, verifyotp] = await prisma.$transaction([
    //     prisma.user.create({
    //         data: {
    //             fullName,
    //             gender,
    //             email,
    //             phone,
    //         },
    //     }),

    //     prisma.otp.create({
    //         data: {
    //             phone,
    //             otp: code,
    //         },
    //     }),
    // ]);

    // // Number(user.phoneNo.toString()) //note: changing BigInt to Number

    return "Verification code sent to your phone number";
}
