import { useContext, useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { GlobalContext } from "../../../App";
import { client } from "../../../utils/client";

const columns = [
  { id: "_id", name: "Id", format: (id: string) => id.slice(0, 10) },
  {
    id: "date",
    name: "Date",
    format: (date: string) => new Date(date).toLocaleDateString(),
  },
  { id: "items", name: "Items" },
  { id: "total_price", name: "Total Price" },
  { id: "state", name: "Status" },
  { id: "action", style: { backgroundColor: "var(--bg-standout)" } },
];

const Orders = () => {
  const [data, setData] = useState<any>();
  const [rows, setRows] = useState<any[]>([]);
  const { token } = useContext(GlobalContext);
  const { path } = useRouteMatch();

  useEffect(() => {
    if (!token || token === "-1") return;
    const fetchData = async () => {
      const { data: fetchedData } = await client.get(
        "/api/order/auth/user/all",
        {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(fetchedData);
    };
    fetchData();
  }, [token, setData]);

  useEffect(() => {
    const internalRows: any[] = [];
    console.log(data)
    if (data && data.data && Array.isArray(data.data)) {
      data.data.forEach((item: any) => {
        const { _id } = item;
        const { state } = item;
        let row;
        if (state) {
          const { updatedAt } = state;
          row = {
            _id: _id,
            date: updatedAt,
            state: state.state,
          };
        }

        const { cart } = item;
        if (cart && Array.isArray(cart.products)) {
          let name = cart.products[0].product.name;
          if (cart.products.length > 1) {
            name += ` and ${cart.products.length - 1} other products`;
          }
          row = { ...row, items: name };
        }
        internalRows.push(row);
      });
      setRows(internalRows);
    }
  }, [data]);

  return (
    <div id={"order-page"}>
      <h1>Orders</h1>
      <hr />
      <table
        id={"order-table"}
        className={"box-shadow-small border-radius-all"}
      >
        <thead>
          <tr>
            {columns.map((column: any) => (
              <th key={column.id}>{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, index: number) => (
            <tr key={index}>
              <>
                {columns
                  .slice(0, columns.length - 1)
                  .map((column: any) =>
                    column.format ? (
                      <td key={column.id + index.toString()}>
                        {column.format(row[column.id])}
                      </td>
                    ) : (
                      <td key={column.id + index.toString()}>
                        {row[column.id]}
                      </td>
                    )
                  )}
                <td>
                  <Link
                    to={`${path}/${row._id}`}
                    className={"view-order-link box-shadow-small"}
                  >
                    View order
                  </Link>
                </td>
              </>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
