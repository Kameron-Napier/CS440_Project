const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await userModel.findByUsername(username);
        if (existingUser) return res.status(409).send('Username already exists');

        const hash = await bcrypt.hash(password, 10);
        await userModel.createUser(username, hash);
        res.status(201).send('User created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Registration error');
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findByUsername(username);
        if (!user || !await bcrypt.compare(password, user.password_hash)) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Login error');
    }
};
