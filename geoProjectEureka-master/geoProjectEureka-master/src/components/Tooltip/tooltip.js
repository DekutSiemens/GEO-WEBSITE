import React from "react";

const Tooltip = ({ message, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-4 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {message}
      </div>
    </div>
  );
};

export default Tooltip;
