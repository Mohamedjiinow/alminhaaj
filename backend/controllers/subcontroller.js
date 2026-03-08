import Subject from "../models/subjectmodel.js";

// 1. Create - Add Subject
export const addSubject = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const newSubject = new Subject({ name, price, description });
        await newSubject.save();
        res.json({ success: true, message: "Maaddada waa la daray" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 2. Read - Get All Subjects
export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({});
        res.json({ success: true, data: subjects });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 3. Update - Edit Subject
export const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        await Subject.findByIdAndUpdate(id, req.body);
        res.json({ success: true, message: "Maaddada waa la cusboonaysiiyay" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 4. Delete - Remove Subject
export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        await Subject.findByIdAndDelete(id);
        res.json({ success: true, message: "Maaddada waa la tirtiray" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};