import React from 'react'
import { LayoutDashboard, ShoppingBag, Store, LayoutGrid, BadgeCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/vendor-approve', icon: BadgeCheck, label: 'Approve Vendors' },
    { path: '/admin/vendors', icon: Store, label: 'Vendors' },
    { path: '/admin/categories', icon: LayoutGrid, label: 'Categories' },
  ];

function AdminSideBar() {
    const location = useLocation();
  return (
    <div className="w-64 h-full bg-gray-950 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <ShoppingBag className="h-8 w-8 text-white" />
        <h1 className="text-white text-xl font-bold">Admin Panel</h1>
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
    </div>
  )
}

export default AdminSideBar;
