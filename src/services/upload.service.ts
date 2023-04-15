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
        msg: "Profile Picture Updated Successfully",
        image: upload.profileImage,
    };
}
