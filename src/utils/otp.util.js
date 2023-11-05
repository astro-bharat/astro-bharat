const config = require('../config/config');
const logger = require('../features/logger');
const {account_sid: accountSid, auth_token: authToken, mob_number: sender} = config.twilio;
const twilio = require('twilio')(accountSid, authToken);

const generateOTP = otpLength => {
	// Declare a digits variable
	// which stores all digits
	const digits = '0123456789';
	let OTP = '';
	for (let i = 0; i < otpLength; i++) {
		OTP += digits[Math.floor(Math.random() * 10)];
	}

	return OTP;
};

const sendSms = async ({message, contactNumber}, next) => {
	try {
		const res = await twilio.messages.create({
			from: sender,
			to: contactNumber,
			body: message,
		}).then(_res => logger.info('otp messages has sent'));
		logger.info(`result of send sms: ${res}`);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	sendSms,
	generateOTP,
};
