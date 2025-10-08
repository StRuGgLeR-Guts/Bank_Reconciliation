import React, { useState } from 'react';

const TransactionsTable = ({ title, data, columns }) => {
    // --- State for pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; 

    if (!data || data.length === 0) return null;

    // --- Logic to calculate which data to show ---
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
                {data.length > rowsPerPage && (
                     <span className="text-sm text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/20">
                            <th className="p-3 font-medium text-gray-200 w-12 text-center">#</th>
                            {columns.map(col => <th key={col.key} className="p-3 font-medium text-gray-200">{col.header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row, index) => (
                            <tr 
                                key={index} 
                                className="border-b border-white/10 hover:bg-white/20 transition-colors duration-200"
                            >
                                <td className="p-3 text-center font-medium text-gray-300">{indexOfFirstRow + index + 1}</td>
                                {columns.map(col => (
                                    <td key={`${col.key}-${index}`} className="p-3 text-gray-200">{row[col.key] !== undefined ? row[col.key] : 'N/A'}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {data.length > rowsPerPage && (
                <div className="mt-4 flex justify-end items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white/20 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30"
                    >
                        Previous
                    </button>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white/20 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionsTable;

