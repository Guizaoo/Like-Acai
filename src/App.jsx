import { Route, Routes } from "react-router-dom";
import Adicao from "./pages/Adicao";
import Carrinho from "./pages/Carrinho";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/adicao" element={<Adicao />} />
      <Route path="/carrinho" element={<Carrinho />} />
    </Routes>
  );
}

export default App;
