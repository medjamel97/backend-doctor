// authRoutes.mjs
import express from "express";
import * as controller from "../controllers/medecin.controller.js";

const router = express.Router();

// PATH = /medecin

router.get("/", controller.getAll);
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/forgot-password/send-email", controller.forgotPassword);
router.post("/forgot-password/verify-reset-code", controller.verifyResetCode);
router.post("/forgot-password/reset-password", controller.resetPassword);

export default router;
