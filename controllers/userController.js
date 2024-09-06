const { OTPGenerator } = require('../utils/OTPgenerator');
const { sendSMS } = require('../utils/sendSMS');
const User = require('../models/user');
const { connectToDatabase } = require('../conf/db');

const registerUser = async (req, res) => {
    //registering the user
    try{
        const { username, phone } = req.body;

        // check if the phone number already exists
        const db = await connectToDatabase();
        const users = db.collection('users');
        const user = await users.findOne({phone: phone});

        if(user){
            return res.status(400).json({message: "User with phone number already exists"})
        }

        // generate One-Time-Passcode
        const otp = OTPGenerator();

        // send OTP via SMS
        await sendSMS(phone, otp);

         // Calculate OTP expiration (current time + 3 hours + 10 minutes)
        // 3 hours + 10 minutes in milliseconds
        const otpExpiration = new Date(Date.now() + (3 * 60 * 60 * 1000) + (10 * 60 * 1000));

        // create and save new user
        const newUser = new User ({
            username: username,
            phone: phone,
            otp: otp,
            otpExpiration: otpExpiration
        });

        newUser.save();

        res.status(200).json({message: "User created successfully"})
    }catch(err) {
        console.error(`An error occured while creating a user: ${err}`);
        res.status(500).json({"error": "An error occured creating the user"})
    }
}

const verifyUser = async (req, res) => {
    try{
        const { phone, otp } = req.body;

        // check if the phone number is registered
        const db = await connectToDatabase();
        const users = db.collection('users');

        const user = await users.findOne({phone: phone});
        if(!user){
            return res.status(400).json({message: "The number is not registered"})
        }

        // verify the OTP
        if(user.otp != otp || user.otpExpiration < Date.now()){
            return res.status(400).json({message: "Invalid OTP"})
        }

        res.status(200).json({success: true, message: "OTP verified successfully"})
    }catch(err) {
        console.error(`Error verifying the OTP: ${err}`);
        res.status(500).json({error: "Failed to verify the OTP"})
    }
}

// authorize user
const authorizeUser = async (req, res) => {
    try{
        const { phone } = req.body;

        const otp = OTPGenerator();
        const otpExpiration = new Date(Date.now() + (3 * 60 * 60 * 1000) + (10 * 60 * 1000));

        // update the otp and otpExpiration in the collection
        await User.findOneAndUpdate(
            {phone: phone},
            {otp: otp, otpExpiration: otpExpiration}
        );

        // send the OTP via SMS
        await sendSMS(phone, otp);

        res.status(200).json({message: "OTP generated and sent successfully"})
    }catch(err){
        console.error(`An error occured while authorizing the user: ${err}`);
        res.status(500).json({message: "An error occured while authorizing the user"})
    }
}

module.exports = { registerUser, verifyUser, authorizeUser }