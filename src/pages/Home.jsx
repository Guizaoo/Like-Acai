import { useNavigate } from "react-router-dom";

const promoItems = [
  {
    id: 1,
    title: "Combo Casal ❤️",
    description: "9 complementos grátis • 2 potes de 500ml + adicionais.",
    oldPrice: "R$ 41,99",
    price: "R$ 32,97",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80",
    badge: "22% OFF",
  },
  {
    id: 2,
    title: "Barca de Açaí G - 1 Litro",
    description: "9 complementos grátis • monte sua barca do seu jeito.",
    oldPrice: "R$ 39,99",
    price: "R$ 34,97",
    image:
      "",
    badge: "PROMO",
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#f3f4f6] pb-24 text-slate-800">
      <div className="bg-[#7f22c8] px-4 py-2 text-center text-sm font-semibold text-white">
        🎁 Promoção de primeiro pedido ativada, aproveite!
      </div>

      <section className="relative h-44 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1611690078903-71dc5a49f5e3?auto=format&fit=crop&w=1400&q=80"
          alt="LikeAçai banner"
          className="h-full w-full object-cover"
        />

        <div className="absolute right-3 top-3 flex gap-2">
          {[
            { id: "buscar", icon: "🔎" },
            { id: "insta", icon: "📷" },
            { id: "info", icon: "ℹ️" }, 
          ].map((action) => (
            <button
              key={action.id}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-lg shadow"
              aria-label={action.id}
            >
              {action.icon}
            </button>
          ))}
        </div>

        <div className="absolute bottom-3 left-3 rounded-xl border border-white/70 bg-white p-2 shadow-md">
          <p className="text-xs font-black text-[#7f22c8]">LIKE</p>
          <p className="text-xs font-black text-[#7f22c8]">AÇAÍ</p>
        </div>
      </section>

      <section className="bg-white px-4 pb-4 pt-3 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-3xl font-black tracking-tight">LikeAçai</h1>
          <span className="text-blue-500">✔️</span>
        </div>

        <span className="inline-flex rounded-md bg-emerald-500 px-2 py-1 text-xs font-bold text-white">
          Aberto
        </span>

        <p className="mt-3 text-lg">
          Pedido mínimo <strong>R$ 20,00</strong> | ⏱️ 27-46 min |{" "}
          <strong className="text-emerald-600">Grátis</strong>
        </p>
        <p className="text-sm text-slate-600">📍 São Luís - MA</p>
        <p className="mt-1 text-sm text-slate-600">⭐ 4,9 (1.291 avaliações)</p>
      </section>

      <section className="m-3 rounded-2xl bg-[#e5e7eb] p-4">
        <p className="text-lg font-bold">📍 Entregamos em</p>
        <p className="text-2xl font-black">São Luís</p>
        <p className="mt-2 text-sm text-slate-600">🕒 27-46 min • 📦 Entrega Grátis</p>
      </section>

      <section className="px-4">
        <span className="inline-flex rounded-full bg-red-500 px-4 py-2 text-sm font-extrabold text-white">
          ⭐ Super Restaurante
        </span>

        <h2 className="mt-4 text-4xl font-black tracking-tight">Super Promoções</h2>

        <div className="mt-4 grid gap-4">
          {promoItems.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl bg-white shadow"
            >
              <div className="relative h-40">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-extrabold text-white">
                  PROMO
                </span>
                <span className="absolute right-2 top-2 rounded-md bg-yellow-400 px-2 py-1 text-xs font-extrabold text-slate-900">
                  {item.badge}
                </span>
              </div>

              <div className="p-3">
                <h3 className="text-2xl font-black leading-tight">{item.title}</h3>
                <p className="mt-1 text-base text-emerald-600">9 Complementos Grátis •</p>
                <p className="text-base text-slate-600">{item.description}</p>

                <p className="mt-2 text-sm text-slate-400 line-through">{item.oldPrice}</p>

                <div className="mt-1 flex items-center justify-between">
                  <strong className="text-4xl font-black text-fuchsia-600">{item.price}</strong>
                  <button
                    type="button"
                    onClick={() => navigate("/adicao", { state: { item } })}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-600 text-4xl leading-none text-white"
                    aria-label={`Adicionar ${item.title}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <nav className="fixed bottom-0 left-1/2 z-10 flex w-full max-w-md -translate-x-1/2 justify-around border-t bg-white py-2 text-sm">
        <button type="button" className="flex flex-col items-center text-fuchsia-600">
          <span>🏠</span>
          <span className="font-semibold">Início</span>
        </button>
        <button type="button" className="flex flex-col items-center text-slate-400">
          <span>🔎</span>
          <span>Buscar</span>
        </button>
        <button type="button" className="flex flex-col items-center text-slate-400">
          <span>🛍️</span>
          <span>Carrinho</span>
        </button>
        <button type="button" className="flex flex-col items-center text-slate-400">
          <span>👤</span>
          <span>Conta</span>
        </button>
      </nav>
    </main>
  );
}

export default Home;
