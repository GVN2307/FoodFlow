const express = require('express');
const router = express.Router();

// Base Market Prices (Reference)
const BASE_PRICES = [
    { id: 1, crop: "Rice (Sona Masoori)", price: 45, unit: "kg", region: "Telangana" },
    { id: 2, crop: "Wheat (Sharbati)", price: 32, unit: "kg", region: "Madhya Pradesh" },
    { id: 3, crop: "Tomato (Hybrid)", price: 25, unit: "kg", region: "Andhra Pradesh" },
    { id: 4, crop: "Cotton", price: 6200, unit: "quintal", region: "Maharashtra" },
    { id: 5, crop: "Turmeric", price: 110, unit: "kg", region: "Tamil Nadu" },
    { id: 6, crop: "Onion", price: 18, unit: "kg", region: "Nashik" },
    { id: 7, crop: "Apple (Shimla)", price: 120, unit: "kg", region: "Himachal" },
];

router.get('/', (req, res) => {
    // Generate 'Live' prices with small random fluctuations
    const livePrices = BASE_PRICES.map(item => {
        const fluctuation = (Math.random() * 4) - 2; // -2 to +2
        const newPrice = Math.max(0, item.price + fluctuation);
        const trend = fluctuation > 0.5 ? 'up' : (fluctuation < -0.5 ? 'down' : 'stable');

        return {
            ...item,
            price: parseFloat(newPrice.toFixed(2)),
            trend,
            lastUpdated: new Date().toLocaleTimeString()
        };
    });

    res.json(livePrices);
});

module.exports = router;
