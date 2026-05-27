import { useState, useEffect, useContext } from 'react';
import { User as UserIcon, Mail, Shield, BadgeCheck, MapPin, AlertTriangle, Lock, Eye, EyeOff, ListTodo } from 'lucide-react';
import { useNavigate } from "react-router-dom"; 
import UpdatePasswordModal from './Update';
import { ThemeContext } from "../context/ThemeContext";

type User = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  id?: string;
};

type Task = {
  id: number;
  title: string;
  status: string;
  color: string;
};

const Profile = () => {
  const navigate = useNavigate(); 
  const { theme }: any = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [user, setUser] = useState<User | null>(null);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(true); 
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState<boolean>(false);   
  const [password, setPassword] = useState<string>("••••••••"); 
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState<boolean>(false);

  const tasks: Task[] = [
    { id: 1, title: "System Security Audit", status: "Completed", color: "text-green-500" },
    { id: 2, title: "Database Migration", status: "In Progress", color: "text-blue-500" },
    { id: 3, title: "Update Profile API", status: "Pending", color: "text-amber-500" }
  ];
  const progressPercent = 65; 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.password) setPassword(parsedUser.password);
    }
  }, []);

  const handleToggleClick = (): void => setShowConfirmModal(true);
  
  const confirmToggle = (): void => {
    setIsTwoFactorEnabled(!isTwoFactorEnabled);
    setShowConfirmModal(false);
  };

  const handlePasswordUpdate = (newPassword: string) => {
    setPassword(newPassword);
  };

  const handleDeleteAccount = async (): Promise<void> => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}"); 
      await fetch(`https://69ef23b6112e1b968e240e58.mockapi.io/users/${storedUser.id}`, { 
        method: "DELETE"
      });

      localStorage.removeItem("user"); 
      localStorage.removeItem(`tasks_${storedUser.email}`); 
      navigate("/"); 
    } catch (error) {
      console.error("Delete failed:", error); 
    }
  };

  const cardStyle = `p-6 md:p-8 rounded-4xl border transition-all duration-300 ${
    isDark ? "bg-slate-900 border-slate-800" : "bg-white border-purple-50 shadow-sm"
  }`;

  return (
    <>
      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className={`rounded-4xl p-6 md:p-8 max-w-sm w-full shadow-2xl border animate-[fadeInUp_0.3s_ease-out] ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-purple-50"}`}>
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className={`text-xl font-black text-center ${isDark ? "text-white" : "text-[#1E1B4B]"}`}>Are you sure?</h3>
            <p className="text-[#94A3B8] text-center text-sm font-medium mt-2 mb-8">Changing security status may require a re-login.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 rounded-xl font-bold text-[#94A3B8] hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={confirmToggle} className="flex-1 py-3 bg-[#6D28D9] text-white rounded-xl font-bold shadow-lg hover:bg-[#5B21B6] transition-colors">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT MODAL */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className={`rounded-[40px] p-6 md:p-8 max-w-sm w-full shadow-2xl border animate-[fadeInUp_0.3s_ease-out] ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-red-100"}`}>
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className={`text-xl font-black text-center ${isDark ? "text-white" : "text-[#1E1B4B]"}`}>Delete Account?</h3>
            <p className="text-[#94A3B8] text-center text-sm font-medium mt-2 mb-8">This action will permanently delete your account and all tasks.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowDeleteAccountModal(false)} className="flex-1 py-3 rounded-xl font-bold text-[#94A3B8] hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={handleDeleteAccount} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE PASSWORD MODAL */}
      {showUpdatePasswordModal && (
        <UpdatePasswordModal
          onClose={() => setShowUpdatePasswordModal(false)}
          onPasswordUpdate={handlePasswordUpdate}
        />
      )}

      {/* MAIN PROFILE CONTAINER */}
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-[fadeInUp_0.6s_ease-out] relative pb-10">
        
        {/* Profile Header Card */}
        <div className={`rounded-4xl border overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-purple-50 shadow-[0_20px_50px_rgba(109,40,217,0.05)]"}`}>
          <div className="h-24 md:h-32 bg-linear-to-r from-[#6D28D9] to-[#C7B5FB]"></div>
          <div className="px-6 md:px-10 pb-8 md:pb-10">
            <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-12 mb-6 sm:mb-8 gap-4">
              <div className={`w-28 h-28 md:w-32 md:h-32 rounded-3xl p-1 shadow-xl flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-white"}`}>
                <div className={`w-full h-full rounded-xl flex items-center justify-center border ${isDark ? "bg-slate-900 border-slate-700" : "bg-[#F5F3FF] border-purple-50"}`}>
                  <UserIcon size={50} className="text-[#6D28D9] md:size-15" />
                </div>
              </div>
              <span className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-2 ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-green-50 text-green-600"}`}>
                <BadgeCheck size={14} /> Active
              </span>
            </div>

            <div className="space-y-1">
              <h2 className={`text-2xl md:text-3xl font-black ${isDark ? "text-white" : "text-[#1E1B4B]"}`}>
                {user?.name || "User Name"}
              </h2>
              <div className="flex items-center gap-3 md:gap-4 text-[#94A3B8] font-medium text-xs md:text-sm">
                <span className="flex items-center gap-1.5">
                  <Shield size={16} /> {user?.role || "Member"}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} /> Global HQ
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Task Manager Section */}
          <div className={cardStyle}>
            <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-3 ${isDark ? "text-slate-200" : "text-[#1E1B4B]"}`}>
              <div className="w-2 h-6 bg-[#6D28D9] rounded-full"></div>
              Task Manager
            </h3>

            <div className="space-y-2 mt-6">
              <div className="flex justify-between text-[10px] font-black text-[#94A3B8] uppercase">
                <span>Overall Progress</span>
                <span className="text-[#6D28D9]">{progressPercent}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-[#F5F3FF]"}`}>
                <div
                  className="h-full bg-[#6D28D9] rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4 mt-6">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-[#FAF9FF] border-purple-50"}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[#6D28D9] shadow-sm ${isDark ? "bg-slate-900" : "bg-white"}`}>
                      <ListTodo size={14} />
                    </div>
                    <span className={`text-xs font-bold truncate ${isDark ? "text-slate-300" : "text-[#1E1B4B]"}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-black uppercase shrink-0 ml-2 ${task.color}`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Credentials Section */}
          <div className={cardStyle}>
            <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-3 ${isDark ? "text-slate-200" : "text-[#1E1B4B]"}`}>
              <div className="w-2 h-6 bg-[#6D28D9] rounded-full"></div>
              Credentials
            </h3>

            <div className="space-y-4 mt-6">
              <div>
                <label className="text-[10px] font-black text-[#94A3B8] uppercase block mb-1 ml-1">Email</label>
                <div className={`flex items-center gap-3 p-4 rounded-2xl border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-[#FAF9FF] border-purple-50"}`}>
                  <Mail size={18} className="text-[#6D28D9] shrink-0" />
                  <span className={`text-xs font-bold truncate ${isDark ? "text-slate-300" : "text-[#1E1B4B]"}`}>
                    {user?.email || "user@mail.com"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-[#94A3B8] uppercase block mb-1 ml-1">Password</label>
                <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-[#FAF9FF] border-purple-50"}`}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Lock size={18} className="text-[#6D28D9] shrink-0" />
                    <span className={`text-xs font-bold truncate ${isDark ? "text-slate-300" : "text-[#1E1B4B]"}`}>
                      {showPassword ? password : "••••••••••••"}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#94A3B8] hover:text-[#6D28D9] transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#94A3B8] leading-relaxed font-medium mt-6">
              Update your password to keep your account secure and protected.
            </p>

            <button
              onClick={() => setShowUpdatePasswordModal(true)}
              className={`w-full py-3 rounded-2xl font-bold transition-all duration-300 cursor-pointer mt-2 ${
                isDark ? "bg-purple-500/10 text-purple-400 hover:bg-purple-600 hover:text-white" : "bg-purple-50 text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white"
              }`}
            >
              Update Password
            </button>
          </div>

          {/* Security Status Section*/}
          <div className={`${cardStyle} md:col-span-2 lg:col-span-1`}>
            <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-3 ${isDark ? "text-slate-200" : "text-[#1E1B4B]"}`}>
              <div className="w-2 h-6 bg-[#6D28D9] rounded-full"></div>
              Security
            </h3>

            <div className={`flex items-center justify-between p-4 rounded-2xl border mt-6 ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-[#FAF9FF] border-purple-50"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[#6D28D9] shadow-sm shrink-0 ${isDark ? "bg-slate-900" : "bg-white"}`}>
                  <Shield size={20} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${isDark ? "text-white" : "text-[#1E1B4B]"}`}>2FA</p>
                  <p className={`text-[10px] font-bold ${isTwoFactorEnabled ? 'text-green-500' : 'text-red-400'}`}>
                    {isTwoFactorEnabled ? "ACTIVE" : "INACTIVE"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleClick}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 cursor-pointer shrink-0 ${isTwoFactorEnabled ? 'bg-[#6D28D9]' : 'bg-gray-300'}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isTwoFactorEnabled ? 'right-1' : 'left-1'}`}
                ></div>
              </button>
            </div>

            <p className="text-[10px] md:text-[11px] text-[#94A3B8] font-medium leading-relaxed mt-6">
              Last security audit:
              <span className={isDark ? "text-white font-bold" : "text-[#1E1B4B] font-bold"}> 2 hours ago</span>.
              Your account is currently protected by biometric and multi-factor protocols.
            </p>

            <div className={`pt-4 border-t space-y-3 mt-6 ${isDark ? "border-slate-800" : "border-purple-100"}`}>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed font-medium">
                Permanently remove your account and all associated tasks. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteAccountModal(true)}
                className="w-full py-3 bg-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
};

export default Profile;