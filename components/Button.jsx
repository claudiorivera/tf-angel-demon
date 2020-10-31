import React from "react";

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-accent-1 text-white font-bold py-2 px-4 rounded"
  >
    {children}
  </button>
);

export default Button;
