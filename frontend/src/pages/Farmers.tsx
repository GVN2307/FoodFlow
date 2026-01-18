import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, MessageSquare, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Farmers = () => {
    const [farmers, setFarmers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarmers = async () => {
            try {
                // Fetch from new endpoint
                const res = await axios.get('http://localhost:8001/marketplace/farmers');
                setFarmers(res.data);
            } catch (error) {
                console.error("Failed to fetch farmers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFarmers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 md:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Farmer Directory</h1>
                    <p className="text-gray-600">Connect directly with the growers feeding your community.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {farmers.map((farmer) => (
                            <div key={farmer.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{farmer.fullName}</h3>
                                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                                            <MapPin size={14} />
                                            <span>Telangana, India</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Products</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {farmer.products && farmer.products.length > 0 ? (
                                            farmer.products.map((p: any, idx: number) => (
                                                <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                    {p.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No products listed yet</span>
                                        )}
                                        {farmer._count?.products > 3 && (
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                +{farmer._count.products - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    to={`/chat?newChatWith=${farmer.id}`}
                                    className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageSquare size={18} />
                                    Message Farmer
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Farmers;
