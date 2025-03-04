import { genearateToken } from "../lib/utlis.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const {fullName,email,password} = req.body;
    try {
        if (password.length < 6){
            return res.status(400).json({ message : "Password is less than 6"});
        }

        const user = await User.findOne({email});

        if (user) return res.status(400).json({ message : " Email already exist"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User ({
            fullName,
            email,
            password : hashedPassword,
        });

        if(newUser){
            genearateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic : newUser.profilePic,
            });
        }
        else{
            res.status(400).json({ message: "Invalid user data"});
        }

    }catch (error){
        console.log("Error in signuo Controller",error.message);
        res.status(500).json({ message: "Invalid Server Error"});
    }
};

export const login =(req, res) => {
    res.send("login route");
};


export const logout =(req, res) => {
    res.send("logout route");

};