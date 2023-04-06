import { prisma } from "../utils/db";

export async function verifyPhone(phone: number) {
    // Number(user.phoneNo.toString()) //note: changing BigInt to Number

    const user = await prisma.user.findUnique({
        where: {
            phone,
        },
    });

    return user;
}
