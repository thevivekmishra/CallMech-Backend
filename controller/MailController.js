import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: `${options.message} \n\n Email of user who sent the message: ${options.userEmail}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email.");
    }
};

export default sendEmail; // Change to default export

export const sendMail = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Please provide all details",
        });
    }

    try {
        await sendEmail({
            email: "vivekmishra89994@gmail.com",
            subject: "Service Booking",
            message,
            userEmail: email,
        });

        res.status(200).json({
            success: true,
            message: "Message sent successfully",
        });
    } catch (error) {
        console.error("Email sending error:", error); // Debugging log
        res.status(500).json({
            success: false,
            message: "Internal server error, please try again",
        });
    }
};
