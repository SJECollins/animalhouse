const ErrAlert = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 p-2 m-2 rounded relative">
      <span className="block text-sm">{message}</span>
    </div>
  );
};

export default ErrAlert;
