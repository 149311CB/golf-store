import {
  alpha,
  Box,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  styled,
  TextField,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import React, { useEffect, useState } from "react";
import { client } from "../utils/client";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const Variant: React.FC<{ variant: any }> = ({ variant }) => {
  const [flexAnchor, setFlexAnchor] = useState<null | HTMLElement>(null);
  const [flexs, setFlexs] = useState<any[]>([]);
  const [flex, setFlex] = useState<string>(variant.flex._id);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client.get("/api/products/flex/all");
      setFlexs(data.data);
    };
    fetchData();
  }, []);
  return (
    <Box>
      <Box>
        <TextField
          id="outlined-basic"
          label="Flex"
          variant="outlined"
          value={variant.flex.type}
          type={"text"}
          onChange={(e) => {
            // setPrice(parseInt(e.target.value));
          }}
          size={"small"}
        />
        <IconButton
          onClick={(e) => {
            setFlexAnchor(e.currentTarget);
          }}
        >
          <ExpandMoreRoundedIcon />
        </IconButton>
        <StyledMenu
          id="flex-dropdown"
          anchorEl={flexAnchor}
          open={Boolean(flexAnchor)}
          onClose={() => setFlexAnchor(null)}
        >
          {flexs.map((flex: any) => (
            <MenuItem
              onClick={() => {
                setFlexAnchor(null);
              }}
            >
              {flex.type}
            </MenuItem>
          ))}
        </StyledMenu>
      </Box>
      <Box></Box>
    </Box>
  );
};

export default Variant;
