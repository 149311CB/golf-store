import { AppBar, Box, Toolbar } from "@mui/material";
import { Icon } from "@iconify/react";
import BellFill from "@iconify/icons-eva/bell-fill";
import SearchTool from "./SearchTool";

const Header = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <AppBar
        position={"static"}
        sx={{
          padding:"0.6rem 0",
          bgcolor: "background.default",
          boxShadow: "none",
          borderBottom: "1px solid",
          // @ts-ignore
          borderColor: (theme) => theme.palette.grey[500_24],
        }}
      >
        <Toolbar sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1 }}>
            <SearchTool />
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: "0.6rem",
              display: "flex",
              alignItems: "center",
              gap: "0.9rem",
            }}
          >
            <Box sx={{ color: "text.secondary" }}>
              <Icon icon={BellFill} width={25} height={25} />
            </Box>
            <Box sx={{ width: "40px" }}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/avatar_default.jpg?alt=media&token=fee21f7a-40f5-4ec8-b772-1a542f0e822a"
                alt={"user-avatar"}
                style={{ width: "100%", borderRadius: "50%" }}
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
