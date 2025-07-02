import jwt from "jsonwebtoken";
import { responseHandler } from "./index.js";

export const validateJwtToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
}

export const generateJwtToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30m" });
}