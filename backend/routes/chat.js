const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// 1. Send a Message
router.post('/send', authenticateToken, async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.userId;

        if (!receiverId || !content) {
            return res.status(400).json({ detail: "Receiver and content required" });
        }

        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId: parseInt(receiverId),
                content
            }
        });

        res.json(message);
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ detail: 'Failed to send message' });
    }
});

// 2. Get Conversation with a specific user
router.get('/conversation/:otherUserId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const otherUserId = parseInt(req.params.otherUserId);

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            },
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                sender: { select: { fullName: true, id: true } },
                receiver: { select: { fullName: true, id: true } }
            }
        });

        res.json(messages);
    } catch (error) {
        console.error('Get Conversation Error:', error);
        res.status(500).json({ detail: 'Failed to fetch messages' });
    }
});

// 3. Get All Conversations (List of people chatted with)
// This is a bit complex in SQL/Prisma, simulating by getting unique user IDs from messages
router.get('/conversations', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get all messages involving this user
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { fullName: true, id: true, email: true } },
                receiver: { select: { fullName: true, id: true, email: true } }
            }
        });

        // Extract unique contacts
        const contactsMap = new Map();

        messages.forEach(msg => {
            const isSender = msg.senderId === userId;
            const contact = isSender ? msg.receiver : msg.sender;

            if (!contactsMap.has(contact.id)) {
                contactsMap.set(contact.id, {
                    ...contact,
                    lastMessage: msg.content,
                    timestamp: msg.createdAt
                });
            }
        });

        res.json(Array.from(contactsMap.values()));

    } catch (error) {
        console.error('Get Chats Error:', error);
        res.status(500).json({ detail: 'Failed to fetch conversations' });
    }
});

module.exports = router;
