import jwt from 'jsonwebtoken';

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        // Fetch token from headers
        const { atoken } = req.headers;
        console.log(atoken);
        console.log(req.headers)
        if (!atoken) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }
        // Verify the token by decoding it
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET_KEY);

        // Check if the token's email matches the admin email
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(403).json({
                success: false,
                message: "Token does not match the admin email"
            });
        }

        // If all is correct, call the next function
        next();

    } catch (error) {
        // console.log(error);
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

export default authAdmin;


