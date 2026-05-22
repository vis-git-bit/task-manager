import { Calendar, Flag, AlignLeft, Type, ChevronDown, CheckCircle2, PlusCircle } from 'lucide-react';
import { useEffect, useContext } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import toast from 'react-hot-toast';

type Props = {
  editIndex: number | null;
  onDone: () => void;
};

type FormValues = {
  task: string;
  description: string;
  date: string;
  status: string;
};

const AddTask = ({ editIndex, onDone } : Props) => {   
  // editIndex -> tells if editing or adding
  // onDone -> callback after submit (go back to dashboard)

  const { user } = useAuth();
  const { theme }: any = useContext(ThemeContext);
  const isDark = theme === "dark";

  // Formik setup 
  const formik = useFormik<FormValues>({
    initialValues: {
      task: "",
      description: "",
      date: "",
      status: ""
    },

    // validation rules
    validationSchema: Yup.object({
      task: Yup.string().required("Task title required"),
      description: Yup.string().required("Description required"),
      date: Yup.string().required("Date required"),
      status: Yup.string().required("Status required")
    }),

    // runs only when form is valid
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values);   // custom function to save task
      resetForm();            // clear form after submit
    }
  });

  // run when editIndex changes (user clicked edit)
  useEffect(() => {
  const key = user?.email ? `tasks_${user.email}` : "tasks_guest";

   const stored = JSON.parse(localStorage.getItem(key)|| "[]");
    if (editIndex !== null) {  
      // check if we are editing (not adding)
      const t = stored[editIndex];   
      // get selected task using index
      // fill form fields with existing data (Formik way)
      formik.setValues({
        task: t.TaskName,
        description: t.Description,
        date: t.DueDate,
        status: t.Status
      });
    }
  }, [editIndex]); // runs when editIndex changes

  // function to handle add/update task
  const handleSubmit = (values : FormValues ): void => {
    const newTask = {
      TaskName: values.task,
      Description: values.description,
      Status: values.status,
      DueDate: values.date,
    };

const key = user?.email ? `tasks_${user.email}` : "tasks_guest";

const stored = JSON.parse(localStorage.getItem(key)|| "[]")
    if (editIndex !== null) {
      // if editing → replace existing task
      stored[editIndex] = newTask;
      toast.success("Task updated successfully!", {
        style: isDark ? { background: '#1e293b', color: '#fff' } : {}
      });
    } else {
      // if adding → push new task
      stored.push(newTask);
      toast.success("New task added!", {
        style: isDark ? { background: '#1e293b', color: '#fff' } : {}
      });
    }
    // save updated list back to localStorage
    localStorage.setItem(key, JSON.stringify(stored));
    onDone(); // go back to dashboard
  };

  return (
   <div className={`w-full backdrop-blur-md rounded-[40px] border overflow-hidden animate-[fadeInUp_0.6s_ease-out] ${
     isDark ? "bg-slate-900/60 border-slate-800 shadow-none" : "bg-white/60 border-white shadow-xl shadow-purple-100/20"
   }`}>
      <div className={`px-6 md:px-10 py-10 border-b ${isDark ? "border-slate-800 bg-slate-900/40" : "border-white/50 bg-white/30"}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#7C3AED] rounded-2xl flex items-center justify-center text-white shadow-lg">
            {editIndex !== null ? <CheckCircle2 size={24} /> : <PlusCircle size={24} />}
          </div>
          <div>
            <h3 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-[#1E1B4B]"}`}>
              {editIndex !== null ? "Modify Task" : "Create New Task"}
            </h3>
            <p className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-[#94A3B8]"}`}>
              {editIndex !== null ? "Update your task details and status." : "Fill in the details to organize your workflow."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-6 md:p-10 space-y-8">
        {/* Task Title */}
        <div className="space-y-3 group">
          <label className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-slate-400" : "text-[#475569]"}`}>
            <Type size={14} className="text-[#6D28D9]" /> Task Title
          </label>
          <input
            type="text"
            name="task"
            placeholder="e.g. Design System Refactor"
            value={formik.values.task}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border rounded-3xl py-4.5 px-6 font-bold outline-none transition-all placeholder:text-[#CBD5E1] ${
              isDark ? "bg-slate-800/50 border-slate-700 text-white focus:border-[#6D28D9]" : "bg-white/80 border-purple-50 text-[#1E1B4B] focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-500/5"
            }`}
          />
          {formik.touched.task && formik.errors.task && (
            <p className="text-red-500 text-xs font-bold px-2">{formik.errors.task}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-slate-400" : "text-[#475569]"}`}>
            <AlignLeft size={14} className="text-[#6D28D9]" /> Description
          </label>
          <textarea
            rows={4}
            name="description"
            placeholder="Briefly describe the task objectives..."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border rounded-3xl py-4.5 px-6 font-bold outline-none transition-all resize-none placeholder:text-[#CBD5E1] ${
              isDark ? "bg-slate-800/50 border-slate-700 text-white focus:border-[#6D28D9]" : "bg-white/80 border-purple-50 text-[#1E1B4B] focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-500/5"
            }`}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-xs font-bold px-2">{formik.errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Due Date */}
          <div className="space-y-3">
            <label className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-slate-400" : "text-[#475569]"}`}>
              <Calendar size={14} className="text-[#6D28D9]" /> Due Date
            </label>
            <input
              type="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border rounded-3xl py-4.5 px-6 font-bold outline-none transition-all ${
                isDark ? "bg-slate-800/50 border-slate-700 text-white focus:border-[#6D28D9]" : "bg-white/80 border-purple-50 text-[#1E1B4B] focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-500/5"
              }`}
            />
            {formik.touched.date && formik.errors.date && (
              <p className="text-red-500 text-xs font-bold px-2">{formik.errors.date}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-3">
            <label className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-slate-400" : "text-[#475569]"}`}>
              <Flag size={14} className="text-[#6D28D9]" /> Status
            </label>
            <div className="relative">
              <select
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-3xl py-4.5 px-6 font-bold appearance-none cursor-pointer transition-all ${
                  isDark ? "bg-slate-800/50 border-slate-700 text-white focus:border-[#6D28D9]" : "bg-white/80 border-purple-50 text-[#1E1B4B] focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-500/5"
                }`}
              >
                <option value="" disabled className="text-[#CBD5E1]">Select Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
              <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]" />
            </div>
            {formik.touched.status && formik.errors.status && (
              <p className="text-red-500 text-xs font-bold px-2">{formik.errors.status}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className={`pt-10 border-t flex flex-col md:flex-row justify-end gap-4 ${isDark ? "border-slate-800" : "border-white/50"}`}>
          <button
            type="button"
            onClick={onDone}
            className={`px-10 py-4.5 rounded-3xl font-black text-sm transition-all active:scale-95 border ${
              isDark ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-purple-50 text-[#94A3B8] hover:bg-slate-50"
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!(formik.isValid && formik.dirty)}
            className="bg-[#6D28D9] text-white px-12 py-4.5 rounded-3xl font-black text-sm shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5B21B6] hover:shadow-2xl active:scale-95"
          >
            {editIndex !== null ? "Save Changes" : "Confirm & Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;