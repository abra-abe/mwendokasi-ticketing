require('dotenv').config();
const mongoose = require('mongoose');

// connect to mongodb
let uri = process.env.MONGO_URI;
mongoose.connect(uri);

// create the schema
const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    phone: {
        type: String
    },
    otp: {
        type: String
    },
    otpExpiration:{
        type: Date,
        default: () => {
            // Set OTP expiration time to 10 minutes from now in local time
            let localTime = new Date();
            // Add 10 minutes
            localTime.setMinutes(localTime.getMinutes() + 10);
            return localTime;
        }
    }
});

// Before saving, adjust the otpExpiration to your local time
userSchema.pre('save', function (next) {
    if (this.otpExpiration) {
        // Convert to local time before saving
        this.otpExpiration = new Date(this.otpExpiration.toLocaleString());
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
