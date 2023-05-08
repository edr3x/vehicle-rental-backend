import { sign } from "jsonwebtoken";

import { prisma } from "../utils/db";
import { sendSMS } from "../utils/sms";
import { CustomError } from "../utils/custom_error";

import config from "../config/env";
import { logger } from "../utils/logger";

type TokenParam = {
    id: string;
    phone: number;
    role: "user" | "driver" | "moderator" | "admin";
    isProfileUpdated: boolean;
};

const verificationCodeGen = () => Math.floor(100000 + Math.random() * 900000);

const createToken = ({ id, phone, role, isProfileUpdated }: TokenParam) => {
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

export async function verifyOTP(
    phone: number,
    otp: number,
    role: TokenParam["role"] = "user",
) {
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
                    role,
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
            role: userdata.role,
            isProfileUpdated: userdata.isProfileUpdated, // myth: yeah this looks stupid, i know 😀
            isAddressUpdated: userdata.isAddressUpdated,
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
        isProfileUpdated: user.isProfileUpdated,
        role: user.role,
        isAddressUpdated: user.isAddressUpdated,
        message: "Successfully Logged In",
    };
}

export async function verifyEmailService(code: string, email: string) {
    const isValid = await prisma.otp.findUnique({
        where: { email },
    });

    if (!isValid) {
        throw new CustomError(400, "Invalid email");
    }

    if (isValid.emailOtp !== code) {
        throw new CustomError(402, "Validation Failed");
    }

    await prisma.$transaction([
        prisma.user.update({
            where: { email },
            data: {
                emailVerified: true,
            },
        }),
        prisma.otp.delete({
            where: { email },
        }),
    ]);

    return "Email verified successfully";
}

export async function deleteOtp() {
    // try {
    //     const currentTime = new Date();
    //     const cutoffTime = new Date(currentTime.getTime() - 180000);
    //     await prisma.otp.deleteMany({
    //         where: {
    //             updatedAt: {
    //                 lt: cutoffTime,
    //             },
    //         },
    //     });
    // } catch (e) {
    //     logger.error(e);
    // }
}
