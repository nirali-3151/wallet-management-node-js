import { WALLET_TYPE } from "../constant/index.js";
import Wallet from "../model/wallet.model.js";
import mongoose from "mongoose";
const { ObjectId: objectId } = mongoose.Types;

export default class WalletService {
    static async createWallet(userId, balance, receiver) {
        const wallet = new Wallet({ sender: userId, balance, type: WALLET_TYPE.CREDIT, receiver: receiver });
        await wallet.save();
        return wallet;
    }

    static async getUserBalance(userId) {        
        const credits = await Wallet.aggregate([
            { $match: { sender: new objectId(userId), type: WALLET_TYPE.CREDIT } },
            { $group: { _id: null, total: { $sum: "$balance" } } }
        ]);
        const debits = await Wallet.aggregate([
            { $match: { sender: new objectId(userId), type: WALLET_TYPE.DEBIT } },
            { $group: { _id: null, total: { $sum: "$balance" } } }
        ]);
        
        const creditTotal = credits[0]?.total || 0;
        const debitTotal = debits[0]?.total || 0;
        return creditTotal - debitTotal;
    }

    static async debitWallet(userId, balance, receiver) {
        const currentBalance = await this.getUserBalance(userId);
        if (currentBalance < balance) {
            const error = new Error("Insufficient balance");
            error.balance = currentBalance;
            throw error;
        }
        const wallet = new Wallet({ sender: userId, balance, type: WALLET_TYPE.DEBIT, receiver: receiver });
        await wallet.save();
        return wallet;
    }

    static async getUserTransactions(userId) {
        return Wallet.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
        .sort({ _id: -1 }) 
        .populate('sender', 'id email')
        .populate('receiver', 'id email');
    }

}