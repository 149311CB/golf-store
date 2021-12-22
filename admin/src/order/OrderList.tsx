import {
  Box,
  Toolbar,
  IconButton,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  Checkbox,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCallback, useContext, useEffect, useState } from "react";
import { client } from "../utils/client";
import { IOrder, OrderRow } from "../models/Order";
import { GlobalContext } from "../App";
import { Link } from "react-router-dom";

const TableToolbar: React.FC<{ selectCount: number; deleteHandler: Function }> =
  ({ selectCount, deleteHandler }) => {
    return (
      <Toolbar
        sx={{
          border: "1px solid red",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography>
          {selectCount > 0 ? `${selectCount} selected` : "Orders"}
        </Typography>
        <IconButton
          onClick={() => {
            selectCount > 0 && deleteHandler();
          }}
        >
          {selectCount > 0 ? <DeleteIcon /> : <FilterListIcon />}
        </IconButton>
      </Toolbar>
    );
  };

const headerCell = [
  {
    id: "item",
    label: "Items",
  },
  {
    id: "date",
    label: "Date",
  },
  {
    id: "total",
    label: "Total",
  },
  {
    id: "status",
    label: "Status",
  },
];

const OrderList = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState("date");
  const [selected, setSelected] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  console.log(orders)

  const toggleSelectAll = () => {
    const newSelected: string[] = [];
    if (!selectAll) {
      orders.forEach((order) => {
        newSelected.push(order.id);
      });
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
    setSelected(newSelected);
  };

  const deleteHandler = () => {
    const newOrders = orders.filter((item) => {
      return !selected.includes(item.id);
    });
    setOrders(newOrders);
  };

  const calculateTotal = (products: any[]) => {
    let total = 0;
    products.forEach((item) => {
      const { product, quantity } = item;
      if (product && quantity && product.price) {
        total += product.price * quantity;
      } else {
        total += 0;
      }
    });
    return total;
  };

  const createRow = useCallback((input: IOrder[]): OrderRow[] => {
    const rows = input.map((data) => {
      let item = "";
      let total = 0;
      if (typeof data.cart !== "string") {
        const { products } = data.cart;
        if (products && products[0].product.name) {
          item = products[0].product.name;
          if (products.length > 1) {
            item += `and ${products.length} other item`;
          }
        }
        total = calculateTotal(products);
      }
      const row: OrderRow = new OrderRow(
        data._id,
        item,
        new Date(data.createdAt).toLocaleDateString(),
        total,
        data.state.state
      );
      return row;
    });
    return rows;
  }, []);

  const { token } = useContext(GlobalContext);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      const { data } = await client.get("/api/order/auth/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data;
    };
    fetchData().then((data) => {
      setOrders(createRow(data as Array<IOrder>));
    });
  }, [createRow, token]);

  return (
    <Box>
      <Paper>
        <TableToolbar
          selectCount={selected.length}
          deleteHandler={deleteHandler}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    onClick={() => {
                      toggleSelectAll();
                    }}
                  />
                </TableCell>
                {headerCell.map((item) => (
                  <TableCell key={item.id}>
                    <TableSortLabel
                      active={orderBy === item.id}
                      direction={orderBy === item.id ? order : "asc"}
                      onClick={() => {
                        setOrder(order === "asc" ? "desc" : "asc");
                        setOrderBy(item.id);
                      }}
                    >
                      {item.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
              {orders
                .sort((a: any, b: any) => {
                  if (orderBy !== "date") {
                    return order === "asc"
                      ? b[orderBy] - a[orderBy]
                      : a[orderBy] - b[orderBy];
                  }
                  return order === "asc"
                    ? new Date(a[orderBy]).getTime() -
                        new Date(b[orderBy]).getTime()
                    : new Date(b[orderBy]).getTime() -
                        new Date(a[orderBy]).getTime();
                })
                .map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell padding={"checkbox"}>
                      <Checkbox
                        checked={selected.includes(order.id)}
                        onClick={() => {
                          const index = selected.indexOf(order.id);
                          if (index > -1) {
                            setSelected(
                              selected.filter((item) => {
                                return !(item === order.id);
                              })
                            );
                          } else {
                            setSelected([...selected, order.id]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/orders/${order.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Typography sx={{ color: "text.primary" }}>
                          {order.items}
                        </Typography>
                      </Link>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>{order.status}</TableCell>
                  </TableRow>
                ))}
            </TableHead>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default OrderList;
