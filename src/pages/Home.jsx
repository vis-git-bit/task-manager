import { useState , useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Table from "../components/Table";
import AddTask from "../components/Task";
import Profile from "../components/Profile";
import AITask from "../components/AITasks";

const Home = () => {
  const [view, setView] = useState("dashboard"); // controls which page is shown (dashboard / addTask / profile)
  const [editIndex, setEditIndex] = useState(null); // stores index of task being edited
  const [tasks , setTasks] = useState([]);// stores all tasks from localStorage
  const [filter , setFilter] = useState("All"); // stores current filter (All / Completed / Pending)

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;  //If filter is "All" show all task
    return task.Status === filter;  //show only tasks whose Status matches the selected filter
     });

  useEffect(() => {

 // get logged-in user
const user = JSON.parse(localStorage.getItem("user"));
const taskKey = user ? `tasks_${user.email}` : "tasks_guest";

const stored = JSON.parse(localStorage.getItem(taskKey)) || [];
  setTasks(stored);
}, [view]); // run whenever view changes (refresh data after adding/editing)

const allTasks = tasks.length;   // total number of tasks

const completedTasks = tasks.filter(
  (t) => t.Status === "Completed"  // count tasks with status "Completed"
).length; 

const pendingTasks = tasks.filter( 
  (t) => t.Status === "Pending"  // count tasks with status "pending"
).length;  

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAF9FF]">
      {/* Sidebar - Responsive: Sidebar on Desktop, Top/Bottom bar on Mobile */}
      <Sidebar 
      view={view}
       // change view when menu item is clicked
       onMenuClick={(action) => setView(action)} />    

      {/* Main Content Wrapper */}
      <div className="grow flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Content Area - Scrollable */}
        <main className="p-4 md:p-8 overflow-y-auto bg-transparent">
          <div className="w-full">
            
            {/* Page Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-[fadeIn_0.5s_ease-out]">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#1E1B4B]">
                  {view === "dashboard" && ( "Dashboard Overview" )}
                  {view === "addTask" && ("Manage Tasks")}
                  {view === "profile" && ("My profile" )}
                  {view === "GenerateTask" && ("AI Task Generator")}
                </h1>
                <p className="text-[#94A3B8] text-sm font-medium mt-1">Welcome back to Task-Manager.</p>
              </div>
            </div>

            {view === "profile" && <Profile />}

            {/* Task Stats - Responsive Grid: 1 col on mobile, 3 on desktop */}
            {view === "dashboard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                <div className="p-6 rounded-3xl md:rounded-4xl bg-[#9e66f750] border border-purple-50 shadow-sm flex flex-col justify-center items-center group hover:border-purple-200 transition-all animate-[fadeInUp_0.4s_ease-out]">
                  <h3 className="text-[#6D28D9] text-xs font-black uppercase tracking-widest mb-2">All Tasks</h3>
                  <p className="text-3xl md:text-4xl font-black text-[#6D28D9]">{allTasks}</p>
                </div>

                <div className="p-6 rounded-3xl md:rounded-4xl bg-[#88f76650]  border border-green-50 shadow-sm flex flex-col justify-center items-center group hover:border-green-200 transition-all animate-[fadeInUp_0.5s_ease-out]">
                  <h3 className="text-[#2daf06b4] text-xs font-black uppercase tracking-widest mb-2">Completed</h3>
                  <p className="text-3xl md:text-4xl font-black text-[#2daf06b4]"> {completedTasks}</p>
                </div>

                <div className="p-6 rounded-3xl md:rounded-4xl bg-[#f5a57771] border border-orange-50 shadow-sm flex flex-col justify-center items-center group hover:border-orange-200 transition-all animate-[fadeInUp_0.6s_ease-out] sm:col-span-2 lg:col-span-1">
                  <h3 className="text-[#f55d05e3] text-xs font-black uppercase tracking-widest mb-2">Pending</h3>
                  <p className="text-4xl font-black text-[#f55d05e3]">{pendingTasks}</p>
                </div>
              </div>
            )}
           
            <div className="space-y-6">
              {view === "dashboard" && ( 
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2 animate-[fadeIn_0.5s_ease-out]">
                    <h2 className="font-bold text-xl text-[#1E1B4B]">My Tasks</h2>
                   <div className="flex gap-1 md:gap-3 bg-white p-1 rounded-2xl border border-purple-50 shadow-sm overflow-x-auto w-full sm:w-auto">
  
                 <button
                   onClick={() => setFilter("All")}
                   className={`flex-1 sm:flex-none px-4 md:px-5 py-1.5 text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap ${
                  filter === "All"
                      ? "bg-[#6D28D9] text-white"
                      : "text-[#94A3B8] hover:text-[#6D28D9]"
                   }`}
                   >
                  All
               </button>

                <button
                 onClick={() => setFilter("Completed")}
                 className={`flex-1 sm:flex-none px-4 md:px-5 py-1.5 text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap ${
                 filter === "Completed"
                    ? "bg-[#6D28D9] text-white"
                    : "text-[#94A3B8] hover:text-[#6D28D9]"
                   }`}
                   >
                 Completed
                  </button>

                  <button
                      onClick={() => setFilter("Pending")}
                      className={`flex-1 sm:flex-none px-4 md:px-5 py-1.5 text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap ${
                   filter === "Pending"
                    ? "bg-[#6D28D9] text-white"
                    : "text-[#94A3B8] hover:text-[#6D28D9]"
                    }`}
                    >
                 Pending                  
                  </button>

               </div>
                  </div>
                  <Table  
                      tasks={filteredTasks}  // pass filtered tasks to table
                      onEdit={(index) => {  //save which task to edit and open form
                      setEditIndex(index);
                      setView("addTask");
                   }}/>
                </>
              )}  
              {/* sending prop(onTaskAdded) */}
              {view === "addTask" &&  <AddTask
              editIndex={editIndex}   // pass index of task to edit
              onDone={() => {
                setView("dashboard");   // go back to dashboard
                setEditIndex(null);    // reset edit index
              }}
            />}
            </div>  
         
          {view === "GenerateTask" && <AITask />}

          </div>
        </main>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }  
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Home;