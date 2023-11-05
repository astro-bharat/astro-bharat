/* eslint-disable no-useless-catch */
// Import the User model
import User, {findById, findByIdAndUpdate, findByIdAndDelete, find, findOne} from '../../models';
import AuthService from './auth.service';

const authService = new AuthService();
class UserService {
	// Create a new user
	async createUser(userData) {
		try {
			const user = new User(userData);
			await authService.sendOtpMessage(userData);
			return await user.save();
		} catch (error) {
			throw error;
		}
	}

	// Retrieve a user by ID
	async getUserById(userId) {
		try {
			return await findById(userId);
		} catch (error) {
			throw error;
		}
	}

	async getUserByMobNumber(mobNumber) {
		try {
			return await findOne({mobNumber});
		} catch (error) {
			throw error;
		}
	}

	// Update user information
	async updateUser(userId, userData) {
		try {
			return await findByIdAndUpdate(userId, userData, {new: true});
		} catch (error) {
			throw error;
		}
	}

	// Delete a user by ID
	async deleteUser(userId) {
		try {
			return await findByIdAndDelete(userId);
		} catch (error) {
			throw error;
		}
	}

	// Retrieve a list of all users
	async getAllUsers() {
		try {
			return await find();
		} catch (error) {
			throw error;
		}
	}
}

export default UserService;
