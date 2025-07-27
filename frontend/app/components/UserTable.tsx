import React from "react";
import { User } from "../types";
import { formatAddress } from "../lib/formatters";
import { useRouter } from "next/navigation";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";

import LoadingSpinner from "./LoadingSpinner";

interface UserTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSort: (key: keyof User) => void;
  sortKey: keyof User;
  sortOrder: "asc" | "desc";
  isLoading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onSort,
  isLoading,
}) => {
  const router = useRouter();

  const getPaginationPages = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > maxPagesToShow - 2) {
        pages.push("...");
      }

      let startPage = Math.max(
        2,
        currentPage - Math.floor(maxPagesToShow / 2) + 1
      );
      let endPage = Math.min(
        totalPages - 1,
        currentPage + Math.floor(maxPagesToShow / 2) - 1
      );

      if (currentPage <= Math.floor(maxPagesToShow / 2) + 1) {
        startPage = 2;
        endPage = maxPagesToShow - 1;
      }
      if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
        startPage = totalPages - maxPagesToShow + 2;
        endPage = totalPages - 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - (maxPagesToShow - 2)) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    return pages.filter((value, index, self) => self.indexOf(value) === index);
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer select-none"
                onClick={() => onSort("name")}
              >
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">
                Email Address
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-600"
                style={{ width: "500px", minWidth: "280px" }}
              >
                Address
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td className="px-6 py-4 text-center" colSpan={3}>
                  <LoadingSpinner />
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/users/${user.id}/posts?name=${encodeURIComponent(
                        user.name
                      )}&email=${encodeURIComponent(user.email)}`
                    )
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-600 truncate"
                    style={{ maxWidth: "392px" }}
                  >
                    {formatAddress(user.address)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex lg:justify-end">
          <div className="flex items-center justify-center space-x-2 py-4 px-6 border-t border-gray-200">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-600  hover:bg-gray-100 text-sm font-semibold rounded-full  disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <BsArrowLeft className="mr-2 text-lg" /> Previous
            </button>

            <div className="flex space-x-2">
              {getPaginationPages().map((pageNumber, index) =>
                typeof pageNumber === "string" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-1 text-gray-500"
                  >
                    {pageNumber}
                  </span>
                ) : (
                  <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber as number)}
                    className={`
                                        px-3 py-1 rounded-md text-sm font-medium cursor-pointer
                                        ${
                                          currentPage === pageNumber
                                            ? "bg-[#F9F5FF] text-[#7F56D9]"
                                            : "bg-white text-gray-700 hover:bg-gray-100  "
                                        }
                                        transition-colors duration-200
                                    `}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:bg-gray-100 text-sm font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              Next <BsArrowRight className="ml-2 text-lg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
