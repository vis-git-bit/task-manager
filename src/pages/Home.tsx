import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Table from "../components/Table";
import AddTask from "../components/Task";
import Profile from "../components/Profile";
import AITask from "../components/AITasks";
import { LayoutDashboard, CheckCircle, Clock, Trash2 , AlertTriangle, LogOut } from 'lucide-react';
import { ThemeContext } from "../context/ThemeContext";
import toast, { Toaster } from 'react-hot-toast'; 

type Task = {
  TaskName: string;
  Description: string;
  Status: "Completed" | "Pending" | "All" | string;
  DueDate: string;
  Priority?: "High" | "Medium" | "Low"; // Added Priority type support
};

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Destructuring authentication actions here

  const [view, setView] = useState<string>("dashboard"); // controls which page is shown (dashboard / addTask / profile)
  const [editIndex, setEditIndex] = useState<number | null>(null); // stores index of task being edited
  const [tasks, setTasks] = useState<Task[]>([]); // stores all tasks from localStorage
  const [filter, setFilter] = useState<"All" | "Completed" | "Pending" | "Overdue">("All"); // stores current filter (All / Completed / Pending / OverDue)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");   // stores search input value
  const [searchedTasks, setSearchedTasks] = useState<Task[]>([]);   // stores searched tasks
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false); // Controls logout confirmation popup 

  // Access theme from context
  const { theme }: any = useContext(ThemeContext);
  const isDark = theme === "dark";

  // for overdue tasks
  const isTaskOverdue = (dueDate: string, status: string) => {
    if (!dueDate || status === "Completed") return false;  // If task has no due date OR task is completed then NOT be considered overdue
    const today = new Date();  // Create a Date object for current date and time
    const taskDate = new Date(dueDate);   // Convert task due date string into actual Date object
    today.setHours(0, 0, 0, 0); // Remove time from current date
    taskDate.setHours(0, 0, 0, 0);  // Remove time from task date
    return taskDate < today;  // Return true if task date is older than today
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true; //If filter is "All" show all task
    console.log("filter is calling")
    if (filter === "Overdue") return isTaskOverdue(task.DueDate, task.Status);  // Show only tasks that are overdue when Overdue filter is selected
    
    return task.Status === filter; //show only tasks whose Status matches the selected filter 
  });

  useEffect(() => {
    // get logged-in user
    const user = JSON.parse(localStorage.getItem("user") || "{}"); 
    const taskKey = user ? `tasks_${user.email}` : "tasks_guest";   //creating unique task storage key per user 

    const stored = JSON.parse(localStorage.getItem(taskKey) || "[]"); 
    setTasks(stored);

    // Set loading to false after data is fetched
    setTimeout(() => setIsLoading(false), 500);
  }, [view]); // run whenever view changes (refresh data after adding/editing)

  // Helper utility to safely update and persist task sequences across runtime storage keys
  const saveTasksToStorage = (updatedTasksList: Task[]) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const taskKey = user ? `tasks_${user.email}` : "tasks_guest";
    setTasks(updatedTasksList);
    localStorage.setItem(taskKey, JSON.stringify(updatedTasksList));
  };

  // Callback to persist sequence alterations caused by simple drag and drop swaps
  const handleReorderTasks = (newTasksOrder: Task[]) => {
    if (filter !== "All" || searchText.trim() !== "") {
      const updatedAbsoluteList = [...tasks];
      newTasksOrder.forEach((updatedTask, targetIdx) => {
        const originalVisibleTasks = searchText.trim() !== "" ? searchedTasks : filteredTasks;
        const matchingTaskReference = originalVisibleTasks[targetIdx];
        const absoluteIndexInMasterList = updatedAbsoluteList.findIndex(t => t === matchingTaskReference);
        
        if (absoluteIndexInMasterList !== -1) {
          updatedAbsoluteList[absoluteIndexInMasterList] = updatedTask;
        }
      });
      saveTasksToStorage(updatedAbsoluteList);
      if (searchText.trim() !== "") setSearchedTasks(newTasksOrder);
    } else {
      saveTasksToStorage(newTasksOrder);
    }
  };

  // Action callback to handle user updating a task priority level selection dropdown inline
  const handlePriorityChange = (visibleIndex: number, newPriority: "High" | "Medium" | "Low") => {
    const targetVisibleTasks = searchText.trim() !== "" ? searchedTasks : filteredTasks;
    const clickedTask = targetVisibleTasks[visibleIndex];
    
    const updatedAbsoluteList = tasks.map((task) => {
      if (task === clickedTask) {
        return { ...task, Priority: newPriority };
      }
      return task;
    });

    saveTasksToStorage(updatedAbsoluteList);

    if (searchText.trim() !== "") {
      setSearchedTasks(searchedTasks.map((t, idx) => idx === visibleIndex ? { ...t, Priority: newPriority } : t));
    }
    
    toast.success(`Priority updated to ${newPriority}`, {
      style: isDark ? { background: '#1e293b', color: '#fff', border: '1px solid #334155' } : {},
    });
  };

  // New function to handle deletion using the correct localStorage key
  const deleteTask = (index: number) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const taskKey = user ? `tasks_${user.email}` : "tasks_guest";

    const targetVisibleTasks = searchText.trim() !== "" ? searchedTasks : filteredTasks;
    const taskToDelete = targetVisibleTasks[index];
    const updatedTasks = tasks.filter((task) => task !== taskToDelete);
    
    setTasks(updatedTasks);
    localStorage.setItem(taskKey, JSON.stringify(updatedTasks));

    if (searchText.trim() !== "") {
      setSearchedTasks(searchedTasks.filter((_, i) => i !== index));
    }

    // Toast notification for delete
    toast.success("Task removed", {
      icon: <Trash2 size={18} className="text-red-500" />,
      style: isDark ? { background: '#1e293b', color: '#fff', border: '1px solid #334155' } : {},
    });
  };

  // Called when user clicks "Log Out" within the modal wrapper
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();  // call context logout fn.
    navigate("/"); 
  };

  const allTasks = tasks.length; // total number of tasks

  const completedTasks = tasks.filter(
    (t) => t.Status === "Completed" // count tasks with status "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (t) => t.Status === "Pending" // count tasks with status "pending"
  ).length;

  const overdueTasks = tasks.filter(
    (t) => isTaskOverdue(t.DueDate, t.Status) // count tasks that are overdue
  ).length;

  // search task by task name
  const handleSearch = () => {
    // filter tasks whose name matches search text
    const filtered = filteredTasks.filter((task) =>
      task.TaskName.toLowerCase().includes(searchText.toLowerCase())
    );

    // store filtered tasks
    setSearchedTasks(filtered);
  };

  // reset search and show all tasks again
  const handleCancelSearch = () => {
    // clear search input
    setSearchText("");

    // clear searched tasks
    setSearchedTasks([]);
  };

  // 3. Render the spinner if loading
  if (isLoading) {
    return (
      <div className={`flex h-screen w-full items-center justify-center transition-colors duration-300 ${isDark ? 'bg-[#0F172A]' : 'bg-[#FAF9FF]'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-purple-400' : 'border-[#7C3AED]'}`}></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen relative overflow-x-hidden transition-colors duration-300 ${
        isDark 
        ? "bg-[#020617] text-slate-100" 
        : "bg-linear-to-br from-[#F8F7FF] via-[#F3EFFF] to-[#E9E2FF]"
      }`}>
      
      {/* Container for notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Background blur element */}
      <div className={`absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-40 pointer-events-none transition-colors duration-500 ${
        isDark ? "bg-[#1E1B4B]" : "bg-[#D8CCFF]"
      }`}></div>

      {/* Sidebar  */}
      <Sidebar
        view={view}
        // change view when menu item is clicked
        onMenuClick={(action: string) => setView(action)}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      {/* Main Content Wrapper */}
      <div className="grow flex flex-col h-screen overflow-hidden relative isolate z-10">
        {/* Topbar */}
        <Topbar 
          searchText={searchText}
          setSearchText={setSearchText}
          handleSearch={handleSearch}
          handleCancel={handleCancelSearch}
        />

        {/* main page */}
        <main className="p-4 md:p-10 overflow-y-auto no-scrollbar relative grow min-h-screen">
          <div className="w-full max-w-7xl mx-auto pb-24 lg:pb-12">
            {/*content area  */}
            <div className="mb-6 md:mb-10 animate-[fadeIn_0.5s_ease-out]">
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1E1B4B]'}`}>
                {view === "dashboard" && "Dashboard Overview"}
                {view === "addTask" && (editIndex !== null ? "Edit Task" : "Manage Tasks")}
                {view === "profile" && "My Profile"}
                {view === "GenerateTask" && "AI Task Generator"}
              </h1>
              <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-[#94A3B8]'}`}>Simplify your workflow with Task-Manager</p>
            </div>

            {view === "profile" && <Profile />} 

            {/* Task Status */}
            {view === "dashboard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                {/* Total Tasks Card */}
                <div className={`relative overflow-hidden p-6 md:p-8 rounded-4xl md:rounded-[40px] backdrop-blur-md border transition-all duration-500 group animate-[fadeInUp_0.4s_ease-out] ${
                    isDark ? 'bg-slate-900/40 border-slate-800 shadow-xs hover:shadow-2xl hover:shadow-purple-400/50 ' : 'bg-white/60 border-white shadow-sm hover:shadow-2xl hover:shadow-purple-400/50'
                }`}>
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
                    <LayoutDashboard size={100} />
                  </div>
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-300 ${
                      isDark ? 'bg-slate-800 text-purple-400 group-hover:bg-purple-600 group-hover:text-white' : 'bg-purple-100 text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white'
                  }`}>
                    <LayoutDashboard size={24} />
                  </div>
                  <h3 className={`text-[10px] md:text-xs font-black uppercase tracking-[0.15em] mb-1 md:mb-2 ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>All Tasks</h3>
                  <p className={`text-3xl md:text-5xl font-black tracking-tighter ${isDark ? 'text-purple-400' : 'text-[#6D28D9]'}`}>{allTasks}</p>
                </div>

                {/* Completed Card */}
                <div className={`relative overflow-hidden p-6 md:p-8 rounded-4xl md:rounded-[40px] backdrop-blur-md border transition-all duration-500 group animate-[fadeInUp_0.5s_ease-out] ${
                    isDark ? 'bg-slate-900/40 border-slate-800  shadow-sm hover:shadow-2xl hover:shadow-emerald-400/50' : 'bg-white/60 border-white shadow-sm hover:shadow-2xl hover:shadow-emerald-400/50'
                }`}>
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
                    <CheckCircle size={100} />
                  </div>
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-300 ${
                      isDark ? 'bg-slate-800 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white' : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                  }`}>
                    <CheckCircle size={24} />
                  </div>
                  <h3 className={`text-[10px] md:text-xs font-black uppercase tracking-[0.15em] mb-1 md:mb-2 ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Completed</h3>
                  <p className={`text-3xl md:text-5xl font-black tracking-tighter ${isDark ? 'text-emerald-400' : 'text-[#2daf06b4]'}`}>{completedTasks}</p>
                </div>

                {/* Pending Card */}
                <div className={`relative overflow-hidden p-6 md:p-8 rounded-4xl md:rounded-[40px] backdrop-blur-md border transition-all duration-500 group animate-[fadeInUp_0.6s_ease-out] ${
                    isDark ? 'bg-slate-900/40 border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-orange-400/50' : 'bg-white/60 border-white shadow-sm hover:shadow-2xl hover:shadow-orange-400/50'
                }`}>
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
                    <Clock size={100} />
                  </div>
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-300 ${
                      isDark ? 'bg-slate-800 text-orange-400 group-hover:bg-orange-500 group-hover:text-white' : 'bg-orange-100 text-orange-500 group-hover:bg-orange-500 group-hover:text-white'
                  }`}>
                    <Clock size={24} />
                  </div>
                  <h3 className={`text-[10px] md:text-xs font-black uppercase tracking-[0.15em] mb-1 md:mb-2 ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Pending</h3>
                  <p className={`text-3xl md:text-5xl font-black tracking-tighter ${isDark ? 'text-orange-400' : 'text-[#f55d05e3]'}`}>{pendingTasks}</p>
                </div>

                {/* OverDue Card */}
                <div className={`relative overflow-hidden p-6 md:p-8 rounded-4xl md:rounded-[40px] backdrop-blur-md border transition-all duration-500 group animate-[fadeInUp_0.7s_ease-out] ${
                    isDark ? 'bg-slate-900/40 border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-red-400/50' : 'bg-white/60 border-white shadow-sm hover:shadow-2xl hover:shadow-red-400/50'
                }`}>
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
                    <AlertTriangle size={100} />
                  </div>
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-300 ${
                      isDark ? 'bg-slate-800 text-[#e20909] group-hover:bg-red-500 group-hover:text-white' : 'bg-red-100 text-red-500 group-hover:bg-red-500 group-hover:text-white'
                  }`}>
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className={`text-[10px] md:text-xs font-black uppercase tracking-[0.15em] mb-1 md:mb-2 ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>OverDue</h3>
                  <p className={`text-3xl md:text-5xl font-black tracking-tighter text-[#e20909]`}>{overdueTasks}</p>
                </div>

              </div>
            )}
                 
            <div className="space-y-6"> 
              {view === "dashboard" && (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2 animate-[fadeIn_0.5s_ease-out]">
                    <h2 className={`font-bold text-lg md:text-xl ${isDark ? 'text-slate-100' : 'text-[#1E1B4B]'}`}>My Tasks</h2>
                    <div className={`flex gap-1 p-1 rounded-xl sm:rounded-2xl border shadow-sm overflow-x-auto w-full sm:w-auto no-scrollbar ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-purple-50'
                    }`}>
                    
                      <button 
                        onClick={() => setFilter("All")}
                        className={`flex-1 sm:flex-none px-3 md:px-5 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl cursor-pointer whitespace-nowrap transition-all ${filter === "All"
                          ? "bg-[#6D28D9] text-white"
                          : isDark ? "text-slate-400 hover:text-purple-400" : "text-[#94A3B8] hover:text-[#6D28D9]"
                          }`}
                      >
                        All
                      </button>

                      <button
                        onClick={() => setFilter("Completed")}
                        className={`flex-1 sm:flex-none px-3 md:px-5 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl cursor-pointer whitespace-nowrap transition-all ${filter === "Completed"
                          ? "bg-[#6D28D9] text-white"
                          : isDark ? "text-slate-400 hover:text-purple-400" : "text-[#94A3B8] hover:text-[#6D28D9]"
                          }`}
                      >
                        Completed
                      </button>

                      <button
                        onClick={() => setFilter("Pending")}
                        className={`flex-1 sm:flex-none px-3 md:px-5 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl cursor-pointer whitespace-nowrap transition-all ${filter === "Pending"
                          ? "bg-[#6D28D9] text-white"
                          : isDark ? "text-slate-400 hover:text-purple-400" : "text-[#94A3B8] hover:text-[#6D28D9]"
                          }`}
                      >
                        Pending
                      </button>

                      <button
                        onClick={() => setFilter("Overdue")}
                        className={`flex-1 sm:flex-none px-3 md:px-5 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl cursor-pointer whitespace-nowrap transition-all ${filter === "Overdue"
                          ? "bg-[#6D28D9] text-white"
                          : isDark ? "text-slate-400 hover:text-purple-400" : "text-[#94A3B8] hover:text-[#6D28D9]"
                          }`}
                      >
                        Overdue
                      </button>

                    </div>
                  </div>
                  <div className="w-full overflow-x-auto rounded-2xl no-scrollbar">
                    <Table
                      tasks={searchText.trim() !== "" && searchedTasks.length >= 0 ? searchedTasks : filteredTasks}
                      onEdit={(index: number) => {
                        const targetVisibleTasks = searchText.trim() !== "" ? searchedTasks : filteredTasks;
                        const taskToEdit = targetVisibleTasks[index];
                        const absoluteIndex = tasks.findIndex(t => t === taskToEdit);
                        
                        setEditIndex(absoluteIndex !== -1 ? absoluteIndex : index);
                        setView("addTask"); 
                      }}
                      onDelete={deleteTask}
                      onReorder={handleReorderTasks}
                      onPriorityChange={handlePriorityChange}
                    />
                  </div>
                </>
              )}
              {/* sending prop(onTaskAdded) */}
              {view === "addTask" && <AddTask
                editIndex={editIndex}   // pass index of task to edit
                onDone={() => {
                  setView("dashboard");   // go back to dashboard
                  setEditIndex(null);    // reset edit index
                }}
              />}
            </div>

            {view === "GenerateTask" && <AITask onViewChange={setView} />}

          </div>
        </main>
      </div>

      {/* logout modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-[fadeIn_0.2s_ease-out]">
          <div 
            className={`w-full max-w-md p-5 sm:p-6 rounded-3xl sm:rounded-4xl border shadow-2xl transition-all duration-300 transform scale-100 animate-[fadeInUp_0.3s_ease-out]
            ${isDark 
              ? "bg-[#0B1220] border-slate-800 text-slate-100" 
              : "bg-white border-purple-50 text-slate-900" 
            }`}
          >
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
                isDark ? "bg-red-950/50 text-red-400" : "bg-red-50 text-red-500"
              }`}>
                <LogOut size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight">Confirm Logout</h3>
                <p className={`text-[11px] sm:text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Are you sure you want to Logout?
                </p>
              </div>
            </div>

            <p className={`text-xs sm:text-sm font-medium mb-6 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Your tasks will stay saved, but you need to log in again to continue managing them.
            </p>

            <div className="flex gap-2.5 sm:gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  isDark 
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs font-bold cursor-pointer text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;