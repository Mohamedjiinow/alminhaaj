import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.json({ success: false, message: "Token lama helin, fadlan login dheh." });
        }

        // Hubi token-ka
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // --- XALKA CILADDA ---
        // Halkii aad req.body wax ku dari lahayd (oo GET-ku uusan lahayn)
        // si toos ah req ugu dar userId.
        req.userId = token_decode.id; 

        // Haddii aad qasab u baahan tahay req.body (tusaale POST request)
        if (req.method !== 'GET') {
            if (!req.body) req.body = {};
            req.body.userId = token_decode.id;
        }

        next();

    } catch (error) {
        console.log("Cilad JWT:", error.message);
        res.json({ success: false, message: "Token-ku waa khalad ama wuu dhacay" });
    }
};

export default authUser;