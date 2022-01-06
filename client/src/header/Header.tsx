import { ReactComponent as Logo } from "../assets/Logo.svg";
import Navbar from "./nav/Navbar";
import NavLink from "./nav/NavLink";
import Search from "./search/Search";
import CartBadge from "./cart-badge/CartBadge";
import AuthModal from "../user/auth/AuthModal";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../App";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const value = useContext(GlobalContext);

  useEffect(() => {
    value.setIsOpen = setIsOpen;
  }, [setIsOpen, value]);

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
        <CartBadge />
        <div className={"header-user"}>
          <i className="fas fa-user pop" onClick={() => setIsOpen(true)}/>
        </div>
        <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </header>
  );
};

export default Header;
