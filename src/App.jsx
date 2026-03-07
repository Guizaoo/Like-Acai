import { Route, Routes } from "react-router-dom";
import Adicao from "./pages/Adicao";
import Carrinho from "./pages/Carrinho";
import Home from "./pages/Home";
import Pagamento from "./pages/Pagamento";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/adicao" element={<Adicao />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/pagamento" element={<Pagamento />} />
    </Routes>
  );
}

export default App;
