import mongoose from "mongoose";
import { WALLET_TYPE } from "../constant/index.js";

const walletSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    type: {
        type: Number,
        enum: [WALLET_TYPE.CREDIT, WALLET_TYPE.DEBIT],
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;