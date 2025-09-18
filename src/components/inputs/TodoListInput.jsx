import { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
const TodoListInput = ({ todoList, setTodoList }) => {
  const [item, setItem] = useState("");
  const handleAddItem = () => {
    if (item.trim()) {
      setTodoList([...todoList, item.trim()]);
    }
    setItem("");
  };

  const handleDeleteItem = (deletedIndex) => {
    const newList = todoList.filter((_, index) => index != deletedIndex);
    setTodoList(newList);
  };
  return (
    <div className=" mt-3 flex flex-col gap-3">
      {Array.isArray(todoList) &&
        todoList.map((curItem, index) => (
          <div key={index} className="flex gap-4 justify-center">
            <p className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md ">
              {curItem}
            </p>
            <button
              className="delete-btn"
              onClick={() => handleDeleteItem(index)}
            >
              <HiOutlineTrash className=" text-lg" /> Delete
            </button>
          </div>
        ))}
      <div className=" flex gap-4 justify-center">
        <input
          type="text"
          value={item}
          placeholder="Enter Task"
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md "
          onChange={(event) => setItem(event.target.value)}
        ></input>
        <button className="card-btn" onClick={handleAddItem}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
