const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const otpService = require('../services/otpService');

// Regular expression to check for exactly 10 digits
const phoneRegex = /^[0-9]{10}$/;

/**
 * Route to generate and send (log) an OTP code
 */
router.post('/send-otp', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone || !phoneRegex.test(phone)) {
            return res.status(400).json({ error: 'Please provide a valid 10-digit phone number' });
        }

        await otpService.generateOtp(phone);

        res.status(200).json({ message: 'OTP sent' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Internal server error while sending OTP' });
    }
});

/**
 * Route to verify an OTP code and either log in or register the user
 */
router.post('/verify-otp', async (req, res) => {
    try {
        const { name } = req.body;
        const phone = String(req.body.phone || '').trim();
        const otp = String(req.body.otp || '').trim();

        if (!phone || !phoneRegex.test(phone) || !otp) {
            return res.status(400).json({ error: 'Please provide valid phone and OTP' });
        }

        console.log(`[DEBUG /verify-otp] phone: '${phone}', otp: '${otp}', type of otp: ${typeof otp}`);
        
        const isValid = await otpService.verifyOtp(phone, otp);
        console.log(`[DEBUG /verify-otp] isValid result: ${isValid}`);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid or expired OTP' });
        }

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { phone }
        });

        // If user doesn't exist, create a new one
        if (!user) {
            // If name was required but not provided, we could return a specific error here
            // prompting the frontend to ask for a name.
            user = await prisma.user.create({
                data: {
                    phone,
                    fullName: name || `User-${phone.substring(6)}`, // Fallback name
                    email: `${phone}@foodflow.local`, // Dummy email since it's required to be unique
                    role: 'citizen',
                    isActive: true
                }
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { sub: user.email, role: user.role, id: user.id },
            process.env.JWT_SECRET || 'your_super_secret_key_change_in_production',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            access_token: token,
            token_type: 'bearer',
            user: {
                id: user.id,
                name: user.fullName,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Internal server error while verifying OTP' });
    }
});

module.exports = router;
