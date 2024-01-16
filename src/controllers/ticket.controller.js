const {ticketService} = require('../services/');
const logger = require('../features/logger');

const updateTicketStatus = async (req, res, next) => {
    try {
        const {seatNumber} = req.params;
        const {status, userDetails} = req.body;
        const updatedTicket = await ticketService.updateTicketStatus(seatNumber, status, userDetails);
        res.json(updatedTicket);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const getTicketStatus = async (req, res, next) => {
    try {
        const {seatNumber} = req.params;
        const ticketStatus = await ticketService.getTicketStatus(seatNumber);
        res.json(ticketStatus);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const getAllClosedTickets = async (req, res, next) => {
    try {
        const closedTickets = await ticketService.getAllClosedTickets();
        res.json(closedTickets);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const getAllOpenTickets = async (req, res) => {
    try {
        const {page, limit} = req.query;
        const options = {limit, page};
        const filter = {status: 'open'};
        const openTickets = await ticketService.getAllOpenTickets(filter, options);
        res.json(openTickets);
    } catch (error) {
        logger.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

const getTicketOwnerDetails = async (req, res, next) => {
    try {
        const {seatNumber} = req.params;
        const ticketOwnerDetails = await ticketService.getTicketOwnerDetails(seatNumber);
        res.json(ticketOwnerDetails);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const resetServer = async (req, res, next) => {
    try {
        await ticketService.resetServer();
        res.json({message: 'Server reset successful'});
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

module.exports = {
    updateTicketStatus,
    getTicketStatus,
    getAllClosedTickets,
    getAllOpenTickets,
    getTicketOwnerDetails,
    resetServer,
};
