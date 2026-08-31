"use client";

import { useState, useEffect } from "react";
import {
  FileDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
} from "lucide-react";
import TenantProfileModal from "./TenantProfileModal";

type TenantDirectoryEntry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  rent: number;
  room: string;
  joinedDate: string;
};

type TenantsTableProps = {
  initialData: TenantDirectoryEntry[];
};

type SortField = "name" | "room" | "joinedDate" | null;
type SortOrder = "asc" | "desc";

export default function TenantsTable({ initialData }: TenantsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenant, setSelectedTenant] =
    useState<TenantDirectoryEntry | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [initialData, statusFilter, sortField, sortOrder, searchTerm]);

  const processedData = initialData.filter((tenant) => {
    let matchesStatus = true;
    if (statusFilter === "Assigned") {
      matchesStatus = tenant.room !== "Unassigned";
    } else if (statusFilter === "Unassigned") {
      matchesStatus = tenant.room === "Unassigned";
    }

    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.includes(searchTerm) ||
      tenant.room.toString().toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (sortField) {
    processedData.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      if (sortField === "room") {
        return sortOrder === "asc"
          ? String(valueA).localeCompare(String(valueB), undefined, {
              numeric: true,
              sensitivity: "base",
            })
          : String(valueB).localeCompare(String(valueA), undefined, {
              numeric: true,
              sensitivity: "base",
            });
      }

      if (typeof valueA === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(String(valueB))
          : String(valueB).localeCompare(valueA);
      }

      return sortOrder === "asc"
        ? (valueA as unknown as number) - (valueB as unknown as number)
        : (valueB as unknown as number) - (valueA as unknown as number);
    });
  }

  const totalPages = Math.max(
    1,
    Math.ceil(processedData.length / ITEMS_PER_PAGE),
  );
  const paginatedData = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field)
      return (
        <ArrowUpDown
          size={14}
          className="ml-1 opacity-40 group-hover:opacity-100 transition-opacity"
        />
      );
    return sortOrder === "asc" ? (
      <ArrowUp size={14} className="ml-1 text-indigo-600" />
    ) : (
      <ArrowDown size={14} className="ml-1 text-indigo-600" />
    );
  };

  const getInitials = (name: string) => {
    if (!name) return "XX";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* TABLE SUB-HEADER ACTION ROW */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white gap-3">
        <h3 className="text-lg font-bold text-primary">All Tenants</h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* CONTEXTUAL SEARCH BAR */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Status Filter Input */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-600 w-full sm:w-auto justify-between">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <span className="sm:hidden font-medium">Filter by:</span>
            </div>
            <select
              className="bg-transparent font-medium focus:outline-none cursor-pointer pr-1 text-right sm:text-left"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Tenants</option>
              <option value="Assigned">Assigned to Room</option>
              <option value="Unassigned">Unassigned</option>
            </select>
          </div>

          <button className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-slate-800 px-3 py-2 rounded-md transition w-full sm:w-auto">
            <FileDown size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider select-none">
              <th
                className="p-4 pl-6 cursor-pointer group"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Tenant Details {renderSortIcon("name")}
                </div>
              </th>
              <th
                className="p-4 cursor-pointer group"
                onClick={() => handleSort("room")}
              >
                <div className="flex items-center">
                  Room {renderSortIcon("room")}
                </div>
              </th>
              <th className="p-4">Agreed Rent</th>
              <th
                className="p-4 cursor-pointer group"
                onClick={() => handleSort("joinedDate")}
              >
                <div className="flex items-center">
                  Joined Date {renderSortIcon("joinedDate")}
                </div>
              </th>
              <th className="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-gray-500 font-medium"
                >
                  No records matched your criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((tenant) => (
                <tr
                  key={tenant.id}
                  onClick={() => setSelectedTenant(tenant)}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {getInitials(tenant.name)}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 block">
                        {tenant.name}
                      </span>
                      <span className="text-xs text-gray-500 block font-medium mt-0.5">
                        {tenant.phone}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {tenant.room === "Unassigned" ? (
                      <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-semibold">
                        Unassigned
                      </span>
                    ) : (
                      <span className="font-medium text-gray-700">
                        {tenant.room}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    ₹{tenant.rent.toLocaleString("en-IN")}/mo
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                    {tenant.joinedDate}
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button
                      className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold 
                                hover:bg-gray-50 text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTenant(tenant);
                      }}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden flex flex-col min-h-[400px]">
        {paginatedData.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">
            No records matched your criteria.
          </div>
        ) : (
          paginatedData.map((tenant) => (
            <div
              key={tenant.id}
              onClick={() => setSelectedTenant(tenant)}
              className="p-4 border-b border-gray-100 flex flex-col gap-3 active:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {getInitials(tenant.name)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{tenant.name}</h4>
                    <p className="text-sm font-medium text-gray-500">
                      {tenant.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-1">
                <div className="flex flex-col gap-1">
                  {tenant.room === "Unassigned" ? (
                    <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                      Unassigned
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-gray-600">
                      Room: {tenant.room}
                    </span>
                  )}
                  <span className="text-xs font-medium text-gray-500">
                    Rent: ₹{tenant.rent.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  className="px-3 py-1.5 border border-gray-200 shadow-sm rounded-lg text-xs font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTenant(tenant);
                  }}
                >
                  Profile
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION FOOTER */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500 font-medium">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {processedData.length === 0
              ? 0
              : (currentPage - 1) * ITEMS_PER_PAGE + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-900">
            {Math.min(currentPage * ITEMS_PER_PAGE, processedData.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {processedData.length}
          </span>{" "}
          tenants
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center px-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* TENANT PROFILE MODAL */}
      {selectedTenant && (
        <TenantProfileModal
          tenant={selectedTenant}
          onClose={() => setSelectedTenant(null)}
        />
      )}
    </div>
  );
}
