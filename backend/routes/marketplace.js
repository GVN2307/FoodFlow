const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                farmer: {
                    select: {
                        fullName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform data to match frontend expectations (camelCase vs snake_case if needed, 
        // though we trying to standardize on camelCase in Node.js, frontend might expect snake_case from old python days?)
        // Frontend `Marketplace.tsx` uses `product.farmer?.full_name`, `product.price_per_kg`.
        // Let's map it to match frontend or update frontend. Standardizing on camelCase is better for JS.
        // But for now, let's just return as is and update frontend or transform here.
        // Let's transform here to match current frontend to avoid frontend breakage first.

        const formattedProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price_per_kg: p.pricePerKg, // Map camelCase DB to snake_case Frontend
            available_quantity: p.availableQuantity, // Map camelCase DB to snake_case Frontend
            image_url: p.imageUrl, // Map camelCase DB to snake_case Frontend
            is_organic: p.isOrganic,
            farmer: {
                full_name: p.farmer.fullName
            }
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({ detail: 'Internal server error' });
    }
});

// Create a product (Optional, for future use)
router.post('/products', async (req, res) => {
    // Needs authentication middleware to get farmer ID
    res.status(501).json({ detail: 'Not implemented' });
});

module.exports = router;
