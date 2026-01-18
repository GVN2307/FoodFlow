import { useState, useEffect, useRef } from 'react';
import api from '../lib/api'; // Use centralized api client
import { useAuth } from '../context/AuthContext';
import { Send, User as UserIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    createdAt: string;
    sender: { fullName: string };
    receiver: { fullName: string };
}

interface Contact {
    id: number;
    fullName: string;
    email: string;
    lastMessage?: string;
    timestamp?: string;
}

const Chat = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Contact[]>([]);
    const [activeContactId, setActiveContactId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [searchParams] = useSearchParams();
    const newChatUserId = searchParams.get('newChatWith');

    // 1. Load Conversations
    useEffect(() => {
        fetchConversations();
        // If redirected from marketplace with a specific user
        if (newChatUserId) {
            const userId = parseInt(newChatUserId);
            if (!isNaN(userId) && userId !== user?.id) {
                setActiveContactId(userId);
                // We might not have this user in the "conversations" list yet if it's new
                // For MVP, we presume we just start chatting.
            }
        }
    }, [newChatUserId, user]);

    // 2. Poll for messages when active contact is selected
    useEffect(() => {
        let interval: any;
        if (activeContactId) {
            fetchMessages(activeContactId);
            interval = setInterval(() => {
                fetchMessages(activeContactId);
            }, 3000); // Poll every 3 seconds
        }
        return () => clearInterval(interval);
    }, [activeContactId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/chat/conversations');
            setConversations(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load conversations", error);
            setLoading(false);
        }
    };

    const fetchMessages = async (contactId: number) => {
        try {
            const res = await api.get(`/chat/conversation/${contactId}`);
            setMessages(res.data);
        } catch (error) {
            console.error("Failed to load messages", error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeContactId || !newMessage.trim()) return;

        try {
            await api.post('/chat/send', {
                receiverId: activeContactId,
                content: newMessage
            });
            setNewMessage('');
            fetchMessages(activeContactId); // Refresh immediately
            fetchConversations(); // Update last message in sidebar
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    if (!user) {
        return <div className="pt-20 text-center">Please log in to chat.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
            <div className="max-w-6xl mx-auto h-[600px] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex">

                {/* Sidebar: Conversations */}
                <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <h2 className="font-bold text-gray-800">Messages</h2>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {loading ? (
                            <div className="text-center p-4 text-gray-400">Loading contacts...</div>
                        ) : conversations.length === 0 && !activeContactId ? (
                            <div className="text-center p-4 text-gray-400 text-sm">No conversations yet. Browse the Marketplace to contact a seller!</div>
                        ) : (
                            conversations.map(contact => (
                                <button
                                    key={contact.id}
                                    onClick={() => setActiveContactId(contact.id)}
                                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${activeContactId === contact.id ? 'bg-green-100 border border-green-200' : 'hover:bg-white hover:shadow-sm'}`}
                                >
                                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        <UserIcon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold text-sm truncate ${activeContactId === contact.id ? 'text-green-900' : 'text-gray-900'}`}>{contact.fullName}</h3>
                                        <p className="text-xs text-gray-500 truncate">{contact.lastMessage || 'Click to chat'}</p>
                                    </div>
                                </button>
                            ))
                        )}

                        {/* If chatting with a new user not in list, show a temp placeholder active state */}
                        {activeContactId && !conversations.find(c => c.id === activeContactId) && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-center">
                                <span className="text-sm font-medium text-green-800">New Conversation</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {activeContactId ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {conversations.find(c => c.id === activeContactId)?.fullName[0] || '?'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {conversations.find(c => c.id === activeContactId)?.fullName || 'Chat User'}
                                        </h3>
                                        <span className="text-xs text-green-600 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-400 mt-10">
                                        <p>This is the start of your secure conversation.</p>
                                        <p className="text-xs">Messages are end-to-end protected.</p>
                                    </div>
                                ) : (
                                    messages.map(msg => {
                                        const isMe = msg.senderId === user?.id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] rounded-2xl p-3 text-sm ${isMe
                                                    ? 'bg-green-600 text-white rounded-br-none'
                                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                                    }`}>
                                                    <p>{msg.content}</p>
                                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-green-200' : 'text-gray-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-gray-100 bg-white">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a secure message..."
                                        className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <UserIcon size={32} />
                            </div>
                            <p>Select a contact to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
