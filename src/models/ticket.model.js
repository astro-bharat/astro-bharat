const mongoose = require('mongoose');
const {toJSON, paginate} = require('./plugins');

const ticketSchema = new mongoose.Schema({
    seatNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    userDetails: {
        type: {
            name: String,
            email: String,
        },
        _id: false,
    },
}, {
    versionKey: 'false',
});

ticketSchema.plugin(toJSON);
ticketSchema.plugin(paginate);

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
