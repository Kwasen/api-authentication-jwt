const express = require('express');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 5000;

const app = new express();

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created',
                authData
            });
        }

    });
});

app.post('/api/login', (req, res) => {
    // Mock user
    const user = {
        id: '1',
        username: 'tukun',
        email: 'tkman@gmail.com'
    };

    // on login, the newly created token is set to last for only 7 hours
    jwt.sign({ user }, 'secretkey', { expiresIn: '7h' }, (err, token) => {
        res.json({
            token
        });
    });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Middleware
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        req.token = bearerHeader.split(' ')[1];
        next(); // call next middleware
    } else {
        // Forbidden
        res.sendStatus(403).json({ error: 'Forbidden' });
    }
};

app.listen(PORT, () => console.log(`Server running ${PORT}`));
