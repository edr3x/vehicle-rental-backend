import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import config from "../config/env";
import { CustomError } from "../utils/custom_error";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) throw new CustomError(400, "Token not found");

        const user = verify(token, config.JWT_SECRET);

        res.locals.user = user;

        // note: looks like:
        // {
        //   id: '7dda059e-1414-4a70-b44f-94bdb63f5406',
        //   phone: 9882857162,
        //   iat: 1681127572,
        //   exp: 1683719572
        // }

        next();
    } catch (error: any) {
        throw new CustomError(401, "Unauthorized");
    }
};
