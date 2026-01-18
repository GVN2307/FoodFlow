import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
// Fix for default marker icon missing in React Leaflet
// @ts-ignore
delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function FarmMap() {
    // Default to Hyderabad
    const [position, setPosition] = React.useState<[number, number]>([17.3850, 78.4867]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                    setLoading(false);
                },
                (err) => {
                    console.error("Location access denied or failed", err);
                    setLoading(false);
                }
            );
        } else {
            console.log("Geolocation not supported");
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div className="h-[300px] w-full bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Locating...</div>;
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800 overflow-hidden h-[300px] w-full z-0 p-1">
            <MapContainer key={position.toString()} center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        Your Farm Location
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
