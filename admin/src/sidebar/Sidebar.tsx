import { Box, Stack, styled, Typography, BoxProps, alpha } from "@mui/material";
import { Icon } from "@iconify/react";
import React from "react";
import { SxProps } from "@mui/material";
import PieChart2Fill from "@iconify/icons-eva/pie-chart-2-fill";
import PeopleFill from "@iconify/icons-eva/people-fill";
import CubeFill from "@iconify/icons-eva/cube-fill";
import ShoppingBagFill from "@iconify/icons-eva/shopping-bag-fill";
import { Link, useLocation } from "react-router-dom";

const SidebarNav = styled((props: BoxProps & { isActive?: boolean }) => (
  <Box {...props} />
))(({ theme, isActive }) => ({
  display: "flex",
  gap: "0.3rem",
  cursor: "pointer",
  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
  alignItems: "center",
  padding: "0.9rem 1.2rem",
  position: "relative",
  backgroundColor: isActive ? alpha(theme.palette.primary.light, 0.08) : "none",
  transition: "background 150ms ease-in-out",
  "& p": {
    fontSize: "0.875rem",
    fontWeight: 600,
    pt: "2px",
  },
  "& span": {
    display: "flex",
    alignItems: "center",
  },
  "&::before": isActive && {
    content: "''",
    position: "absolute",
    width: "3px",
    top: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: "0.3rem",
    borderBottomLeftRadius: "0.3rem",
    backgroundColor: theme.palette.primary.main,
  },
  "&:hover": {
    // @ts-ignore
    backgroundColor: theme.palette.grey[500_8],
  },
}));

const Sidebar: React.FC<{ sx?: SxProps }> = ({ sx }) => {
  const { pathname } = useLocation();
  return (
    <Box
      sx={{
        ...sx,
        borderRight: "1px solid ",
        // @ts-ignore
        borderColor: (theme) => theme.palette.grey[500_24],
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
      }}
    >
      <Box
        sx={{
          p: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}
      >
        <Box sx={{ width: "50px" }}>
          <img
            src={"https://minimal-kit-react.vercel.app/static/logo.svg"}
            alt={"logo"}
            style={{ width: "100%" }}
          />
        </Box>
        <Box sx={{ p: 2, borderRadius: "0.6rem", backgroundColor: "grey.100" }}>
          <Box sx={{ width: "50px" }}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/avatar_default.jpg?alt=media&token=fee21f7a-40f5-4ec8-b772-1a542f0e822a"
              alt={"user-avatar"}
              style={{ width: "100%", borderRadius: "50%" }}
            />
          </Box>
        </Box>
      </Box>
      <Stack>
        <Link to={"/dashboard"} style={{ textDecoration: "none" }}>
          <SidebarNav isActive={pathname.includes("/dashboard")}>
            <span>
              <Icon icon={PieChart2Fill} width={22} height={22} />
            </span>
            <Typography>Dashboard</Typography>
          </SidebarNav>
        </Link>
        <Link to={"/users"} style={{ textDecoration: "none" }}>
          <SidebarNav isActive={pathname.includes("/users")}>
            <span>
              <Icon icon={PeopleFill} width={22} height={22} />
            </span>
            <Typography>Users</Typography>
          </SidebarNav>
        </Link>
        <Link to={"/products"} style={{ textDecoration: "none" }}>
          <SidebarNav isActive={pathname.includes("/products")}>
            <span>
              <Icon icon={CubeFill} width={22} height={22} />
            </span>
            <Typography>Products</Typography>
          </SidebarNav>
        </Link>
        <Link to={"/orders"} style={{ textDecoration: "none" }}>
          <SidebarNav isActive={pathname.includes("/orders")}>
            <span>
              <Icon icon={ShoppingBagFill} width={22} height={22} />
            </span>
            <Typography>Orders</Typography>
          </SidebarNav>
        </Link>
      </Stack>
    </Box>
  );
};

export default Sidebar;
