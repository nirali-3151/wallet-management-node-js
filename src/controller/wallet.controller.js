import { responseHandler } from "../util/index.js";
import WalletService from "../service/wallet.service.js";
import { WALLET_TYPE } from "../constant/index.js";
import mongoose from "mongoose";

export default class WalletController {
    static async getWalletBalance(req, res) {
        try {

            const { user } = req;
            const wallet = await WalletService.getUserBalance(user.userId);

            return responseHandler(res, true, 200, "Balance retrieved successfully", { id: user.userId, balance: wallet });

        } catch (err) {
            return responseHandler(res, false, 500, err.message, null)
        }
    }

    static async creditWallet(req, res) {
        try {
            const { balance, receiver } = req.body;
            const { user } = req;

            await WalletService.createWallet(user.userId, balance, receiver);
            return responseHandler(res, true, 201, "Wallet credited successfully", null);

        } catch (err) {
            return responseHandler(res, false, 500, err.message, null)
        }
    }

    static async debitWallet(req, res) {
        const session = await mongoose.startSession();
        try {
            const { balance, receiver } = req.body;
            const { user } = req;

            //here transition more 
            session.startTransaction();

            await WalletService.debitWallet(user.userId, balance, receiver);

            await session.commitTransaction();
            session.endSession();
            return responseHandler(res, true, 200, "Wallet debited successfully", null);

        } catch (err) {
            await session.abortTransaction();
            session.endSession()
            if (err.message === "Insufficient balance") {
                return responseHandler(res, false, 400, { message: err.message, balance: err.balance }, null);
            }
            return responseHandler(res, false, 500, err.message, null)
        }
    }

    static async getWalletTransactions(req, res) {
        try {
            const { user } = req;
            const transactions = await WalletService.getUserTransactions(user.userId);

            const finalData = transactions.map(transaction => ({
                id: transaction._id,
                sender: {
                    id: transaction.sender?._id,
                    email: transaction.sender?.email
                },
                receiver: {
                    id: transaction.receiver?._id,
                    email: transaction.receiver?.email
                },
                balance: transaction.type === WALLET_TYPE.CREDIT ? transaction.balance : -transaction.balance,
                createdAt: transaction.createdAt
            }));
            return responseHandler(res, true, 200, "Transactions retrieved successfully", finalData);
        } catch (err) {
            return responseHandler(res, false, 500, err.message, null);
        }
    }
}
