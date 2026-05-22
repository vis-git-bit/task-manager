import { useState, useContext } from "react";
import { Sparkles, Save, Layout, CheckCircle2, Circle, Loader2 } from "lucide-react";
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
  const [prompt, setPrompt] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const { theme }: any = useContext(ThemeContext);
   const { user } = useAuth();
  const isDark = theme === "dark";

  const generateTasks = async (): Promise<void> => {
    if (prompt.length === 0) return;
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:5000/generate-tasks", { //Send request to my backend server at port 5000 and hit the /generate-tasks API route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }), //converting data into string for backend
      });

      if (!res.ok) { //if backend fails handle error 
        const errorData = await res.json(); //get response and convert into JS object 
        console.error("Backend Error:", errorData);
        setIsGenerating(false);
        return;
      }

      const data: Task[] = await res.json(); //get data
      console.log("AI RESPONSE:", data);

      setTasks(data); //save in state
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
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
    <div className="space-y-10 animate-[fadeIn_0.6s_ease-out] w-full">

      <div className={`flex justify-center items-center text-3xl font-semibold ${
        isDark ? "text-white" : "text-[#1E1B4B]"}`
      }>
        <h1> Hi , {user?.name || "User Name"} . How Can i Help You? </h1>
      </div>
      {/* Search/Prompt Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-[#7C3AED] to-[#DB2777] rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
        <div className={`relative flex flex-col sm:flex-row gap-4 backdrop-blur-xl p-3 rounded-4xl border transition-all ${
          isDark ? "bg-slate-900/60 border-slate-800 shadow-none" : "bg-white/50 border-white shadow-2xl"
        }`}>
          <div className="flex-1 flex items-center px-4 gap-3">
            <Sparkles className="text-[#7C3AED] shrink-0" size={20} />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your goal (e.g. 'Plan a 3-day workout routine')"
              className={`w-full py-4 bg-transparent border-none focus:ring-0 outline-none font-bold placeholder:text-[#94A3B8] placeholder:font-medium tracking-tight ${isDark ? "text-white" : "text-[#1E1B4B]"}`}
            />
          </div>

          <button
            onClick={generateTasks}
            disabled={isGenerating || prompt.length === 0}
            className="px-10 py-4 rounded-3xl bg-[#6D28D9] text-white font-black text-sm hover:bg-[#5B21B6] transition-all shadow-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              "Generate with AI"
            )}
          </button>
        </div>
      </div>

      {/* Results Grid */}
      {tasks.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className={`h-px grow bg-linear-to-r from-transparent to-transparent ${isDark ? "via-slate-800" : "via-purple-200"}`}></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8]">AI Suggestions</span>
            <div className={`h-px grow bg-linear-to-r from-transparent to-transparent ${isDark ? "via-slate-800" : "via-purple-200"}`}></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task, index) => (
              <div
                key={index}
                className={`relative overflow-hidden p-6 rounded-[35px] backdrop-blur-md border shadow-sm hover:shadow-2xl transition-all duration-500 group animate-[fadeInUp_0.4s_ease-out] ${
                  isDark ? "bg-slate-900 border-slate-800" : "bg-white/70 border-white"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white transition-all ${isDark ? "bg-slate-800" : "bg-purple-50"}`}>
                  <Layout size={18} />
                </div>
                
                <h3 className={`font-black mb-4 text-sm leading-relaxed transition-colors group-hover:text-[#6D28D9] ${isDark ? "text-slate-200" : "text-[#1E1B4B]"}`}>
                  {task.title}
                </h3>

                <div className={`flex items-center justify-between pt-4 border-t ${isDark ? "border-slate-800" : "border-purple-50/50"}`}>
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

          {/* Action Footer */}
          <div className="flex justify-center pt-6">
            <button
              onClick={saveTasks}
              className="group flex items-center gap-3 px-12 py-5 rounded-[28px] bg-emerald-500 text-white font-black text-sm hover:bg-emerald-600 transition-all cursor-pointer shadow-2xl active:scale-95"
            >
              <Save size={20} className="group-hover:bounce" />
              Save All Generated Tasks
            </button>
          </div>
        </div>
      )}

      {/* Empty State / Loading Placeholder */}
      {isGenerating && tasks.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-48 rounded-[35px] border animate-pulse ${isDark ? "bg-slate-800 border-slate-700" : "bg-white/30 border-white"}`}></div>
          ))}
        </div>
      )}

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

export default AITask;