import express from "express";
import WalletController from "../controller/wallet.controller.js";
import { userMiddleware } from "../util/index.js";
import { validateMiddleware } from "../util/index.js";
import { createWalletSchema } from "../middleware/wallet.middleware.js";

const router = express.Router();

router.post("/wallet/credit", userMiddleware, validateMiddleware(createWalletSchema), WalletController.creditWallet);
router.post("/wallet/debit", userMiddleware, validateMiddleware(createWalletSchema), WalletController.debitWallet);
router.get("/wallet/balance", userMiddleware, WalletController.getWalletBalance);
router.get("/wallet/transactions", userMiddleware, WalletController.getWalletTransactions);

export default router;