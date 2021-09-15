import React from "react";

const NavLink: React.FC<React.ReactNode> = ({ children }) => {
  return <li className={"pop"}>{children}</li>;
};

export default NavLink;
