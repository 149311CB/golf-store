import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import Honeybadger from "@honeybadger-io/js";
import ErrorBoundary from "@honeybadger-io/react";

Honeybadger.configure({
  apiKey: "hbp_CwMlthQerhHfxzNM6C1QThmjHRkmTU1vj8Na",
  environment: "production",
});

ReactDOM.render(
  <ErrorBoundary honeybadger={Honeybadger}>
    <App />
  </ErrorBoundary>,
  document.getElementById("root")
);
