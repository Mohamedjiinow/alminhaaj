import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    description: { type: String }
}, { timestamps: true });

const Subject = mongoose.models.subject || mongoose.model("subject", subjectSchema);
export default Subject;