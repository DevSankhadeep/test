const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const usersSchema = new Schema({
    fullname: { type: String, required: true },
    mobile: String,
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    password: { type: String, required: true },
    profile: String,
    key: String,
    address: String,
    branch: String,
    userType: String,
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

usersSchema.pre("save", async function (next) {
    try {
        const user = this;
        if (!user.isModified("password")) return next();
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("users", usersSchema);