import React, { useEffect, useState } from 'react';
import { Scroll, ExternalLink, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export default function Policies() {
    const [policies, setPolicies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await axios.get('http://localhost:8001/policies');
                setPolicies(res.data);
            } catch (error) {
                console.error("Failed to fetch policies", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 px-4 pb-12">
            <div className="container mx-auto max-w-5xl">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Government Policies & Schemes</h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Stay informed about the latest agricultural policies, subsidies, and insurance schemes designed to help farmers thrive.
                    </p>
                </header>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {policies.map((policy) => (
                            <div key={policy.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                                        <Scroll className="h-6 w-6" />
                                    </div>
                                    <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-full">
                                        {policy.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{policy.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                    {policy.description}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800">
                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                        Eligibility: {policy.eligibility}
                                    </span>
                                    <a
                                        href={policy.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Details <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
