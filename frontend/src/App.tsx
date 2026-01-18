import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Placeholders for future pages
// Placeholders for future pages
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Policies from './pages/Policies';
import AIAgronomist from './pages/AIAgronomist';
import Chat from './pages/Chat';
import Farmers from './pages/Farmers';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';

import PriceIndex from './pages/PriceIndex';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans antialiased text-gray-900 bg-gray-50 dark:bg-zinc-950 dark:text-zinc-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/farmers" element={<Farmers />} />
                <Route path="/prices" element={<PriceIndex />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/ai-agronomist" element={<AIAgronomist />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
