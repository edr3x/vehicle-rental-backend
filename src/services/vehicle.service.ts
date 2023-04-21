// TODO: have to fix all
/*

import {
    AddBrandSchema,
    AddCategorySchema,
    AddSubCategorySchema,
    AddVehicleSchema,
} from "../schemas/vehicle.schema";
import { calculateDistance } from "../utils/calculate_distance";
import { prisma } from "../utils/db";
import config from "../config/env";

export const addCategory = async (categoryDetails: AddCategorySchema) => {
    const { title, description, logo } = categoryDetails;
    const category = await prisma.category.create({
        data: {
            title,
            description,
            logo,
        },
    });
    return { msg: "Category added", result: category };
};

export const updateCategory = async (id: string, categoryDetails: any) => {
    const { title, description, logo } = categoryDetails;
    const category = await prisma.category.update({
        where: {
            id: id,
        },
        data: {
            title,
            description,
            logo,
        },
    });
    return { msg: "Category updated" };
};

export const listAllCategory = async () => {
    const category = await prisma.category.findMany();
    return { msg: "ALl Category Fetched", result: category };
};

export const deleteCategory = async (id: string) => {
    await prisma.category.delete({
        where: {
            id: id,
        },
    });
    return { msg: "Category Deleted" };
};

export const addSubCategory = async (
    subCategoryDetails: AddSubCategorySchema,
) => {
    const { title, description, categoryId, logo } = subCategoryDetails;
    const subCategory = await prisma.subCategory.create({
        data: {
            title,
            description,
            logo,
            categoryId,
        },
    });
    return { msg: "Category added", result: subCategory };
};

export const updateSubCategory = async (
    id: string,
    subCategoryDetails: any,
) => {
    const { title, description, categoryId, logo } = subCategoryDetails;
    const subCategory = await prisma.subCategory.update({
        where: {
            id: id,
        },
        data: {
            title,
            description,
            logo,
            categoryId,
        },
    });
    return { msg: "Category Updated" };
};

export const listAllSubCategory = async () => {
    const subCategory = await prisma.subCategory.findMany();
    return { msg: "ALl Sub Categories Fetched", result: subCategory };
};

export const deleteSubCategory = async (id: string) => {
    await prisma.subCategory.delete({
        where: {
            id: id,
        },
    });
    return { msg: "Sub-Category Deleted" };
};

export const addBrand = async (brandDetails: AddBrandSchema) => {
    const { title, description, logo } = brandDetails;
    const brand = await prisma.brand.create({
        data: {
            title,
            description,
            logo,
        },
    });
    return { msg: "Brand added", result: brand };
};

export const updateBrand = async (id: string, brandDetails: any) => {
    const { title, description, logo } = brandDetails;
    const brand = await prisma.brand.update({
        where: {
            id: id,
        },
        data: {
            title,
            description,
            logo,
        },
    });
    return { msg: "Brand Updated" };
};

export const listAllBrands = async () => {
    const brands = await prisma.brand.findMany();
    return { msg: "ALl Brands Fetched", result: brands };
};

export const deleteBrand = async (id: string) => {
    await prisma.brand.delete({
        where: {
            id: id,
        },
    });
    return { msg: "Brand Deleted" };
};

export async function addVehicle(
    vehicleDetails: AddVehicleSchema,
    loggedInUser: any,
) {
    const {
        title,
        type,
        categoryId,
        subCategoryId,
        brandId,
        model,
        thumbnail,
        images,
        bluebookPics,
        vehicleNumber,
        description,
        rentGuidelines,
        rate,
        pickupAddress,
        driveTrain,
        insurancePaperPhoto,
        features,
    } = vehicleDetails;

    const vehicle = await prisma.vehicle.create({
        data: {
            title,
            addedById: loggedInUser.id,
            type,
            categoryId,
            subCategoryId,
            brandId,
            model,
            thumbnail,
            images,
            bluebookPics,
            vehicleNumber,
            description,
            rentGuidelines,
            rate,
            pickupAddress,
            driveTrain,
            insurancePaperPhoto,
            features: {
                create: features,
            },
        },
    });
    return { msg: "Vehicle added", result: vehicle };
}

export async function listAllVehicle() {
    let vehicles = await prisma.vehicle.findMany({
        where: {
            isVerified: true,
        },
        select: {
            id: true,
            title: true,
            addedById: true,
            type: true,
            category: {
                select: {
                    id: true,
                    title: true,
                },
            },
            subCategory: {
                select: {
                    id: true,
                    title: true,
                },
            },
            brand: {
                select: {
                    id: true,
                    title: true,
                    logo: true,
                },
            },
            model: true,
            thumbnail: true,
            isBooked: true,
        },
    });

    // vehicles.map((vehicle) => {
    //     vehicle.thumbnail = `${config.UPLOADS}${vehicle.thumbnail}`;
    //     vehicle.brand.logo = `${config.UPLOADS}${vehicle.brand.logo}`;
    //     return vehicle;
    // });

    return { msg: "Vehicles fetched", result: vehicles };
}

export async function getVehiclesNearMe(lat: number, lon: number) {
    let allVehicles = await prisma.vehicle.findMany({
        where: {
            isVerified: true,
        },
        select: {
            id: true,
            title: true,
            addedById: true,
            type: true,
            category: {
                select: {
                    id: true,
                    title: true,
                },
            },
            subCategory: {
                select: {
                    id: true,
                    title: true,
                },
            },
            brand: {
                select: {
                    id: true,
                    title: true,
                    logo: true,
                },
            },
            model: true,
            thumbnail: true,
            pickupAddress: true,
            isBooked: true,
        },
    });

    let newArr: Array<any> = [];

    for (let i = 0; i < allVehicles.length; i++) {
        const distance = calculateDistance(
            lat,
            lon,
            Number(allVehicles[i].pickupAddress[0]),
            Number(allVehicles[i].pickupAddress[1]),
        );

        const newVehicleList = {
            ...allVehicles[i],
            distance,
        };

        if (distance <= 15) {
            newArr.push(newVehicleList);
        }
    }

    // newArr.map((vehicle) => {
    //     vehicle.thumbnail = `${config.UPLOADS}${vehicle.thumbnail}`;
    //     vehicle.brand.logo = `${config.UPLOADS}${vehicle.brand.logo}`;
    //     return vehicle;
    // });

    return { msg: "Vehicles near me fetched", result: newArr };
}
*/
