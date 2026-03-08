import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 1. Get All Users (Admin Only can use this usually)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json({ success: true, data: users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
//2. registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Fadlan buuxi meelaha bannaan" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "Email-kan mar hore ayaa la isticmaalay" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || "teacher" 
        });

        const user = await newUser.save();

        // --- QAYBTA CUSUB: SAMEE TOKEN ---
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

        res.json({ 
            success: true, 
            message: "User-ka waa la diiwaan-geliyay",
            token, // Token-ka halkan ku dar
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 3. Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User-kan ma jiro!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Password-ku waa khalad!" });
        }

        // Token-ka waxaa lagu daray Role si middleware-ku u shaqeeyo
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ 
            success: true, 
            message: "Si guul leh ayaad u gashay", 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                role: user.role,
                email: user.email 
            } 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// 4. Delete User
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "User-ka waa la tirtiray" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};