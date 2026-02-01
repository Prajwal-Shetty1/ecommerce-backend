import userModels from "../models/userModels.js"
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const createToken =(id) => {
    return jwt.sign({id},process.env.JWT_SECRET);
}
//Routes for UserLogin
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModels.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = createToken(user._id);
        return res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


//Routes for UserRegister
const registerUser = async (req,res) => {
    //res.json({msg:"Register API working"})

    try {
        const { name, email, password } = req.body;
        //check user alredy exists or not
        const exists = await userModels.findOne({email});
        if(exists){
            return res.json({success:false,msg:"User Already Exists!"});
        }
        //validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,msg:"Please enter a valid email!"})
        }
        if(!password || password.length < 8){
            return res.json({success:false,msg:"Please enter a strong password!"});
        }
        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = await new userModels({
            name,email,password:hashedPassword
        })
        //saveit
        const user = await newUser.save();

        const token = createToken(user._id);
        res.json({success:true,token});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

//Routes for AdminLogin
const adminLogin = async (req,res) => {

}

export {loginUser,registerUser,adminLogin};