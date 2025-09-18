import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/cards/TaskCard";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance";
const MyTasks = () => {
  const [tabs, setTabs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("All");
  const navigate = useNavigate();
  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };
  useEffect(() => {
    const getAllTasks = async () => {
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
    };
    getAllTasks();
  }, [status]);

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
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
                createdAt={task.progress}
                dueDate={task.dueDate}
                assignedTo={task.assignedTo}
                attachmentCount={task.attachments.length}
                completedTodoCount={
                  task.todoChecklist.filter((item) => item.completed == true)
                    .length
                }
                todoChecklist={task.todoChecklist}
                onClick={() => handleClick(task._id)}
              />
            ))}
        </div>
      </div>
      {tasks.length == 0 && <h1>You are not assigned with any tasks.</h1>}
    </DashboardLayout>
  );
};

export default MyTasks;
