import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom"; // HashRouter import
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <HashRouter>
    <App />
  </HashRouter>
);