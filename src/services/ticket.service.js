const _ = require('lodash');
const Ticket = require('../models/ticket.model');
// eslint-disable-next-line no-unused-vars
const {emitEvent} = require('../connection/kafka');
const config = require('../../config/config');
// Const httpStatus = require('http-status');

const updateTicketStatus = async (seatNumber, status, userDetails) => {
    const query = {
        seatNumber,
    };
    const update = {
        status,
        userDetails,
    };
    const existingDocument = await Ticket.findOne(query);

    if (existingDocument) {
        // If the document exists, update it
        await Ticket.updateOne(query, update);
    } else {
        // If the document doesn't exist, check the collection size
        const currentSize = await Ticket.countDocuments();

        if (currentSize < config.env.maximum_seats) {
            // If the collection size is within the limit, proceed with the update
            await Ticket.create({...query, ...update});
        } else {
            throw new Error('Collection size limit exceeded');
        }
    }

    const updatedTicket = await Ticket.findOneAndUpdate(
        {seatNumber},
        {status, userDetails},
        {new: true, upsert: true},
    );

    if (!updatedTicket) {
        throw new Error('Ticket not found');
    }

    // EmitEvent('TicketUpdated', {seatNumber, status, userDetails});

    return updatedTicket;
};

const getTicketStatus = async seatNumber => {
    const ticket = await Ticket.findOne({seatNumber});
    if (!ticket) {
        throw new Error('Ticket not found');
    }

    return ticket;
};
// Other functions using emitEvent as needed

const getAllClosedTickets = async () => {
    console.log('Getting');
    const closedTickets = await Ticket.find({status: 'closed'});
    return closedTickets;
};

const getAllOpenTickets = async (filter = {}, options = {}) => {
    filter.status = 'open';
    options.sortBy = 'seatNumber:asc';
    const openTickets = await Ticket.paginate(filter, options);
    return openTickets;
};

const getTicketOwnerDetails = async seatNumber => {
    const ticket = await Ticket.findOne({seatNumber});

    if (!ticket) {
        throw new Error('Ticket not found');
    }

    if (_.isEmpty(ticket.userDetails)) {
        throw new Error('User not found');
    }

    return ticket.userDetails;
};

const resetServer = async () => {
    await Ticket.updateMany({}, {status: 'open', userDetails: {}});
    // EmitEvent('ServerReset', {status: 'open'});
};

module.exports = {
    updateTicketStatus,
    getTicketStatus,
    getAllClosedTickets,
    getAllOpenTickets,
    getTicketOwnerDetails,
    resetServer,
};
