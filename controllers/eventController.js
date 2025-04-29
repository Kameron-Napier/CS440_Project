const eventModel = require('../models/eventModel');
const { validationResult } = require('express-validator');

exports.getEvents = async (req, res) => {
    try {
        const events = await eventModel.getAllEvents();
        res.json(events);
    } catch (err) {
        res.status(500).send('Database error');
    }
};

exports.addEvent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const event = {
        ...req.body,
        username: req.user.username
    };

    try {
        await eventModel.addEvent(event);
        res.status(201).send('Event added');
    } catch (err) {
        res.status(500).send('Database error');
    }
};
