import {
    AddBrandSchema,
    AddSubCategorySchema,
    AddVehicleSchema,
    FindVehicleNearMeSchema,
    UpdateBrandSchema,
    UpdateSubCategorySchema,
} from "../schemas/vehicle.schema";
import { calculateDistance } from "../utils/calculate_distance";
import { prisma } from "../utils/db";
import config from "../config/env";
import { CustomError } from "../utils/custom_error";

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
        category,
        subCategoryId,
        brandId,
        model,
        images,
        vehicleNumber,
        description,
        rentGuidelines,
        rate,
        pickupAddress,
        driveTrain,
        features,
    } = vehicleDetails;

    const vehicle = await prisma.vehicle.create({
        data: {
            addedById: loggedInUser.id,
            title,
            category,
            type,
            subCategoryId,
            brandId,
            model,
            images,
            vehicleNumber,
            description,
            rentGuidelines,
            rate,
            pickupAddress,
            driveTrain,
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
            category: true,
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

    return { msg: "Vehicles fetched", result: vehicles };
}

export async function getVehicleDetailsService(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            addedBy: {
                select: {
                    id: true,
                    phone: true,
                    profileImage: true,
                    fullName: true,
                },
            },
            type: true,
            category: true,
            thumbnail: true,
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
            images: true,
            vehicleNumber: true,
            description: true,
            rentGuidelines: true,
            rate: true,
            pickupAddress: true,
            driveTrain: true,
            features: true,
        },
    });

    if (!vehicle) throw new CustomError(404, "Vehicle not found");

    return {
        msg: "Vehicle details fetched",
        result: {
            ...vehicle,
            addedBy: {
                ...vehicle.addedBy,
                phone: Number(vehicle.addedBy.phone),
            },
        },
    };
}

export async function getVehiclesNearMe(inputValues: FindVehicleNearMeSchema) {
    const category = inputValues.category;

    const whereClause =
        category === "all"
            ? { isVerified: true }
            : { isVerified: true, category };

    const allVehicles = await prisma.vehicle.findMany({
        where: whereClause,
        select: {
            id: true,
            title: true,
            addedById: true,
            type: true,
            category: true,
            rate: true,
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
                },
            },
            model: true,
            thumbnail: true,
            pickupAddress: true,
            isBooked: true,
        },
    });

    let newArr: Array<any> = [];

    const lat = parseFloat(inputValues.lat);
    const lon = parseFloat(inputValues.lon);

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

        if (distance <= 15) newArr.push(newVehicleList);
    }

    return { msg: "Vehicles near me fetched", result: newArr };
}
