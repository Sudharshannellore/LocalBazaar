import React from 'react';
import { LayoutDashboard, ShoppingBag, ShoppingCart, LogOut } from 'lucide-react'; // ✅ imported LogOut
import { Link, useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { path: '/delivery', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/delivery/orders', icon: ShoppingCart, label: 'Orders' },
];

function DeliverySideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('deliveryToken');
    localStorage.removeItem('deliveryInfo');
    navigate('/login/delivery');
  };

  return (
    <div className="w-64 h-full bg-gray-950 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <ShoppingBag className="h-8 w-8 text-white" />
        <h1 className="text-white text-xl font-bold">Delivery Panel</h1>
      </div>
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-white hover:bg-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white hover:bg-gray-900 w-full mt-4"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </div>
  );
}

export default DeliverySideBar;
