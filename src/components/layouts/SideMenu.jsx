import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../context/UserContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import defaultAvatar from "../../assets/images/defaultAvatar.png";
const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) return;
    user.role === "admin"
      ? setMenu(SIDE_MENU_DATA)
      : setMenu(SIDE_MENU_USER_DATA);
  }, [user]);

  const handleClick = (item) => {
    const { path } = item;
    if (path === "logout") handleLogout();
    else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    clearUser();
    navigate("/accounts/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative w-[30%] h-[30%]">
          <img
            src={user?.avatar || defaultAvatar}
            alt="Avatar"
            className="w-full rounded-full px-1 py-2"
          ></img>
        </div>
        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.username || ""}
        </h5>

        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>
      {menu &&
        menu.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-4 text-[15px] ${
              activeMenu === item.label
                ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
                : ""
            } py-3 px-6 mb-3 cursor-pointer`}
            onClick={() => handleClick(item)}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}
    </div>
  );
};

export default SideMenu;
