require("dotenv").config();
const dbService = require("../services/db.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../model/users.model");
const Customers = require("../model/customers.model");
const loginFunc = async (req, res, schema) => {
    try {
        const { email, password } = req.body;
        const query = { email };
        const dbRes = await dbService.findOneRecord(query, schema);
        if (dbRes) {
            const isMatch = await bcrypt.compare(password, dbRes.password);
            if (isMatch) {
                if (dbRes.isActive) {
                    /* delete dbRes._doc.password;
                     const payload = {
                         ...dbRes._doc, 
                         _id : dbRes._id.toString()
                 }*/
                    const userData = dbRes.toObject ? dbRes.toObject() : { ...dbRes };
                    delete userData.password;
                    /*const payload = {
                        ...userData,
                        _id: dbRes._id.toString()
                    }*/
                    const db = await Customers.findOne(
                        {email},
                        {_id:0, accountNo:1}
                    );
                   let payload = null;
                    db? 
                     payload = {
                        ...userData,
                        _id : dbRes._id.toString(),
                        accountNo : db.accountNo
                    }
                    :
                    payload = {
                        ...userData,
                        _id : dbRes._id.toString()
                    }
                    const token = await jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        { expiresIn: "3h" }
                    )
                    return res.status(200).json({
                        message: "Data found!",
                        isLoged: true,
                        token,
                        userType: userData.userType
                    });
                } else {
                    return res.status(401).json({
                        message: "You are not active member!",
                        isLoged: false
                    });
                }

            } else {
                return res.status(401).json({
                    message: "Invaild credencials!",
                    isLoged: false
                });
            }

        }
        else {
            return res.status(401).json({
                message: "Invaild credencials!",
                isLoged: false
            });
        }

    } catch (error) {
        /*return res.status(500).json({
            message: "Internal server error!",
            isLoged: false,
            error
        });*/
        console.error("Login error:", error.message, error.stack);  // 👈 add this
        return res.status(500).json({
            message: "Internal server error!",
            isLoged: false,
            error
        });
    }
}
module.exports = {
    loginFunc
}