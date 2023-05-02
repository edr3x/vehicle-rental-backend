import {
    AddBrandSchema,
    AddCategorySchema,
    AddSubCategorySchema,
    AddVehicleSchema,
    UpdateBrandSchema,
    UpdateCategorySchema,
    UpdateSubCategorySchema,
} from "../schemas/vehicle.schema";
import { calculateDistance } from "../utils/calculate_distance";
import { prisma } from "../utils/db";
import config from "../config/env";
import { CustomError } from "../utils/custom_error";

export async function addCategory(categoryDetails: AddCategorySchema) {
    const category = await prisma.category.create({
        data: categoryDetails,
    });
    return { msg: "Category added", result: category };
}

export async function updateCategory(
    id: string,
    categoryDetails: UpdateCategorySchema["body"],
) {
    await prisma.category.update({
        where: { id },
        data: categoryDetails,
    });
    return { msg: "Category updated" };
}

export async function listAllCategory() {
    const category = await prisma.category.findMany();
    return { msg: "ALl Category Fetched", result: category };
}

export async function deleteCategory(id: string) {
    await prisma.category.delete({
        where: {
            id: id,
        },
    });
    return { msg: "Category Deleted" };
}

export async function addSubCategory(subCategoryDetails: AddSubCategorySchema) {
    const subCategory = await prisma.subCategory.create({
        data: subCategoryDetails,
    });
    return { msg: "Category added", result: subCategory };
}

export async function updateSubCategory(
    id: string,
    subCategoryDetails: UpdateSubCategorySchema["body"],
) {
    await prisma.subCategory.update({
        where: { id },
        data: subCategoryDetails,
    });
    return { msg: "Category Updated" };
}

export async function listAllSubCategory() {
    const subCategory = await prisma.subCategory.findMany();
    return { msg: "ALl Sub Categories Fetched", result: subCategory };
}

export async function deleteSubCategory(id: string) {
    await prisma.subCategory.delete({
        where: {
            id: id,
        },
    });
    return { msg: "Sub-Category Deleted" };
}

export async function findSubCategoryFromCategory(categoryId: string) {
    const subCategory = await prisma.subCategory.findMany({
        where: {
            categoryId,
        },
    });

    if (!subCategory) throw new CustomError(400, "No Sub Category Found");

    return { msg: "Sub Categories Fetched", result: subCategory };
}

export async function addBrand(brandDetails: AddBrandSchema) {
    const brand = await prisma.brand.create({
        data: brandDetails,
    });
    return { msg: "Brand added", result: brand };
}

export async function updateBrand(
    id: string,
    brandDetails: UpdateBrandSchema["body"],
) {
    const result = await prisma.brand.update({
        where: { id },
        data: brandDetails,
    });
    return { msg: "Brand Updated", result };
}

export async function listAllBrands() {
    const brands = await prisma.brand.findMany();
    return { msg: "ALl Brands Fetched", result: brands };
}

export async function deleteBrand(id: string) {
    await prisma.brand.delete({
        where: {
            id: id,
        },
    });
    return { msg: "Brand Deleted" };
}

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

    vehicles.map((vehicle) => {
        vehicle.thumbnail = `${config.HOST}/image/${vehicle.thumbnail}`;
        vehicle.brand.logo = `${config.HOST}/image/${vehicle.brand.logo}`;
        return vehicle;
    });

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

    newArr.map((vehicle) => {
        vehicle.thumbnail = `${config.HOST}/image/${vehicle.thumbnail}`;
        vehicle.brand.logo = `${config.HOST}/image/${vehicle.brand.logo}`;
        return vehicle;
    });

    return { msg: "Vehicles near me fetched", result: newArr };
}
