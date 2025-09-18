import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TaskCard from "../../components/cards/TaskCard";
import { useNavigate } from "react-router";
const ManageTask = () => {
  const [tabs, setTabs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };
  useEffect(() => {
    const getAllTasks = async () => {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status,
        },
      });
      setTasks(res.data?.tasks);
      const statusSummary = res.data?.statusSummary;
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];
      setTabs(statusArray);
      setLoading(false);
    };
    getAllTasks();
  }, [status]);

  const handleDownload = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <DashboardLayout activeMenu={"Manage Tasks"}>
      <div className="flex flex-col  gap-3  mt-3">
        {/* header */}
        <div className=" flex gap-3 justify-between">
          <h2 className="text-base md:text-xl">My Tasks</h2>
          <div className=" flex gap-3">
            {tasks.length > 0 && (
              <TaskStatusTabs
                tabs={tabs}
                activeTab={status}
                setActive={setStatus}
              />
            )}
            <button className="download-btn flex" onClick={handleDownload}>
              <LuFileSpreadsheet className="text-lg" /> Download Report
            </button>
          </div>
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          {tasks.length > 0 &&
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                status={task.status}
                progress={task.progress}
                createdAt={task.createdAt}
                dueDate={task.dueDate}
                assignedTo={task.assignedTo}
                attachmentCount={task.attachments.length}
                completedTodoCount={
                  task.todoChecklist.filter((item) => item.completed == true)
                    .length
                }
                todoChecklist={task.todoChecklist}
                onClick={() => handleClick(task)}
              />
            ))}

          {loading && <h1>Loading tasks...</h1>}
          {!loading && tasks.length == 0 && (
            <h1>There are currently no tasks.</h1>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTask;
