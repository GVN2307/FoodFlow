import React from 'react';
import { useAuth } from '../context/AuthContext';
import FarmerDashboard from './FarmerDashboard';
import CitizenDashboard from './CitizenDashboard';

export default function Dashboard() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center text-white">Please log in.</div>;
    }

    // Role-based rendering
    if (user.role === 'farmer' || user.role === 'admin') {
        return <FarmerDashboard />;
    }

    return <CitizenDashboard />;
}
