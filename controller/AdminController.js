import jwt from 'jsonwebtoken'

// API for admin login 
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate admin credentials
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Generate token with concatenated string of email and password
            const token = jwt.sign(email + password, process.env.JWT_SECRET_KEY);
            return res.json({
                success: true,
                token
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export { loginAdmin };