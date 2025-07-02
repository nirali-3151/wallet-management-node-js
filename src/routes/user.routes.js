import express from "express";
import UserController from "../controller/user.controller.js";

const router = express.Router();

router.post("/user/start-session" , UserController.startSession);

export default router;