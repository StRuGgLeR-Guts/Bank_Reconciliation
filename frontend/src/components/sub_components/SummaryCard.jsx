import React from 'react';

const SummaryCard = ({ title, value, colorClass = 'text-blue-400' }) => (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:-translate-y-2">
        <p className="text-lg font-medium text-gray-300">{title}</p>
        <p className={`text-5xl font-bold mt-2 ${colorClass}`}>{value}</p>
    </div>
);

export default SummaryCard;

