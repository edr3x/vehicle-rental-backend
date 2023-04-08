import { prisma } from "../utils/db";
import { redis } from "../utils/redis";
import { verificationCodeGen } from "../utils/codegen";
import { logger } from "../utils/logger";
// import { sendVerification } from "../utils/sms";

export async function sendVerificationCode(phone: number) {
    const user = await prisma.user.findUnique({
        where: {
            phone,
        },
    });

    if (!user) {
    }

    const code = verificationCodeGen();

    await redis.connect();
    await redis.setEx(phone.toString(), 170, code.toString());
    await redis.disconnect();

    // send verificaiton code to user
    // const message: string = `Your verification code is ${code}.`;
    // const send_code = await sendVerification(phone, message);

    // Number(user.phoneNo.toString()) //note: changing BigInt to Number

    logger.info(`Verification code ${code} sent to ${phone}`);

    return "Verification code sent to your phone number";
}
