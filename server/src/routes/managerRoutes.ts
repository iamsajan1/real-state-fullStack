import express from "express";
import { createManager, getManager, updatetManager } from "../controllers/managerControllers";
 const router=express.Router();


router.get("/:cognitoId",getManager);
router.put("/:cognitoId",updatetManager);

router.post("/",createManager);
export default router;