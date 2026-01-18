import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sprout, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/images/hero-farm.png';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
    const { isAuthenticated } = useAuth();
    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.4)'
                    }}
                />
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 mb-6"
                    >
                        {isAuthenticated ? "Welcome Back to FoodFlow" : <>The Future of Agriculture <br /> starts here.</>}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                    >
                        Connecting Farmers, Citizens, and Policy Makers through AI-driven insights and a transparent marketplace.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link
                            to={isAuthenticated ? "/dashboard" : "/register"}
                            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all text-lg gap-2"
                        >
                            {isAuthenticated ? "Go to Dashboard" : "Join the Ecosystem"} <ArrowRight className="h-5 w-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 bg-zinc-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-zinc-800/50 border border-zinc-700 backdrop-blur-sm">
                            <Sprout className="h-12 w-12 text-green-500 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">AI Agronomist</h3>
                            <p className="text-gray-400">Instant crop disease analysis and growth tracking using Gemini 3 Vision models.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-zinc-800/50 border border-zinc-700 backdrop-blur-sm">
                            <TrendingUp className="h-12 w-12 text-blue-500 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Smart Dashboard</h3>
                            <p className="text-gray-400">Real-time weather data, crop trends, and predictive analytics for farmers.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-zinc-800/50 border border-zinc-700 backdrop-blur-sm">
                            <ShieldCheck className="h-12 w-12 text-yellow-500 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Fair Marketplace</h3>
                            <p className="text-gray-400">Direct Farmer-to-Citizen sales with global price tracking and zero middlemen.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
