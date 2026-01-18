import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import WeatherWidget from '../components/WeatherWidget';
import CropTrends from '../components/CropTrends';
import FarmMap from '../components/FarmMap';
import { HandCoins, Sprout, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = React.useState({
        totalCrops: 0,
        estimatedEarnings: 0,
        alerts: [] as any[]
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                // Use api client with interceptor for consistent auth
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, [user]);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.full_name ? user.full_name.split(' ')[0] : 'Farmer'}! 🌾
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Here's what's happening on your farm today.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <WeatherWidget />

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                            <Sprout className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Crops</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCrops} Active</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                            <HandCoins className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Est. Earnings</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.estimatedEarnings.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <CropTrends />
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Farm Location</h3>
                        <FarmMap />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Alerts & Tips
                        </h3>
                        <div className="space-y-4">
                            {stats.alerts.length > 0 ? stats.alerts.map((alert, idx) => (
                                <div key={idx} className={`p-4 border-l-4 rounded-r-lg ${alert.type === 'warning' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-500 text-orange-800 dark:text-orange-200' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-500 text-blue-800 dark:text-blue-200'}`}>
                                    <p className="text-sm">
                                        <strong>{alert.type === 'warning' ? 'Alert:' : 'Tip:'}</strong> {alert.message}
                                    </p>
                                </div>
                            )) : (
                                <p className="text-gray-500 text-sm">No alerts for today.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl shadow-lg text-white">
                        <h3 className="text-xl font-bold mb-2">AI Agronomist</h3>
                        <p className="text-green-100 mb-4 text-sm">Upload a photo of your crop to detect diseases instantly.</p>
                        <button
                            onClick={() => navigate('/ai-agronomist')}
                            className="w-full bg-white text-green-700 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors"
                        >
                            Try Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
