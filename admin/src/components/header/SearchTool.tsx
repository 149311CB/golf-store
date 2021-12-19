import {
  alpha,
  Box,
  InputBase,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@iconify/icons-eva/search-fill";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { client } from "../../utils/client";
export const Search = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey.A200,
  "&:hover": {
    backgroundColor: theme.palette.grey.A100,
  },
  color: theme.palette.text.secondary,
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
  "&:focus": {
    color: theme.palette.text.primary,
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  fontSize: "13px",
}));

const fetchData = async (keyword: string) => {
  const { data } = await client.get(
    `/api/products/games/search?keyword=${keyword}`
  );
  return data;
};

const SearchMenu = () => {
  const [keyword, setKeyword] = useState<string | null>();
  const [results, setResults] = useState<any[] | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (keyword) {
      setVisible(true);
      fetchData(keyword).then((data: any) => {
        setResults(data);
      });
    }
  }, [keyword, setVisible]);
  return (
    <Box sx={{ position: "relative", maxWidth: "300px" }}>
      <Search>
        <SearchIconWrapper>
          <Icon icon={SearchIcon} width={25} height={25} />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
      </Search>
      {visible && (
        <Box
          // ref={ref}
          sx={{
            mt: "10px",
            right: 0,
            borderRadius: 1,
            // border: "1px solid blue",
            zIndex: 2,
            width: "max-content",
            maxWidth: "300px",
            position: "absolute",
            bgcolor: "common.black",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          }}
        >
          <Stack sx={{ display: "flex", flexDirection: "column" }}>
            {results &&
              results.map((result: any) => (
                <Link
                  key={result._id}
                  to={{
                    pathname: `/product/${result.name
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`,
                    state: { _id: result._id },
                  }}
                >
                  {/* <StackItem sx={{ p: 1, display: "flex", gap: "0.9rem" }}> */}
                  {/*   <Box */}
                  {/*     sx={{ */}
                  {/*       width: "50px", */}
                  {/*       border: "1px solid blue", */}
                  {/*     }} */}
                  {/*   > */}
                  {/*     <img */}
                  {/*       src={ */}
                  {/*         result.images?.find((image: any) => { */}
                  {/*           return image.type === "portrait"; */}
                  {/*         })?.url */}
                  {/*       } */}
                  {/*       style={{ width: "100%" }} */}
                  {/*       alt={result.name + "portrait"} */}
                  {/*     /> */}
                  {/*   </Box> */}
                  {/*   <Box sx={{ width: "100%" }}> */}
                  {/*     <Box sx={{ display: "flex" }}> */}
                  {/*       <Typography>{result.name}</Typography> */}
                  {/*       <Typography */}
                  {/*         sx={{ */}
                  {/*           fontSize: "0.625rem !important", */}
                  {/*           ml: 1, */}
                  {/*           p: "0.1rem 0.3rem", */}
                  {/*           bgcolor: "background.paper", */}
                  {/*           borderRadius: 1, */}
                  {/*           width: "max-content", */}
                  {/*         }} */}
                  {/*       > */}
                  {/*         {result.type} */}
                  {/*       </Typography> */}
                  {/*     </Box> */}
                  {/*     <Typography>${result.sale_price}</Typography> */}
                  {/*   </Box> */}
                  {/* </StackItem> */}
                </Link>
              ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default SearchMenu;
