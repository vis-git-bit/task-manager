import { useContext, useState } from "react";
import { Circle, CheckCircle2, Calendar, Edit3, Trash2, Layout, AlignLeft, AlertCircle, GripVertical, ChevronDown } from 'lucide-react';
import { ThemeContext } from "../context/ThemeContext";

type Task = {
  TaskName: string;
  Description: string;
  Status: "Completed" | "Pending" | "All" | string;
  DueDate: string;
  Priority?: "High" | "Medium" | "Low"; // Added Priority type support
};

type Props = {
  tasks?: Task[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void; 
  onReorder?: (newTasks: Task[]) => void; // Added callback to push reordered data up to parent state
  onPriorityChange?: (index: number, newPriority: "High" | "Medium" | "Low") => void; // Added callback for priority changes
};

const Table = ({ tasks, onEdit, onDelete, onReorder, onPriorityChange } : Props) => {    // receive tasks via props 
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);  //state for showing delete model
  const [showConfirmEdit, setShowConfirmEdit] = useState<boolean>(false);  //state for showing edit confirmation model
  const [activeIndex, setActiveIndex] = useState<number | null>(null);  //state for clicked index
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null); // State for active priority dropdown

  // Simple state for native drag-and-drop index tracking
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Access theme from context
  const { theme }: any = useContext(ThemeContext);
  const isDark = theme === "dark";

  const taskData = tasks || [];

   // overdue checker
  const isOverdue = (dueDate: string, status: string) => {
    if (!dueDate || status === "Completed") return false;     // Return false if task has no due date or is already completed

    const today = new Date();    // Store current date
    const taskDate = new Date(dueDate);   // Convert due date string into Date object

    today.setHours(0, 0, 0, 0);    // Remove time from current date to compare only dates
    taskDate.setHours(0, 0, 0, 0);   // Remove time from task date to compare only dates

    return taskDate.getTime() < today.getTime();    // Return true if task date is older than today
  };

  // --- SIMPLE HTML5 DRAG & DROP HANDLERS ---
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault(); // Tells browser to allow a drop here
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updatedTasks = [...taskData];
    const draggedItem = updatedTasks[draggedIndex];
    
    // Perform simple index swapping inside the data list
    updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(targetIndex, 0, draggedItem);
    
    setDraggedIndex(targetIndex);
    if (onReorder) onReorder(updatedTasks);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Theme matching style helper for priority dropdown buttons
  const getPriorityStyles = (priority: string | undefined) => {
    switch (priority) {
      case "High":
        return { dot: "bg-red-500", text: "text-red-400 bg-red-500/10 border-red-500/20" };
      case "Medium":
        return { dot: "bg-orange-500", text: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
      case "Low":
        return { dot: "bg-emerald-500", text: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
      default:
        return { dot: "bg-slate-400", text: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
    }
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
      <div className={`backdrop-blur-md border rounded-3xl lg:rounded-[40px] p-4 lg:p-6 overflow-hidden animate-[fadeIn_0.8s_ease-out] transition-all duration-300 ${
        isDark ? "bg-slate-900/40 border-slate-800 shadow-none" : "bg-white/40 border-white shadow-xl shadow-purple-100/20"
      }`}>
        <div className="w-full">
          
          {/* Desktop Table Grid (Visible strictly from Large 'lg' viewports up) */}
          <table className="w-full border-separate border-spacing-y-4 hidden lg:table"> 
            <thead>
              <tr className="text-left">
                <th className="w-10 pb-2 pl-4"></th>
                <th className={`pb-2 px-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Task Name</th>
                <th className={`pb-2 px-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Description</th>
                <th className={`pb-2 px-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Priority</th>
                <th className={`pb-2 px-6 text-[10px] font-black uppercase tracking-widest text-center ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Status</th> 
                <th className={`pb-2 px-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Due Date</th>
                <th className={`pb-2 px-6 text-[10px] font-black uppercase tracking-widest text-right ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taskData.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`text-center py-20 font-bold rounded-4xl ${isDark ? 'bg-slate-900/50 text-slate-500' : 'text-[#94A3B8] bg-white/50'}`}>
                    No tasks found.
                  </td>
                </tr>
              ) : (
                taskData.map((task, index) => {
                 // check overdue
                  const overdue = isOverdue(task.DueDate, task.Status);
                  const pStyle = getPriorityStyles(task.Priority);
                  const isDraggingRow = draggedIndex === index;

                  return (
                    <tr 
                      key={index} 
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`group transition-all duration-150 ${isDraggingRow ? 'opacity-30 scale-[0.98]' : ''}`}
                    >
                      {/* Drag Handle Icon Column */}
                      <td className={`py-5 pl-4 rounded-l-[28px] border-y border-l transition-all cursor-grab active:cursor-grabbing ${
                        isDark 
                        ? "bg-slate-900/60 border-slate-800 group-hover:bg-slate-800 text-slate-600 group-hover:text-slate-400" 
                        : "bg-white/80 border-purple-50 group-hover:bg-white group-hover:shadow-md text-slate-300 group-hover:text-slate-500"
                      }`}>
                        <GripVertical size={16} />
                      </td>

                      <td className={`py-5 px-6 border-y transition-all ${
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

                      {/* Dropdown for Priorities */}
                      <td className={`py-5 px-6 border-y transition-all relative ${
                        isDark 
                        ? "bg-slate-900/60 border-slate-800 group-hover:bg-slate-800" 
                        : "bg-white/80 border-purple-50 group-hover:bg-white group-hover:shadow-md"
                      }`}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownIndex(openDropdownIndex === index ? null : index);
                          }}
                          className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all w-28 cursor-pointer ${
                            isDark ? "bg-slate-900/40 hover:bg-slate-800/80" : "bg-slate-50 hover:bg-slate-100"
                          } ${pStyle.text}`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${pStyle.dot}`} />
                            {task.Priority || "Select"}
                          </span>
                          <ChevronDown size={14} className="opacity-60" />
                        </button>

                        {openDropdownIndex === index && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownIndex(null)} />
                            <div className={`absolute top-16 left-6 z-20 w-32 p-1.5 rounded-2xl border shadow-xl flex flex-col gap-1 backdrop-blur-md ${
                              isDark ? "bg-slate-950/95 border-slate-800" : "bg-white/95 border-slate-100"
                            }`}>
                              {(["High", "Medium", "Low"] as const).map((level) => (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => {
                                    if (onPriorityChange) onPriorityChange(index, level);
                                    setOpenDropdownIndex(null);
                                  }}
                                  className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition-all text-left cursor-pointer ${
                                    isDark ? "hover:bg-slate-800/80" : "hover:bg-slate-100"
                                  } ${level === "High" ? "text-red-400" : level === "Medium" ? "text-orange-400" : "text-emerald-400"}`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${level === "High" ? "bg-red-500" : level === "Medium" ? "bg-orange-500" : "bg-emerald-500"}`} />
                                  {level
                                }</button>
                              ))}
                            </div>
                          </>
                        )}
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

          {/* Unified Mobile & Tablet Layout Layer (Hidden completely on Desktop 'lg') */}
          <div className="flex flex-col gap-4 lg:hidden">
            {taskData.length === 0 ? (
              <div className={`text-center py-16 px-4 font-bold rounded-2xl ${isDark ? 'bg-slate-900/50 text-slate-500' : 'text-[#94A3B8] bg-white/50'}`}>
                No tasks found.
              </div>
            ) : (
              taskData.map((task, index) => {
                const overdue = isOverdue(task.DueDate, task.Status);
                const pStyle = getPriorityStyles(task.Priority);
                const isDraggingRow = draggedIndex === index;

                return (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`p-5 rounded-[20px] border transition-all flex flex-col gap-3.5 relative ${
                      isDraggingRow ? 'opacity-30 scale-[0.98]' : ''
                    } ${
                      isDark 
                        ? "bg-slate-900/60 border-slate-800" 
                        : "bg-white/80 border-purple-50 shadow-xs"
                    }`}
                  >
                    {/* Upper Header segment */}
                    <div className="flex items-center justify-between border-b pb-2.5 dark:border-slate-800 border-purple-50">
                      <div className={`flex items-center gap-1.5 cursor-grab active:cursor-grabbing ${isDark ? "text-slate-600" : "text-slate-300"}`}>
                        <GripVertical size={16} />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Rearrange</span>
                      </div>
                      
                      <div className="flex gap-2.5">
                        <button 
                          onClick={() => { setActiveIndex(index); setShowConfirmEdit(true); }}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                            isDark ? "bg-slate-800 text-purple-400" : "bg-purple-50 text-[#7C3AED]"
                          }`}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => { setActiveIndex(index); setShowDeleteModal(true); }}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                            isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-500"
                          }`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Task Identity and context */}
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-slate-800 text-purple-400' : 'bg-purple-50 text-[#7C3AED]'}`}>
                        <Layout size={16}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-base font-black truncate ${isDark ? 'text-slate-200' : 'text-[#1E1B4B]'}`}>{task.TaskName}</p>
                        <div className="flex items-start gap-1.5 mt-1">
                          <AlignLeft size={13} className="text-[#94A3B8] shrink-0 mt-0.5" />
                          <p className={`text-xs font-medium line-clamp-2 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                            {task.Description && task.Description.trim() !== "" ? task.Description : "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Meta Controls fields split */}
                    <div className="grid grid-cols-2 gap-4 pt-1 items-center">
                      
                      {/* Priority selector container */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownIndex(openDropdownIndex === index ? null : index);
                          }}
                          className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all w-full max-w-32 cursor-pointer ${
                            isDark ? "bg-slate-900/40 hover:bg-slate-800/80" : "bg-slate-50 hover:bg-slate-100"
                          } ${pStyle.text}`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${pStyle.dot}`} />
                            <span className="truncate">{task.Priority || "Select"}</span>
                          </span>
                          <ChevronDown size={13} className="opacity-60 shrink-0" />
                        </button>

                        {openDropdownIndex === index && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownIndex(null)} />
                            <div className={`absolute bottom-full mb-1 left-0 z-20 w-32 p-1.5 rounded-xl border shadow-xl flex flex-col gap-1 backdrop-blur-md ${
                              isDark ? "bg-slate-950/95 border-slate-800" : "bg-white/95 border-slate-100"
                            }`}>
                              {(["High", "Medium", "Low"] as const).map((level) => (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => {
                                    if (onPriorityChange) onPriorityChange(index, level);
                                    setOpenDropdownIndex(null);
                                  }}
                                  className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all text-left cursor-pointer ${
                                    isDark ? "hover:bg-slate-800/80" : "hover:bg-slate-100"
                                  } ${level === "High" ? "text-red-400" : level === "Medium" ? "text-orange-400" : "text-emerald-400"}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${level === "High" ? "bg-red-500" : level === "Medium" ? "bg-orange-500" : "bg-emerald-500"}`} />
                                  {level}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Status tags alignments */}
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight ${
                          overdue 
                            ? (isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-500")
                            : task.Status === "Completed" 
                              ? (isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600") 
                              : (isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-500")
                        }`}>
                          {overdue ? <AlertCircle size={13} /> : task.Status === "Completed" ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                          {overdue ? "Overdue" : task.Status}
                        </span>
                      </div>
                    </div>

                    {/* Timeline row footer */}
                    <div className={`flex items-center gap-1.5 text-xs font-bold border-t pt-2.5 dark:border-slate-800 border-purple-50 ${isDark ? 'text-slate-400' : 'text-[#1E1B4B]'} ${overdue ? "text-red-500/80" : ""}`}>
                      <Calendar size={13} className="text-[#94A3B8]" />
                      <span>Due Date:</span>
                      <span>{task.DueDate}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Informational Guidance bar section */}
      {taskData.length > 1 && (
        <div className={`mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-dashed text-xs font-bold tracking-wide text-center transition-all ${
          isDark ? "border-slate-800 bg-slate-900/20 text-purple-400/70" : "border-purple-100 bg-purple-50/30 text-[#7C3AED]/70"
        }`}>
          <GripVertical size={14} className="animate-pulse shrink-0" />
          Drag rows or cards directly via vertical handles to rearrange task lists sequence
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/60 backdrop-blur-md">
          <style>{`
            body { overflow: hidden !important; }
            main { overflow: hidden !important; }
          `}</style>

          <div className={`p-6 sm:p-10 rounded-4xl sm:rounded-[40px] shadow-2xl max-w-sm w-full text-center border animate-[fadeInUp_0.3s_ease-out] ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-white"
          }`}>
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 ${
              isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-500"
            }`}>
              <Trash2 size={28} className="sm:w-8 sm:h-8"/>
            </div>
            <h2 className={`text-xl sm:text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#1E1B4B]'}`}>Delete Task?</h2>
            <p className={`text-xs sm:text-sm mb-6 sm:mb-8 font-medium ${isDark ? 'text-slate-400' : 'text-[#94A3B8]'}`}>Are you sure you want to delete the task?</p>
            <div className="flex justify-center gap-3 sm:gap-4">
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-all active:scale-95 shadow-lg shadow-red-100/10"
              >
                Yes, Delete
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                  isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
       
      {/* EDIT MODAL */}
      {showConfirmEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/60 backdrop-blur-md">
          <style>{`
            body { overflow: hidden !important; }
            main { overflow: hidden !important; }
          `}</style>

          <div className={`p-6 sm:p-10 rounded-4xl sm:rounded-[40px] shadow-2xl max-w-sm w-full text-center border animate-[fadeInUp_0.3s_ease-out] ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-white"
          }`}>
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 ${
              isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-[#7C3AED]"
            }`}>
              <Edit3 size={28} className="sm:w-8 sm:h-8"/>
            </div>
            <h2 className={`text-xl sm:text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#1E1B4B]'}`}>Edit Task?</h2>
            <p className={`text-xs sm:text-sm mb-6 sm:mb-8 font-medium ${isDark ? 'text-slate-400' : 'text-[#94A3B8]'}`}>Are you sure you want to modify this task's details?</p>
            <div className="flex justify-center gap-3 sm:gap-4">
              <button 
                onClick={proceedToEdit} 
                className={`flex-1 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-all active:scale-95 shadow-lg ${
                  isDark ? "bg-purple-600 hover:bg-purple-700 shadow-purple-900/20" : "bg-[#6D28D9] hover:bg-[#5B21B6] shadow-purple-100"
                }`}
              >
                Yes, Edit
              </button>
              <button 
                onClick={() => setShowConfirmEdit(false)} 
                className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-all ${
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