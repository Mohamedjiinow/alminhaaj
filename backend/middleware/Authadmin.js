import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
    try {
        // 1. Ka soo qaad token-ka headers-ka (Badanaa waxaa loo soo diraa magaca 'token')
        const { token } = req.headers;

        // 2. Hubi haddii token uu jiro iyo haddii kale
        if (!token) {
            return res.json({ success: false, message: "Lama oggola, fadlan dib u gasho nidaamka (Token Missing)" });
        }

        // 3. Decode garee Token-ka adigoo isticmaalaya Secret Key-gaaga
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Hubi in qofka leh Token-kan uu yahay Admin
        // Tan waxay shaqaynaysaa haddii aad Role-ka ku dartay Token-ka markii qofku Login samaynayay
        if (token_decode.role !== 'admin') {
            return res.json({ success: false, message: "Error: Ma lahan awood maamul (Admin Only)!" });
        }

        // Haddii wax walba sax yihiin, u gudbi function-ka xiga (Controller-ka)
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Token-kaagu waa mid khaldan ama dhacay: " + error.message });
    }
}

export default authAdmin;