const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Optional: Middleware if we want to restrict policies to logged in users, 
// usually policies are public info, but let's keep it simple.

router.get('/', async (req, res) => {
    try {
        // Mock Policy Data
        const policies = [
            {
                id: 1,
                title: "PM Kisan Samman Nidhi",
                description: "Financial benefit of Rs. 6000/- per year in three equal installments to all landholding farmers families.",
                eligibility: "Small and marginal farmers",
                category: "Financial Aid",
                link: "https://pmkisan.gov.in/"
            },
            {
                id: 2,
                title: "Pradhan Mantri Fasal Bima Yojana",
                description: "Crop insurance scheme that provides financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
                eligibility: "All farmers growing notified crops",
                category: "Insurance",
                link: "https://pmfby.gov.in/"
            },
            {
                id: 3,
                title: "Soil Health Card Scheme",
                description: "Government issues soil health cards to farmers which allows them to decide the dosage of nutrients.",
                eligibility: "All farmers",
                category: "Education",
                link: "https://soilhealth.dac.gov.in/"
            },
            {
                id: 4,
                title: "Rythu Bandhu (Telangana)",
                description: "Investment support scheme for farmers by Government of Telangana.",
                eligibility: "Land owning farmers in Telangana",
                category: "State Scheme",
                link: "#"
            }
        ];

        res.json(policies);

    } catch (error) {
        console.error('Get Policies Error:', error);
        res.status(500).json({ detail: 'Internal server error' });
    }
});

module.exports = router;
