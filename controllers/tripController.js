const Trip = require('../models/trip');
const User = require('../models/user');
const { sendSMS } = require('../utils/sendSMS');
const { generateQRCode } = require('../utils/QRcodeGenerator');

// function for booking ticket
const bookTicket = async (req, res) => {
    try{
        const { phone, routeID } = req.body;

        // fetch username from phone number
        const user = await User.findOne({phone: phone});

        if(!user){
            console.log(`user with number ${phone} does not exist, check the number`);
            return res.status(400).json({message: "The number does not exist check the number format"})
        }

        const username = user.username;

        const price = 750;

        var route = ""

        // check for routes..
        // PS: this code was written at 2 in the morning, if it works don't touch it
        if(routeID == '001'){
            var route = "Kimara-Kivukoni"
        }else if (routeID == '002'){
            var route = "Ubungo-Kivukoni"
        }else if (routeID == '003'){
            var route = "Morroco-Kivukoni"
        }else if (routeID == '004'){
            var route = "Kimara-Gerezani"
        }else if (routeID == '005'){
            var route = "Ubungo-Gerezani"
        }else if (routeID == '006'){
            var route = "Morroco-Gerezani"
        }else if (routeID == '007'){
            var route = "Kimara-Morroco"
        }else if (routeID == '008'){
            var route = "Ubungo-Morroco"
        }else if (routeID == '009'){
            var route = "Kimara-Ubungo"
        }else if (routeID == '080'){
            var route = "Muhimbili-Gerezani"
        }else if (routeID == '090'){
            var route = "Mbezi-Kimara"
        }else {
            // not sure how you got here but ok...
            return res.status(400).json({message: "You somehow managed to input a wrong value...HOW???"})
        }// should've just used switch statement

        //set the date (add 3 hours for local time)
        dateAndTime = new Date(Date.now() + (3 * 60 * 60 * 1000));

        const newTrip = new Trip ({
            username: username,
            phone: phone,
            route: route,
            price: price,
            dateAndTime: dateAndTime
        });

        newTrip.save();

        // Generate the QR code with trip information
        const qrCodeBuffer = await generateQRCode({
            route,
            price,
            dateAndTime: dateAndTime.toISOString(),
            text: `Route: ${route}, Price: ${price}, Date/Time: ${dateAndTime.toISOString()}`
        });

        // send confirmation SMS
        await sendSMS(phone, 'You have successfully booked your ticket');

        // res.status(200).json({message: "Trip successfully created"});
        
        // Send the QR code image as a response
        res.setHeader('Content-Type', 'image/png');
        res.send(qrCodeBuffer);
    }catch(err){
        console.error(`An error occured booking a ticket: ${err}`);
        res.status(500).json({error: "An error occured while booking a ticket"});
    }
}

module.exports = { bookTicket }