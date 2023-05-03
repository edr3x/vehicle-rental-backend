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
            category,
            type,
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

    vehicles.map((vehicle) => {
        vehicle.thumbnail = `${config.HOST}/image/${vehicle.thumbnail}`;
        vehicle.brand.logo = `${config.HOST}/image/${vehicle.brand.logo}`;
        return vehicle;
    });

    return { msg: "Vehicles fetched", result: vehicles };
}

export async function getVehiclesNearMe(qureyParams: FindVehicleNearMeSchema) {
    const category = qureyParams.category;

    const lat = parseFloat(qureyParams.lat);
    const lon = parseFloat(qureyParams.lon);

    const whereClause =
        category === undefined
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
