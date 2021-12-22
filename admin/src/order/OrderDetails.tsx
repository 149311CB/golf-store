import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import {
  Box,
  Typography,
  Paper,
  styled,
  Button,
  darken,
  Stack,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { GlobalContext } from "../App";
import { client } from "../utils/client";
import Specs from "./Specs";

const CustomTimelineItem = styled(TimelineItem)(() => ({
  "& .MuiTimelineContent-root": {
    display: "inline-flex",
    alignItems: "flex-start",
    gap: "0.3rem",
    flexDirection: "column",
  },
}));

const StateButton: React.FC<{
  stateHandler: Function;
  bgcolor: string;
  disabled?: boolean;
}> = ({ stateHandler, bgcolor, children, disabled = false }) => {
  return (
    <Button
      sx={{
        bgcolor: `${bgcolor}.main`,
        color: "primary.contrastText",
        width: "100%",
        "&:hover": {
          // @ts-ignore
          bgcolor: (theme) => darken(theme.palette[bgcolor].main, 0.1),
        },
      }}
      onClick={() => {
        stateHandler();
      }}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

const OrderDetails: React.FC<RouteComponentProps> = ({ match }) => {
  const {
    params: { id },
  }: any = match;
  const { token } = useContext(GlobalContext);
  const [currentState, setCurrentState] = useState<any>(null);
  const [stateHistory, setStateHistory] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [products, setProducts] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const handleClose = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  const confirmHandler = async () => {
    if (!token) return;
    await client
      .put(`/api/order/auth/confirm/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ status }) => {
        if (status === 200) {
          setSnackbarState({
            ...snackbarState,
            open: true,
            message: "order confirmed",
          });
        }
      });
    setLoading(false);
  };

  const shipHandler = async () => {
    if (!token) return;
    await client
      .put(`/api/order/auth/ship/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ status }) => {
        if (status === 200) {
          setSnackbarState({
            ...snackbarState,
            open: true,
            message: "order shipped",
          });
        }
      });
    setLoading(false);
  };

  const completeOrder = async () => {
    if (!token) return;
    await client
      .put(`/api/order/auth/complete/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ status }) => {
        if (status === 200) {
          setSnackbarState({
            ...snackbarState,
            open: true,
            message: "success",
          });
        }
      });
    setLoading(false);
  };

  const cancelOrder = async () => {
    if (!token) return;
    await client
      .put(`/api/order/auth/cancel/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ status }) => {
        if (status === 200) {
          setSnackbarState({
            ...snackbarState,
            open: true,
            message: "order rejected",
          });
        }
      });
    setLoading(false);
  };

  useEffect(() => {
    if (!token || loading) return;
    const fetchData = async () => {
      const {
        data: { data },
      } = await client.get(`/api/order/auth/details/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);
      setCurrentState(data.state);
      setStateHistory(data.stateHistory);
      setPaymentMethod(data.paymentMethod);
      setProducts(data.cart.products);
    };
    fetchData();
  }, [token, id, loading]);

  return (
    <Box sx={{ p: 3 }}>
      <Box className={"order-info"} sx={{ display: "flex", gap: "1.2rem" }}>
        <Paper
          className={"state-info"}
          elevation={3}
          sx={{
            p: 2,
            borderRadius: "0.6rem",
            "& *": { fontSize: "0.875rem" },
            "& strong": { color: "text.primary" },
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: currentState
                ? currentState.state === "succeeded" ||
                  currentState.state === "success"
                  ? "primary.main"
                  : currentState.state === "cancelled"
                  ? "error.main"
                  : "text.primary"
                : "text.primary",
              fontWeight: 500,
              "& span": {
                color: "text.secondary",
              },
            }}
          >
            <strong>State: </strong>
            {currentState ? currentState.state : "unknown"}{" "}
            <span>
              (
              {currentState &&
                new Date(currentState.updatedAt).toLocaleString()}
              )
            </span>
          </Typography>
          {stateHistory.length > 1 && (
            <Box className={"state-history"}>
              <Timeline position={"left"} sx={{ p: 0 }}>
                {stateHistory
                  .slice(0)
                  .reverse()
                  .map(({ _id, state, createdAt }: any) => (
                    <CustomTimelineItem position={"left"} key={_id}>
                      <TimelineContent>
                        <Typography
                          sx={{
                            color: "text.primary",
                            fontWeight: 600,
                          }}
                        >
                          {state}
                        </Typography>
                        <Typography
                          sx={{ color: "text.secondary", fontSize: "0.813rem" }}
                        >
                          ({new Date(createdAt).toLocaleString()})
                        </Typography>
                      </TimelineContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={
                            state === "confirmed"
                              ? "success"
                              : state === "shipped"
                              ? "warning"
                              : state === "completed"
                              ? "primary"
                              : state === "cancelled"
                              ? "error"
                              : "grey"
                          }
                        />
                        <TimelineConnector />
                      </TimelineSeparator>
                    </CustomTimelineItem>
                  ))}
              </Timeline>
            </Box>
          )}
          {currentState && currentState.state === "pending" && (
            <Box sx={{ display: "flex", gap: "1.2rem", mt: 2 }}>
              <StateButton
                stateHandler={() => {
                  setLoading(true);
                  confirmHandler();
                }}
                bgcolor={"primary"}
                disabled={loading}
              >
                Confirm
              </StateButton>
              <StateButton
                stateHandler={() => {
                  setLoading(true);
                  cancelOrder();
                }}
                bgcolor={"error"}
                disabled={loading}
              >
                Reject
              </StateButton>
            </Box>
          )}
          {currentState && currentState.state === "confirmed" && (
            <Box sx={{ display: "flex", gap: "1.2rem", mt: 2 }}>
              <StateButton
                stateHandler={() => {
                  setLoading(true);
                  shipHandler();
                }}
                bgcolor={"primary"}
                disabled={loading}
              >
                Ship
              </StateButton>
              <StateButton
                stateHandler={() => {
                  setLoading(true);
                  cancelOrder();
                }}
                bgcolor={"error"}
                disabled={loading}
              >
                Reject
              </StateButton>
            </Box>
          )}
          {currentState && currentState.state === "shipped" && (
            <Box sx={{ display: "flex", gap: "1.2rem", mt: 2 }}>
              <StateButton
                stateHandler={() => {
                  setLoading(true);
                  completeOrder();
                }}
                bgcolor={"primary"}
                disabled={loading}
              >
                Complete order
              </StateButton>
            </Box>
          )}
        </Paper>
        <Paper
          className={"payment-info"}
          elevation={3}
          sx={{
            p: 2,
            borderRadius: "0.6rem",
            "& *": { fontSize: "0.875rem" },
            "& strong": { color: "text.primary" },
            width: "100%",
          }}
        >
          {paymentMethod && (
            <Box>
              <Typography>
                <strong>Payment method:</strong>{" "}
                <span>
                  {paymentMethod.method[0].toUpperCase() +
                    paymentMethod.method.slice(1, paymentMethod.method.length)}
                </span>
              </Typography>
              {paymentMethod.method === "stripe" && (
                <Box>
                  <Typography>
                    <strong>Brand:</strong>{" "}
                    <span>
                      {paymentMethod.details.brand[0].toUpperCase() +
                        paymentMethod.details.brand.slice(
                          1,
                          paymentMethod.details.brand.length
                        )}
                    </span>
                  </Typography>
                  <Typography>
                    <strong>Card:</strong>{" "}
                    <span>**** **** **** {paymentMethod.details.last4}</span>
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Box>
      <Paper
        className={"order-details"}
        elevation={3}
        sx={{
          mt: 3,
          p: 2,
          borderRadius: "0.6rem",
          "& *": { fontSize: "0.875rem" },
          "& strong": { color: "text.primary" },
          width: "100%",
        }}
      >
        <Stack divider={<Divider />} spacing={2}>
          {products &&
            products.map(
              (product: any, index: number) =>
                product && (
                  <Box
                    className={"product-container"}
                    sx={{ display: "flex", gap: "1.2rem" }}
                    key={product._id}
                  >
                    <Box className={"image-container"} sx={{ width: "100px" }}>
                      <img
                        src={product.product.images[0]}
                        alt={`${product.product.name} ${index}`}
                        style={{ width: "100%" }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <div className={"specs"}>
                        <Specs
                          variant={product.variant}
                          product={product.product}
                        />
                        {/* <Controls */}
                        {/*   cartProduct={product} */}
                        {/*   removeProduct={removeProduct} */}
                        {/*   setLoading={setLoading} */}
                        {/* /> */}
                      </div>
                      <div
                        className={"price-container"}
                        style={{ fontSize: "16px", fontWeight: 600 }}
                      >
                        ${product.product.price}
                      </div>
                    </Box>
                  </Box>
                )
            )}
        </Stack>
      </Paper>
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default withRouter(OrderDetails);
