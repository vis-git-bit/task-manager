import { useContext , useEffect } from 'react';
import { Search, Bell, UserCircle, Moon, Sun } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from '../context/ThemeContext';

type Props = {
  searchText: string;   // stores search text
  setSearchText: (value: string) => void;    // updates search text
  handleSearch: () => void;    // runs search
  handleCancel: () => void;    // resets search
};

// receive search props from Home component
const Topbar = ({
  searchText,
  setSearchText,
  handleSearch,
  handleCancel
}: Props) => {

  const { user } = useAuth();

  // access theme and toggle from context
  const { theme, toggleTheme }: any = useContext(ThemeContext); 

  useEffect (() => {
     console.log("useEffect Running");
    const delaySearch = setTimeout (() => {  // Wait 2000ms then run search
     console.log("Search Running");
     handleSearch();
    }, 2000);

    return() => {
      console.log("Timer Cleared");
      clearTimeout(delaySearch);  //Old timer gets removed & new timer starts again
    };
  }, [searchText]);  //Run effect whenever searchText changes.

  return (
    <div
      className={`h-24 md:h-32 backdrop-blur-md border-b flex items-center justify-between gap-4 px-4 md:px-10 sticky top-0 z-20 transition-all duration-300 ${
        theme === "dark"
          ? "bg-[#0B1220] border-[#1F2937]"
          : "bg-white/40 border-white/20"
      }`}
    >
      {/* Search */}
      <div className="flex items-center grow max-w-2xl gap-2 sm:gap-3">
        <div className="relative w-full group block"> 
          
          <Search
            size={18}
            className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 transition-colors ${
              theme === "dark"
                ? "text-gray-400 group-focus-within:text-violet-400"
                : "text-[#94A3B8] group-focus-within:text-[#7C3AED]"
            }`}
          />

          <input
            type="text"
            value={searchText}   // current search value
            onChange={(e) => {
              console.log(e.target.value)
              setSearchText(e.target.value)}  } // update input value while typing
            placeholder="Search workflow..."
            className={`w-full rounded-xl sm:rounded-2xl py-2 sm:py-2.5 md:py-3 pl-9 sm:pl-12 pr-3 text-xs sm:text-sm font-medium outline-none transition-all ${
              theme === "dark"
                ? "bg-[#111827] border border-[#1F2937] text-white placeholder:text-gray-500 focus:border-violet-500" 
                : "bg-white border border-purple-50 text-[#1E1B4B] focus:border-[#7C3AED] focus:bg-white" 
            }`}
          />
        </div>

        <div className="flex gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleSearch}
            className={`px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              theme === "dark"
                ? "bg-violet-600 hover:bg-violet-700 text-white"
                : "bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
            }`}
          >
            Search
          </button>

          <button
            onClick={handleCancel}
            className={`px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              theme === "dark"
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-6 shrink-0">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 md:p-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer ${
            theme === "dark"
              ? "bg-[#111827] text-yellow-300 hover:bg-[#1F2937]"
              : "bg-white text-[#7C3AED] hover:bg-[#F3E8FF]"
          }`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification */}
        <button
          className={`p-2 md:p-3 rounded-xl sm:rounded-2xl transition-all relative ${
            theme === "dark"
              ? "text-gray-300 hover:text-violet-400"
              : "text-[#94A3B8] hover:text-[#7C3AED]"
          }`}
        >
          <Bell size={18} />
          <span
            className={`absolute top-2.5 right-2.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full border ${
              theme === "dark" ? "border-[#0B1220]" : "border-white"
            }`}
          ></span>
        </button>

        {/* User */}
        <div
          className={`flex items-center gap-2 md:gap-4 pl-2 md:pl-6 cursor-pointer group ${
            theme === "dark"
              ? "border-l border-[#1F2937]"
              : "border-l border-purple-100"
          }`}
        >
          <div className="text-right hidden md:block">
            <p
              className={`text-sm font-black transition-colors ${
                theme === "dark"
                  ? "text-white group-hover:text-violet-400"
                  : "text-[#1E1B4B] group-hover:text-[#7C3AED]"
              }`}
            >
              {user?.name || "User Name"}
            </p>

            <p
              className={`text-[10px] font-black uppercase tracking-widest ${
                theme === "dark"
                  ? "text-gray-500"
                  : "text-[#94A3B8]"
              }`}
            >
              user account
            </p>
          </div>

          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm border transition-all ${
              theme === "dark"
                ? "bg-[#111827] border-[#1F2937]"
                : "bg-white border-purple-50"
            }`}
          >
            <UserCircle
              size={22}
              className={`${
                theme === "dark"
                  ? "text-violet-400"
                  : "text-[#7C3AED]"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;