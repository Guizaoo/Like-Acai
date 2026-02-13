import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Carrinho() {
  const navigate = useNavigate();
  const { items, totalPriceFormatted, removeItem, changeQuantity, clearCart } = useCart();
 
  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-slate-100 pb-28 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-fuchsia-700"
          >
            ← Voltar
          </button>
          <h1 className="text-base font-bold">Seu carrinho</h1>
          <button type="button" onClick={clearCart} className="text-xs font-semibold text-red-500">
            Limpar
          </button>
        </div>
      </header>

      <section className="space-y-3 px-3 pt-3">
        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <p className="text-sm font-semibold">Seu carrinho está vazio.</p>
            <p className="mt-1 text-xs text-slate-500">Adicione itens pelo cardápio para continuar.</p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 rounded-xl bg-fuchsia-700 px-4 py-2 text-xs font-semibold text-white"
            >
              Ir para início
            </button>
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className="rounded-2xl bg-white p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">{item.title}</h2>
                  <p className="text-xs text-slate-500">{item.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-xs font-semibold text-red-500"
                >
                  Remover
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeQuantity(item.id, -1)}
                  className="h-7 w-7 rounded-full border border-slate-300 font-bold"
                >
                  -
                </button>
                <span className="text-sm font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => changeQuantity(item.id, 1)}
                  className="h-7 w-7 rounded-full border border-slate-300 font-bold"
                >
                  +
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      {items.length > 0 ? (
        <footer className="safe-bottom fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-white px-3 pb-3 pt-2 shadow-[0_-8px_20px_rgba(0,0,0,0.08)]">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold">
            <span>Total</span>
            <span className="text-fuchsia-700">{totalPriceFormatted}</span>
          </div>
          <button type="button" className="w-full rounded-xl bg-fuchsia-700 py-3 text-xs font-bold uppercase text-white">
            Finalizar pedido
          </button>
        </footer>
      ) : null}
    </main>
  );
}

export default Carrinho;
