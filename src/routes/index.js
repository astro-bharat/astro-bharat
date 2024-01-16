/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const ticketRoute = require('../routes/ticket.router');

/* GET home page. */

const defaultPath = '/api/v0';

const defaultRoutes = [
    {
        path: '/tickets',
        route: ticketRoute,
    },
];

defaultRoutes.forEach(eachRoute => {
    router.use(`${defaultPath}${eachRoute.path}`, eachRoute.route);
});

module.exports = router;
