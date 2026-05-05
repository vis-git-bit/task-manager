import { Calendar, Flag, AlignLeft, Type, ChevronDown } from 'lucide-react';
import { useEffect } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";

// accepting prop from home page
const AddTask = ({ editIndex, onDone }) => {   
  // editIndex -> tells if editing or adding
  // onDone -> callback after submit (go back to dashboard)

  // Formik setup (handles form state + validation)
  const formik = useFormik({
    initialValues: {
      task: "",
      description: "",
      date: "",
      status: ""
    },

    // validation rules using Yup
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
   const user = JSON.parse(localStorage.getItem("user"));
   const key = `tasks_${user.email}`;

   const stored = JSON.parse(localStorage.getItem(key)) || [];
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
  }, [editIndex]); // dependency -> runs when editIndex changes

  // function to handle add/update task
  const handleSubmit = (values) => {
    const newTask = {
      TaskName: values.task,
      Description: values.description,
      Status: values.status,
      DueDate: values.date,
    };
const user = JSON.parse(localStorage.getItem("user"));
const key = `tasks_${user.email}`;

const stored = JSON.parse(localStorage.getItem(key)) || [];
    if (editIndex !== null) {
      // if editing → replace existing task
      stored[editIndex] = newTask;
    } else {
      // if adding → push new task
      stored.push(newTask);
    }
    // save updated list back to localStorage
    localStorage.setItem(key, JSON.stringify(stored));
    onDone(); // go back to dashboard
  };

  return (
    <div className="w-full bg-white rounded-4xl shadow-sm border border-purple-50 overflow-hidden animate-[fadeInUp_0.6s_ease-out]">
      <div className="px-6 md:px-10 py-8 border-b border-purple-50">
        <h3 className="text-xl md:text-2xl font-black text-[#1E1B4B]">Create New Task</h3>
        <p className="text-[#94A3B8] text-sm font-medium mt-1">Fill in the details to organize your workflow.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-6 md:p-10 space-y-6 md:space-y-8">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[11px] font-black text-[#475569] uppercase tracking-widest ml-1"><Type size={14} className="text-[#6D28D9]" /> Task Title</label>
          <input type="text" name="task" placeholder="e.g. Design System Refactor" value={formik.values.task} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full bg-[#FAF9FF] border border-purple-50 rounded-2xl py-3.5 md:py-4.5 px-6 text-[#1E1B4B] font-bold outline-none focus:border-[#6D28D9] transition-all" />
          {formik.touched.task && formik.errors.task && <p className="text-red-500 text-xs font-bold">{formik.errors.task}</p>}
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[11px] font-black text-[#475569] uppercase tracking-widest ml-1"><AlignLeft size={14} className="text-[#6D28D9]" /> Description</label>
          <textarea rows="4" name="description" placeholder="Briefly describe the task objectives..." value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full bg-[#FAF9FF] border border-purple-50 rounded-2xl py-3.5 md:py-4.5 px-6 text-[#1E1B4B] font-bold outline-none focus:border-[#6D28D9] transition-all resize-none" />
          {formik.touched.description && formik.errors.description && <p className="text-red-500 text-xs font-bold">{formik.errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[11px] font-black text-[#475569] uppercase tracking-widest ml-1"><Calendar size={14} className="text-[#6D28D9]" /> Due Date</label>
            <input type="date" name="date" value={formik.values.date} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full bg-[#FAF9FF] border border-purple-50 rounded-2xl py-3.5 md:py-4.5 px-6 font-bold outline-none" />
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[11px] font-black text-[#475569] uppercase tracking-widest ml-1"><Flag size={14} className="text-[#6D28D9]" /> Status</label>
            <div className="relative">
              <select name="status" value={formik.values.status} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full bg-[#FAF9FF] border border-purple-50 rounded-2xl py-3.5 md:py-4.5 px-6 font-bold appearance-none cursor-pointer">
                <option value="">Select Status</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
              <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-purple-50 flex justify-end">
          <button type="submit" disabled={!(formik.isValid && formik.dirty)} className="w-full md:w-auto bg-[#6D28D9] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95">
            {editIndex !== null ? "Update Task" : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;