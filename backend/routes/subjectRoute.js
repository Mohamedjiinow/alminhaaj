import express from "express";
import { addSubject, getSubjects, updateSubject, deleteSubject } from "../controllers/subcontroller.js";
import authAdmin from "../middleware/Authadmin.js";
import authUser from "../middleware/Authuser.js";

const subjectRouter = express.Router();

subjectRouter.post("/add", authAdmin, addSubject);
subjectRouter.get("/list", authUser, getSubjects);
subjectRouter.put("/update/:id",authAdmin, updateSubject);
subjectRouter.delete("/remove/:id", authAdmin, deleteSubject);

export default subjectRouter;