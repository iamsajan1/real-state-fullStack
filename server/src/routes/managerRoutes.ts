import express from "express";
import { createManager, getManager, getManagerProperties, updatedManager } from "../controllers/managerControllers";
 const router=express.Router();


router.get("/:cognitoId",getManager);
router.put("/:cognitoId",updatedManager);
router.get("/:cognitoId/properties", getManagerProperties);
router.post("/",createManager);
export default router;