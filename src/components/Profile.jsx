import { useState, useEffect } from 'react';
import { User, Mail, Shield, BadgeCheck, MapPin, AlertTriangle, Lock, Eye, EyeOff, ListTodo } from 'lucide-react';

const Profile = () => {
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(true); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [password, setPassword] = useState("••••••••"); 
  const [showPassword, setShowPassword] = useState(false);

  // Logic: Task Manager state (Progress calculation)
  const tasks = [
    { id: 1, title: "System Security Audit", status: "Completed", color: "text-green-500" },
    { id: 2, title: "Database Migration", status: "In Progress", color: "text-blue-500" },
    { id: 3, title: "Update Profile API", status: "Pending", color: "text-amber-500" }
  ];
  const progressPercent = 65; // Logic: Mock progress value

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.password) setPassword(parsedUser.password);
    }
  }, []);

  // --- LOGIC: TOGGLE ACTIONS ---
  const handleToggleClick = () => setShowConfirmModal(true);
  const confirmToggle = () => {
    setIsTwoFactorEnabled(!isTwoFactorEnabled);
    setShowConfirmModal(false);
  };

  return (
    // Added responsive padding (p-4 on mobile, p-8 on larger screens)
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-[fadeInUp_0.6s_ease-out] relative pb-10">
      
      {/* --- CONFIRMATION MODAL --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-4xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-purple-50">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-[#1E1B4B] text-center">Are you sure?</h3>
            <p className="text-[#94A3B8] text-center text-sm font-medium mt-2 mb-8">
              Changing security status may require a re-login.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 rounded-xl font-bold text-[#94A3B8] hover:bg-gray-50 ">Cancel</button>
              <button onClick={confirmToggle} className="flex-1 py-3 bg-[#6D28D9] text-white rounded-xl font-bold shadow-lg ">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-4xl md:rounded-4xl border border-purple-50 shadow-[0_20px_50px_rgba(109,40,217,0.05)] overflow-hidden">
        <div className="h-24 md:h-32 bg-linear-to-r from-[#6D28D9] to-[#C7B5FB]"></div>
        <div className="px-6 md:px-10 pb-8 md:pb-10">
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-12 mb-6 sm:mb-8 gap-4">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-3xl p-1 shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-[#F5F3FF] rounded-xl flex items-center justify-center border border-purple-50">
                <User size={50} className="text-[#6D28D9] md:size-15" />
              </div>
            </div>
            <span className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <BadgeCheck size={14} /> Active
            </span>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-[#1E1B4B]">{user?.name || "User Name"}</h2>
            <div className="flex items-center gap-3 md:gap-4 text-[#94A3B8] font-medium text-xs md:text-sm">
              <span className="flex items-center gap-1.5"><Shield size={16} /> {user?.role || "Member"}</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} /> Global HQ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Multi-Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        
        {/* 1. Task Manager Section */}
        <div className="bg-white p-6 md:p-8 rounded-4xl border border-purple-50 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-[#1E1B4B] uppercase tracking-widest flex items-center gap-3">
            <div className="w-2 h-6 bg-[#6D28D9] rounded-full"></div>
            Task Manager
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black text-[#94A3B8] uppercase">
              <span>Overall Progress</span>
              <span className="text-[#6D28D9]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#F5F3FF] rounded-full overflow-hidden">
              <div className="h-full bg-[#6D28D9] rounded-full " style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-[#FAF9FF] rounded-2xl border border-purple-50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 bg-white rounded-lg shrink-0 flex items-center justify-center text-[#6D28D9] shadow-sm">
                    <ListTodo size={14} />
                  </div>
                  <span className="text-xs font-bold text-[#1E1B4B] truncate">{task.title}</span>
                </div>
                <span className={`text-[9px] md:text-[10px] font-black uppercase shrink-0 ml-2 ${task.color}`}>{task.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Credentials Section */}
        <div className="bg-white p-6 md:p-8 rounded-4xl border border-purple-50 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-[#1E1B4B] uppercase tracking-widest flex items-center gap-3">
            <div className="w-2 h-6 bg-[#6D28D9] rounded-full"></div>
            Credentials
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-[#94A3B8] uppercase block mb-1 ml-1">Email</label>
              <div className="flex items-center gap-3 bg-[#FAF9FF] p-4 rounded-2xl border border-purple-50">
                <Mail size={18} className="text-[#6D28D9] shrink-0" />
                <span className="text-xs text-[#1E1B4B] font-bold truncate">{user?.email || "user@mail.com"}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-[#94A3B8] uppercase block mb-1 ml-1">Password</label>
              <div className="flex items-center justify-between bg-[#FAF9FF] p-4 rounded-2xl border border-purple-50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Lock size={18} className="text-[#6D28D9] shrink-0" />
                  <span className="text-xs text-[#1E1B4B] font-bold truncate">{showPassword ? password : "••••••••••••"}</span>
                </div>
                <button onClick={() => setShowPassword(!showPassword)} className="text-[#94A3B8] hover:text-[#6D28D9] transition-colors p-1">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Security Status Section */}
        {/* 'md:col-span-2 lg:col-span-1' makes this card wide on tablet but normal on desktop */}
        <div className="bg-white p-6 md:p-8 rounded-4xl border border-purple-50 shadow-sm space-y-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-black text-[#1E1B4B] uppercase tracking-widest flex items-center gap-3">
            <div className="w-2 h-6 bg-[#6D28D9] rounded-full"></div>
            Security
          </h3>
          <div className="flex items-center justify-between p-4 bg-[#FAF9FF] rounded-2xl border border-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#6D28D9] shadow-sm shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1E1B4B]">2FA</p>
                <p className={`text-[10px] font-bold ${isTwoFactorEnabled ? 'text-green-500' : 'text-red-400'}`}>
                  {isTwoFactorEnabled ? "ACTIVE" : "INACTIVE"}
                </p>
              </div>
            </div>
            <button 
              onClick={handleToggleClick}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 cursor-pointer shrink-0 ${isTwoFactorEnabled ? 'bg-[#6D28D9]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isTwoFactorEnabled ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
          <p className="text-[10px] md:text-[11px] text-[#94A3B8] font-medium leading-relaxed">
            Last security audit: <span className="text-[#1E1B4B] font-bold">2 hours ago</span>. Your account is currently protected by biometric and multi-factor protocols.
          </p>
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Profile;