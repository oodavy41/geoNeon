import "./index.html";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

let container = document.createElement("div");
document.body.appendChild(container);
ReactDOM.render(<App />, container);
