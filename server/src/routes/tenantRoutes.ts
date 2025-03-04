import express from "express";
import { createTenant, getTenant, updatetTenant } from "../controllers/tenantControllers";
const router=express.Router();


router.get("/:cognitoId",getTenant);
router.put("/:cognitoId",updatetTenant);
router.post("/",createTenant);
export default router;