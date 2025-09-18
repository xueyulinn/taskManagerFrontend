import { useEffect, useState } from "react";
import { useParams } from "react-router";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import AvatarGroup from "../../components/AvatarGroup";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const TaskDetails = () => {
  const { taskId } = useParams();
  const [curTask, setCurTask] = useState(null);
  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";

      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getTaskById = async () => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );
      setCurTask(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const updateChecklist = async (index) => {
    try {
      if (curTask) {
        const todoChecklist = [...curTask.todoChecklist];
        todoChecklist[index].completed = !todoChecklist[index].completed;
        const res = await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
          {
            todoChecklist,
          }
        );
        setCurTask(res.data.updatedTask);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (taskId) {
      getTaskById(taskId);
    }
  }, [taskId]);
  const handleClickLink = (link) => {
    window.open(link, "_blank");
  };
  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <div className=" grid grid-cols-1 md:grid-cols-4 mt-4">
        <div className=" form-card col-span-3">
          <div className=" flex justify-between items-center">
            <h2 className=" text-base md:text-xl font-medium">
              {curTask?.title}
            </h2>
            <div
              className={`${getStatusTagColor} py-0.5 px-4 rounded font-medium`}
            >
              {curTask?.status}
            </div>
          </div>
          <InfoCard label={"Description"} value={curTask?.description} />

          <div className="grid grid-cols-12 mt-4">
            <div className=" col-span-6 md:col-span-4">
              <InfoCard label={"Priority"} value={curTask?.priority} />
            </div>
            <div className=" col-span-6 md:col-span-4">
              <InfoCard
                label={"Due Date"}
                value={
                  curTask?.dueDate
                    ? moment(curTask.dueDate).format("DD-MM-YYYY")
                    : "N/A"
                }
              />
            </div>
            <div className=" col-span-6 md:col-span-4">
              <label className=" text-sm text-gray-500">
                {"Assigned Members"}
              </label>
              <AvatarGroup
                avatars={curTask?.assignedTo?.map((item) => item.avatar)}
              />
            </div>
          </div>

          {/* todoChecklist */}
          <div className=" mt-4">
            <label className=" text-sm text-gray-500">Todo Checklist</label>
            {curTask?.todoChecklist &&
              curTask.todoChecklist.map((item, index) => {
                return (
                  <TodoChecklist
                    key={index}
                    text={item.text}
                    isChecked={item.completed}
                    onChange={() => updateChecklist(index)}
                  />
                );
              })}
          </div>

          {/* attachments */}
          <div className=" mt-4">
            <label className=" text-sm text-gray-500">Attachments</label>
            {curTask?.attachments &&
              curTask.attachments.map((link) => {
                return (
                  <Attachment
                    link={link}
                    onClick={() => handleClickLink(link)}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const InfoCard = ({ label, value }) => {
  return (
    <div>
      <label className=" text-sm text-gray-500">{label}</label>
      <p className=" text-gray-700 font-medium mt-0.5">{value}</p>
    </div>
  );
};

const TodoChecklist = ({ text, isChecked, onChange }) => {
  return (
    <div className=" flex gap-4 items-center p-3">
      <input
        className=" rounded-lg text-primary bg-gray-100"
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
      />
      <p className=" text-gray-800">{text}</p>
    </div>
  );
};

const Attachment = ({ link, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="mt-2 flex justify-between items-center bg-gray-50 border border-gray-100 py-2 px-3"
    >
      <p>{link}</p>
      <LuSquareArrowOutUpRight className=" text-gray-400" />
    </div>
  );
};
export default TaskDetails;
