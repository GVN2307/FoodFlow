const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware to authenticate token (Basic implementation)
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

router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Get exact crop count for this farmer
        const cropCount = await prisma.crop.count({
            where: {
                farmerId: userId,
                status: { not: 'Harvested' } // Only count active crops
            }
        });

        // 2. Calculate estimated earnings (Mock logic: Sum of Price x Quantity of listed products)
        const products = await prisma.product.findMany({
            where: { farmerId: userId },
            select: { pricePerKg: true, availableQuantity: true }
        });

        const totalEarnings = products.reduce((acc, curr) => {
            return acc + ((curr.pricePerKg || 0) * (curr.availableQuantity || 0));
        }, 0);

        // 3. Mock Alerts (Future: Real logic based on weather/crops)
        const alerts = [
            { type: 'warning', message: 'Pest Alert: High chance of aphid attacks in cotton due to humidity.' },
            { type: 'info', message: 'Irrigation: Schedule watering for late evening to save water.' }
        ];

        res.json({
            totalCrops: cropCount,
            estimatedEarnings: totalEarnings,
            alerts: alerts
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ detail: 'Internal server error' });
    }
});

// 4. Market Trends Endpoint
router.get('/trends', authenticateToken, async (req, res) => {
    try {
        const trends = [
            { crop_name: "Cotton (Long Staple)", current_price: 6200, trend: "up", demand_level: "high" },
            { crop_name: "Red Chilli (Teja)", current_price: 14500, trend: "stable", demand_level: "medium" },
            { crop_name: "Turmeric", current_price: 7200, trend: "down", demand_level: "low" },
            { crop_name: "Paddy (Common)", current_price: 2100, trend: "stable", demand_level: "high" },
            { crop_name: "Maize", current_price: 1850, trend: "up", demand_level: "medium" },
            { crop_name: "Soybean", current_price: 4800, trend: "down", demand_level: "medium" }
        ];
        res.json(trends);
    } catch (error) {
        console.error('Trends Error:', error);
        res.status(500).json({ detail: 'Internal server error' });
    }
});

// 5. Weather Endpoint (Open-Meteo)
router.get('/weather', authenticateToken, async (req, res) => {
    try {
        // Default to Hyderabad, India for now
        const lat = 17.3850;
        const lon = 78.4867;

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
        const data = await weatherRes.json();

        const current = data.current;

        // Map WMO codes to text (Simple version)
        let condition = "Clear Sky";
        const code = current.weather_code;
        if (code === 0) condition = "Clear Sky";
        else if (code >= 1 && code <= 3) condition = "Partly Cloudy";
        else if (code >= 45 && code <= 48) condition = "Foggy";
        else if (code >= 51 && code <= 67) condition = "Rainy";
        else if (code >= 80 && code <= 99) condition = "Thunderstorm";

        res.json({
            city: "Hyderabad, IN",
            temperature: Math.round(current.temperature_2m),
            condition: condition,
            humidity: current.relative_humidity_2m,
            wind_speed: current.wind_speed_10m
        });

    } catch (error) {
        console.error('Weather API Error:', error);
        res.status(500).json({ detail: 'Failed to fetch weather' });
    }
});

module.exports = router;
