import express from "express";
import { createVehicle, getAllVehicle, getVehicle } from "../controllers/vehicleCntrl.js";

const router = express. Router();

router.post("/create", createVehicle)
router.get("/allvehicles", getAllVehicle)
router.get("/:id", getVehicle)

export {router as vehicleRoute}