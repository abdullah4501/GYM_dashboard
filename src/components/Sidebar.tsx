import React from 'react';
import { 
  BarChart3, 
  Video, 
  BookOpen, 
  Award, 
  Users, 
  Package,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo.png';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/videos', label: 'Videos', icon: Video },
  { to: '/ebooks', label: 'E-Books', icon: BookOpen },
  { to: '/certificates', label: 'Certificates', icon: Award },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/transactions', label: 'Transactions', icon: Package },
  { to: '/bank-transfers', label: 'SEPA Transfers', icon: Package },
];

interface SidebarProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open = false, setOpen }) => {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.reload();
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`
          fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-200
          ${open ? "block md:hidden" : "hidden"}
        `}
        onClick={() => setOpen?.(false)}
      />
      {/* Sidebar Drawer */}
      <div
        className={`
          fixed z-40 top-0 left-0 h-full w-64 bg-black border-r border-gray-800 flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* Close Button for mobile */}
        <button
          className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white text-2xl"
          onClick={() => setOpen?.(false)}
          aria-label="Close sidebar"
        >
          <X className="w-7 h-7" />
        </button>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex justify-center">
          <img src={Logo} alt="Logo" className="max-h-10" />
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center px-6 py-3 text-left transition-colors duration-200 no-underline ${
                    isActive
                      ? 'bg-red-500 text-white border-r-2 border-red-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
                end
                onClick={() => setOpen?.(false)} // close sidebar on navigation (mobile)
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 w-64 border-t border-gray-800">
          <NavLink to="/admin-settings" className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </NavLink>
          <button
            className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors duration-200"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
