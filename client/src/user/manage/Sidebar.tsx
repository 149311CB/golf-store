import { Link, useHistory } from "react-router-dom";

const Sidebar: React.FC<{ path: string }> = ({ path }) => {
  const {
    location: { pathname },
  } = useHistory();
  const current = pathname.split("/");
  return (
    <div id={"sidebar"} className={"box-shadow-small border-radius-all"}>
      <ul>
        <li>
          <Link
            to={`${path}`}
            className={`box-shadow-small border-radius-all ${
              !current[2] ? "active" : ""
            }`}
          >
            Account
          </Link>
        </li>
        <li>
          <Link
            to={`${path}/orders`}
            className={`box-shadow-small border-radius-all ${
              current[2] === "orders" ? "active" : ""
            }`}
          >
            Orders
          </Link>
        </li>
        <li>
          <Link
            to={`${path}/addresses`}
            className={`box-shadow-small border-radius-all ${
              current[2] === "addresses" ? "active" : ""
            }`}
          >
            Addresses
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
