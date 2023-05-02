import { NextFunction, Request, Response } from "express";

import * as VehicleService from "../services/vehicle.service";
import {
    AddBrandSchema,
    AddCategorySchema,
    AddSubCategorySchema,
    AddVehicleSchema,
    UpdateBrandSchema,
    UpdateCategorySchema,
    UpdateSubCategorySchema,
} from "../schemas/vehicle.schema";

export async function listAllCategoryController(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.listAllCategory();

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function addCategoryController(
    req: Request<{}, {}, AddCategorySchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.addCategory(req.body);

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function updateCategoryController(
    req: Request<
        UpdateCategorySchema["params"],
        {},
        UpdateCategorySchema["body"]
    >,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.updateCategory(
            req.params.categoryId,
            req.body,
        );
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function deleteCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.deleteCategory(req.params.id);
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function addSubCategoryController(
    req: Request<{}, {}, AddSubCategorySchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.addSubCategory(req.body);
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function updateSubCategoryController(
    req: Request<
        UpdateSubCategorySchema["params"],
        {},
        UpdateSubCategorySchema["body"]
    >,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.updateSubCategory(
            req.params.subCategoryId,
            req.body,
        );
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function listAllSubCategoryController(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.listAllSubCategory();
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function deleteSubCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.deleteSubCategory(req.params.id);
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function findSubCategoryFromCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.findSubCategoryFromCategory(
            req.params.id,
        );

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function addBrandController(
    req: Request<{}, {}, AddBrandSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.addBrand(req.body);
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function updateBrandController(
    req: Request<UpdateBrandSchema["params"], {}, UpdateBrandSchema["body"]>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.updateBrand(
            req.params.brandId,
            req.body,
        );
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function listAllBrandController(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.listAllBrands();
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function deleteBrandController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.deleteBrand(req.params.id);
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function addVehicleController(
    req: Request<{}, {}, AddVehicleSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.addVehicle(
            req.body,
            res.locals.user,
        );
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function listAllVehicleController(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.listAllVehicle();
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function getVehiclesNearMeController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const lat = parseInt(req.query.lat as string);
        const lon = parseInt(req.query.lon as string);

        const response = await VehicleService.getVehiclesNearMe(lat, lon);

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}
