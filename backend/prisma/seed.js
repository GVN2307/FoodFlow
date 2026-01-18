const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 0. Cleanup existing data
    await prisma.product.deleteMany({});
    await prisma.crop.deleteMany({});
    console.log('Cleaned up existing products and crops.');

    // 1. Create a Farmer
    const farmerPassword = await bcrypt.hash('password123', 10);
    const farmer = await prisma.user.upsert({
        where: { email: 'ravi@farmer.com' },
        update: {},
        create: {
            email: 'ravi@farmer.com',
            password: farmerPassword,
            fullName: 'Ravi Kumar',
            role: 'farmer'
        },
    });
    console.log(`Created user: ${farmer.email}`);

    // 2. Create a Citizen
    const citizenPassword = await bcrypt.hash('password123', 10);
    const citizen = await prisma.user.upsert({
        where: { email: 'priya@citizen.com' },
        update: {},
        create: {
            email: 'priya@citizen.com',
            password: citizenPassword,
            fullName: 'Priya Reddy',
            role: 'citizen'
        },
    });
    console.log(`Created user: ${citizen.email}`);

    // 3. Create Crops for Farmer (For Dashboard Stats)
    const cropsData = [
        {
            name: 'Cotton',
            variety: 'Bt Cotton',
            plantingDate: new Date('2025-06-15'),
            status: 'Growing',
            farmerId: farmer.id
        },
        {
            name: 'Red Chilli',
            variety: 'Guntur Sannam',
            plantingDate: new Date('2025-08-01'),
            status: 'Flowering',
            farmerId: farmer.id
        },
        {
            name: 'Paddy',
            variety: 'Sona Masoori',
            plantingDate: new Date('2025-07-10'),
            status: 'Harvest Ready',
            farmerId: farmer.id
        }
    ];

    for (const c of cropsData) {
        await prisma.crop.create({
            data: c
        });
    }
    console.log(`Created ${cropsData.length} crops for ${farmer.fullName}`);

    // 4. Create Products for Farmer
    const productsData = [
        {
            name: 'Premium Sona Masoori Rice',
            description: 'Aged for 12 months, premium quality rice directly from my paddy fields.',
            pricePerKg: 55,
            availableQuantity: 500,
            imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
            isOrganic: true,
            farmerId: farmer.id
        },
        {
            name: 'Fresh Organic Tomatoes',
            description: 'Juicy, farm-fresh tomatoes without any pesticides.',
            pricePerKg: 40,
            availableQuantity: 120,
            imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600',
            isOrganic: true,
            farmerId: farmer.id
        },
        {
            name: 'Turmeric Powder (High Curcumin)',
            description: 'Homemade turmeric powder from dry roots.',
            pricePerKg: 250,
            availableQuantity: 50,
            imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
            isOrganic: true,
            farmerId: farmer.id
        },
        {
            name: 'Kashmiri Apples',
            description: 'Sweet and crunchy apples.',
            pricePerKg: 150,
            availableQuantity: 200,
            imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=600',
            isOrganic: false,
            farmerId: farmer.id
        },
        {
            name: 'Organic Cotton Seeds (Bt II)',
            description: 'High yield potential, resistant to bollworms. Pack of 450g.',
            pricePerKg: 750, // Per pack technically
            availableQuantity: 100,
            imageUrl: 'https://images.unsplash.com/photo-1471193945509-9adadd09e587?auto=format&fit=crop&q=80&w=600',
            isOrganic: true,
            farmerId: farmer.id
        },
        {
            name: 'Vermicompost (Bio-Fertilizer)',
            description: 'Nutrient-rich organic fertilizer for all crops.',
            pricePerKg: 15,
            availableQuantity: 1000,
            imageUrl: 'https://images.unsplash.com/photo-1628519592415-385ee92e5976?auto=format&fit=crop&q=80&w=600',
            isOrganic: true,
            farmerId: farmer.id
        },
        {
            name: 'Neem Oil (Pest Repellent)',
            description: 'Pure cold-pressed neem oil for organic pest control.',
            pricePerKg: 350, // Per liter
            availableQuantity: 50,
            imageUrl: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&q=80&w=600',
            isOrganic: true,
            farmerId: farmer.id
        },
        {
            name: 'Nano Bananas (Robusta)',
            description: 'Sweet, small-sized bananas rich in potassium. Naturally ripened.',
            pricePerKg: 35,
            availableQuantity: 300,
            imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=600',
            isOrganic: true,
            farmerId: farmer.id
        }
    ];

    for (const p of productsData) {
        await prisma.product.create({
            data: p
        });
    }
    console.log(`Created ${productsData.length} products for ${farmer.fullName}`);

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
