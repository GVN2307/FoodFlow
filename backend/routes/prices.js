const express = require('express');
const router = express.Router();

// Mock Global Market Prices
const MOCK_PRICES = [
    { id: 1, crop: "Rice (Sona Masoori)", price: 45, unit: "kg", trend: "up", region: "Telangana" },
    { id: 2, crop: "Wheat (Sharbati)", price: 32, unit: "kg", trend: "stable", region: "Madhya Pradesh" },
    { id: 3, crop: "Tomato (Hybrid)", price: 25, unit: "kg", trend: "down", region: "Andhra Pradesh" },
    { id: 4, crop: "Cotton", price: 6200, unit: "quintal", trend: "up", region: "Maharashtra" },
    { id: 5, crop: "Turmeric", price: 110, unit: "kg", trend: "stable", region: "Tamil Nadu" },
    { id: 6, crop: "Onion", price: 18, unit: "kg", trend: "down", region: "Nashik" },
    { id: 7, crop: "Apple (Shimla)", price: 120, unit: "kg", trend: "up", region: "Himachal" },
];

router.get('/', (req, res) => {
    res.json(MOCK_PRICES);
});

module.exports = router;
