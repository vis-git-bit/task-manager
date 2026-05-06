import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, UserCircle, LogOut, CheckCircle2,  Wand2 } from 'lucide-react';

type Props = {
  onMenuClick: (view: string) => void; //fn. recieves a string but returns nothing 
  view: string;
};

const Sidebar = ({ onMenuClick, view } : Props) => {   // receive function to change view & current active view
  const navigate = useNavigate();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', action: "dashboard" },
    { icon: <PlusCircle size={20} />, label: 'Add Task', action: "addTask" },
    { icon: <Wand2 size={20} />, label: 'Generate Task', action: "GenerateTask" },
    { icon: <UserCircle size={20} />, label: 'Profile', action: "profile" },
  ];

  const handleLogout = () => { 
   localStorage.removeItem("user"); 
    navigate("/");
  }; 

  return (
    <div className="w-full lg:w-80 bg-white border-b lg:border-r border-purple-50 flex flex-row lg:flex-col p-4 lg:p-8 font-sans z-10">
      <div className="flex items-center gap-3 mb-0 lg:mb-12 mr-8 lg:mr-0">
        <div className="w-10 h-10 bg-[#6D28D9] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-100">
          <CheckCircle2 className="text-white" size={22} />
        </div>
        <span className="hidden sm:block text-xl font-black text-[#2E1065] tracking-tight">Task-Manager</span>
      </div>

      <nav className="grow flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible no-scrollbar">
        {menuItems.map((item, index) => (
          <button           
            key={index}
            onClick={() => onMenuClick(item.action)}  // send selected action to parent (Home)
            className={`flex items-center gap-4 px-4 lg:px-5 py-3 lg:py-4 rounded-2xl transition-all duration-300 font-bold text-sm cursor-pointer whitespace-nowrap ${
              view === item.action
                ? 'bg-[#F5F3FF] text-[#6D28D9] shadow-sm' 
                : 'text-[#94A3B8] hover:bg-[#FAF9FF] hover:text-[#6D28D9]'
            }`}
          >
            {item.icon}
            <span className="hidden lg:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="ml-4 lg:ml-0 lg:pt-8 border-l lg:border-l-0 lg:border-t border-[#F1F5F9] flex items-center">
        <button onClick={handleLogout} className="flex items-center gap-4 px-4 lg:px-5 py-3 lg:py-4 rounded-2xl text-[#94A3B8] hover:bg-red-50 hover:text-red-500 hover:w-full transition-all duration-300 font-bold text-sm cursor-pointer ">
          <LogOut size={20} />
          <span className="hidden lg:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;  