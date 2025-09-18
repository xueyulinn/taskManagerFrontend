import { useEffect, useState } from "react";
import { API_PATHS } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance.js";
import AvatarGroup from "../AvatarGroup.jsx";
import Modal from "../Modal.jsx";
import { LuUsers } from "react-icons/lu";
const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState(selectedUsers);
  const selectedUsersAvatars = allUsers
    .filter((curUser) => selectedUsers.includes(curUser._id))
    .map((curUser) => curUser.avatar);
  const toggleUserSelection = (id) => {
    setTempSelectedUsers((prev) =>
      // cancel the selected user
      prev.includes(id) ? prev.filter((curId) => curId != id) : [...prev, id]
    );
  };
  const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (res.data?.length > 0) {
        setAllUsers(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div iv className=" mt-3">
      {selectedUsersAvatars.length == 0 && (
        <button className="card-btn" onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-sm" /> Add Members
        </button>
      )}

      {selectedUsersAvatars.length > 0 && (
        <div
          className="cursor-pointer h-20 w-20"
          onClick={() => setIsModalOpen(true)}
        >
          <AvatarGroup maxVisible={3} avatars={selectedUsersAvatars} />
        </div>
      )}
      <Modal
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        title={"Select Users"}
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-200"
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {user.username}
                </p>
                <p className="text-[13px] text-gray-500">{user.email}</p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
