const logger = require('../features/logger');
import UserService from './user.service';
const {generateOTP, sendSms} = require('../utils/otp.util');

const userService = new UserService();

class AuthService {
	async sendOtpMessage(body) {
		try {
			const {phoneNumber} = body;
			const mobNumber = `${phoneNumber.countryCode}${phoneNumber.number}`;
			const otp = generateOTP(4);
			const expireTime = 10;
			const otpMessage = `Your OTP for TheAstroBharat: ${otp}

            Valid for ${expireTime} minutes. Use it to verify your mobile number.

            TheAstroBharat Team
            `;
			const userPaylod = {
				phoneOtp: otp,
			};
			const [updatedUser] = await Promise.all([userService.updateUser(body.userId, userPaylod), sendSms({message: otpMessage, contactNumber: mobNumber})]);
			return updatedUser;
		} catch (err) {
			logger.error(err);
			throw err;
		}
	}

	async verifyOtpUser(body) {
		try {
			const userDetails = await userService.getUserByMobNumber(body.mobNumber);
			const {phoneOtp} = userDetails;
			if (phoneOtp === body.phoneOtp) {
				return true;
			}

			return false;
		} catch (err) {
			logger.error(err);
			throw err;
		}
	}
}

export default AuthService;
