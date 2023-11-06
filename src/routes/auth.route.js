/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const {verifyOtpUser, sendOtpUser} = require('../controllers/auth.controller');

router.post('/verify-otp', verifyOtpUser);
router.post('/send-otp', sendOtpUser);

module.exports = router;
