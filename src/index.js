import React from "react";
import ReactDOM from "react-dom";
// require("dotenv").config();
import "./styles/index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <div className="area">
      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
