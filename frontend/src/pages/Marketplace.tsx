import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Marketplace = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // In a real app, use an axios instance from context or lib
                const res = await axios.get('http://localhost:8001/marketplace/products');
                setProducts(res.data);
                setFilteredProducts(res.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
                // Mock data if API fails (for demo)
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (activeCategory === "All") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === activeCategory));
        }
    }, [activeCategory, products]);

    const handleAddToCart = (product: any) => {
        addToCart(product);
        // Simple feedback
        const btn = document.getElementById(`btn-${product.id}`);
        if (btn) {
            const original = btn.innerHTML;
            btn.innerHTML = '✔';
            setTimeout(() => { btn.innerHTML = original }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 md:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                        <p className="text-gray-600">Direct from Farmer to Citizen</p>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {["All", "Crop", "Pesticide", "Vegetable", "Fruit"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {cat === "Pesticide" && <span className="mr-1">🛡️</span>}
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col">
                                <div className="h-48 w-full bg-gray-200 relative group">
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
                                    {product.category === 'Pesticide' && (
                                        <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
                                            Safe Input
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">By {product.farmer?.full_name || "Local Farmer"}</p>

                                    <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                                        <div>
                                            <span className="text-2xl font-bold text-gray-900">₹{product.price_per_kg}</span>
                                            <span className="text-sm text-gray-500">/{product.category === 'Pesticide' ? 'L' : 'kg'}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/chat?newChatWith=${product.farmerId || product.farmer?.id}`)}
                                                className="p-2 bg-gray-100 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                title="Message Seller"
                                            >
                                                <MessageSquare size={20} />
                                            </button>
                                            <button
                                                id={`btn-${product.id}`}
                                                onClick={() => handleAddToCart(product)}
                                                className="p-2 bg-gray-100 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                                                title="Add to Cart"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
