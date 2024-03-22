// authRoutes.mjs
import express from "express";
import * as controller from "../controllers/dossier-medical.controller.js";

const router = express.Router();

// PATH = /dossier-medical

router.get("/", controller.getAll);
router.post("/", controller.add);
router.put("/", controller.update);
router.delete("/", controller.remove);

export default router;
