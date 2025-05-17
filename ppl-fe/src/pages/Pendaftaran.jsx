"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Tiket from "../component/Tiket";

const Pendaftaran = () => {
  const [daftarAntrean, setDaftarAntrean] = useState(false);
  const [nama, setNama] = useState("");
  const [spesialis, setSpesialis] = useState("");
  const [dokter, setDokter] = useState("");
  const [jam, setJam] = useState("");

  function generateQueueNumber() {
    const alphabet = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // 'A' to 'Z'
    const number = String(Math.floor(Math.random() * 100)).padStart(3, "0"); // '00' to '99'
    return alphabet + number;
  }

  const handleDaftarAntrean = () => {
    if (!nama || !spesialis || !dokter || !jam) {
      alert("Semua input harus diisi terlebih dahulu!");
      return;
    }
    setDaftarAntrean(true);
  };

  return (
    <div className="w-screen h-screen relative flex flex-col justify-center items-center">
      <h1 className="font-bold text-7xl mb-6">Hospital System</h1>
      <h1 className="text-2xl text-gray-500 mb-6">
        Pengujian Perangkat Lunak 2025
      </h1>
      <form action="" className="w-1/2">
        <div className="flex flex-col mb-4">
          <label htmlFor="">Nama</label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            type="text"
            placeholder="Insert nama anda di sini"
            className="w-full border-gray-400 border rounded-md p-1"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="">Spesialis Dokter</label>
          <select
            value={spesialis}
            onChange={(e) => setSpesialis(e.target.value)}
            placeholder="Pilih dokter yang anda inginkan di sini"
            className="w-full border-gray-400 border rounded-md p-1"
            required
          >
            <option value="" disabled>
              Pilih spesialis dokter
            </option>
            <option value="Jantung">Jantung</option>
            <option value="Paru-Paru">Paru-Paru</option>
            <option value="Saraf">Saraf</option>
          </select>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="">Nama Dokter</label>
          <select
            value={dokter}
            onChange={(e) => setDokter(e.target.value)}
            placeholder="Pilih dokter yang anda inginkan di sini"
            className="w-full border-gray-400 border rounded-md p-1"
            required
          >
            <option value="" disabled>
              Pilih dokter
            </option>
            <option value="Dokter A">Dokter A</option>
            <option value="Dokter B">Dokter B</option>
            <option value="Dokter C">Dokter C</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Jam Kunjungan</label>
          <select
            value={jam}
            onChange={(e) => setJam(e.target.value)}
            placeholder="Pilih dokter yang anda inginkan di sini"
            className="w-full border-gray-400 border rounded-md p-1"
            required
          >
            <option value="" disabled>
              Pilih jam kunjungan
            </option>
            <option value="07:00">07:00</option>
            <option value="09:00">09:00</option>
            <option value="11:00">11:00</option>
            <option value="14:00">14:00</option>
            <option value="16:00">16:00</option>
          </select>
        </div>
        <div className="w-full flex items-center justify-center mt-3">
          <div className="w-2/3 flex items-center justify-evenly">
            <button
              type="button"
              className="p-2 bg-black rounded-md text-white"
              onClick={handleDaftarAntrean}
            >
              Daftar Antrean
            </button>
            <Link
              to="/TabelHistori"
              className="p-2 border border-black rounded-md"
            >
              Cek History Antrean
            </Link>
          </div>
        </div>
      </form>
      {daftarAntrean && (
        <div
          id="tiket-modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <Tiket
            nomor_antrean={generateQueueNumber()}
            nama_pasien={nama}
            spesialis_dokter={spesialis}
            nama_dokter={dokter}
            jam_kunjungan={jam}
          />
        </div>
      )}
    </div>
  );
};

export default Pendaftaran;
