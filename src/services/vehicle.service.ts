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
import { CustomError } from "../utils/custom_error";
import Axios from "axios";

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
    const user = await prisma.user.findUnique({
        where: { id: loggedInUser.id },
    });

    if (!user) throw new CustomError(400, "User Not Found");

    if (user.kycStatus !== "verified") {
        throw new CustomError(
            400,
            "Please verify your KYC first to add a vehicle",
        );
    }

    const {
        title,
        type,
        category,
        subCategoryId,
        thumbnail,
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

    await prisma.vehicle.create({
        data: {
            addedById: loggedInUser.id,
            title,
            category,
            thumbnail,
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

    return { msg: "Vehicle added successfully" };
}

export async function listSelfPostedVehicle(loggedInUser: any) {
    const vehicles = await prisma.vehicle.findMany({
        where: {
            addedById: loggedInUser.id,
        },
        include: {
            subCategory: true,
            brand: true,
            Booking: {
                select: {
                    id: true,
                    status: true,
                },
            },
        },
    });

    return { msg: "Vehicles fetched", result: vehicles };
}

export async function listAllVehicle() {
    let vehicles = await prisma.vehicle.findMany({
        orderBy: {
            createdAt: "desc",
        },
        where: {
            isVerified: true,
        },
        select: {
            id: true,
            title: true,
            isVerified: true,
            addedBy: {
                select: {
                    id: true,
                    fullName: true,
                    profileImage: true,
                },
            },
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

function shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [
            shuffledArray[j],
            shuffledArray[i],
        ];
    }
    return shuffledArray;
}

type Vehicle = {
    id: string;
    title: string;
    rate: string;
    thumbnail?: string;
};

function removeDuplicates(array: Vehicle[]): Vehicle[] {
    const uniqueKeys = new Set();
    return array.filter((vehicle) => {
        if (uniqueKeys.has(vehicle["id"])) {
            return false;
        }
        uniqueKeys.add(vehicle["id"]);
        return true;
    });
}

async function getVehicleListingFromAlgo(id: string) {
    try {
        const colab_response = await Axios.get(
            `http://localhost:5050/recom/${id}`,
        );

        return colab_response.data["data"];
    } catch (e) {
        console.log("Can't connect with algorithm service");
        return [];
    }
}

export async function getRecommendedVehicles(localUser: any) {
    const vehicles = await prisma.vehicle.findMany({
        where: {
            isVerified: true,
            isBooked: false,
        },
        select: {
            id: true,
            thumbnail: true,
            title: true,
            rate: true,
        },
    });

    const shuffledVehicles = shuffleArray(vehicles).slice(0, 8);

    const colab_vehicles = await getVehicleListingFromAlgo(localUser.id);

    const bookingHistory: Array<any> = await prisma.$queryRaw`
        SELECT DISTINCT ON (b."vehicleId") v.id, v.thumbnail, v.title, v.rate
        FROM "Booking" b
        JOIN "Vehicle" v ON b."vehicleId" = v.id
        WHERE b."bookedById" = ${localUser.id}
          AND b."status" = 'completed'
          AND b."vehicleId" IN (
            SELECT "vehicleId"
            FROM "Booking"
            WHERE "bookedById" = ${localUser.id}
              AND "status" = 'completed'
            GROUP BY "vehicleId"
            HAVING COUNT("vehicleId") > 2
        )`;

    const combined = removeDuplicates(
        colab_vehicles.concat(bookingHistory).concat(shuffledVehicles),
    ).slice(0, 6);

    const combined_vehicle = shuffleArray(combined);

    return { msg: "Recommended vehicles fetched", result: combined_vehicle };
}

export async function getVehiclesNearMe(inputValues: FindVehicleNearMeSchema) {
    const category = inputValues.category;

    const whereClause =
        category === "all"
            ? { isVerified: true }
            : { isVerified: true, category };

    const allVehicles = await prisma.vehicle.findMany({
        where: {
            ...whereClause,
            isBooked: false,
        },
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

        if (distance <= 15) {
            let insertIndex = 0;
            while (
                insertIndex < newArr.length &&
                newArr[insertIndex].distance < distance
            ) {
                insertIndex++;
            }
            newArr.splice(insertIndex, 0, newVehicleList);
        }
    }

    return { msg: "Vehicles near me fetched", result: newArr };
}

export async function bookingsPerVehicle(vehicleId: string) {
    const bookings = await prisma.booking.findMany({
        where: {
            vehicleId: vehicleId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            bookedBy: {
                select: {
                    fullName: true,
                    profileImage: true,
                },
            },
            Vehicle: {
                select: {
                    rate: true,
                },
            },
        },
    });

    return { msg: "Bookings fetched", bookings };
}

export async function searchVehicles(searchString: string) {
    const vehicles = await prisma.vehicle.findMany({
        where: {
            AND: [
                {
                    isVerified: true,
                },
                {
                    isBooked: false,
                },
                {
                    OR: [
                        {
                            title: {
                                contains: searchString,
                                mode: "insensitive",
                            },
                        },
                        {
                            model: {
                                contains: searchString,
                                mode: "insensitive",
                            },
                        },
                    ],
                },
            ],
        },
        select: {
            id: true,
            title: true,
            thumbnail: true,
            rate: true,
        },
    });

    if (!vehicles) throw new CustomError(404, "No vehicles found");

    if (vehicles.length === 0) throw new CustomError(404, "No vehicles found");

    return { msg: "Vehicles fetched", result: vehicles };
}
