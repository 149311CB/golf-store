import React from "react";

const Navbar: React.FC<React.ReactNode> = ({ children }) => {
  return (
    <div className={"navbar"}>
      <ul>{children}</ul>
    </div>
  );
};

export default Navbar;
