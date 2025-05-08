import React from "react";
import { Link } from "react-router-dom";

const data = [
  {
    nomor_antrean: "A001",
    nama_pasien: "Alex",
    spesialis_dokter: "Jantung",
    nama_dokter: "Dokter A",
    jam_kunjungan: "09.00",
  },
  {
    nomor_antrean: "A001",
    nama_pasien: "Alex",
    spesialis_dokter: "Jantung",
    nama_dokter: "Dokter A",
    jam_kunjungan: "09.00",
  },
  {
    nomor_antrean: "A001",
    nama_pasien: "Alex",
    spesialis_dokter: "Jantung",
    nama_dokter: "Dokter A",
    jam_kunjungan: "09.00",
  },
];

const TabelHistori = () => {
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
            <th className="border px-4 py-2">Spesialis Dokter</th>
            <th className="border px-4 py-2">Nama Dokter</th>
            <th className="border px-4 py-2">Jam Kunjungan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.nomor_antrean} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{row.nomor_antrean}</td>
              <td className="border px-4 py-2">{row.nama_pasien}</td>
              <td className="border px-4 py-2">{row.nama_dokter}</td>
              <td className="border px-4 py-2">{row.jam_kunjungan}</td>
            </tr>
          ))}
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
