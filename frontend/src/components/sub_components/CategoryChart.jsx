import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CategoryChart = ({ categoryData }) => {
  if (!categoryData || Object.keys(categoryData).length === 0) return null;
  const data = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Amount",
        data: Object.values(categoryData),
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Spending by Category",
        font: { size: 20 },
      },
    },
  };
  return (
    <div className="mt-6 flex justify-center">
      {" "}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        {" "}
        <Pie data={data} options={options} />{" "}
      </div>{" "}
    </div>
  );
};

export default CategoryChart