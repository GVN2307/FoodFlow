import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import api from '../lib/api';

interface CropTrend {
    crop_name: string;
    current_price: number;
    trend: 'up' | 'down' | 'stable';
    demand_level: string;
}

export default function CropTrends() {
    const [trends, setTrends] = useState<CropTrend[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard/trends')
            .then(res => setTrends(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-64 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse"></div>;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Trends</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3 font-medium">Crop</th>
                            <th className="px-6 py-3 font-medium">Price / Quintal</th>
                            <th className="px-6 py-3 font-medium">Trend</th>
                            <th className="px-6 py-3 font-medium">Demand</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {trends.map((crop) => (
                            <tr key={crop.crop_name} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{crop.crop_name}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">₹{crop.current_price}</td>
                                <td className="px-6 py-4">
                                    <div className={`flex items-center gap-1 font-medium ${crop.trend === 'up' ? 'text-green-600' :
                                            crop.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                                        }`}>
                                        {crop.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                                        {crop.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                                        {crop.trend === 'stable' && <Minus className="h-4 w-4" />}
                                        <span className="capitalize">{crop.trend}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${crop.demand_level === 'high' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                            crop.demand_level === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                        {crop.demand_level.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
