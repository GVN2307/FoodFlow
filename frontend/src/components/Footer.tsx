import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-800 bg-black py-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
                <p className="text-center text-sm leading-loose text-gray-400 md:text-left">
                    &copy; 2026 FoodFlow Protocol. Built for HackforEarth.
                </p>
                <div className="flex gap-4">
                    <span className="text-sm text-gray-500">Privacy Policy</span>
                    <span className="text-sm text-gray-500">Terms of Service</span>
                </div>
            </div>
        </footer>
    );
}
