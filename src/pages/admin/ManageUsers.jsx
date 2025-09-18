import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuFileSpreadsheet } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import UserCard from "../../components/cards/UserCard";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDownload = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      URL.revokeObjectURL(link);
    } catch (error) {
      toast.error("Server error.");
    }
  };

  const [deletedUserId, setDeletedUserId] = useState(null);

  const handleDeleteUser = async () => {
    try {
      axiosInstance.delete(API_PATHS.USERS.DELETE_USER(deletedUserId));
      setOpenModal(false);
      getAllUsers();
      toast.success("User deleted.");
    } catch (error) {
      toast.error("Server error.");
    }
  };

  return (
    <DashboardLayout activeMenu={"Team Members"}>
      <div className=" mt-3 mb-5">
        <div className=" flex gap-3 justify-between">
          <h2 className="text-base md:text-xl">Manage Users</h2>
          <div className=" flex gap-3">
            <button className="download-btn flex" onClick={handleDownload}>
              <LuFileSpreadsheet className="text-lg" /> Download Report
            </button>
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
        {users.length > 0 &&
          users.map((user) => (
            <UserCard
              key={user.username}
              userInfo={user}
              handleDeleteUser={() => {
                setDeletedUserId(user._id);
                setOpenModal(true);
              }}
            />
          ))}
        {!loading && users.length == 0 && (
          <h1>There are currently no members.</h1>
        )}
      </div>

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={"Delete User"}
      >
        <DeleteAlert
          content={"Are you sure you want to delete this user?"}
          onClick={handleDeleteUser}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default ManageUsers;
