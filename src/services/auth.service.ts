import { sign } from "jsonwebtoken";

import { prisma } from "../utils/db";
import { sendSMS } from "../utils/sms";
import { CustomError } from "../utils/custom_error";

import config from "../config/env";

type TokenParams = {
    id: string;
    phone: number;
    role: "user" | "admin";
    isProfileUpdated: boolean;
};

const verificationCodeGen = () => Math.floor(100000 + Math.random() * 900000);

const createToken = ({ id, phone, role, isProfileUpdated }: TokenParams) => {
    return sign(
        {
            id,
            phone,
            role,
            isProfileUpdated,
        },
        config.JWT_SECRET,
        {
            expiresIn: "30d",
        },
    );
};

export async function sendOTP(phone: number) {
    try {
        const code = verificationCodeGen();

        const otpExists = await prisma.otp.findUnique({
            where: {
                phone,
            },
        });

        if (!otpExists) {
            await prisma.otp.create({
                data: {
                    phone,
                    otp: code,
                },
            });
        } else {
            await prisma.otp.update({
                where: { phone },
                data: {
                    phone,
                    otp: code,
                },
            });
        }

        // const message: string = `Your verification code is ${code}.`;

        // await sendSMS(phone, message);

        return "Verification code sent to your phone number";
    } catch (error: any) {
        throw new CustomError(500, "Unexpected Server ERROR");
    }
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
            role: userdata.role,
            isProfileUpdated: userdata.isProfileUpdated,
        });

        return {
            token: jwtToken,
            message:
                "OTP Verified Successfully, fillup personal details to continue",
        };
    }

    const jwtToken = createToken({
        id: user.id,
        phone: Number(user.phone.toString()),
        role: user.role,
        isProfileUpdated: user.isProfileUpdated,
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