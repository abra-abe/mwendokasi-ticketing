const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

// function to generate QR code
const generateQRCode = async ({ route, price, dateAndTime }) => {
    try{
        const width = 400;
        const height = 500;
        const padding = 20;

        // create canvas
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // set white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        // Set text color and font
        ctx.fillStyle = 'black';
        ctx.font = 'bold 20px Arial';

        // Add Route, Price, and Date/Time information at the top
        ctx.fillText(`Route: ${route}`, padding, 30);
        ctx.fillText(`Price: ${price}`, padding, 60);
        ctx.fillText(`Date/Time: ${dateAndTime}`, padding, 90);

        const text = 'https://john-kisomo.onrender.com';

        // generate the qr code as a data url 
        const qrDataUrl = await QRCode.toDataURL(text, { errorCorrectionLevel:'H' });

        // load the QR code image
        const qrImage = await loadImage(qrDataUrl);

        // Draw the QR code on the canvas below the text
        ctx.drawImage(qrImage, padding, 120, width - padding * 2, width - padding * 2);

        // Convert canvas to a buffer
        const buffer = canvas.toBuffer('image/png');

        return buffer;

    }catch (err) {
        console.error(`Error generating the QR code: ${err}`);
        throw new Error('Failed to generate QR code');
    }
}

module.exports = { generateQRCode }