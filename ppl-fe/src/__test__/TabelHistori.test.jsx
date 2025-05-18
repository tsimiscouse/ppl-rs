import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import TabelHistori from "../pages/TabelHistori";

jest.mock("axios");

const mockData = {
  data: {
    data: [
      {
        queue_number: "001",
        patient_name: "John Doe",
        doctor: { name: "Dr. Smith" },
        visitTime: { formatted_time: "10:00 AM" },
      },
      {
        queue_number: "002",
        patient_name: "Jane Doe",
        doctor: { name: "Dr. Watson" },
        visitTime: { formatted_time: "11:00 AM" },
      },
      {
        queue_number: "003",
        patient_name: "Alice",
        doctor: { name: "Dr. Brown" },
        visitTime: { formatted_time: "12:00 PM" },
      },
      {
        queue_number: "004",
        patient_name: "Bob",
        doctor: { name: "Dr. Adams" },
        visitTime: { formatted_time: "01:00 PM" },
      },
      {
        queue_number: "005",
        patient_name: "Charlie",
        doctor: { name: "Dr. Carter" },
        visitTime: { formatted_time: "02:00 PM" },
      },
      {
        queue_number: "006",
        patient_name: "Dave",
        doctor: { name: "Dr. Grey" },
        visitTime: { formatted_time: "03:00 PM" },
      },
    ],
  },
};

describe("TabelHistori Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue(mockData);
  });

  it("renders table headers and data correctly", async () => {
    render(
      <MemoryRouter>
        <TabelHistori />
      </MemoryRouter>
    );

    expect(await screen.findByText("Hospital System")).toBeInTheDocument();
    expect(
      screen.getByText("Pengujian Perangkat Lunak 2025")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
    });
  });

  it("displays pagination and navigates to next page", async () => {
    render(
      <MemoryRouter>
        <TabelHistori />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const nextBtn = screen.getByText("Next");
    expect(nextBtn).toBeInTheDocument();

    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText("Dave")).toBeInTheDocument();
    });
  });

  it("navigates to previous page when Previous button clicked", async () => {
    render(
      <MemoryRouter>
        <TabelHistori />
      </MemoryRouter>
    );

    // Go to page 2 first
    fireEvent.click(await screen.findByText("2"));

    await waitFor(() => expect(screen.getByText("Dave")).toBeInTheDocument());

    // Click Previous
    fireEvent.click(screen.getByText("Previous"));

    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    );
  });

  it("disables previous button on first page", async () => {
    render(
      <MemoryRouter>
        <TabelHistori />
      </MemoryRouter>
    );

    const prevBtn = await screen.findByText("Previous");
    expect(prevBtn).toHaveClass("disabled::opacity-50");
  });

  it("disables next button on last page", async () => {
    render(
      <MemoryRouter>
        <TabelHistori />
      </MemoryRouter>
    );

    // Wait for data load
    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    );

    // Click 'Next' to go to last page (page 2)
    fireEvent.click(screen.getByText("Next"));

    // Now 'Next' button should be disabled on last page
    await waitFor(() => {
      const nextBtn = screen.getByText("Next");
      expect(nextBtn).toBeDisabled();
    });
  });

  it("renders correct number of rows per page", async () => {
    render(
      <MemoryRouter>
        <TabelHistori />
      </MemoryRouter>
    );

    // Wait for data load
    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    );

    // On page 1, we expect 5 rows
    const rows = screen.getAllByRole("row"); // includes header row too
    // Table has 1 header row + 5 data rows = 6 rows total
    expect(rows.length).toBe(6);

    // Go to page 2
    fireEvent.click(screen.getByText("2"));

    await waitFor(() => {
      // On page 2, expect 1 data row + header row = 2 rows total
      const rowsPage2 = screen.getAllByRole("row");
      expect(rowsPage2.length).toBe(2);
      expect(screen.getByText("Dave")).toBeInTheDocument();
    });
  });

  it("allows clicking numbered pagination buttons", async () => {
    render(
      <MemoryRouter>
        <TabelHistori />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Click page 2 button
    fireEvent.click(screen.getByText("2"));

    await waitFor(() => {
      expect(screen.getByText("Dave")).toBeInTheDocument();
    });

    // Click back to page 1 button
    fireEvent.click(screen.getByText("1"));

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("displays 'No Data Available' when response is empty", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });

    render(
      <MemoryRouter>
        <TabelHistori />
      </MemoryRouter>
    );

    expect(await screen.findByText("No Data Available")).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    // Mock rejection
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    // Spy on console.error to suppress noisy logs in test output
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <TabelHistori />
      </MemoryRouter>
    );

    // Since error handling doesn't show UI changes, just wait to ensure no crash
    await waitFor(() => {
      // Component rendered and no data shown
      expect(screen.getByText("Hospital System")).toBeInTheDocument();
    });

    // Restore console.error
    console.error.mockRestore();
  });

  it("handles null data gracefully", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: null } });

    render(
      <MemoryRouter>
        <TabelHistori />
      </MemoryRouter>
    );

    expect(await screen.findByText("No Data Available")).toBeInTheDocument();
  });

  it("renders 'Tutup History Antrean' link with correct href", () => {
    render(
      <MemoryRouter>
        <TabelHistori />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /Tutup History Antrean/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("navigates home when 'Tutup History Antrean' link clicked", () => {
    render(
      <MemoryRouter>
        <TabelHistori />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /Tutup History Antrean/i });
    expect(link).toBeInTheDocument();

    fireEvent.click(link);
    // Because MemoryRouter is used without history mocks, actual navigation test is limited.
    // But you can check href or use userEvent and spy on history.push if you add react-router mocks.
  });
});
