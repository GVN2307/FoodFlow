import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User as UserIcon, LogOut, ShoppingCart, MessageSquare, Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { cart } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-green-500">
                    <Leaf className="h-6 w-6" />
                    <span>FoodFlow</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {isAuthenticated && (
                        <Link to="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                    )}
                    <Link to="/marketplace" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Marketplace
                    </Link>
                    <Link to="/farmers" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Farmers
                    </Link>
                    <Link to="/prices" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Prices
                    </Link>
                    {user?.role === 'farmer' && (
                        <>
                            <Link to="/policies" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Policies
                            </Link>
                            <Link to="/ai-agronomist" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                AI Agronomist
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
                    </button>
                    <Link to="/chat" className="p-2 text-gray-300 hover:text-white transition-colors" title="Messages">
                        <MessageSquare className="h-5 w-5" />
                    </Link>
                    <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
                        <ShoppingCart className="h-5 w-5" />
                        {cart.length > 0 && (
                            <span className="absolute top-0 right-0 h-4 w-4 bg-green-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                {cart.length}
                            </span>
                        )}
                    </Link>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <UserIcon className="h-4 w-4" />
                                <span className="hidden md:inline">{user?.full_name || user?.email}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden md:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className={cn(
                                    "inline-flex h-9 items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-700 disabled:pointer-events-none disabled:opacity-50"
                                )}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
