"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TabelHistori = () => {
  const [dataPasien, setDataPasien] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchDataPasien = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/patient-queues"
        );
        setDataPasien(response.data.data);
        console.log(
          "Patient queue data:",
          response?.data.data || "No Data Available"
        );
      } catch (error) {
        console.error("Error fetching patient queue:", error);
      }
    };

    fetchDataPasien();
  }, []);

  const totalPages = Math.ceil((dataPasien?.length || 0) / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedData = dataPasien.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-screen h-screen relative flex flex-col justify-center items-center">
      <h1 className="font-bold text-7xl mb-6">Hospital System</h1>
      <h1 className="text-2xl text-gray-500 mb-6">
        Pengujian Perangkat Lunak 2025
      </h1>
      <table className="w-2/3 bg-white border border-gray-300">
        <thead className="bg-gray-100 text-center">
          <tr>
            <th className="border px-4 py-2">Nomor Antrean</th>
            <th className="border px-4 py-2">Nama Pasien</th>
            {/* <th className="border px-4 py-2">Spesialis Dokter</th> */}
            <th className="border px-4 py-2">Nama Dokter</th>
            <th className="border px-4 py-2">Jam Kunjungan</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.queue_number}</td>
                <td className="border px-4 py-2">{item.patient_name}</td>
                <td className="border px-4 py-2">{item.doctor?.name}</td>
                <td className="border px-4 py-2">
                  {item.visitTime?.formatted_time || "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center px-4 py-6">
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled::opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === i + 1 ? "bg-gray-200 font-bold" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      <div className="w-full flex items-center justify-center mt-3">
        <div className="w-2/3 flex items-center justify-evenly">
          <Link to="/" className="p-2 border border-black rounded-md">
            Tutup History Antrean
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TabelHistori;
