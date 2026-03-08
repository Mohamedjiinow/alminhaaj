import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "student", required: true },
    studentName: { type: String, ref: "student", required: true },
    rollNumber: { type: String, ref: "student", required: true },
    responsiblePhone: { type: String, ref: "student", required: true },
    date: { type: Date, required: true }, // Saacad la'aan ayaan ka dhigaynaa
    status: { type: String, enum: ["Present", "Absent"], required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
}, { timestamps: true });

// Midkaani wuxuu diidayaa in arday hal maalin labo jeer la xaadiro
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.models.attendance || mongoose.model("attendance", attendanceSchema);
export default Attendance;