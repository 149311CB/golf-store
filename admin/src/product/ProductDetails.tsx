import {
  Box,
  Divider,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { GlobalContext } from "../App";
import { client } from "../utils/client";
import Variant from "./Variant";

const ProductDetails: React.FC<RouteComponentProps> = ({ match }) => {
  const {
    params: { id },
  }: any = match;
  const { token } = useContext(GlobalContext);
  const [data, setData] = useState<any>();
  const [golf, setGolf] = useState<any>();
  const [variants, setVarians] = useState<any[]>();
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      const { data } = await client.get(`/api/products/golfs/${id}`, {
        credentials: "include",
        headers: { authorization: `Bearer ${token}` },
      });
      setData(data.data);
    };
    fetchData();
  }, [token, id]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const { golf, variants } = data;
    setGolf(golf);
    setVarians(variants);
    const { name, price, description } = golf;
    setName(name);
    setPrice(price);
    setDescription(description);
  }, [data]);
  return (
    <Box sx={{ padding: "1.2rem" }}>
      <Box>
        <Box
          className={"active-image-container"}
          sx={{
            width: "200px",
            border: "2px solid",
            borderColor: (theme) => theme.palette.grey.A400,
            mb: 3,
          }}
        >
          <img
            src={golf && golf.images[imageIndex]}
            alt=""
            style={{ width: "100%" }}
          />
        </Box>
        <Box
          className={"image-list-container"}
          sx={{ display: "flex", gap: "0.6rem" }}
        >
          {golf &&
            golf.images &&
            golf.images.map((image: string, index: number) => (
              <Box
                sx={{
                  width: "50px",
                  overflow: "hidden",
                  border: `${imageIndex === index ? 2 : 1}px solid`,
                  borderColor: (theme) =>
                    imageIndex === index
                      ? theme.palette.primary.main
                      : theme.palette.grey.A400,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setImageIndex(index);
                }}
                key={index}
              >
                <img src={image} alt="" style={{ width: "100%" }} />
              </Box>
            ))}
        </Box>
      </Box>
      <Box
        component={"form"}
        sx={{ mt: 5, display: "flex", flexDirection: "column", gap: "0.9rem" }}
      >
        <TextField
          id="outlined-basic"
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextField
          id="filled-multiline-flexible"
          variant="outlined"
          label="Description"
          multiline
          maxRows={4}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Price"
          variant="outlined"
          value={price}
          type={"number"}
          inputProps={{ min: 0 }}
          onChange={(e) => {
            setPrice(parseInt(e.target.value));
          }}
        />
      </Box>
      <Divider sx={{ mt: 3 }} />
      <Box>
        <Typography variant={"h5"} sx={{ mb: 3 }}>
          Variants
        </Typography>
        <Box
          style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
        >
          {variants &&
            variants.map((variant: any) => <Variant variant={variant} key={variant._id}/>)}
        </Box>
      </Box>
    </Box>
  );
};

export default withRouter(ProductDetails);
