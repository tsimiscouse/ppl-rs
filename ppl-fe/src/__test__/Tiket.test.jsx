import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tiket from "../component/Tiket";
import { MemoryRouter } from "react-router-dom";

jest.mock("html2canvas", () => jest.fn());
jest.mock("jspdf", () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    getImageProperties: jest.fn(() => ({ width: 500, height: 500 })),
    internal: { pageSize: { getWidth: () => 210 } },
    save: jest.fn(),
  }));
});

describe("Ticket Component", () => {
  const mockProps = {
    nomor_antrean: "A001",
    nama_pasien: "John Doe",
    spesialis_dokter: "Cardiologist",
    nama_dokter: "Dr. Smith",
    jam_kunjungan: "11:00",
  };

  test("renders Tiket component with data", () => {
    render(
      <MemoryRouter>
        <Tiket {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByText("Nomor Antrean")).toBeInTheDocument();
    expect(screen.getByText("A001")).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Cardiologist/)).toBeInTheDocument();
    expect(screen.getByText(/Dr. Smith/)).toBeInTheDocument();
    expect(screen.getByText(/11:00/)).toBeInTheDocument();
  });

  test("clicking Export to PDF triggers html2canvas and jsPDF", async () => {
    const html2canvas = require("html2canvas");
    const jsPDF = require("jspdf");

    const fakeCanvas = document.createElement("canvas");
    fakeCanvas.toDataURL = jest.fn(() => "data:image/png;base64,test");
    html2canvas.mockResolvedValue(fakeCanvas);

    render(
      <MemoryRouter>
        <Tiket {...mockProps} />
      </MemoryRouter>
    );

    const exportButton = screen.getByText(/Export to PDF/i);
    fireEvent.click(exportButton);

    expect(html2canvas).toHaveBeenCalled();
    await new Promise((res) => setTimeout(res, 0));
    expect(jsPDF).toHaveBeenCalled();
  });
});
