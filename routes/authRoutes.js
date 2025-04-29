const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

router.post('/register',
    body('username').trim().escape().isLength({ min: 3, max: 20 }),
    body('password').trim().escape().isStrongPassword({
        minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0
    }),
    authController.register
);

router.post('/login',
    body('username').trim().escape(),
    body('password').trim().escape(),
    authController.login
);

module.exports = router;
