import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Heart, MapPin, Search } from 'lucide-react';

export default function CitizenDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Dummy Featured Cards */}
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800">
                            <div className="h-40 bg-zinc-200 dark:bg-zinc-800 animate-pulse" /> {/* Placeholder Image */}
                            <div className="p-4">
                                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-center text-gray-500 mt-4 text-sm">Real data coming from Marketplace...</p>
            </div>
        </div>
    );
}
