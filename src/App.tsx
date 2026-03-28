/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Leaf, 
  Award, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle,
  Menu,
  X,
  Plus,
  Minus,
  Lock,
  ArrowRight
} from 'lucide-react';
import { STORE_CONFIG, BENEFITS, HOW_IT_WORKS, FAQS } from './constants';
import { supabase } from './supabase';
import Dashboard from './Dashboard';

// --- Store Components (Moved from original App.tsx) ---

const StoreHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState(() => localStorage.getItem('app_name') || STORE_CONFIG.STORE_NAME);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Listen for storage changes to update name in real-time if changed in another tab
    const handleStorageChange = () => {
      setStoreName(localStorage.getItem('app_name') || STORE_CONFIG.STORE_NAME);
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">{storeName}</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">How COD Works</button>
          <button onClick={() => scrollToSection('faq')} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">FAQ</button>
          <button onClick={() => navigate('/admin/login')} className="text-sm font-medium text-gray-400 hover:text-black transition-colors">Admin</button>
          <button 
            onClick={() => scrollToSection('order-form')}
            className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all active:scale-95"
          >
            Order Now
          </button>
        </nav>

        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            <button onClick={() => scrollToSection('how-it-works')} className="text-left py-2 font-medium">How COD Works</button>
            <button onClick={() => scrollToSection('faq')} className="text-left py-2 font-medium">FAQ</button>
            <button onClick={() => navigate('/admin/login')} className="text-left py-2 font-medium">Admin Login</button>
            <button 
              onClick={() => scrollToSection('order-form')}
              className="bg-black text-white py-4 rounded-xl font-bold text-center"
            >
              Order Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ... (Rest of the store components: Hero, Benefits, HowItWorks, OrderForm, FAQ, Footer)
// I'll keep them in the same file for simplicity as requested "fully working result"

const Hero = () => (
  <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
        <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">In Stock & Ready to Ship</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">{STORE_CONFIG.PRODUCT_NAME}</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">{STORE_CONFIG.PRODUCT_DESCRIPTION}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2">
            Order Now — {STORE_CONFIG.CURRENCY} {STORE_CONFIG.PRICE_PER_UNIT}
          </button>
          <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white border border-gray-200 text-black px-8 py-4 rounded-2xl font-bold text-lg hover:border-black transition-all active:scale-95 flex items-center justify-center gap-2">
            How it Works
          </button>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative">
        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-[3rem] blur-3xl opacity-50 -z-10"></div>
        <img src="https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&q=80&w=800&h=800" alt={STORE_CONFIG.PRODUCT_NAME} className="w-full aspect-square object-cover rounded-[2.5rem] shadow-2xl" referrerPolicy="no-referrer" />
      </motion.div>
    </div>
  </section>
);

const Benefits = () => (
  <section className="py-24 bg-gray-50/50 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
        <p className="text-gray-600">We focus on quality, sustainability, and customer satisfaction above all else.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {BENEFITS.map((benefit, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 text-black">
              {benefit.icon === 'ShieldCheck' ? <ShieldCheck /> : benefit.icon === 'Leaf' ? <Leaf /> : <Award />}
            </div>
            <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
            <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How Cash on Delivery Works</h2>
        <p className="text-gray-600">Shopping with us is simple, safe, and stress-free. No credit card required.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-12 relative">
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 -z-10"></div>
        {HOW_IT_WORKS.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mb-8 shadow-lg ring-8 ring-white">{item.step}</div>
            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedProducts = () => (
  <section id="products" className="py-24 px-6 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
        <p className="text-gray-600">Explore our curated collection of premium essentials.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {(STORE_CONFIG as any).FEATURED_PRODUCTS.map((product: any, i: number) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -10 }}
            className="group bg-gray-50 rounded-[2rem] overflow-hidden border border-transparent hover:border-black/5 transition-all"
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-1">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xl">{STORE_CONFIG.CURRENCY} {product.price}</span>
                <button 
                  onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const OrderForm = () => {
  const [formData, setFormData] = useState({ customer_name: '', phone: '', email: '', city: '', address: '', country: STORE_CONFIG.DEFAULT_COUNTRY, product_variant: STORE_CONFIG.VARIANTS[0], quantity: 1, notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('orders').insert([{ ...formData, product_name: STORE_CONFIG.PRODUCT_NAME, status: 'pending', created_at: new Date().toISOString() }]);
      if (error) throw error;
      setSubmitStatus('success');
      setFormData({ customer_name: '', phone: '', email: '', city: '', address: '', country: STORE_CONFIG.DEFAULT_COUNTRY, product_variant: STORE_CONFIG.VARIANTS[0], quantity: 1, notes: '' });
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order-form" className="py-24 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12">
          <div className="md:col-span-3 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold mb-8">Complete Your Order</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Full Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none" value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} required />
              <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              <input type="text" placeholder="City" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
              <textarea placeholder="Full Address" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
              <button type="submit" disabled={isSubmitting} className="w-full py-5 rounded-2xl font-bold text-xl bg-black text-white hover:bg-gray-800 transition-all">
                {isSubmitting ? 'Processing...' : `Confirm Order — ${STORE_CONFIG.CURRENCY} ${formData.quantity * STORE_CONFIG.PRICE_PER_UNIT}`}
              </button>
              {submitStatus === 'success' && <p className="text-green-600 font-bold text-center">Order placed successfully!</p>}
            </form>
          </div>
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>{STORE_CONFIG.CURRENCY} {formData.quantity * STORE_CONFIG.PRICE_PER_UNIT}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => (
  <section id="faq" className="py-24 px-6">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-gray-100 rounded-3xl p-6">
            <h4 className="font-bold text-lg mb-2">{faq.question}</h4>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => {
  const storeName = localStorage.getItem('app_name') || STORE_CONFIG.STORE_NAME;
  return (
    <footer className="py-12 px-6 border-t border-gray-100 text-center">
      <p className="text-gray-400 text-sm">© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
    </footer>
  );
};

const Store = () => (
  <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
    <StoreHeader />
    <main>
      <Hero />
      <Benefits />
      <FeaturedProducts />
      <HowItWorks />
      <OrderForm />
      <FAQ />
    </main>
    <Footer />
  </div>
);

// --- Admin Login Component ---

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-black rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
          <p className="text-gray-500 mt-2">Enter your credentials to access the dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Email Address</label>
            <input 
              type="email" 
              placeholder="admin@example.com"
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-black outline-none transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-black outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-black text-white font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
            Back to Store
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Protected Route ---

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

// --- Main App ---

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
