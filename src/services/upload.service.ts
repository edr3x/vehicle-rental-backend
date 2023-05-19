import { CustomError } from "../utils/custom_error";
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

export async function updateBrandLogo(image: any, brandId: string) {
    const upload = await prisma.brand.update({
        where: { id: brandId },
        data: {
            logo: image,
        },
    });

    return {
        message: "Brand Logo Picture Updated Successfully",
        image: upload.logo,
    };
}

export async function updateVehicleThumbnail(
    image: any,
    vehicleId: string,
    loggedInUser: any,
) {
    const upload = await prisma.vehicle.updateMany({
        where: {
            AND: {
                id: vehicleId,
                addedById: loggedInUser.id,
            },
        },
        data: {
            thumbnail: image,
        },
    });

    if (!upload) throw new CustomError(400, "Vehicle Thumbnail Not Updated");

    return {
        message: "Vehicle Thumbnail Updated Successfully",
        data: upload,
    };
}
