import GeneralController from "../controllers/general.controllers";
import express from "express";
const router = express.Router();

router.get("/ping", GeneralController.ping);

export default router;
