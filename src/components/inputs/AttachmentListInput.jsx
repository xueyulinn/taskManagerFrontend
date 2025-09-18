import { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";
const AttachmentListInput = ({ attachments, setAttachments }) => {
  const [item, setItem] = useState("");
  const handleAddItem = () => {
    if (item.trim()) {
      setAttachments([...attachments, item.trim()]);
    }
    setItem("");
  };

  const handleDeleteItem = (deletedIndex) => {
    const newAttachments = attachments.filter(
      (_, index) => index != deletedIndex
    );
    setAttachments(newAttachments);
  };
  return (
    <div className=" mt-3 flex flex-col gap-3">
      {Array.isArray(attachments) &&
        attachments.map((curItem, index) => (
          <div key={index} className="flex gap-4 items-center">
            <LuPaperclip className=" text-gray-400" />
            <p className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md ">
              {curItem}
            </p>
            <button
              className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
              onClick={() => handleDeleteItem(index)}
            >
              <HiOutlineTrash className="text-base" /> Delete
            </button>
          </div>
        ))}

      <div className=" flex gap-4 items-center">
        <LuPaperclip className=" text-gray-400" />
        <input
          type="text"
          value={item}
          onChange={(event) => setItem(event.target.value)}
          placeholder="Add File Link"
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md "
        />
        <button className=" card-btn" onClick={handleAddItem}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default AttachmentListInput;
