import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Heart, MapPin, Search } from 'lucide-react';

export default function CitizenDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Fetch all products and simulate "Featured" by taking top 4
                // In a real app, you might have a ?featured=true query param
                const res = await axios.get('http://localhost:8001/marketplace/products');
                setFeaturedProducts(res.data.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch featured products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Hello, {user?.full_name ? user.full_name.split(' ')[0] : 'Citizen'}! 🌿
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Find fresh, local produce near you.
                </p>
            </header>

            {/* Quick Stats / Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div onClick={() => navigate('/marketplace')} className="cursor-pointer bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800 hover:border-green-500 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Start Shopping</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Browse fresh crops</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                            <Heart className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Favorites</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">0 items saved</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Location</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Hyderabad, TG</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            <div className="mb-8">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured This Week</h2>
                    <button onClick={() => navigate('/marketplace')} className="text-green-600 hover:text-green-500 text-sm font-medium">View All &rarr;</button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-zinc-900 h-64 rounded-xl animate-pulse shadow-sm border border-gray-100 dark:border-zinc-800"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <div key={product.id} onClick={() => navigate('/marketplace')} className="cursor-pointer group bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-zinc-800">
                                <div className="h-40 bg-gray-200 relative overflow-hidden">
                                    <img
                                        src={product.image_url || "https://images.unsplash.com/photo-1595855709915-02b774b7c126?auto=format&fit=crop&w=300&q=80"}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {product.isOrganic && (
                                        <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
                                            Organic
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">By {product.farmer?.full_name || 'Farmer'}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-green-600">₹{product.price_per_kg}/kg</span>
                                        <span className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                            {product.available_quantity}kg left
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
