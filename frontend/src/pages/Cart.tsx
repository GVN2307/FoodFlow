import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, CreditCard, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, clearCart, total } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    const handleCheckout = () => {
        setIsCheckingOut(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsCheckingOut(false);
            setIsPaid(true);
            clearCart();
        }, 2000);
    };

    if (isPaid) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 px-4 flex justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full h-fit">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                    <p className="text-gray-600 mb-6">Your order has been placed successfully. Thank you for supporting local farmers.</p>
                    <Link to="/marketplace" className="block w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors" onClick={() => setIsPaid(false)}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 md:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
                        <Link to="/marketplace" className="text-green-600 font-medium hover:underline">
                            Browse Marketplace
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="md:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.cartId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                    <img
                                        src={item.image_url || "https://placehold.co/100"}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Seller: {item.farmer?.full_name || 'Farmer'}</p>
                                        <p className="font-bold text-green-600 mt-1">₹{item.price_per_kg}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.cartId)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Bill Summary */}
                        <div className="md:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Bill Details</h2>

                                <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cart.length} items)</span>
                                        <span>₹{total}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Platform Fee</span>
                                        <span>₹0</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-green-600">₹{total}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isCheckingOut ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <CreditCard size={20} />
                                            Pay Now
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-4">Safe & Secure Payment</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
