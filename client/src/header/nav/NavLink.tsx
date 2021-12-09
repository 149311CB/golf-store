import React from "react";
import { Link } from "react-router-dom";

const NavLink: React.FC<{ to: string }> = ({ children, to }) => {
  return (
    <li className={"pop"}>
      <Link to={to}>{children}</Link>
    </li>
  );
};

export default NavLink;
