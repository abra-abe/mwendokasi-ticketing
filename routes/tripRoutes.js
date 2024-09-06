const express = require('express');
const router = express.Router();
const { bookTicket } = require('../controllers/tripController');

router.post('/book-ticket', bookTicket);

module.exports = router;