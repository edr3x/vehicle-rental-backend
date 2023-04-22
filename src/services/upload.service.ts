import { prisma } from "../utils/db";

export async function uploadService(images: any, loggedInUser: any) {
    const upload = await prisma.upload.create({
        data: {
            images: images,
            userId: loggedInUser.id,
        },
    });

    return { msg: "Image Uploaded Successfully", image: upload.images };
}

export async function updateProfilePic(image: any, loggedInUser: any) {
    const upload = await prisma.user.update({
        where: {
            id: loggedInUser.id,
        },
        data: {
            profileImage: image,
        },
    });

    return {
        message: "Profile Picture Updated Successfully",
        image: upload.profileImage,
    };
}

export async function updateLicensePic(image: any, loggedInUser: any) {
    const upload = await prisma.drivingLicense.update({
        where: { driverId: loggedInUser.id },
        data: {
            licenseNo: image,
        },
    });

    return {
        message: "License Picture Updated Successfully",
        image: upload.licensePic,
    };
}
