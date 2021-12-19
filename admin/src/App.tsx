import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import Login from "./auth/Login";
import palette from "./theme";
import Page from "./page/Page";
import { client } from "./utils/client";

const GlobalContext = createContext<any>(null);
function App() {
  const theme = React.useMemo(() => createTheme({ palette: palette }), []);
  const [token, setToken] = useState<string | null>(null);
  const getToken = async () => {
    const { data } = await client.get("/api/employee/auth/token/refresh", {
      credentials: "include",
    });
    setToken(data.data.token);
  };

  useEffect(() => {
    getToken();
    setTimeout(() => {
      getToken();
    }, 5 * 60 * 100);
  }, []);

  return (
    <Router>
      <GlobalContext.Provider value={{ token }}>
        <ThemeProvider theme={theme}>
          <Box sx={{ boxSizing: "border-box" }}>
            {token ? <Page /> : <Login />}
          </Box>
        </ThemeProvider>
      </GlobalContext.Provider>
    </Router>
  );
}

export default App;
