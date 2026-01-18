import React, { useState } from 'react';
import axios from 'axios';
import { Send, Bot, Image as ImageIcon, Loader2 } from 'lucide-react';

const AIAgronomist = () => {
    const [messages, setMessages] = useState<any[]>([
        { id: 1, sender: 'bot', text: 'Hello! I am your AI Agronomist. How can I help you regarding your crops today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleSend = async () => {
        if (!input.trim() && !selectedImage) return;

        let userMsg;
        if (selectedImage) {
            userMsg = {
                id: Date.now(),
                sender: 'user',
                text: input || 'Analyze this image',
                image: URL.createObjectURL(selectedImage)
            };
        } else {
            userMsg = { id: Date.now(), sender: 'user', text: input };
        }

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        const imageToUpload = selectedImage; // detailed ref
        setSelectedImage(null);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            let res;

            if (imageToUpload) {
                // If image, call Analyze
                const formData = new FormData();
                formData.append('image', imageToUpload);

                res = await axios.post('http://localhost:8001/ai/analyze', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const diagnosis = res.data;
                const botReply = (
                    <div className="space-y-2">
                        <p><strong>Analysis:</strong> {diagnosis.condition}</p>
                        <p><strong>Confidence:</strong> {diagnosis.confidence}%</p>
                        <p><strong>Recommendation:</strong> {diagnosis.recommendation}</p>
                        <div className={`h-2 rounded-full w-full ${diagnosis.color === 'green' ? 'bg-green-500' : diagnosis.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                    </div>
                );

                const botMsg = { id: Date.now() + 1, sender: 'bot', component: botReply };
                setMessages(prev => [...prev, botMsg]);

            } else {
                // Chat not implemented in backend, simple echo for now
                // Or simulate chat response
                await new Promise(r => setTimeout(r, 1000));
                const botMsg = { id: Date.now() + 1, sender: 'bot', text: "I am currently optimized for image analysis. Please upload a crop photo!" };
                setMessages(prev => [...prev, botMsg]);
            }

        } catch (error) {
            const errorMsg = { id: Date.now() + 1, sender: 'bot', text: "I'm having trouble connecting to the network. Please try again." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-8 flex flex-col items-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px]">
                <div className="bg-emerald-600 p-4 text-white flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">AI Agronomist</h2>
                        <p className="text-emerald-100 text-xs">Powered by Gemini. Ask me anything about crops.</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.sender === 'user'
                                ? 'bg-emerald-600 text-white rounded-br-none'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                }`}>
                                {msg.image && (
                                    <img src={msg.image} alt="Upload" className="mb-2 rounded-lg max-h-48 object-cover" />
                                )}
                                {msg.component ? msg.component : msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                <Loader2 className="animate-spin text-emerald-600" size={16} />
                                <span className="text-gray-400 text-xs">Thinking...</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-3 rounded-xl transition-colors ${selectedImage ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                        >
                            <ImageIcon size={20} />
                        </button>
                        <input
                            type="text"
                            className="flex-1 bg-gray-100 border-0 rounded-xl px-4 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                            placeholder={selectedImage ? "Image selected. Press Send to analyze..." : "Type your question..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            disabled={(!input.trim() && !selectedImage) || loading}
                            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-200"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAgronomist;
