// authRoutes.mjs
import express from "express";
import * as controller from "../controllers/rendez-vous.controller.js";

const router = express.Router();

// PATH = /rendez-vous

router.get("/", controller.getAll);
router.post("/", controller.add);
router.put("/", controller.update);
router.delete("/", controller.remove);

export default router;
