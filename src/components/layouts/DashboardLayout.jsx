import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import NavbarLayout from "./NavbarLayout";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  return (
    <div className="">
      <NavbarLayout></NavbarLayout>
      <div className="flex">
        <div className="max-[1080px]:hidden">
          {user && <SideMenu activeMenu={activeMenu}></SideMenu>}
        </div>
        <div className="grow mx-5">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
