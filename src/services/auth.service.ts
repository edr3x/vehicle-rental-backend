import { sign } from "jsonwebtoken";

import { prisma } from "../utils/db";
import { sendSMS } from "../utils/sms";
import { CustomError } from "../utils/custom_error";

import { CreateUserSchema } from "../schemas/auth.schema";
import config from "../config/env";

const verificationCodeGen = () => Math.floor(100000 + Math.random() * 900000);

const createToken = ({ id, phone }: { id: string; phone: number }) => {
    return sign(
        {
            id,
            phone,
        },
        config.JWT_SECRET,
        {
            expiresIn: "30d",
        },
    );
};

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

    const user = await prisma.user.findUnique({
        where: {
            phone,
        },
    });

    if (!user) {
        const [userdata, verifyotp] = await prisma.$transaction([
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

        if (!userdata || !verifyotp) {
            throw new CustomError(500, "Unexpected Server ERROR");
        }

        const jwtToken = createToken({
            id: userdata.id,
            phone,
        });

        return {
            token: jwtToken,
            message:
                "OTP Verified Successfully, fillup personal details to continue",
        };
    }

    if (!user.isRegistered) {
        throw new CustomError(400, "User not registered");
    }

    const jwtToken = createToken({
        id: user.id,
        phone: Number(user.phone.toString()),
    });

    await prisma.otp.delete({
        where: {
            phone,
        },
    });

    return {
        token: jwtToken,
        message: "Successfully Logged In",
    };
}

export async function updateUserService(
    userDetails: CreateUserSchema,
    localuserdata: any,
) {
    const { fullName, gender, email, phone } = userDetails;

    if (localuserdata.phone !== phone) {
        throw new CustomError(400, "Invalid Phone Number");
    }

    const user = await prisma.user.update({
        where: {
            phone,
        },
        data: {
            fullName,
            gender,
            email,
            isRegistered: true,
        },
    });

    return {
        email: user.email,
        phone: user.phone ? Number(user.phone.toString()) : null,
        fullName: user.fullName,
        gender: user.gender,
    };
}
