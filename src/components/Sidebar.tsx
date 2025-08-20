import React, {useState} from 'react';
import { 
  BarChart3, 
  Video, 
  BookOpen, 
  Award, 
  Users, 
  Package,
  Settings,
  LogOut,
  
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



const Sidebar: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    window.location.reload();
  };
  return (
    <div className="w-64 bg-black min-h-screen border-r border-gray-800 relative flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800 flex justify-center">
        <img src={Logo} alt="" />
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
              end // ensures /dashboard only matches exactly
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 w-64 border-t border-gray-800">
        {/* <button className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button> */}
        <button className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors duration-200" 
          onClick={() => {
            handleLogout();
          }}>
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
