import React from 'react';
import { 
  BarChart3, 
  Video, 
  BookOpen, 
  Award, 
  Users, 
  Package,
  Home,
  Settings,
  LogOut
} from 'lucide-react';

type ActivePage = 'dashboard' | 'videos' | 'ebooks' | 'certificates' | 'members' | 'plans';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: BarChart3 },
    { id: 'videos' as ActivePage, label: 'Videos', icon: Video },
    { id: 'ebooks' as ActivePage, label: 'E-Books', icon: BookOpen },
    { id: 'certificates' as ActivePage, label: 'Certificates', icon: Award },
    { id: 'members' as ActivePage, label: 'Members', icon: Users },
    { id: 'plans' as ActivePage, label: 'Plans', icon: Package },
  ];

  return (
    <div className="w-64 bg-black min-h-screen border-r border-gray-800">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Passion Physique</h2>
            <p className="text-gray-400 text-sm">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                activePage === item.id
                  ? 'bg-red-500 text-white border-r-2 border-red-400'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 w-64 border-t border-gray-800">
        <button className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button>
        <button className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors duration-200">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;