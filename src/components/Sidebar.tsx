import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, UserCircle, LogOut, CheckCircle2, Wand2 } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

type Props = {
  onMenuClick: (view: string) => void; //fn. recieves a string but returns nothing 
  view: string;
  onLogoutClick: () => void; // New prop to handle modal trigger
};

const Sidebar = ({ onMenuClick, view, onLogoutClick }: Props) => {   // receive function to change view & current active view
  const navigate = useNavigate();

  // get logout function from context
  const { logout } = useAuth();

  // Access theme for specific conditional styling if needed
  const { theme }: any = useContext(ThemeContext);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', action: "dashboard" },
    { icon: <PlusCircle size={20} />, label: 'Add Task', action: "addTask" },
    { icon: <Wand2 size={20} />, label: 'Generate Task', action: "GenerateTask" },
    { icon: <UserCircle size={20} />, label: 'Profile', action: "profile" },
  ];

  const handleLogout = () => { 
    // call context logout fn.
    logout();  
    navigate("/"); 
  }; 

  return (
    <div
      className={`w-full lg:w-80 backdrop-blur-xl border-b lg:border-r flex flex-row lg:flex-col p-4 lg:p-8 font-sans z-30 transition-colors duration-300
      ${theme === "dark"
        ? "bg-[#0B1220] border-[#1F2937]"
        : "bg-white/70 border-purple-100"
      }`}
    >
      <div className="flex items-center gap-3 mb-0 lg:mb-12 mr-8 lg:mr-0">
        <div className="w-10 h-10 bg-linear-to-br from-[#7C3AED] to-[#6D28D9] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 dark:shadow-none">
          <CheckCircle2 className="text-white" size={22} />
        </div>
        <span
          className={`hidden sm:block text-xl font-black tracking-tight 
          ${theme === "dark" ? "text-white" : "text-[#2E1065]"}
          `}
        >
          Task-Manager
        </span>
      </div>

      <nav className="grow flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible no-scrollbar">
        {menuItems.map((item, index) => (
          <button           
            key={index}
            onClick={() => onMenuClick(item.action)} // send selected action to parent (Home)
            className={`flex items-center gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-2xl transition-all duration-300 font-bold text-sm cursor-pointer whitespace-nowrap  
            ${view === item.action
              ? 'bg-[#7C3AED] text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/20' 
              : theme === "dark"
                ? "text-gray-300 hover:bg-[#111827] hover:text-violet-400"
                : "text-[#94A3B8] hover:bg-purple-50 hover:text-[#7C3AED]"
            }`}
          >
            {item.icon}
            <span className="hidden lg:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="ml-4 lg:ml-0 lg:pt-8 border-l lg:border-l-0 lg:border-t flex items-center">
        <button 
          onClick={onLogoutClick} // Intercepted to trigger confirmation modal instead of routing instantly
          className={`flex items-center gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-2xl transition-all duration-300 font-bold text-sm cursor-pointer w-full 
          ${theme === "dark"
            ? "text-gray-400 hover:bg-red-900/20 hover:text-red-400"
            : "text-[#94A3B8] hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <LogOut size={20} />
          <span className="hidden lg:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 