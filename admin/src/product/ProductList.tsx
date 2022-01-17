import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../utils/client";

const headerCell = [
  {
    id: "_id",
    label: "Id",
    format: (id: string) => id.slice(0, 10),
  },
  {
    id: "image",
    label: "Image",
  },
  {
    id: "name",
    label: "Name",
  },
  {
    id: "price",
    label: "Price",
    format: (price: string) => "$" + price,
  },
  {
    id: "variants",
    label: "Variants",
  },
  {
    id: "totalStock",
    label: "Total Stock",
  },
];

const ProductList = () => {
  const [rows, setRows] = useState<any[]>([]);
  const createRow = (data: any) => {
    const rows = data.map((item: any) => {
      const { golf, variants } = item;
      let total = 0;
      if (Array.isArray(variants)) {
        variants.forEach((variant: any) => {
          total += variant.stock;
        });
      }
      const row = {
        _id: golf._id,
        image: golf.images[0],
        name: golf.name,
        price: golf.price,
        variants: variants.length,
        totalStock: total,
      };
      return row;
    });
    return rows;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client.get("/api/products/golfs", {
        credentials: "include",
      });
      console.log(data)
      setRows(createRow(data.data));
    };
    fetchData();
  }, []);
  return (
    <Box>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                {headerCell.map((item) => (
                  <TableCell key={item.id}>{item.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: any) => (
                <TableRow key={row._id}>
                  <TableCell key={row._id + "checkbox"}>
                    <Checkbox />
                  </TableCell>
                  {headerCell.map((cell: any) =>
                    cell.id === "image" ? (
                      <TableCell key={row._id + cell.id} sx={{ width: "100px" }}>
                        <img
                          src={row[cell.id]}
                          alt=""
                          style={{ width: "100%" }}
                        />
                      </TableCell>
                    ) : cell.id === "_id" ? (
                      <TableCell key={row._id + cell.id}>
                        <Link to={`/products/${row._id}`}>
                          {cell.format
                            ? cell.format(row[cell.id])
                            : row[cell.id]}
                        </Link>
                      </TableCell>
                    ) : (
                      <TableCell key={row._id + cell.id}>
                        {cell.format ? cell.format(row[cell.id]) : row[cell.id]}
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ProductList;
