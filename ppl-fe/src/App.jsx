import "./App.css";
import Pendaftaran from "./pages/Pendaftaran";
import TabelHistori from "./pages/TabelHistori";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Pendaftaran />} />
        <Route path="/TabelHistori" element={<TabelHistori />} />
      </Routes>
    </div>
  );
}

export default App;
