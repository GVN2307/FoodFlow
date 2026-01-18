import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';

const PriceIndex = () => {
    const [prices, setPrices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchPrices = () => {
        axios.get('http://localhost:8001/prices')
            .then(res => {
                setPrices(res.data);
                if (res.data.length > 0) setLastUpdated(res.data[0].lastUpdated);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPrices();
        // Auto-refresh every 5 seconds to show "Real-time" effect
        const interval = setInterval(fetchPrices, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold mb-3 animate-pulse">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span> LIVE MARKET
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Price Index</h1>
                    <p className="text-gray-600">Real-time commodity rates across regions.</p>
                    {lastUpdated && <p className="text-xs text-gray-400 mt-2">Last Updated: {lastUpdated}</p>}
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-700">Crop</th>
                                    <th className="p-4 font-semibold text-gray-700">Region</th>
                                    <th className="p-4 font-semibold text-gray-700">Price</th>
                                    <th className="p-4 font-semibold text-gray-700">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {prices.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{item.crop}</td>
                                        <td className="p-4 text-gray-500">{item.region}</td>
                                        <td className="p-4 font-bold text-gray-900 font-mono">
                                            ₹{item.price.toFixed(2)} <span className="text-xs font-normal text-gray-400 font-sans">/ {item.unit}</span>
                                        </td>
                                        <td className="p-4">
                                            {item.trend === 'up' && (
                                                <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                                                    <TrendingUp size={14} /> Up
                                                </span>
                                            )}
                                            {item.trend === 'down' && (
                                                <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                                                    <TrendingDown size={14} /> Down
                                                </span>
                                            )}
                                            {item.trend === 'stable' && (
                                                <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                                                    <Minus size={14} /> Stable
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriceIndex;
