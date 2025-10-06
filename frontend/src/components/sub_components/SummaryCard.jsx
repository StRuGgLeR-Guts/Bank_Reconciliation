import React from 'react';
const SummaryCard = ({ title, value, colorClass = "text-blue-600" }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
    {" "}
    <p className="text-lg font-medium text-gray-500">{title}</p>{" "}
    <p className={`text-5xl font-bold mt-2 ${colorClass}`}>{value}</p>{" "}
  </div>
);
export default SummaryCard