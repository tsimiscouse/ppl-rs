"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Tiket from "../component/Tiket";

const Pendaftaran = () => {
  const [daftarAntrean, setDaftarAntrean] = useState(false);
  const [nama, setNama] = useState("");
  const [spesialis, setSpesialis] = useState("");
  const [spesialisOptions, setSpesialisOptions] = useState([]);
  const [dokter, setDokter] = useState(null);
  const [dokterOptions, setDokterOptions] = useState([]);
  const [jam, setJam] = useState({ id: "", time: "" });
  const [availJam, setAvailJam] = useState([]);
  const [tiketData, setTiketData] = useState(null);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/doctors/specializations"
        );
        const specializations =
          response.data.data?.map((item) => item.specialization) || [];
        setSpesialisOptions(specializations);
        console.log(response?.data.data || "No Data Available");
      } catch (error) {
        console.error("Error Fetching Specializations:", error);
      }
    };

    fetchSpecializations();
  }, []);

  useEffect(() => {
    if (!spesialis) return;

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/doctors/specialization/${spesialis}`
        );
        setDokterOptions(response.data.data);
        setDokter("");
        console.log(response?.data.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [spesialis]);

  useEffect(() => {
    if (!dokter) return;

    const fetchAvailTime = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/time-slots/available/${dokter?.id}`
        );
        console.log(response.data.data);
        setAvailJam(response.data.data);
        // setJam("");
      } catch (error) {
        console.error("Error fetching time:", error);
      }
    };

    fetchAvailTime();
  }, [dokter]);

  // function generateQueueNumber() {
  //   const alphabet = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // 'A' to 'Z'
  //   const number = String(Math.floor(Math.random() * 100)).padStart(3, "0"); // '00' to '99'
  //   return alphabet + number;
  // }

  const handleDaftarAntrean = async (body) => {
    if (!nama || !spesialis || !dokter || !jam) {
      alert("Semua input harus diisi terlebih dahulu!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/patient-queues",
        body
      );

      const rawData = response?.data.data;
      const time = new Date(
        rawData.visitTime.time_slot.replace("Z", "")
      ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const newData = {
        ...rawData,
        jam_kunjungan: time,
      };
      setTiketData(newData);
      setDaftarAntrean(true);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error post data:", error);
    }
  };

  return (
    <div className="w-screen h-screen relative flex flex-col justify-center items-center">
      <h1 className="font-bold text-7xl mb-6">Hospital System</h1>
      <h1 className="text-2xl text-gray-500 mb-6">
        Pengujian Perangkat Lunak 2025
      </h1>
      <form action="" className="w-1/2">
        <div className="flex flex-col mb-4">
          <label htmlFor="Nama">Nama</label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            type="text"
            placeholder="Insert nama anda di sini"
            className="w-full border-gray-400 border rounded-md p-1"
            required
            id="Nama"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="Spesialis Dokter">Spesialis Dokter</label>
          <select
            value={spesialis}
            onChange={(e) => setSpesialis(e.target.value)}
            placeholder="Pilih dokter yang anda inginkan di sini"
            className="w-full border-gray-400 border rounded-md p-1"
            required
            id="Spesialis Dokter"
          >
            <option value="" disabled>
              Pilih spesialis dokter
            </option>
            {spesialisOptions.map((spec, index) => (
              <option value={spec} key={index}>
                {spec}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="Nama Dokter">Nama Dokter</label>
          <select
            value={dokter?.id || ""}
            onChange={(e) => {
              const selectedDoctor = dokterOptions.find(
                (d) => d.id === parseInt(e.target.value)
              );
              setDokter(selectedDoctor);
            }}
            placeholder="Pilih dokter yang anda inginkan di sini"
            className="w-full border-gray-400 border rounded-md p-1"
            required
            id="Nama Dokter"
          >
            <option value="" disabled>
              Pilih dokter
            </option>
            {dokterOptions.map((d) => (
              <option value={d.id} key={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="Jam Kunjungan">Jam Kunjungan</label>
          <select
            value={jam.id}
            onChange={(e) => {
              const selected = availJam.find(
                (j) => j.id === parseInt(e.target.value)
              );
              const formatted = new Date(
                selected.time_slot.replace("Z", "")
              ).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
              setJam({ id: selected.id, time: formatted });
            }}
            placeholder="Pilih dokter yang anda inginkan di sini"
            className="w-full border-gray-400 border rounded-md p-1"
            required
            id="Jam Kunjungan"
          >
            <option value="" disabled>
              Pilih jam kunjungan
            </option>
            {availJam.map((slot) => {
              const formattedTime = new Date(
                slot.time_slot.replace("Z", "")
              ).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              return (
                <option value={slot.id} key={slot.id}>
                  {formattedTime}
                </option>
              );
            })}
          </select>
        </div>
        <div className="w-full flex items-center justify-center mt-3">
          <div className="w-2/3 flex items-center justify-evenly">
            <button
              type="button"
              className="p-2 bg-black rounded-md text-white"
              onClick={() =>
                handleDaftarAntrean({
                  patient_name: nama,
                  doctor_id: dokter?.id,
                  visit_time_id: jam?.id,
                })
              }
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
      {daftarAntrean && tiketData && (
        <div
          data-testid="tiket-modal"
          id="tiket-modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <Tiket
            nomor_antrean={tiketData.queue_number}
            nama_pasien={tiketData.patient_name}
            spesialis_dokter={tiketData.doctor?.specialization}
            nama_dokter={tiketData.doctor?.name}
            jam_kunjungan={tiketData.visitTime?.formatted_time}
          />
        </div>
      )}
    </div>
  );
};

export default Pendaftaran;
