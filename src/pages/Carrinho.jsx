import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Carrinho() {
  const navigate = useNavigate();
  const { items, totalPriceFormatted, removeItem, changeQuantity, clearCart } = useCart();
 
  return (
    <main className="app-shell mx-auto min-h-screen w-full max-w-md bg-transparent pb-28 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-fuchsia-700 transition-colors duration-200 hover:bg-fuchsia-50"
          >
            ← Voltar
          </button>
          <h1 className="text-base font-bold">Seu carrinho</h1>
          <button
            type="button"
            onClick={clearCart}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-red-500 transition-colors duration-200 hover:bg-red-50"
          >
            Limpar
          </button>
        </div>
      </header>

      <section className="space-y-3 px-3 pt-3">
        {items.length === 0 ? (
          <div className="surface-card rounded-2xl p-5 text-center">
            <p className="text-sm font-semibold">Seu carrinho está vazio.</p>
            <p className="mt-1 text-xs text-slate-500">Adicione itens pelo cardápio para continuar.</p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 rounded-xl bg-fuchsia-700 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-fuchsia-800"
            >
              Ir para início
            </button>
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className="surface-card rounded-2xl p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">{item.title}</h2>
                  <p className="text-xs text-slate-500">{item.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-md px-1.5 py-1 text-xs font-semibold text-red-500 transition-colors duration-200 hover:bg-red-50"
                >
                  Remover
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeQuantity(item.id, -1)}
                  className="h-8 w-8 rounded-full border border-slate-300 font-bold transition-colors duration-200 hover:bg-slate-100"
                >
                  -
                </button>
                <span className="text-sm font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => changeQuantity(item.id, 1)}
                  className="h-8 w-8 rounded-full border border-slate-300 font-bold transition-colors duration-200 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      {items.length > 0 ? (
        <footer className="safe-bottom sticky-panel fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-slate-200 px-3 pb-3 pt-2">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold">
            <span>Total</span>
            <span className="text-fuchsia-700">{totalPriceFormatted}</span>
          </div>
          <button
            type="button"
            className="w-full rounded-xl bg-fuchsia-700 py-3 text-xs font-bold uppercase text-white transition-colors duration-200 hover:bg-fuchsia-800"
          >
            Finalizar pedido
          </button>
        </footer>
      ) : null}
    </main>
  );
}

export default Carrinho;
