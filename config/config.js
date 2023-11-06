
process.env.ALLOW_CONFIG_MUTATIONS = 'true';
/* eslint-disable camelcase */
const config = require('config');
const dotenv = require('dotenv');
const Joi = require('joi');
const {generateRefreshTokenSecretKey, generateRandomString} = require('../src/utils/utils');

dotenv.config();

const configEnv = config.get('config');

if (!configEnv.AUTHENTICATION.REFRESH_TOKEN_SECRET_KEY) {
	configEnv.AUTHENTICATION.REFRESH_TOKEN_SECRET_KEY = generateRefreshTokenSecretKey();
}

if (!configEnv.AUTHENTICATION.REFRESH_TOKEN_ISSUER) {
	configEnv.AUTHENTICATION.REFRESH_TOKEN_ISSUER = generateRefreshTokenSecretKey();
}

if (!configEnv.AUTHENTICATION.JWT_TOKEN_ISSUER) {
	configEnv.AUTHENTICATION.JWT_TOKEN_ISSUER = generateRandomString(12);
}

if (!configEnv.AUTHENTICATION.JWT_TOKEN_SECRET_KEY) {
	configEnv.AUTHENTICATION.JWT_TOKEN_SECRET_KEY = generateRefreshTokenSecretKey();
}

const envVarsSchema = Joi.object({
	ENV: Joi.object({
		APP_HOST: Joi.string().required().description('The application host URL'),
		ASTRO_HOST: Joi.string().required().description('The Astro host URL'),
		WEBHOOK_HOST: Joi.string().required().description('The webhook host URL'),
		PORT: Joi.string().required().description('The application port'),
		ENVIRONMENT: Joi.string().required().description('The environment of the app'),
	}).description('Environments setting'),
	DATABASE: Joi.object({
		TYPE: Joi.string().required().description('The type of database (e.g., mongodb)'),
		URL: Joi.string().required().description('The database connection URL'),
		PORT: Joi.number().required().description('The database port'),
		DBNAME: Joi.string().required().description('The name of the database'),
		MONGO_AUTHENTICATION_ENABLED: Joi.boolean().required().description('MongoDB authentication enabled'),
	}).description('Database settings'),
	DEBUG_MONGOOSE: Joi.boolean().required().description('Debug Mongoose enabled'),
	REDIS: Joi.object({
		HOST: Joi.string().required().description('Redis host'),
		PORT: Joi.number().required().description('Redis port'),
		PASSWORD: Joi.string().required().description('Redis password'),
		SSL_ENABLED: Joi.boolean().required().description('SSL for Redis enabled'),
	}).description('Redis settings'),
	KAFKA: Joi.object({
		HOST: Joi.string().required().description('Kafka host'),
		USER: Joi.string().required().description('Kafka username'),
		PASSWORD: Joi.string().required().description('Kafka password'),
		PORT: Joi.number().required().description('Kafka port'),
	}).description('Kafka settings'),
	SMTP: Joi.object({
		HOST: Joi.string().required().description('SMTP host'),
		PORT: Joi.number().required().description('SMTP port'),
		USERNAME: Joi.string().required().description('SMTP username'),
		PASSWORD: Joi.string().required().description('SMTP password'),
		EMAIL_FROM: Joi.string().required().description('Email sender address'),
	}).description('SMTP settings'),
	TWILIO: Joi.object({
		ACCOUNT_SID: Joi.string().required().description('account id of twilio user'),
		AUTH_TOKEN: Joi.string().required().description('auth token of twilio user'),
		MOB_NUMBER: Joi.string().required().description('mobile number of sender'),
	}).description('Twilio settings'),
	AUTHENTICATION: Joi.object({
		OTP_LENGTH: Joi.number().required().description('length of otp of the number'),
		SALT_RANDOM: Joi.number().required().description('salted random number'),
		REFRESH_TOKEN_SECRET_KEY: Joi.string().required().description('refresh token secret key'),
		REFRESH_TOKEN_ISSUER: Joi.string().required().description('refresh token issuer'),
		JWT_TOKEN_ISSUER: Joi.string().required().description('jwt token issuer'),
		JWT_TOKEN_SECRET_KEY: Joi.string().required().description('jwt token secret key'),
		REFRESH_TOKEN_EXPIRATION: Joi.string().required().description('refresh token expiration'),
		JWT_TOKEN_EXPIRATION: Joi.string().required().description('jwt token expiration'),
		TOKEN_ALGORITHM: Joi.string().required().description('token algorithm'),
	}).description('authentication settings'),
}).unknown(true);

