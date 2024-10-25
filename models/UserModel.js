import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: function() {
            // Generate a default image URL based on the first letter of the user's name
            const firstLetter = this.name ? this.name.charAt(0).toUpperCase() : 'U'; // Default to 'U' if name is not provided
            return `https://example.com/default-${firstLetter}.png`;
        },
    },
    address: {
       type:String,
       required:true,
    },
    gender: {
        type: String,
        default: "Not Selected",
    },
    phone: {
        type: String, 
        default: "0000000000",
    },
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
