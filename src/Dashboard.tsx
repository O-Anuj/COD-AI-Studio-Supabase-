import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Search, 
  Filter, 
  MoreVertical, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Download,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { supabase } from './supabase';
import { STORE_CONFIG } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types ---

interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  product_variant: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

// --- Components ---

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className={cn("text-xs font-bold px-2 py-1 rounded-full", trend > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const OrderRow = ({ order, onUpdateStatus }: { order: Order, onUpdateStatus: (id: string, status: string) => void | Promise<void>, key?: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statusColors = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    confirmed: "bg-blue-50 text-blue-600 border-blue-100",
    shipped: "bg-purple-50 text-purple-600 border-purple-100",
    delivered: "bg-green-50 text-green-600 border-green-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <tr className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
            {order.customer_name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">{order.customer_name}</p>
            <p className="text-xs text-gray-500">{order.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <p className="text-sm font-medium text-gray-700">{order.product_variant}</p>
        <p className="text-xs text-gray-400">Qty: {order.quantity}</p>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          {order.city}
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", statusColors[order.status])}>
          {order.status}
        </span>
      </td>
      <td className="py-4 px-4 text-xs text-gray-400">
        {new Date(order.created_at).toLocaleDateString()}
      </td>
      <td className="py-4 px-4 text-right relative">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
        
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-4 top-12 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 p-2 overflow-hidden"
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase px-3 py-2">Change Status</p>
                {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onUpdateStatus(order.id, s);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors capitalize",
                      order.status === s ? "bg-gray-50 text-black" : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </td>
    </tr>
  );
};

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [storeName, setStoreName] = useState(() => localStorage.getItem('app_name') || STORE_CONFIG.STORE_NAME);

  const [adminEmail, setAdminEmail] = useState('');

  const saveSettings = () => {
    localStorage.setItem('app_name', storeName);
    alert('Settings saved successfully!');
  };

  useEffect(() => {
    fetchOrders();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setAdminEmail(user.email);
    });
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setOrders(orders.map(o => o.id === id ? { ...o, status: status as any } : o));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const revenue = orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + (o.quantity * STORE_CONFIG.PRICE_PER_UNIT), 0);

    return { total, pending, delivered, cancelled, revenue };
  }, [orders]);

  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const count = orders.filter(o => o.created_at.startsWith(date)).length;
      return {
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        orders: count
      };
    });
  }, [orders]);

  const statusData = [
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Delivered', value: stats.delivered, color: '#10b981' },
    { name: 'Cancelled', value: stats.cancelled, color: '#ef4444' },
    { name: 'Other', value: stats.total - stats.pending - stats.delivered - stats.cancelled, color: '#6366f1' }
  ].filter(d => d.value > 0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">{storeName}</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
              activeTab === 'overview' ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50 hover:text-black"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
              activeTab === 'orders' ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50 hover:text-black"
            )}
          >
            <Package className="w-5 h-5" />
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
              activeTab === 'settings' ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50 hover:text-black"
            )}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight capitalize">{activeTab}</h1>
            <p className="text-gray-500 text-sm">Manage your store and track performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 text-gray-400" />
            </button>
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <StatCard title="Total Orders" value={stats.total} icon={Package} color="bg-blue-500" trend={12} />
              <StatCard title="Pending" value={stats.pending} icon={Clock} color="bg-amber-500" trend={-5} />
              <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle2} color="bg-green-500" trend={8} />
              <StatCard title="Total Revenue" value={`${STORE_CONFIG.CURRENCY} ${stats.revenue}`} icon={TrendingUp} color="bg-purple-500" trend={15} />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-8">Order Volume (Last 7 Days)</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#9ca3af' }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#9ca3af' }} 
                      />
                      <Tooltip 
                        cursor={{ fill: '#f9fafb' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="orders" fill="#000" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-8">Status Distribution</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-4">
                  {statusData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="text-gray-500">{d.name}</span>
                      </div>
                      <span className="font-bold">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 flex justify-between items-center border-b border-gray-50">
                <h3 className="text-lg font-bold">Recent Orders</h3>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-sm font-bold text-gray-400 hover:text-black transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <th className="py-4 px-8">Customer</th>
                      <th className="py-4 px-4">Product</th>
                      <th className="py-4 px-4">Location</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4">Date</th>
                      <th className="py-4 px-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <OrderRow key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by name, email, or city..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-black outline-none transition-all text-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-gray-400 ml-2" />
                <select 
                  className="bg-gray-50 border-transparent rounded-2xl px-4 py-2.5 text-sm font-bold outline-none focus:bg-white focus:border-black transition-all"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <th className="py-4 px-8">Customer</th>
                      <th className="py-4 px-4">Product</th>
                      <th className="py-4 px-4">Location</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4">Date</th>
                      <th className="py-4 px-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <OrderRow key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-20 text-center text-gray-400 font-medium">
                          No orders found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Placeholder */}
              <div className="p-6 border-t border-gray-50 flex justify-between items-center">
                <p className="text-xs text-gray-400 font-medium">Showing {filteredOrders.length} of {orders.length} orders</p>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
                  <button className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 disabled:opacity-50" disabled><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
              <h3 className="text-xl font-bold">General Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Application Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-black outline-none transition-all"
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                  />
                  <p className="text-xs text-gray-400">This name will appear in the dashboard and store header.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Admin Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent outline-none cursor-not-allowed text-gray-400"
                    value={adminEmail}
                    readOnly
                  />
                </div>

                <div className="pt-6">
                  <button 
                    onClick={saveSettings}
                    className="bg-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
