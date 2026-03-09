import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* BrowserRouter habilita navegação por rotas */}
    <BrowserRouter>
      {/* CartProvider deixa o carrinho disponível para toda a aplicação */}
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
