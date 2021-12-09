import { ReactComponent as Logo } from "../assets/Logo.svg";

import Navbar from "./nav/Navbar";
import NavLink from "./nav/NavLink";
import Search from "./search/Search";
import Cart from "./cart/Cart";
import User from "./user/User";

const Header = () => {
  return (
    <header>
      <div className={"logo"}>
        <NavLink to={"/"}>
          <Logo />
        </NavLink>
      </div>
      <Navbar>
        <NavLink to={"/"}>CLUBS</NavLink>
        <NavLink to={"/"}>GOLF</NavLink>
        <NavLink to={"/"}>BALLS APPAREL</NavLink>
        <NavLink to={"/"}>ACCESSORIES CUSTOMIZATION</NavLink>
      </Navbar>
      <div className={"left-col"}>
        <Search />
        <Cart />
        <User/>
      </div>
    </header>
  );
};

export default Header;
