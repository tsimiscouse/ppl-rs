# 🏥 Hospital Queue System Interface

A modern and responsive web-based queue registration interface for hospitals. Built using **Vite** and **React (JSX)**, this system allows patients to register online by selecting a doctor, choosing a time slot, and entering their name. Upon submission, a unique queue number is generated and shown as confirmation. Patient data persists even after refreshing the page.

---

## ✨ Features

- 📝 **Patient Registration Form**

  - Dropdown to select a doctor (e.g., _Dr. Andi – Spesialis Jantung_, _Dr. Budi – Spesialis Mata_)
  - Dropdown to select a time (e.g., _09:00_, _10:00_)
  - Required input for patient name (max 50 characters)

- 🔢 **Queue Number Generation**

  - Automatically generates queue numbers (e.g., _A001_, _A002_, etc.)
  - Displays a confirmation page with:
    - Queue number
    - Doctor
    - Time
    - Patient name

- 🔁 **Persistent Data**

  - Data stored in `localStorage` to survive page reloads

- ⚠️ **Validation**
  - If the name field is empty, the error `"Nama pasien wajib diisi"` is shown

---

## 🧪 Tech Stack

| Technology   | Purpose                      |
| ------------ | ---------------------------- |
| Vite         | Frontend build tool          |
| React (JSX)  | Component-based UI library   |
| Tailwind CSS | Styling with utility classes |
