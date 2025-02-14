import nodeMailer from "nodemailer";
import Mech from '../models/Mech.js';


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
        text: `${options.message} \n\n `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email.");
    }
};
export default sendEmail;


export const sendMail = async (req, res) => {
    const { mechanicId, selectedDate, message, userName, userEmail, userMobileNumber } = req.body; // Include user data

    try {
        // Fetch the mechanic's details by ID
        const mechanic = await Mech.findById(mechanicId);
        
        if (!mechanic) {
            return res.status(404).json({
                success: false,
                message: "Mechanic not found.",
            });
        }

        // Construct the message that will be sent via email
        const emailMessage = `
            A booking has been made with the following details:


            - Selected Date: ${selectedDate}
           
            - User Name: ${userName}
            - User Email: ${userEmail}
            - User Mobile: ${userMobileNumber}

             ${message ? `- Message from the user: ${message}` : ''}

            Please accept or reject the booking from your dashboard
        `;

        // Send the email to the mechanic
        await sendEmail({
            email: mechanic.email, // Mechanic's email from the database
            subject: "Service Booking",
            message: emailMessage, // Send the constructed message to the mechanic
        });

        res.status(200).json({
            success: true,
            message: "Booking email sent successfully to the mechanic",
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error, please try again",
        });
    }
};
