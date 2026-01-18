import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import heroImage from '../assets/images/hero-farm.png';

export default function Signup() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('citizen'); // Default to citizen
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await signup(email, password, fullName, role);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to create account');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background with overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(8px) brightness(0.3)'
                }}
            />

            <div className="relative z-10 w-full max-w-md px-6 my-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                            Join FoodFlow
                        </h2>
                        <p className="text-gray-400 mt-2">Start your journey in the transparent food ecosystem</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Create a strong password"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-300 block">I am a</label>

                            <div className="flex items-center gap-3 bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/50 hover:border-emerald-500/50 transition-colors">
                                <input
                                    type="checkbox"
                                    id="role-farmer"
                                    checked={role === 'farmer'}
                                    onChange={() => setRole('farmer')}
                                    className="w-5 h-5 rounded border-gray-600 text-emerald-600 focus:ring-emerald-500 bg-zinc-800 transition-colors cursor-pointer"
                                />
                                <label htmlFor="role-farmer" className="flex-1 text-sm font-medium text-gray-300 cursor-pointer select-none">
                                    Farmer (Producer)
                                </label>
                            </div>

                            <div className="flex items-center gap-3 bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/50 hover:border-blue-500/50 transition-colors">
                                <input
                                    type="checkbox"
                                    id="role-citizen"
                                    checked={role === 'citizen'}
                                    onChange={() => setRole('citizen')}
                                    className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-zinc-800 transition-colors cursor-pointer"
                                />
                                <label htmlFor="role-citizen" className="flex-1 text-sm font-medium text-gray-300 cursor-pointer select-none">
                                    Citizen (Consumer)
                                </label>
                            </div>

                            <div className="flex items-center gap-3 bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/50 hover:border-purple-500/50 transition-colors">
                                <input
                                    type="checkbox"
                                    id="role-admin"
                                    checked={role === 'admin'}
                                    onChange={() => setRole('admin')}
                                    className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-zinc-800 transition-colors cursor-pointer"
                                />
                                <label htmlFor="role-admin" className="flex-1 text-sm font-medium text-gray-300 cursor-pointer select-none">
                                    Government Official
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">
                            Sign In
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
