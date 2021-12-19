import {
  Box,
  Button,
  Checkbox,
  darken,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { client } from "../utils/client";

const Login = () => {
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const { status } = await client.post(
      "/api/employee/auth/login",
      {
        email: "xstk2000@gmail.com",
        password: "Godislove@2000",
      },
      {
        credentials: "include",
      }
    );

    if (status === 200) {
      window.location.href = "/dashboard";
    }
  };
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box
        sx={{
          border: "1px solid red",
          width: "35%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "1.2rem",
        }}
      >
        <Box
          sx={{
            borderRadius: "0.6rem",
            height: "90%",
            boxShadow:
              "rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 16px 32px -4px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "0.9rem",
          }}
        >
          <Box sx={{ width: "50px" }}>
            <img
              src={"https://minimal-kit-react.vercel.app/static/logo.svg"}
              alt={"logo"}
              style={{ width: "100%", marginLeft: "40px" }}
            />
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "2rem",
              fontFamily: "'Public Sans', sans-serif",
              color: "text.primary",
              pl: 5,
            }}
          >
            Hi, Welcome back
          </Typography>
          <img
            src="https://minimal-kit-react.vercel.app/static/illustrations/illustration_login.png"
            alt={"login-illu"}
          />
        </Box>
      </Box>
      <Box
        className={"login-main-menu"}
        sx={{
          border: "1px solid blue",
          width: "65%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "50%",
            "& *": { fontFamily: "'Public Sans', sans-serif" },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1.5rem",
                fontFamily: "'Public Sans', sans-serif",
                color: "text.primary",
                mb: 1,
              }}
            >
              Sign in to admin portal
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 3 }}>
              Enter your details below
            </Typography>
          </Box>
          <Box
            component={"form"}
            sx={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
            onSubmit={submitHandler}
          >
            <TextField
              required
              type={"email"}
              id="outlined-required"
              label="Email"
            />
            <TextField
              required
              type={"password"}
              id="outlined-required"
              label="Password"
            />
            <Box
              sx={{
                position: "relative",
                border: "1px solid purple",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                "& *": { fontFamily: "'Public Sans', sans-serif" },
              }}
            >
              <FormGroup
                sx={{
                  "& span": { color: "text.primary" },
                }}
              >
                <FormControlLabel control={<Checkbox />} label="Remember me" />
              </FormGroup>
              <Link to={"/reset-password"} style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    color: "primary.main",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                  }}
                >
                  Forgot password?
                </Typography>
              </Link>
            </Box>
            <Button
              type={"submit"}
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontWeight: "900",
                p: "0.9rem 0",
                borderRadius: "0.6rem",
                textTransform: "none",
                fontFamily: "'Public Sans', sans-serif",
                "&:hover": {
                  bgcolor: (theme) => darken(theme.palette.primary.main, 0.3),
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
