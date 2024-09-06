require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// import routes
const user = require('./routes/userRoutes');
const trip = require('./routes/tripRoutes');

// ******Configurations*******
// json parser
app.use(express.json());

// express body-parser
app.use(express.urlencoded({extended: true}));

// Routes mapping
app.use('/user', user);

app.use('/trip', trip);

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
})