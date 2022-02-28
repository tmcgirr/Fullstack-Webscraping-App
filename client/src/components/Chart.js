import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Average Gas Price Line Chart",
    },
  },
};

function avg(array) {
  let total = 0;
  let count = 0;

  array.forEach(function (item, index) {
    total += item;
    count++;
  });

  return total / count;
}

export default function Chart() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const labelsUnsorted = [...new Set(items.map((item) => item.date))];
  const labels = labelsUnsorted.sort();

  let tempdata = [];
  let regDataSet = [];
  let midDataSet = [];
  let premDataSet = [];
  let dieDataSet = [];

  const gasFunc = (type, date) => {
    items
      .filter((item) => item.gas_type === type && item.date === date)
      .map((item) => tempdata.push(item.gas_price));
    // dataSet.push(dataSetStart.map((item) => +item).sort()[0]); // Get min value
    if (type === "Regular") {
      regDataSet.push(avg(tempdata.map((item) => +item)).toFixed(2)); // Get avg value
    } else if (type === "Mid-Grade") {
      midDataSet.push(avg(tempdata.map((item) => +item)).toFixed(2)); // Get avg value
    } else if (type === "Premium") {
      premDataSet.push(avg(tempdata.map((item) => +item)).toFixed(2)); // Get avg value
    } else if (type === "Diesel") {
      dieDataSet.push(avg(tempdata.map((item) => +item)).toFixed(2)); // Get avg value
    }
    // Clear temp data to be reused
    tempdata = [];
  };

  const runGasFunc = (type) => {
    labels.forEach((Date) => gasFunc(type, Date));
  };

  runGasFunc("Regular");
  runGasFunc("Mid-Grade");
  runGasFunc("Premium");
  runGasFunc("Diesel");

  const data = {
    labels,
    datasets: [
      {
        label: "Regular",
        data: regDataSet,
        borderColor: "rgb(0, 99, 132)",
        backgroundColor: "rgba(0, 99, 132, 0.5)",
      },
      {
        label: "Mid-Grade",
        data: midDataSet,
        borderColor: "rgb(100, 162, 235)",
        backgroundColor: "rgba(100, 162, 235, 0.5)",
      },
      {
        label: "Premium",
        data: premDataSet,
        borderColor: "rgb(200, 99, 132)",
        backgroundColor: "rgba(200, 99, 132, 0.5)",
      },
      {
        label: "Diesel",
        data: dieDataSet,
        borderColor: "rgb(300, 162, 235)",
        backgroundColor: "rgba(300, 162, 235, 0.5)",
      },
    ],
  };

  // Fetch data from DB and set items
  useEffect(() => {
    fetch("http://localhost:5000/gasInfo")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  return <Line options={options} data={data} />;
}
