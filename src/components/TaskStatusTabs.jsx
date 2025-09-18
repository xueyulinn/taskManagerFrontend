const TaskStatusTabs = ({ tabs, activeTab, setActive }) => {
  return (
    <div className=" flex gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={`cursor-pointer ${
            tab.label === activeTab
              ? "text-primary"
              : "text-gray hover:text-gray-700"
          } py-2 px-1 `}
          onClick={() => setActive(tab.label)}
        >
          <div className=" flex gap-2 items-center">
            <span>{tab.label}</span>
            <span
              className={`${
                tab.label === activeTab
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              } rounded-full px-3`}
            >
              {tab.count}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TaskStatusTabs;
