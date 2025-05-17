import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pendaftaran from "../pages/Pendaftaran";
import { BrowserRouter } from "react-router-dom";

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

test("shows Tiket after valid form submission", () => {
  render(
    <BrowserRouter>
      <Pendaftaran />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText("Insert nama anda di sini"), {
    target: { value: "Alex" },
  });
  fireEvent.change(screen.getByDisplayValue("Pilih spesialis dokter"), {
    target: { value: "Jantung" },
  });
  fireEvent.change(screen.getByDisplayValue("Pilih dokter"), {
    target: { value: "Dokter A" },
  });
  fireEvent.change(screen.getByDisplayValue("Pilih jam kunjungan"), {
    target: { value: "09:00" },
  });

  fireEvent.click(screen.getByText("Daftar Antrean"));

  expect(screen.getByText("Jantung")).toBeInTheDocument();
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
