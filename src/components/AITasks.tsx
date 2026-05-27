import { useState, useContext, useEffect } from "react";
import { Sparkles, Save, Layout, CheckCircle2, Circle, Loader2, History, Trash2, ArrowLeft } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

type Task = {
  title: string;
  Status: "Pending" | "Completed" | "All";
};

type Props = {
  onViewChange: (view: string) => void;
};

const AITask = ({ onViewChange }: Props) => {
  const [prompt, setPrompt] = useState<string>(" ");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // State for current view and history list 
  const [currentView, setCurrentView] = useState<"search" | "history">("search");
  const [historyList, setHistoryList] = useState<string[]>([]);
  
  const { theme }: any = useContext(ThemeContext);
  const { user } = useAuth();
  const isDark = theme === "dark";

  // Load saved history when the component opens
  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`history_${user.email}`); 
      if (saved) {
        setHistoryList(JSON.parse(saved));
      }
    }
  }, [user?.email]);

  const generateTasks = async (historyPrompt?: string): Promise<void> => {
    // If we clicked a history item, use it. Otherwise use what is in the input box. 
    const textToSearch = historyPrompt || prompt;  
    
    if (textToSearch.trim().length === 0) return;  
    setIsGenerating(true); 
    setCurrentView("search"); // Switch back to main view to show results
    
    try {
      const res = await fetch("http://localhost:5000/generate-tasks", { // Send request to backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textToSearch }),
      });

      if (!res.ok) { // If backend fails handle error 
        const errorData = await res.json(); 
        console.error("Backend Error:", errorData);
        setIsGenerating(false);
        return;
      }

      const data: Task[] = await res.json(); 
      console.log("AI RESPONSE:", data);

      setTasks(data); 

      // SAVE TO HISTORY LOGIC
      if (user?.email) {
        const cleanHistory = historyList.filter((item) => item !== textToSearch);
        const updatedHistory = [textToSearch, ...cleanHistory];
        
        setHistoryList(updatedHistory);
        localStorage.setItem(`history_${user.email}`, JSON.stringify(updatedHistory));
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearAllHistory = (): void => {
    if (user?.email) {
      localStorage.removeItem(`history_${user.email}`);
      setHistoryList([]);
    }
  };

  const saveTasks = (): void => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.email) return;

    const key = `tasks_${user.email}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");

    const formattedTasks = tasks.map((t) => ({
      TaskName: t.title,
      Description: "AI Generated Task",
      Status: t.Status,
      DueDate: new Date().toLocaleDateString("en-GB")
    }));

    const updated = [...existing, ...formattedTasks];
    localStorage.setItem(key, JSON.stringify(updated));
    onViewChange("dashboard");
  };

  return (
    <div className="space-y-8 lg:space-y-10 animate-[fadeIn_0.6s_ease-out] w-full max-w-350 mx-auto px-1">

      {/* Top Bar with Greeting and Recents Button - Stacks cleanly on Mobile/Tablet */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-purple-50/10 pb-4 lg:border-none lg:pb-0">
        <div className={`text-2xl lg:text-3xl font-black tracking-tight leading-tight ${
          isDark ? "text-white" : "text-[#1E1B4B]"}`
        }>
          <h1>Hi, {user?.name || "User"}. <br className="block lg:hidden" />How can I help you?</h1>
        </div>

        <button
          onClick={() => setCurrentView(currentView === "search" ? "history" : "search")}
          className={`w-full lg:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-black border transition-all cursor-pointer active:scale-[0.98] shrink-0 ${
            isDark 
              ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800" 
              : "bg-white border-purple-100 text-[#7C3AED] hover:bg-purple-50 shadow-xs"
          }`}
        >
          <History size={16} />
          {currentView === "search" ? `Recents (${historyList.length})` : "Back to Generator"}
        </button>
      </div>

      {/* --- HISTORY LIST VIEW --- */}
      {currentView === "history" && (
        <div className={`p-4 sm:p-6 rounded-[28px] lg:rounded-[35px] border animate-[fadeIn_0.4s_ease-out] ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white/80 border-white shadow-xl"}`}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashed border-slate-700/20">
            <button 
              onClick={() => setCurrentView("search")}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#7C3AED] hover:underline cursor-pointer"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h2 className={`text-sm sm:text-lg font-black ${isDark ? "text-white" : "text-[#1E1B4B]"}`}>Your Search History</h2>
            <button 
              onClick={clearAllHistory}
              disabled={historyList.length === 0}
              className="text-xs text-rose-500 hover:text-rose-600 disabled:opacity-40 flex items-center gap-1 font-black transition-colors cursor-pointer"
            >
              <Trash2 size={14} /> Clear All
            </button>
          </div>

          {historyList.length === 0 ? (
            <div className="text-center py-16 text-[#94A3B8] font-bold text-sm">
              <History size={36} className="mx-auto mb-3 opacity-30" />
              Your search history is empty.
            </div>
          ) : (
            <div className="space-y-3 max-h-112.5 overflow-y-auto pr-1">
              {historyList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setPrompt(item); 
                    generateTasks(item); 
                  }}
                  className={`flex justify-between items-center p-4 rounded-2xl border text-left cursor-pointer transition-all lg:hover:translate-x-1 group active:scale-[0.99] gap-4 ${
                    isDark 
                      ? "bg-slate-800/40 border-slate-800/80 text-slate-200 lg:hover:bg-slate-800 lg:hover:border-[#7C3AED]" 
                      : "bg-purple-50/20 border-purple-100 text-[#1E1B4B] lg:hover:bg-purple-50/60 lg:hover:border-[#7C3AED]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Sparkles size={16} className="text-[#7C3AED] shrink-0" />
                    <span className="font-bold truncate text-xs sm:text-sm transition-colors group-hover:text-[#7C3AED]">{item}</span>
                  </div>
                  <span className="text-xs text-[#7C3AED] font-black shrink-0 hidden lg:inline opacity-0 group-hover:opacity-100 transition-opacity">Click to run →</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- MAIN GENERATOR VIEW --- */}
      {currentView === "search" && (
        <>
          {/* Prompt input: Action items wrap into a stacked button on Mobile/Tablet */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-[#7C3AED] to-[#DB2777] rounded-[28px] lg:rounded-4xl blur opacity-15 group-focus-within:opacity-35 transition duration-700"></div>
            <div className={`relative flex flex-col lg:flex-row gap-3 backdrop-blur-xl p-3 rounded-[28px] lg:rounded-4xl border transition-all ${
              isDark ? "bg-slate-900/60 border-slate-800 shadow-none" : "bg-white/50 border-white shadow-2xl shadow-purple-100/30"
            }`}>
              <div className="flex-1 flex items-center px-3 gap-3">
                <Sparkles className="text-[#7C3AED] shrink-0" size={20} />
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your goal (e.g. 'Plan a 3-day workout routine')"
                  className={`w-full py-3 bg-transparent border-none focus:ring-0 outline-none font-bold text-sm sm:text-base placeholder:text-[#94A3B8] placeholder:font-semibold tracking-tight ${isDark ? "text-white" : "text-[#1E1B4B]"}`}
                />
              </div>

              <button
                onClick={() => generateTasks()}
                disabled={isGenerating || prompt.trim().length === 0}
                className="w-full lg:w-auto px-8 py-4 rounded-2xl lg:rounded-3xl bg-[#6D28D9] text-white font-black text-sm hover:bg-[#5B21B6] transition-all shadow-xl shadow-purple-900/10 cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2 shrink-0"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate with AI"
                )}
              </button>
            </div>
          </div>

          {/* AI Suggestions Results Layer */}
          {tasks.length > 0 && (
            <div className="space-y-6 lg:space-y-8">
              <div className="flex items-center gap-4">
                <div className={`h-px grow bg-linear-to-r from-transparent to-transparent ${isDark ? "via-slate-800" : "via-purple-100"}`}></div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#94A3B8] whitespace-nowrap">AI Suggestions</span>
                <div className={`h-px grow bg-linear-to-r from-transparent to-transparent ${isDark ? "via-slate-800" : "via-purple-100"}`}></div>
              </div>

              {/* Cards Grid: Single layout flow for Mobile + Tablets; 3 Columns on Desktops */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden p-5 sm:p-6 rounded-3xl lg:rounded-[35px] backdrop-blur-md border shadow-xs hover:shadow-xl transition-all duration-300 group animate-[fadeInUp_0.4s_ease-out] ${
                      isDark ? "bg-slate-900 border-slate-800" : "bg-white border-purple-50/60"
                    }`}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 text-[#7C3AED] transition-all group-hover:scale-105 ${isDark ? "bg-slate-800" : "bg-purple-50"}`}>
                      <Layout size={16} />
                    </div>
                    
                    <h3 className={`font-black mb-4 text-sm leading-relaxed ${isDark ? "text-slate-200" : "text-[#1E1B4B]"}`}>
                      {task.title}
                    </h3>

                    <div className={`flex items-center justify-between pt-3.5 border-t ${isDark ? "border-slate-800" : "border-purple-50/60"}`}>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight ${
                        task.Status === "Completed" 
                        ? (isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600") 
                        : (isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-500")
                      }`}>
                        {task.Status === "Completed" ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                        {task.Status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Save Footer Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={saveTasks}
                  className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-10 py-4.5 rounded-2xl lg:rounded-[28px] bg-emerald-500 text-white font-black text-sm hover:bg-emerald-600 transition-all cursor-pointer shadow-xl shadow-emerald-900/10 active:scale-[0.98]"
                >
                  <Save size={18} />
                  Save All Generated Tasks
                </button>
              </div>
            </div>
          )}

          {/* Skeleton Loaders Framework for Mobile and Tablets */}
          {isGenerating && tasks.length === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-40 sm:h-44 rounded-3xl lg:rounded-[35px] border animate-pulse ${isDark ? "bg-slate-800/60 border-slate-700/50" : "bg-white/40 border-purple-50/50"}`}></div>
              ))}
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
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

export default AITask;