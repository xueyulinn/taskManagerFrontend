import { useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useLocation } from "react-router";
import AttachmentListInput from "../../components/inputs/AttachmentListInput";
import SelectUsers from "../../components/inputs/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance";
import { PRIORITY_DATA } from "../../utils/data";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router";
import moment from "moment";
import DeleteAlert from "../../components/DeleteAlert";
import { toast } from "react-toastify";
const CreateTask = () => {
  const location = useLocation();
  const taskId = location.state?.taskId;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });
  const [curTask, setCurTask] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const navigate = useNavigate();
  const handleValueChange = (key, value) => {
    setTaskData((preData) => ({ ...preData, [key]: value }));
  };
  const handleSubmit = () => {
    setError(null);
    if (!taskData.title) {
      setError("Task title is required.");
      return;
    }
    if (!taskData.description) {
      setError("Task description is required.");
      return;
    }
    if (!taskData.dueDate) {
      setError("Task duedate is required.");
      return;
    }
    if (taskData.assignedTo.length == 0) {
      setError("Task not assigned to anyone.");
      return;
    }
    if (taskData.todoChecklist.length == 0) {
      setError("Task checklist is required.");
      return;
    }
    if (taskId) {
      updateTask();
      return;
    }
    createTask();
  };

  const createTask = async () => {
    try {
      setLoading(true);
      const todoList = taskData.todoChecklist.map((item) => ({
        text: item,
        completed: false,
      }));
      const res = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        todoChecklist: todoList,
        dueDate: new Date(taskData.dueDate).toISOString(),
      });
      toast.success("Task created.");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getDetailsById = async () => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );
      const taskInfo = res.data;
      console.log(taskInfo.assignedTo);
      if (taskInfo) {
        setCurTask(taskInfo);
        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo.assignedTo?.map((item) => item._id),
          todoChecklist: taskInfo.todoChecklist.map((item) => item.text),
          attachments: taskInfo.attachments,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (taskId) {
      getDetailsById();
    }
    return () => {};
  }, [taskId]);
  const updateTask = async () => {
    try {
      setLoading(true);
      const todoList = taskData.todoChecklist.map((item) => {
        const preChecklist = curTask?.todoChecklist || [];
        const matchedTask = preChecklist.find((task) => task.text == item);
        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });
      toast.success("Task updated.");
    } catch (error) {
      if (error.response.data.message) {
        setError(error.response.data.message);
      } else {
        toast.error("Server error.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task deleted.");
      setOpenDeleteAlert(false);
      navigate("/admin/tasks");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <DashboardLayout activeMenu={"Create Task"}>
      <div className="grid grid-cols-4 mt-4">
        <div className="form-card col-span-4">
          <div className=" flex justify-between items-center">
            <h2 className="text-base md:text-xl">
              {taskId ? "UpdateTask" : "CreateTask"}
            </h2>
            {taskId && (
              <button
                onClick={() => setOpenDeleteAlert(true)}
                className="delete-btn"
              >
                <LuTrash2 className="text-base" /> Delete
              </button>
            )}
          </div>
          {/* header */}
          <div className="mt-4">
            <label className="text-xs md:text-base font-medium text-slate-600 ">
              Task Title
            </label>

            <input
              className="form-input"
              value={taskData.title}
              onChange={(event) =>
                handleValueChange("title", event.target.value)
              }
              placeholder="Task title"
            ></input>
          </div>
          {/* description */}
          <div className="mt-3">
            <label className="text-xs md:text-base font-medium text-slate-600">
              Description
            </label>

            <textarea
              placeholder="Describe task"
              className="form-input"
              rows={4}
              value={taskData?.description}
              onChange={(event) =>
                handleValueChange("description", event.target.value)
              }
              maxLength={500}
            />
          </div>

          <div className=" grid  grid-cols-10  md:grid-cols-12 ">
            <div className="mt-3 col-span-4">
              <label className="text-xs md:text-base font-medium text-slate-600 mr-3">
                Priority
              </label>
              <select
                className="text-xs md:text-sm mx-[8px] border border-gray-100 bg-gray-50"
                onChange={(event) =>
                  handleValueChange("priority", event.target.value)
                }
              >
                {PRIORITY_DATA.map((item) => (
                  <option key={item.label}> {item.label}</option>
                ))}
              </select>
            </div>

            <div className="mt-3 col-span-4">
              <label className="text-xs md:text-base font-medium text-slate-600 ">
                Due Date
              </label>

              <input
                className="text-xs md:text-sm mx-[12px] bg-gray-50 border border-gray-100"
                value={taskData?.dueDate}
                onChange={(event) =>
                  handleValueChange("dueDate", event.target.value)
                }
                type="date"
              />
            </div>

            <div className="mt-3 col-span-4">
              <label className=" text-xs md:text-base font-medium text-slate-600">
                Assign To
              </label>
              <SelectUsers
                selectedUsers={taskData.assignedTo}
                setSelectedUsers={(assignedUsers) =>
                  handleValueChange("assignedTo", assignedUsers)
                }
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs md:text-base font-medium text-slate-600 mr-3">
              TODO Checklist
            </label>
            <TodoListInput
              todoList={taskData?.todoChecklist}
              setTodoList={(val) => handleValueChange("todoChecklist", val)}
            />
          </div>

          <div className="mt-3">
            <label className="text-xs md:text-base font-medium text-slate-600 mr-3">
              Add Attachments
            </label>
            <AttachmentListInput
              attachments={taskData?.attachments}
              setAttachments={(val) => handleValueChange("attachments", val)}
            />
          </div>

          {error && (
            <p className=" text-xs md:text-base text-red-500 font-medium mt-3">
              {error}
            </p>
          )}

          <button
            className="add-btn mt-5 uppercase"
            onClick={handleSubmit}
            disabled={loading}
          >
            {taskId ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        title={"Delete Task"}
        onClose={() => setOpenDeleteAlert(false)}
      >
        <DeleteAlert
          content={"Are you sure you want to delete this task?"}
          onClick={deleteTask}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
