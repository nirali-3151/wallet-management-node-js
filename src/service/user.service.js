import User from "../model/user.model.js";

export default class UserService {
    static async createUser(data) {
        try {
            const user = new User(data);
            await user.save();
            return user;
        } catch (error) {
            throw new Error("Error creating user");
        }
    }

    static async getUserByEmail(email) {
        const user = await User.findOne({ email });
        return user;
    }

}