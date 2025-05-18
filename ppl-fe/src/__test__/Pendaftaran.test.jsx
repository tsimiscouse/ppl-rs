import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pendaftaran from "../pages/Pendaftaran";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

describe("Pendaftaran Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock GET specializations
    axios.get.mockImplementation((url) => {
      if (url === "http://localhost:3000/api/doctors/specializations") {
        return Promise.resolve({
          data: {
            data: [
              { specialization: "Jantung" },
              { specialization: "Anak" },
              { specialization: "Gigi" },
            ],
          },
        });
      }
      if (url.startsWith("http://localhost:3000/api/doctors/specialization/")) {
        return Promise.resolve({
          data: {
            data: [
              { id: 1, name: "Dokter A", specialization: "Jantung" },
              { id: 2, name: "Dokter B", specialization: "Jantung" },
            ],
          },
        });
      }
      if (url.startsWith("http://localhost:3000/api/time-slots/available/")) {
        return Promise.resolve({
          data: {
            data: [
              { id: 10, time_slot: "2025-05-18T09:00:00Z" },
              { id: 11, time_slot: "2025-05-18T10:00:00Z" },
            ],
          },
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    // Mock POST form submission
    axios.post.mockResolvedValue({
      data: {
        data: {
          queue_number: "A001",
          patient_name: "Alex",
          doctor: { name: "Dokter A", specialization: "Jantung" },
          visitTime: {
            time_slot: "2025-05-18T09:00:00Z",
            formatted_time: "09:00",
          },
        },
      },
    });
  });

  test("shows alert if any input is empty", () => {
    window.alert = jest.fn();
    render(
      <BrowserRouter>
        <Pendaftaran />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Daftar Antrean"));
    expect(window.alert).toHaveBeenCalledWith(
      "Semua input harus diisi terlebih dahulu!"
    );
  });

  test("shows Tiket after valid form submission", async () => {
    render(
      <BrowserRouter>
        <Pendaftaran />
      </BrowserRouter>
    );

    const user = userEvent.setup();

    const spesialisSelect = await screen.findByLabelText("Spesialis Dokter");
    await user.selectOptions(spesialisSelect, "Jantung");

    const dokterSelect = await screen.findByLabelText("Nama Dokter");
    await waitFor(() => expect(dokterSelect.options.length).toBeGreaterThan(1));
    await user.selectOptions(dokterSelect, "1");

    const jamSelect = await screen.findByLabelText("Jam Kunjungan");
    await waitFor(() => expect(jamSelect.options.length).toBeGreaterThan(1));
    await user.selectOptions(jamSelect, "10");

    const namaInput = screen.getByPlaceholderText("Insert nama anda di sini");
    await user.type(namaInput, "Alex");

    await user.click(screen.getByText("Daftar Antrean"));

    const tiketModal = await screen.findByTestId("tiket-modal");
    expect(tiketModal).toBeInTheDocument();

    expect(screen.getByText("Jantung")).toBeInTheDocument();
    expect(screen.getByText("Dokter A")).toBeInTheDocument();
    expect(screen.getByText("09:00")).toBeInTheDocument();
  });

  test("Tiket modal doesn't show before form submission", () => {
    render(
      <BrowserRouter>
        <Pendaftaran />
      </BrowserRouter>
    );
    expect(screen.queryByTestId("tiket-modal")).not.toBeInTheDocument();
  });

  test("handles API error gracefully", async () => {
    // Mock GET specialization call to reject
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    // Suppress console.error output during test
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Pendaftaran />
      </BrowserRouter>
    );

    // Wait to ensure component rendered and no crash happened
    await waitFor(() => {
      // You can check for presence of something in UI
      expect(screen.getByLabelText(/Spesialis Dokter/i)).toBeInTheDocument();
    });

    // Restore console.error after test
    console.error.mockRestore();
  });
});
