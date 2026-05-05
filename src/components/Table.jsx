import { useState, useEffect } from "react";

const Table = ({ tasks, onEdit }) => {    // receive tasks via props 
  const [taskData, setTaskData] = useState([]);   // store all tasks
  const [showModal, setShowModal] = useState(false);  //state for showing model or not
  const [deleteIndex, setDeleteIndex] = useState(null);  //state for clicked index for delete 

  useEffect(() => {
    // We prioritize the tasks prop if provided, otherwise fetch
    if(tasks) {
        setTaskData(tasks);
    } else {
        const storedTask = JSON.parse(localStorage.getItem("mytask")) || [];   //get task data 
        setTaskData(storedTask);  //update the state
    }
  }, [tasks]);

  const confirmDelete = () => {
    const updated = taskData.filter((_, i) => i !== deleteIndex);  //check clicked index and current item index is same or not
    setTaskData(updated);   //update state
    localStorage.setItem("mytask", JSON.stringify(updated));  //save updated taskdata in storage 

    setShowModal(false);  //update state for not to show model 
    setDeleteIndex(null);  //update state after removing that index start 
  };

  return (
    <div className="bg-white border border-purple-50 rounded-4xl p-4 md:p-8 shadow-sm overflow-hidden animate-[fadeIn_0.8s_ease-out]">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse min-w-175">
          <thead>
            <tr className="text-left border-b border-gray-50">
              <th className="pb-4 px-2 text-[11px] font-black text-[#94A3B8] uppercase tracking-widest">TaskName</th>
              <th className="pb-4 px-2 text-[11px] font-black text-[#94A3B8] uppercase tracking-widest">Description</th> 
              <th className="pb-4 px-2 text-[11px] font-black text-[#94A3B8] uppercase tracking-widest">Status</th>
              <th className="pb-4 px-2 text-[11px] font-black text-[#94A3B8] uppercase tracking-widest">DueDate</th>
              <th className="pb-4 px-2 text-[11px] font-black text-[#94A3B8] uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {taskData.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-10 text-gray-400 font-medium">No tasks.</td></tr>
            ) : (
              taskData.map((task, index) => (
                <tr key={index} className="group hover:bg-[#FAF9FF] transition-colors">
                  <td className="py-5 px-2 text-sm font-bold text-[#1E1B4B]">{task.TaskName}</td>
                  <td className="py-5 px-2 text-sm font-bold text-[#1E1B4B] max-w-50 truncate">{task.Description}</td>
                  <td className="py-5 px-2">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg ${
                      task.Status === "Completed" ? "bg-green-50 text-green-600" : 
                      task.Status === "Pending" ? "bg-orange-50 text-orange-500" : "bg-purple-50 text-purple-600"
                    }`}>{task.Status}</span>
                  </td>
                  <td className="py-5 px-2 text-sm text-[#94A3B8] font-medium">{task.DueDate}</td>
                  <td className="py-5 px-2 text-right">
                    <div className="flex gap-2 justify-end">
                      <button className="px-4 py-2 text-white bg-[#6D28D9] rounded-xl cursor-pointer text-xs font-bold hover:shadow-lg transition-shadow" onClick={() => onEdit(index)}>Edit</button>
                      <button className="px-3 py-2 text-white bg-red-500 rounded-xl cursor-pointer text-xs font-bold hover:shadow-lg transition-shadow" onClick={() => {setDeleteIndex(index); setShowModal(true);}}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-6">Are you sure you want to delete?</h2>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold">Delete</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;