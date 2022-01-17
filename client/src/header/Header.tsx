import { ReactComponent as Logo } from "../assets/Logo.svg";
import Navbar from "./nav/Navbar";
import NavLink from "./nav/NavLink";
import Search from "./search/Search";
import CartBadge from "./cart-badge/CartBadge";
import AuthModal from "../user/auth/AuthModal";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../App";
import { client } from "../utils/client";
import { Link, useHistory } from "react-router-dom";
import Button from "../components/button/Button";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatar, setAvatar] = useState(
    "https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/avatar.svg?alt=media&token=ba3ea983-3133-41d9-88c4-002deffd991a"
  );
  const userMenuRef = useOnClickOutside();
  const value = useContext(GlobalContext);
  const { token } = value;

  useEffect(() => {
    value.setIsOpen = setIsOpen;
  }, [setIsOpen, value]);

  useEffect(() => {
    if (token && token !== "-1") {
      const fetchAvatar = async () => {
        const { data } = await client.get("/api/user/auth/details?avatar", {
          credentials: "include",
          headers: { authorization: `Bearer ${token}` },
        });
        setAvatar(data.data.avatar);
      };
      fetchAvatar();
    }
  }, [token]);

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
        <div
          className={"header-user"}
          onClick={() => (userMenuRef.current.style.display = "block")}
        >
          {token && token !== "-1" ? (
            <img src={avatar} alt={"user-avatar"} style={{ width: "100%" }} />
          ) : (
            <i className="fas fa-user pop" onClick={() => setIsOpen(true)} />
          )}
          <div
            className={"dropdown box-shadow-small border-radius-all"}
            ref={userMenuRef}
          >
            <ul>
              <li>
                <Link
                  to={"/account"}
                  className={"box-shadow-small border-radius-top"}
                >
                  Account
                </Link>
              </li>
              <hr style={{ margin: "0" }} />
              <li>
                <Button
                  className={"box-shadow-small border-radius-bottom"}
                  onClick={async () => {
                    const {status} = await client.get("/api/user/auth/logout", {
                      credentials: "include",
                      headers: { authorization: `Bearer ${token}` },
                    });
                    if(status === 200){
                      window.location.href = "/"
                    }
                  }}
                >
                  Log out
                </Button>
              </li>
            </ul>
          </div>
        </div>
        <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </header>
  );
};

export default Header;
