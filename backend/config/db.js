import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // Waxaan isticmaalaynaa xogta ku jirta .env
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`DB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Server-ka ha iska damiyo haddii DB uu ku xirmi waayo
    }
}