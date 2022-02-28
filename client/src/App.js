import "./App.css";
import React from "react";

import DataOutput from "./components/DataOutput";
import Chart from "./components/Chart";

export default function App() {
  return (
    <div>
      <Chart />
      <DataOutput />
    </div>
  );
}
