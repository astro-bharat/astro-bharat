const Joi = require('joi');

const ticketValidationSchema = {
    status: Joi.string().valid('open', 'closed').required(),
    userDetails: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
    }),
};

const updateTicketSchema = {
    params: Joi.object({
        seatNumber: Joi.string().required(),
    }),
    body: Joi.object()
        .keys({...ticketValidationSchema})
        .required(),
};

const getTicketStatusSchema = {
    params: Joi.object({
        seatNumber: Joi.string().required(),
    }),
};

const getTicketOwnerDetailsSchema = Joi.object({
    params: Joi.object({
        seatNumber: Joi.string().required(),
    }),
});

module.exports = {
    updateTicketSchema,
    getTicketStatusSchema,
    getTicketOwnerDetailsSchema,
};
