import React from "react";

const Navbar = ({ children }) => {
  return (
    <div className={"navbar"}>
      <ul>{children}</ul>
    </div>
  );
};

export default Navbar;
