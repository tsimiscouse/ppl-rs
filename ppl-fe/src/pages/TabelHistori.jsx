"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// const data = [
//   {
//     nomor_antrean: "A001",
//     nama_pasien: "Alex",
//     spesialis_dokter: "Jantung",
//     nama_dokter: "Dokter A",
//     jam_kunjungan: "09.00",
//   },
//   {
//     nomor_antrean: "A001",
//     nama_pasien: "Alex",
//     spesialis_dokter: "Jantung",
//     nama_dokter: "Dokter A",
//     jam_kunjungan: "09.00",
//   },
//   {
//     nomor_antrean: "A001",
//     nama_pasien: "Alex",
//     spesialis_dokter: "Jantung",
//     nama_dokter: "Dokter A",
//     jam_kunjungan: "09.00",
//   },
// ];

const TabelHistori = () => {
  const [dataPasien, setDataPasien] = useState([]);

  useEffect(() => {
    const fetchDataPasien = async () => {
      try {
        const response = await axios.get("/api/patient-queues");
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
          {Array.isArray(dataPasien) && dataPasien.length > 0 ? (
            dataPasien.map((item, index) => (
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
