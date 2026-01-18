import React, { useEffect, useState } from 'react';
import { Cloud, Wind, Droplets, Sun } from 'lucide-react';
import api from '../lib/api';

interface WeatherData {
    city: string;
    temperature: number;
    condition: string;
    humidity: number;
    wind_speed: number;
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await api.get('/dashboard/weather');
                setWeather(response.data);
            } catch (error) {
                console.error("Failed to fetch weather data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) {
        return <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow animate-pulse h-48">Loading Weather...</div>;
    }

    if (!weather) {
        return <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow text-red-500">Failed to load weather data.</div>;
    }

    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold mb-1">{weather.city}</h2>
                    <p className="text-blue-100">{weather.condition}</p>
                </div>
                <Sun className="h-10 w-10 text-yellow-300" />
            </div>

            <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-bold">{weather.temperature}°</span>
                <span className="text-sm ml-1 text-blue-100">C</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-200" />
                    <span className="text-sm font-medium">{weather.humidity}% Humidity</span>
                </div>
                <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-blue-200" />
                    <span className="text-sm font-medium">{weather.wind_speed} km/h Wind</span>
                </div>
            </div>
        </div>
    );
}
