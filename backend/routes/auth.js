const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, full_name, fullName, role } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ detail: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName: fullName || full_name, // Support both snake_case and camelCase
                role: role || 'citizen',
            },
        });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ detail: 'Internal server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        // Handle both JSON and URL-encoded (FastAPI's OAuth2PasswordRequestForm uses form-data/url-encoded, but frontend might send JSON)
        // For simplicity, we'll assume the frontend sends JSON or we handle the body check.
        // If reusing the exact same frontend logic that used OAuth2PasswordRequestForm, it sends `username` and `password` as form data.
        // But our React `api.ts` likely sends JSON. Let's support checking `email` OR `username`.

        const email = req.body.email || req.body.username;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ detail: 'Email/Username and password required' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ detail: 'Incorrect email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ detail: 'Incorrect email or password' });
        }

        // Create Token
        const token = jwt.sign(
            { sub: user.email, role: user.role, userId: user.id },
            JWT_SECRET,
            { expiresIn: '30m' }
        );

        res.json({ access_token: token, token_type: 'bearer' });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ detail: 'Internal server error' });
    }
});

module.exports = router;
