require('dotenv').config();
const AfricasTalking = require('africastalking');

const africastalking = AfricasTalking({
    apiKey: process.env.AT_API,
    username: 'sandbox'
})

const sendSMS = async (phoneNumber, text) => {
    try{
        const result = await africastalking.SMS.send({
            to: phoneNumber,
            message: text,
            from: 'Agro'
        });
        console.log(result);
    }catch(err){
        console.error(err);
    }
}

module.exports = { sendSMS };