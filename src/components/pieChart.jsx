import React, { useState, useEffect } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Typography } from "@mui/material";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/DataSaverOffOutlined";
import * as TransactionAPI from "../api/transactionApi";
import "../index.css";

const PieCharts = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    TransactionAPI.getAll()
      .then((res) => res.records)
      .then((transactions) => {
        setSalesData(transactions);
      })
      .catch((error) => console.error("Error fetching sales data:", error));
  }, []);

  const productNames = ["CPO", "PKO", "TBS"];
  const othersName = "Other";

  // Menggabungkan "TBS Internal" dan "TBS Eksternal" menjadi "TBS"
  const combinedTBSCount = salesData.filter(
    (transaction) =>
      transaction.productName === "TBS Internal" ||
      transaction.productName === "TBS Eksternal"
  ).length;

  const productCount = {};
  productNames.forEach((productName) => {
    if (productName === "TBS") {
      productCount[productName] = combinedTBSCount;
    } else {
      productCount[productName] = salesData.filter(
        (transaction) => transaction.productName === productName
      ).length;
    }
  });

  const othersCount =
    salesData.length -
    productNames.reduce(
      (sum, productName) => sum + productCount[productName],
      0
    );

  const pieChartData = [...productNames, othersName].map((productName) => {
    return {
      name: productName === othersName ? "Other" : productName,
      value:
        productName === othersName ? othersCount : productCount[productName],
      fill:
        productName === "CPO"
          ? "#0B63F6"
          : productName === "PKO"
          ? "#33cc33"
          : productName === "TBS"
          ? "#ffc107"
          : "#f44336",
    };
  });

  return (
    <>
      <div className="areaChart">
        <div className="chart mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Legend iconType="square" />
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(2)}%`
                }
                labelLine={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};


export default PieCharts;
