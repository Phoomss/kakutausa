import { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import authService from "../../services/authService";
import { Home, Users, ShoppingCart, BarChart3, FileText, File, Settings, X } from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const sidebarItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    {
      icon: FileText,
      label: 'Content Management',
      submenu: [
        { path: '/content', label: 'Content', icon: File },
        { path: '/content-type', label: 'Content Type', icon: File },
      ],
    },
    { path: '/settings', icon: Settings, label: 'Settings' },
    {
      label: 'Logout',
      icon: X,
      action: logout
    }
  ];

  return (
    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="mt-8">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          // Submenu
          if (item.submenu) {
            return (
              <div key={item.label} className="mb-1">
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className="w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors text-gray-600"
                >
                  {Icon && <Icon className="w-5 h-5 mr-3" />}
                  <span className="flex-1">{item.label}</span>
                  <span className="ml-auto">{openSubmenus[item.label] ? '▲' : '▼'}</span>
                </button>
                {openSubmenus[item.label] &&
                  item.submenu.map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `w-full flex items-center px-12 py-2 text-left hover:bg-gray-100 transition-colors ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'}`
                        }
                      >
                        {SubIcon && <SubIcon className="w-4 h-4 mr-2" />}
                        {sub.label}
                      </NavLink>
                    );
                  })}
              </div>
            );
          }

          // Logout Action
          if (item.action) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors text-gray-600"
              >
                {Icon && <Icon className="w-5 h-5 mr-3" />}
                {item.label}
              </button>
            );
          }

          // Normal Link
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'}`
              }
            >
              {Icon && <Icon className="w-5 h-5 mr-3" />}
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
