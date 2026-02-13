import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Adicao from "./pages/Adicao";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/adicao" element={<Adicao />} />
    </Routes>
  );
}

export default App;
