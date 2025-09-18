import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context/UserContext";
import InfoCard from "../../components/cards/InfoCard";
import CustomPieChart from "../../components/cards/CustomPieChart";
import CustomBarChart from "../../components/cards/CustomBarChart";
import TaskListTable from "../../components/TaskListTable";
import moment from "moment";
import { LuArrowRight } from "react-icons/lu";
import { useNavigate } from "react-router";
const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];
const DashBoard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const prepareChartData = (data) => {
    const taskDistribution = data?.charts.taskDistribution || null;
    const taskPriorityLevels = data?.charts.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  // load data
  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="my-2">
            <h2 className="text-xl md:text-2xl">
              Good Morning! {user?.username}
            </h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>
        <div className=" grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          <InfoCard
            label="Total Tasks"
            value={dashboardData?.charts?.taskDistribution?.All || 0}
            color="bg-primary"
          />

          <InfoCard
            label="Pending Tasks"
            value={dashboardData?.charts?.taskDistribution?.Pending || 0}
            color="bg-violet-500"
          />

          <InfoCard
            label="In Progress Tasks"
            value={dashboardData?.charts?.taskDistribution?.InProgress || 0}
            color="bg-cyan-500"
          />

          <InfoCard
            label="Completed Tasks"
            value={dashboardData?.charts?.taskDistribution?.Completed || 0}
            color="bg-lime-500"
          />
        </div>
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>

            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>

        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Priority Levels</h5>
            </div>

            <CustomBarChart data={barChartData} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashBoard;
