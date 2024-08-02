import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

import "./chart-styles.css";

const options = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        usePointStyle: true,
      },
    },
  },
};

export function PieChart({ data }) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  function transformData(data) {
    console.log("data: ", data);
    const labels = Object.keys(data);
    const values = Object.values(data);

    return {
      labels,
      datasets: [
        {
          data: values,

          backgroundColor: [
            "red",
            "green",
            "blue",
            "yellow",
            "purple",
            "orange",
            "pink",

            // "#FF6384",
            // "#36A2EB",
            // "#FFCE56",
            // "#FF6384",
            // "#36A2EB",
            // "#FFCE56",
            // "#FF6384",
            // documentStyle.getPropertyValue("--blue-500"),
            // documentStyle.getPropertyValue("--yellow-500"),
            // documentStyle.getPropertyValue("--green-500"),
          ],

          hoverBackgroundColor: [
            "red",
            "green",
            "blue",
            "yellow",
            "purple",
            "orange",
            "pink",
            // "#FF63F4",
            // "#36A2FB",
            // "#FFCEF6",
            // "#FF63F4",
            // "#36A2FB",
            // "#FFCEF6",
            // "#FF63F4",
            // documentStyle.getPropertyValue("--blue-400"),
            // documentStyle.getPropertyValue("--yellow-400"),
            // documentStyle.getPropertyValue("--green-400"),
          ],
        },
      ],
    };
  }

  useEffect(() => {
    const transformedData = transformData(data);
    // const documentStyle = getComputedStyle(document.documentElement);

    setChartData(transformedData);
    setChartOptions(options);
  }, [data]);

  return (
    <div className="chart-wrapper">
      <Chart type="pie" data={chartData} options={chartOptions} className="chart" />
    </div>
  );
}
