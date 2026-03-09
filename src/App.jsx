import { Route, Routes } from "react-router-dom";
import Adicao from "./pages/Adicao";
import Carrinho from "./pages/Carrinho";
import Home from "./pages/Home";
import Pagamento from "./pages/Pagamento";

function App() {
  // Mapa principal de rotas do aplicativo.
  // Se você criar novas telas, adicione um novo <Route> aqui.
  return (
    <Routes>
      {/* Home / cardápio */}
      <Route path="/" element={<Home />} />
      {/* Tela de personalização do açaí */}
      <Route path="/adicao" element={<Adicao />} />
      {/* Carrinho com itens escolhidos */}
      <Route path="/carrinho" element={<Carrinho />} />
      {/* Pagamento Pix + envio de localização */}
      <Route path="/pagamento" element={<Pagamento />} />
    </Routes>
  );
}

export default App;
