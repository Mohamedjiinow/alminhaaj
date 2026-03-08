import express from "express";
import { addStudent, getStudents, updateStudent, deleteStudent, payFee, } from "../controllers/studentcontroller.js";
import authUser from "../middleware/Authuser.js";

const studentRouter = express.Router();

studentRouter.post("/add",authUser, addStudent);
studentRouter.get("/list",authUser, getStudents);
studentRouter.put("/update/:id",authUser, updateStudent);
studentRouter.delete("/remove/:id",authUser, deleteStudent);
studentRouter.post('/pay-fee', authUser, payFee)

export default studentRouter;