import { STATUS_CODE } from "../constant/index.js";
import { validateJwtToken } from "./JwtTokenValidator.js";

export const responseHandler = (res, success, statusCode, message, data) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    })
}

export const userMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return responseHandler(res, false, STATUS_CODE.UNAUTHORIZED, "Unauthorized access", null);
    }

    try {
        const decoded = validateJwtToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return responseHandler(res, false, STATUS_CODE.UNAUTHORIZED, error?.message || "Invalid token", null);
    }
}

export const validateMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return responseHandler(res, false, STATUS_CODE.BAD_REQUEST, error.details[0].message, null);
        }
        next();
    }
}