const {error, value: envVars} = envVarsSchema.validate(configEnv);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

const configuration = {
	env: {
		app_host: process.env.APP_HOST || envVars.APP_HOST,
		astro_host: process.env.ASTRO_HOST || envVars.ASTRO_HOST,
		webhook_host: process.env.WEBHOOK_HOST || envVars.WEBHOOK_HOST,
		port: process.env.PORT || envVars.PORT,
		environment: process.env.ENVIRONMENT || envVars.ENVIRONMENT,
	},
	database: {
		type: process.env.DATABASE_TYPE || envVars.DATABASE.TYPE,
		url: process.env.DATABASE_URL || envVars.DATABASE.URL,
		port: process.env.DATABASE_PORT || envVars.DATABASE.PORT,
		dbname: process.env.DATABASE_DBNAME || envVars.DATABASE.DBNAME,
		mongo_authentication_enabled: process.env.DATABASE_MONGO_AUTHENTICATION_ENABLED || envVars.DATABASE.MONGO_AUTHENTICATION_ENABLED,
	},
	debug_mongoose: process.env.DEBUG_MONGOOSE || envVars.DEBUG_MONGOOSE,
	redis: {
		host: process.env.REDIS_HOST || envVars.REDIS.HOST,
		port: process.env.REDIS_PORT || envVars.REDIS.PORT,
		password: process.env.REDIS_PASSWORD || envVars.REDIS.PASSWORD,
		ssl_enabled: process.env.REDIS_SSL_ENABLED || envVars.REDIS.SSL_ENABLED,
	},
	kafka: {
		host: process.env.KAFKA_HOST || envVars.KAFKA.HOST,
		user: process.env.KAFKA_USER || envVars.KAFKA.USER,
		password: process.env.KAFKA_PASSWORD || envVars.KAFKA.PASSWORD,
		port: process.env.KAFKA_PORT || envVars.KAFKA.PORT,
	},
	smtp: {
		host: process.env.SMTP_HOST || envVars.SMTP.HOST,
		port: process.env.SMTP_PORT || envVars.SMTP.PORT,
		username: process.env.SMTP_USERNAME || envVars.SMTP.USERNAME,
		password: process.env.SMTP_PASSWORD || envVars.SMTP.PASSWORD,
		email_from: process.env.SMTP_EMAIL_FROM || envVars.SMTP.EMAIL_FROM,
	},
	twilio: {
		account_sid: process.env.ACCOUNT_SID || envVars.TWILIO.ACCOUNT_SID,
		auth_token: process.env.AUTH_TOKEN || envVars.TWILIO.AUTH_TOKEN,
		mob_number: process.env.MOB_NUMBER || envVars.TWILIO.MOB_NUMBER,
	},
	authentication: {
		otp_length: process.env.OTP_LENGTH || envVars.AUTHENTICATION.OTP_LENGTH,
		salt: process.env.SALT_RANDOM || envVars.AUTHENTICATION.SALT_RANDOM,
		refresh_token_secret_key: process.env.REFRESH_TOKEN_SECRET_KEY || envVars.AUTHENTICATION.REFRESH_TOKEN_SECRET_KEY,
		refresh_token_issuer: process.env.REFRESH_TOKEN_ISSUER || envVars.AUTHENTICATION.REFRESH_TOKEN_ISSUER,
		jwt_token_issuer: process.env.JWT_TOKEN_ISSUER || envVars.AUTHENTICATION.JWT_TOKEN_ISSUER,
		jwt_token_secret_key: process.env.JWT_TOKEN_SECRET_KEY || envVars.AUTHENTICATION.JWT_TOKEN_SECRET_KEY,
		jwt_token_expiration: process.env.JWT_TOKEN_EXPIRATION || envVars.AUTHENTICATION.JWT_TOKEN_EXPIRATION,
		refresh_token_expiration: process.env.REFRESH_TOKEN_EXPIRATION || envVars.AUTHENTICATION.REFRESH_TOKEN_EXPIRATION,
		token_algortihm: process.env.TOKEN_ALGORITHM || envVars.AUTHENTICATION.TOKEN_ALGORITHM,
	},
};

module.exports = configuration;
