import { Router } from "express";
import {addReportType, 
    getReportTypes,
    searchReportTypes,
    getReportTypeById,
    updateReportType,
    deleteReportType
 } from "./report-type.controller";


const router = Router();


router.post("/report-types", addReportType);

router.get("/report-types", getReportTypes);
router.get("/report-types/search", searchReportTypes);
router.get("/report-types/:id", getReportTypeById);
router.patch("/report-types/:id", updateReportType);
router.delete("/report-types/:id", deleteReportType);

export default router;