const mongoose = require('mongoose');
const logger = require('../features/logger');
const config = require('../../config/config');
const Ticket = require('../models/ticket.model');
const seedsData = require('../seeds');

const connectDB = async () => {
    try {
        const dbUri = `${config.database.url}${config.database.dbname}`;
        await mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true});
        if (config.debug_mongoose) {
            mongoose.set('debug', true);
        }

        logger.info('db connected');
    } catch (err) {
        logger.error('db error', err);
    }
};

const seedDataInsert = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        const totalTickets = await Ticket.countDocuments();
        if (totalTickets <= 0) {
            logger.info('Inserted seed data');
            return Ticket.create(seedsData);
        }

        // Logger.info('Already inserted not need to insert seed data');
    } catch (err) {
        throw err;
    }
};

module.exports = {connectDB, seedDataInsert};
