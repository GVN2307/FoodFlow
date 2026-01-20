const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

if (!process.env.JWT_SECRET) {
    console.warn("⚠️ WARNING: JWT_SECRET is not defined. Using default insecure key.");
    process.env.JWT_SECRET = "default_fallback_secret";
}

// Middleware
app.use(cors());
app.use(express.json());

const marketplaceRoutes = require('./routes/marketplace');
const dashboardRoutes = require('./routes/dashboard');
const aiRoutes = require('./routes/ai');
const policiesRoutes = require('./routes/policies');
const chatRoutes = require('./routes/chat');
const priceRoutes = require('./routes/prices');

// Routes
app.use('/auth', authRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/ai', aiRoutes);
app.use('/policies', policiesRoutes);
app.use('/chat', chatRoutes);
app.use('/prices', priceRoutes);

app.get('/', (req, res) => {
    res.send('FoodFlow Protocol API (Node.js) is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
