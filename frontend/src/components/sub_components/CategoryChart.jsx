import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CategoryChart = ({ categoryData }) => {
  //Gsap animation
  useGSAP(() => {
    gsap.to(".pie", {
      scale: 1.1,
      scrollTrigger: {
        trigger: ".pie",
        start: "top 53%",
        end: "bottom bottom",
        scrub: 2,
      },
      ease: "power1.inOut",
    });
  }, []);

  if (!categoryData || Object.keys(categoryData).length === 0) return null;

  const data = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Amount",
        data: Object.values(categoryData),
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)", // Blue
          "rgba(239, 68, 68, 0.7)", // Red
          "rgba(245, 158, 11, 0.7)", // Amber
          "rgba(16, 185, 129, 0.7)", // Emerald
          "rgba(139, 92, 246, 0.7)", // Violet
          "rgba(249, 115, 22, 0.7)", // Orange
        ],
        borderColor: "#111827", // A dark border for contrast
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#D1D5DB",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Spending by Category",
        font: { size: 20 },
        color: "#FFFFFF",
      },
    },
  };

  return (
    <div className="mt-8 pie">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default CategoryChart;
