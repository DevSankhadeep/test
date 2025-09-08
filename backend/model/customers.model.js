const mongoose = require("mongoose");
const { Schema } = mongoose;

const customersSchema = new Schema({
    accountNo: { type: Number, unique: true, required: true },
    fullname: { type: String, required: true },
    mobile: String,
    fatherName: String,
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    dob: String,
    gender: String,
    currency: String,
    key: String,
    profile: String,
    signature: String,
    document: String,
    finalBalance: {
        type: Number,
        default: 0
    },
    address: String,
    userType: String,
    branch: String,
    createdBy: String,
    customerLoginId: String,
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("customers", customersSchema);