import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

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
];

const cardapio = [
  {
    categoria: "Café da Manhã / Lanches",
    itens: [
      {
        id: "salada-fruta",
        title: "Salada de Fruta Individual",
        description:
          "Vai uma salada refrescante e sensacional, a nossa é feita com as melhores frutas da época fresca e deliciosa.",
        price: "R$ 14,50",
      },
    ],
  },
  {
    categoria: "Shake Proteico",
    itens: [
      {
        id: "shake-proteico",
        title: "Shake Proteico 500ml",
        description:
          "Sinta-se devidamente nutrido e fortalecido com nosso delicioso shake proteico, carregado de pura proteína e energia.",
        price: "R$ 41,47",
      },
    ],
  },
  {
    categoria: "Açaí Montado",
    itens: [
      {
        id: "acai-700",
        title: "Açaí de 700ml",
        description: "Açaí 700ml: grande, completo e irresistível. Do jeito que você merece!",
        price: "R$ 49,99",
      },
      {
        id: "acai-500",
        title: "Açaí de 500ml",
        description: "Açaí na medida certa! 500ml cremoso e cheio de energia para matar sua fome.",
        price: "R$ 42,90",
        image:
          "https://images.unsplash.com/photo-1623082574085-157d955f5a16?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  {
    categoria: "Bebidas",
    itens: [
      {
        id: "agua",
        title: "Água",
        description: "Água pura e cristalina, essencial para manter-se hidratado e revitalizado durante o dia.",
        price: "R$ 4,99",
      },
      {
        id: "agua-gas",
        title: "Água com Gás",
        description: "Água com gás, uma opção refrescante e efervescente para acompanhar suas refeições.",
        price: "R$ 6,99",
      },
      {
        id: "refrigerante",
        title: "Refrigerante",
        description: "Escolha entre uma variedade de refrigerantes gelados para saciar sua sede com sabor.",
        price: "R$ 7,99",
      },
      {
        id: "h2o",
        title: "H2O Limão 500ml",
        description: "Leve e cítrica, perfeita para acompanhar o seu pedido.",
        price: "R$ 10,99",
        image:
          "https://images.unsplash.com/photo-1622480916113-7d8f4a4f6de3?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "heineken",
        title: "Heineken Long Neck 330ml",
        description: "Produto para maiores de 18 anos.",
        price: "R$ 12,99",
        image:
          "https://images.unsplash.com/photo-1618885472179-5e474019f2a9?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
];

function CardapioItem({ item, onAdd }) {
  return (
    <article className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      {item.image ? (
        <img src={item.image} alt={item.title} className="h-16 w-16 flex-none rounded-xl object-cover" />
      ) : (
        <div className="h-16 w-16 flex-none rounded-xl bg-slate-100" />
      )}

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold leading-tight text-slate-800">{item.title}</h4>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{item.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800">{item.price}</p>
          <button
            type="button"
            onClick={onAdd}
            className="flex h-9 min-w-9 items-center justify-center rounded-full bg-fuchsia-600 px-2 text-xl font-bold text-white"
            aria-label={`Adicionar ${item.title}`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

function Home() {
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();
  const [filtro, setFiltro] = useState("");

  const cardapioFiltrado = useMemo(() => {
    const termo = filtro.trim().toLowerCase();

    if (!termo) return cardapio;

    return cardapio
      .map((secao) => ({
        ...secao,
        itens: secao.itens.filter(
          (item) =>
            item.title.toLowerCase().includes(termo) ||
            item.description.toLowerCase().includes(termo) ||
            secao.categoria.toLowerCase().includes(termo),
        ),
      }))
      .filter((secao) => secao.itens.length > 0);
  }, [filtro]);

  const irParaInicio = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const abrirBusca = () => {
    navigate("/");
    const cardapioSection = document.getElementById("secao-cardapio");
    cardapioSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-slate-100 pb-28 text-slate-800">
      <div className="bg-[#7f22c8] px-4 py-2 text-center text-xs font-semibold text-white">
        🎁 Promoção de primeiro pedido ativada, aproveite!
      </div>

      <section className="relative h-36 w-full overflow-hidden sm:h-44">
        <img
          src="https://images.unsplash.com/photo-1611690078903-71dc5a49f5e3?auto=format&fit=crop&w=1400&q=80"
          alt="LikeAçai banner"
          className="h-full w-full object-cover"
        />
      </section>

      <section className="rounded-b-3xl bg-white px-4 pb-4 pt-3 shadow-sm">
        <div className="mb-1 flex items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight">LikeAçai</h1>
          <span className="text-blue-500">✔️</span>
        </div>
        <p className="text-xs text-slate-600">📍 São Luís - MA • ⭐ 4,9 (1.291 avaliações)</p>
      </section>

      <section className="px-3 pt-3">
        <label htmlFor="busca-cardapio" className="sr-only">
          Buscar no cardápio
        </label>
        <input
          id="busca-cardapio"
          type="search"
          value={filtro}
          onChange={(event) => setFiltro(event.target.value)}
          placeholder="Pesquise por item, categoria ou descrição"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-fuchsia-500 focus:ring"
        />
      </section>

      <section className="px-3 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Super Promoções</h2>
          <span className="text-xs font-medium text-fuchsia-700">Entrega rápida</span>
        </div>

        <div className="space-y-3">
          {promoItems.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="relative h-36">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-[10px] font-extrabold text-white">
                  {item.badge}
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-lg font-black leading-tight">{item.title}</h3>
                <p className="mt-1 text-xs text-slate-600">{item.description}</p>
                <p className="mt-2 text-xs text-slate-400 line-through">{item.oldPrice}</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <strong className="text-2xl font-black text-fuchsia-600">{item.price}</strong>
                  <button
                    type="button"
                    onClick={() => navigate("/adicao", { state: { item } })}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-fuchsia-600 text-3xl leading-none text-white"
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

      <section id="secao-cardapio" className="px-3 pt-5">
        <h2 className="text-lg font-bold tracking-tight">Cardápio</h2>

        <div className="mt-3 space-y-5">
          {cardapioFiltrado.length === 0 ? (
            <p className="rounded-xl bg-white p-3 text-sm text-slate-500 shadow-sm">Nenhum item encontrado.</p>
          ) : (
            cardapioFiltrado.map((secao) => (
              <div key={secao.categoria}>
                <h3 className="mb-2 text-base font-semibold text-slate-800">{secao.categoria}</h3>
                <div className="space-y-2.5">
                  {secao.itens.map((item) => (
                    <CardapioItem key={item.id} item={item} onAdd={() => addItem(item)} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <nav className="safe-bottom fixed bottom-0 left-1/2 z-10 flex w-full max-w-md -translate-x-1/2 justify-around border-t border-slate-200 bg-white py-2 text-[11px] shadow-[0_-6px_16px_rgba(15,23,42,0.08)]">
        <button
          type="button"
          onClick={irParaInicio}
          className="flex min-w-14 flex-col items-center text-fuchsia-600"
        >
          <span>🏠</span>
          <span className="font-semibold">Início</span>
        </button>
        <button type="button" onClick={abrirBusca} className="flex min-w-14 flex-col items-center text-slate-600">
          <span>🔎</span>
          <span>Buscar</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/carrinho")}
          className="relative flex min-w-14 flex-col items-center text-slate-600"
        >
          <span>🛍️</span>
          <span>Carrinho</span>
          {totalItems > 0 ? (
            <span className="absolute right-0 top-0 rounded-full bg-fuchsia-700 px-1.5 text-[10px] font-bold text-white">
              {totalItems}
            </span>
          ) : null}
        </button>
        <button type="button" className="flex min-w-14 flex-col items-center text-slate-400">
          <span>👤</span>
          <span>Conta</span>
        </button>
      </nav>
    </main>
  );
}

export default Home;
