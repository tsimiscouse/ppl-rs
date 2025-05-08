import React, { useRef } from "react";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";

const Tiket = ({
  nomor_antrean,
  nama_pasien,
  spesialis_dokter,
  nama_dokter,
  jam_kunjungan,
}) => {
  const contentRef = useRef();

  const handleExport = () => {
    const input = contentRef.current;

    // Hide buttons before capture
    const buttons = input.querySelectorAll(".no-print");
    buttons.forEach((btn) => (btn.style.display = "none"));

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("TiketAntrian.pdf");

      // Show buttons again
      buttons.forEach((btn) => (btn.style.display = "inline-block"));
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      <div
        ref={contentRef}
        className="w-1/3 h-auto p-4 flex flex-col items-center justify-center border bg-white shadow-lg rounded"
      >
        <h1 className="text-2xl font-bold">Nomor Antrean</h1>
        <h1 className="text-4xl font-bold">{nomor_antrean}</h1>
        <h1>Nama Pasien: {nama_pasien}</h1>
        <h1>Nama Pasien: {spesialis_dokter}</h1>
        <h1>Nama Dokter: {nama_dokter}</h1>
        <h1>Jam Kunjungan: {jam_kunjungan}</h1>

        <div className="flex items-center justify-center gap-2 mt-3">
          <Link
            to="/TabelHistori"
            className="no-print p-2 border rounded-md bg-black text-white"
          >
            Lanjutkan
          </Link>
          <button
            onClick={handleExport}
            type="button"
            className="no-print p-2 border rounded-md border-black"
          >
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tiket;
