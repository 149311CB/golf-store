import React from "react";
import { ReactComponent as Logo } from "../assets/Logo.svg";

import Navbar from "./nav/Navbar";
import NavLink from "./nav/NavLink";
import Search from "./search/Search";
import Cart from "./cart/Cart";

const Header = () => {
  return (
    <header>
      <div className={"logo"}>
        <Logo />
      </div>
      <Navbar>
        <NavLink>CLUBS</NavLink>
        <NavLink>GOLF</NavLink>
        <NavLink>BALLS APPAREL</NavLink>
        <NavLink>ACCESSORIES CUSTOMIZATION</NavLink>
      </Navbar>
      <div className={"left-col"}>
        <Search />
        <Cart />
      </div>
    </header>
  );
};

export default Header;
