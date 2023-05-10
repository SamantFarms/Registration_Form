import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Registration from "./Components/Registration";
import "../node_modules/bootstrap/dist/css/bootstrap.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Registration />
      </div>
    </BrowserRouter>
  );
}
