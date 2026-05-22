import { useState, useEffect, useContext } from "react";
import { Circle, CheckCircle2, Calendar, Edit3, Trash2, Layout, AlignLeft, AlertCircle } from 'lucide-react';
import { ThemeContext } from "../context/ThemeContext";

type Task = {
  TaskName: string;
  Description: string;
  Status: "Completed" | "Pending" | "All" | string;
  DueDate: string;
};

type Props = {
  tasks?: Task[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void; 
};

const Table = ({ tasks, onEdit, onDelete } : Props) => {    // receive tasks via props 
  const [taskData, setTaskData] = useState<Task[]>([]);   // store all tasks
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);  //state for showing delete model
  const [showConfirmEdit, setShowConfirmEdit] = useState<boolean>(false);  //state for showing edit confirmation model
  const [activeIndex, setActiveIndex] = useState<number | null>(null);  //state for clicked index

  // Access theme from context
  const { theme }: any = useContext(ThemeContext);
  const isDark = theme === "dark";

  useEffect(() => {
    if(tasks) {
        setTaskData(tasks);
    } else {
        const storedTask = JSON.parse(localStorage.getItem("mytask") || "[]");
        setTaskData(storedTask);
    }
  }, [tasks]);

   // overdue checker
  const isOverdue = (dueDate: string, status: string) => {
    if (!dueDate || status === "Completed") return false;     // Return false if task has no due date or is already completed

    const today = new Date();    // Store current date
    const taskDate = new Date(dueDate);   // Convert due date string into Date object

   
    today.setHours(0, 0, 0, 0);    // Remove time from current date to compare only dates
    taskDate.setHours(0, 0, 0, 0);   // Remove time from task date to compare only dates

    return taskDate.getTime() < today.getTime();    // Return true if task date is older than today
  };

  const confirmDelete = () : void => {
    if (activeIndex !== null) {
      onDelete(activeIndex); 
    }
    setShowDeleteModal(false);  
    setActiveIndex(null);  
  };

  const proceedToEdit = () : void => {
    if (activeIndex !== null) {
      onEdit(activeIndex); 
    }
    setShowConfirmEdit(false);
    setActiveIndex(null);
  };

  return (
    <>
      <div className={`backdrop-blur-md border rounded-[40px] p-2 md:p-6 overflow-hidden animate-[fadeIn_0.8s_ease-out] transition-all duration-300 ${
        isDark ? "bg-slate-900/40 border-slate-800 shadow-none" : "bg-white/40 border-white shadow-xl shadow-purple-100/20"
      }`}>
        <div className="overflow-x-auto no-scrollbar px-2">
          <table className="w-full border-separate border-spacing-y-4 min-w-200"> 
            <thead>
              <tr className="text-left">
                <th className={`pb-2 px-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Task Name</th>
                <th className={`pb-2 px-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Description</th>
                <th className={`pb-2 px-6 text-[10px] font-black uppercase tracking-widest text-center ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Status</th> 
                <th className={`pb-2 px-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Due Date</th>
                <th className={`pb-2 px-6 text-[10px] font-black uppercase tracking-widest text-right ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taskData.length === 0 ? (
                <tr>
                  <td colSpan={5} className={`text-center py-20 font-bold rounded-4xl ${isDark ? 'bg-slate-900/50 text-slate-500' : 'text-[#94A3B8] bg-white/50'}`}>
                    No tasks found.
                  </td>
                </tr>
              ) : (
                taskData.map((task, index) => {
                 // check overdue
                  const overdue = isOverdue(task.DueDate, task.Status);

                  return (
                    <tr key={index} className="group transition-all">
                    <td className={`py-5 px-6 rounded-l-[28px] border-y border-l transition-all ${
                      isDark 
                      ? "bg-slate-900/60 border-slate-800 group-hover:bg-slate-800" 
                      : "bg-white/80 border-purple-50 group-hover:bg-white group-hover:shadow-md"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800 text-purple-400' : 'bg-purple-50 text-[#7C3AED]'}`}>
                          <Layout size={16}/>
                        </div>
                        <p className={`text-sm font-black ${isDark ? 'text-slate-200' : 'text-[#1E1B4B]'}`}>{task.TaskName}</p>
                      </div>
                    </td>
                    <td className={`py-5 px-6 border-y transition-all ${
                      isDark 
                      ? "bg-slate-900/60 border-slate-800 group-hover:bg-slate-800" 
                      : "bg-white/80 border-purple-50 group-hover:bg-white group-hover:shadow-md"
                    }`}>
                      <div className="flex items-center gap-2">
                        <AlignLeft size={14} className="text-[#94A3B8] shrink-0" />
                        <p className={`text-xs font-medium max-w-50 truncate ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                          {task.Description && task.Description.trim() !== "" ? task.Description : "—"}
                        </p>
                      </div>
                    </td>
                    <td className={`py-5 px-6 border-y transition-all text-center ${
                      isDark 
                      ? "bg-slate-900/60 border-slate-800 group-hover:bg-slate-800" 
                      : "bg-white/80 border-purple-50 group-hover:bg-white group-hover:shadow-md" 
                    }`}>
                      {/* STATUS BADGE - Logic for Overdue, Completed, and Pending */}
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight ${
                        overdue 
                          ? (isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-500")
                          : task.Status === "Completed" 
                            ? (isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600") 
                            : (isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-500")
                      }`}>
                        {overdue ? <AlertCircle size={14} /> : task.Status === "Completed" ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                        {overdue ? "Overdue" : task.Status}
                      </span>
                    </td> 
                    <td className={`py-5 px-6 border-y transition-all ${
                      isDark 
                      ? "bg-slate-900/60 border-slate-800 group-hover:bg-slate-800" 
                      : "bg-white/80 border-purple-50 group-hover:bg-white group-hover:shadow-md"
                    }`}>
                      <div className={`flex items-center gap-2 text-xs font-bold ${isDark ? 'text-slate-300' : 'text-[#1E1B4B]'} ${overdue ? "text-red-500/80" : ""}`}>
                        <Calendar size={14} className="text-[#94A3B8]" />
                        {task.DueDate}
                      </div>
                    </td>
                    <td className={`py-5 px-6 rounded-r-[28px] border-y border-r transition-all text-right ${
                      isDark 
                      ? "bg-slate-900/60 border-slate-800 group-hover:bg-slate-800" 
                      : "bg-white/80 border-purple-50 group-hover:bg-white group-hover:shadow-md"
                    }`}>
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => { setActiveIndex(index); setShowConfirmEdit(true); }}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                            isDark 
                            ? "bg-slate-800 text-purple-400 hover:bg-purple-600 hover:text-white" 
                            : "bg-purple-50 text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white"
                          }`}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => { setActiveIndex(index); setShowDeleteModal(true); }}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                            isDark 
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white" 
                            : "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>

   {showDeleteModal && (
  <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#020617]/60 backdrop-blur-md">
    
  {/* internal css for stopping the scroll */}
    <style>{`
      body { overflow: hidden !important; }
      main { overflow: hidden !important; }
    `}</style>

    <div className={`p-10 rounded-[40px] shadow-2xl max-w-sm w-full text-center border animate-[fadeInUp_0.3s_ease-out] md:ml-65 ${
      isDark ? "bg-slate-900 border-slate-800" : "bg-white border-white"
    }`}>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
        isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-500"
      }`}>
        <Trash2 size={32}/>
      </div>
      <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#1E1B4B]'}`}>Delete Task?</h2>
      <p className={`text-sm mb-8 font-medium ${isDark ? 'text-slate-400' : 'text-[#94A3B8]'}`}>Are you sure you want to delete the task?</p>
      <div className="flex justify-center gap-4">
        <button 
        onClick={confirmDelete}
         className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold cursor-pointer transition-all active:scale-95 shadow-lg shadow-red-100/10">
          Yes, Delete</button>
        <button 
        onClick={() => setShowDeleteModal(false)} 
        className={`flex-1 py-4 rounded-2xl font-bold cursor-pointer transition-all ${
          isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
        }`}>
          Cancel</button>
      </div>
    </div>
  </div>
)}
     
      {/* EDIT MODAL */}
   {showConfirmEdit && (
  <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#020617]/60 backdrop-blur-md">
    
    <style>{`
      body { overflow: hidden !important; }
      main { overflow: hidden !important; }
    `}</style>

    <div className={`p-10 rounded-[40px] shadow-2xl max-w-sm w-full text-center border animate-[fadeInUp_0.3s_ease-out] md:ml-65 ${
      isDark ? "bg-slate-900 border-slate-800" : "bg-white border-white"
    }`}>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
        isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-[#7C3AED]"
      }`}>
        <Edit3 size={32}/>
      </div>
       <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#1E1B4B]'}`}>Edit Task?</h2>
      <p className={`text-sm mb-8 font-medium ${isDark ? 'text-slate-400' : 'text-[#94A3B8]'}`}>Are you sure you want to modify this task's details?</p>
    <div className="flex justify-center gap-4">
        <button 
          onClick={proceedToEdit} 
          className={`flex-1 text-white py-4 rounded-2xl font-bold cursor-pointer transition-all active:scale-95 shadow-lg ${
            isDark ? "bg-purple-600 hover:bg-purple-700 shadow-purple-900/20" : "bg-[#6D28D9] hover:bg-[#5B21B6] shadow-purple-100"
          }`}
        >
          Yes, Edit
        </button>
        <button 
          onClick={() => setShowConfirmEdit(false)} 
          className={`flex-1 py-4 rounded-2xl font-bold cursor-pointer transition-all ${
            isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Table;