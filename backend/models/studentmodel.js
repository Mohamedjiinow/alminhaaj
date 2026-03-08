// models/studentmodel.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, unique: true }, // Waxaan u baahanahay midkan inuu auto noqdo
    responsibleName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: [true, "Fadlan dooro Jinsiga"] },
    responsiblePhone: { type: String, required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "subject" }],
    discount: { type: Number, default: 0 },
    feeStatus: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    lastPaymentMonth: { type: String, default: "" },
    paymentHistory: [{
        amount: Number,
        month: String,
        date: { type: Date, default: Date.now },
        evcReference: String
    }]
}, { timestamps: true });

studentSchema.pre("save", async function () {
    // Kaliya haddii uusan lahayn Roll Number ama uusan ku bilaaban STD
    if (!this.rollNumber || !this.rollNumber.startsWith("STD")) {
        try {
            const lastStudent = await this.constructor.findOne(
                { rollNumber: /^STD/ },
                { rollNumber: 1 },
                { sort: { rollNumber: -1 } }
            );

            let nextNumber = 1;
            if (lastStudent && lastStudent.rollNumber) {
                const lastNumber = parseInt(lastStudent.rollNumber.replace("STD", ""), 10);
                if (!isNaN(lastNumber)) {
                    nextNumber = lastNumber + 1;
                }
            } else {
                const count = await this.constructor.countDocuments();
                nextNumber = count + 1;
            }

            this.rollNumber = `STD${nextNumber.toString().padStart(3, '0')}`;
        } catch (error) {
            throw error;
        }
    }
});

const Student = mongoose.models.student || mongoose.model("student", studentSchema);
export default Student;