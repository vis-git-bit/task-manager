import { useState, useEffect } from 'react';
import { Search, Bell, UserCircle } from 'lucide-react';

type User = {
  name?: string;
  email?: string;
};

const Topbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const StoredUser = localStorage.getItem("user");
    if (StoredUser) { setUser(JSON.parse(StoredUser)) }
  }, []);

  return (
    <div className="h-20 md:h-24 bg-white/80 backdrop-blur-md border-b border-purple-50 flex items-center justify-between px-4 md:px-10 sticky top-0 z-20">
      
      <div className="flex items-center grow max-w-md">
        <div className="relative w-full group hidden xs:block">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#6D28D9] transition-colors" />
          <input
            type="text"
            placeholder="Search workflow..."
            className="w-full bg-[#FAF9FF] border border-transparent rounded-2xl py-2.5 md:py-3 pl-12 pr-4 text-sm font-medium outline-none focus:border-purple-100 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <button className="p-2 md:p-3 text-[#94A3B8] hover:text-[#6D28D9] hover:bg-[#F5F3FF] rounded-2xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 md:top-3 md:right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-2 md:gap-4 pl-2 md:pl-6 border-l border-gray-100 cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-[#1E1B4B]">{user?.name || "User Name"}</p>
            <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">user account</p>
          </div>
          <div className="w-10 h-10 md:w-11 md:h-11 bg-[#F5F3FF] rounded-xl md:rounded-2xl border border-purple-50 flex items-center justify-center">
            <UserCircle size={24} className="text-[#6D28D9]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;