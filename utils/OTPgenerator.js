//OTP Generator function
const OTPGenerator = () => {
    let result = '';
    const numbers =
        '0123456789'
    
    const numberLength = numbers.length;
    for (let i = 0; i < 6; i++) {
        result += numbers.charAt(Math.floor(Math.random() *
        numberLength))
    }
    // console.log(result);
    return result;
};


module.exports = { OTPGenerator };