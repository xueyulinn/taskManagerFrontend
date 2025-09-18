const DeleteAlert = ({ content, onClick }) => {
  return (
    <div className="flex justify-between">
      <p className=" text-white font-medium">{content}</p>
      <button onClick={onClick} className="delete-btn">
        Delete
      </button>
    </div>
  );
};

export default DeleteAlert;
