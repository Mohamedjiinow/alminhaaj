import express from "express";
import { markAttendance, getAttendanceByDate, getAttendanceSummary} from "../controllers/attendancecontroller.js";
import authUser from "../middleware/Authuser.js";

const attendanceRouter = express.Router();

attendanceRouter.post("/save",authUser, markAttendance);
attendanceRouter.get("/get",authUser, getAttendanceByDate);
attendanceRouter.get('/summary',authUser, getAttendanceSummary);
export default attendanceRouter;