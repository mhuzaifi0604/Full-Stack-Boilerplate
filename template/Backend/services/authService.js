const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { decrypt } = require('./cryptoService')

const JWT_SECRET = process.env.JWT_SECRET;

// Mock user database
const users = [
    {
        id: '1',
        email: 'admin@npmjs.com',
        password: '$2a$10$yFJXKioLIdFeUhsbat75..AEiEmyQhwM5Enj/9P3AXY5ReVC.lu1C'
        // email: 'dev@pmdpk.com',
        // password: '$2a$10$q62ZJw20xdKWvqtV7pFpbevPBysE9TvrLJX2WocDH.Clpk.43X.Ue', // 'pmd@786'
    },
    {
        id: '2',
        email: 'networks@pmdpk.com',
        password: '$2a$10$kObr3k/8AeIOEwdcM79K0utCi0WKMBoqx4ewuFkb9UKznoAZ1dHi6', // 'pmd@123'
    }
];

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(decrypt(password), user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCurrentUser = (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: { id: user.id, email: user.email } });
};

exports.logout = (req, res) => {
    res.json({ message: 'Logout successful' });
};
