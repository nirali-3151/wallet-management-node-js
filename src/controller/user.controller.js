import { responseHandler } from "../util/index.js";
import UserService from "../service/user.service.js";
import { generateJwtToken, validateJwtToken } from "../util/JwtTokenValidator.js";


export default class UserController {
    static async startSession(req, res) {
        try {

            const { email } = req.body;
            const getUserWithEmail = await UserService.getUserByEmail(email);
            if (!getUserWithEmail) {
                return responseHandler(res, false, 400, "User does not exist", null);
            }
            const createJwtToken = generateJwtToken(getUserWithEmail._id);
            const validateToken = validateJwtToken(createJwtToken)            
            return responseHandler(res, true, 200, "User logged in successfully", { token: createJwtToken, id: getUserWithEmail._id, expiresAt: validateToken.exp});
        } catch (err) {
            return responseHandler(res, false, 500, err.message, null)
        }
    }

}   