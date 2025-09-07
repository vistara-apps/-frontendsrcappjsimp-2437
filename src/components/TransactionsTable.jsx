import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const TransactionsTable = ({ transactions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;

  const filteredTransactions = transactions.filter(tx =>
    tx.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Recent Transactions
          </h3>
          <p className="text-sm text-gray-600">
            Latest customer transactions and payments
          </p>
        </div>
        <div className="mt-3 sm:mt-0 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm w-full sm:w-64"
          />
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden space-y-3">
        {paginatedTransactions.map(tx => (
          <div key={tx.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-900">{tx.customer}</p>
                <p className="text-sm text-gray-500">ID: {tx.id}</p>
              </div>
              <span className="font-semibold text-green-600">${tx.amount}</span>
            </div>
            <p className="text-sm text-gray-600">{tx.date}</p>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map(tx => (
              <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                <td className="py-3 px-4 text-gray-600">#{tx.id}</td>
                <td className="py-3 px-4 font-medium text-gray-900">{tx.customer}</td>
                <td className="py-3 px-4 font-semibold text-green-600">${tx.amount}</td>
                <td className="py-3 px-4 text-gray-600">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;