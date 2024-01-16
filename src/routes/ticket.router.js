const express = require('express');
const {ticketController} = require('../controllers');
const {validate} = require('../middlewares/validation.middleware');
const {updateTicketSchema, getTicketStatusSchema, getTicketOwnerDetailsSchema} = require('../validations/ticket.validation');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/open', ticketController.getAllOpenTickets);
router.get('/closed', ticketController.getAllClosedTickets);
router.put('/seat/:seatNumber', validate(updateTicketSchema), ticketController.updateTicketStatus);
router.get('/seat/:seatNumber', validate(getTicketStatusSchema), ticketController.getTicketStatus);
router.get('/seat/:seatNumber/details', validate(getTicketOwnerDetailsSchema), ticketController.getTicketOwnerDetails);
router.post('/reset', ticketController.resetServer);

module.exports = router;
