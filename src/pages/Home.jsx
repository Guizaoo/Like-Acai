import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function NavIcon({ children }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      {children}
    </span>
  );
}

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
    <article className="surface-card content-auto flex items-start gap-3 rounded-2xl p-3">
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="h-16 w-16 flex-none rounded-xl object-cover"
        />
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
            className="flex h-9 min-w-9 items-center justify-center rounded-full bg-fuchsia-600 px-2 text-xl font-bold text-white transition-colors duration-200 hover:bg-fuchsia-700"
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
  const [abaAtiva, setAbaAtiva] = useState("inicio");

  const estiloAba = (aba, estiloInativo = "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800") =>
    `relative flex min-w-16 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-xs font-medium transition-all duration-200 ${
      abaAtiva === aba ? "bg-fuchsia-600/15 text-fuchsia-700" : estiloInativo
    }`;

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
    setAbaAtiva("inicio");
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const abrirBusca = () => {
    setAbaAtiva("buscar");
    navigate("/");
    const cardapioSection = document.getElementById("secao-cardapio");
    cardapioSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="app-shell mx-auto min-h-screen w-full max-w-md bg-transparent pb-28 text-slate-800">
      <div className="bg-linear-to-r from-fuchsia-700 to-fuchsia-600 px-4 py-2 text-center text-xs font-semibold text-white">
        🎁 Promoção de primeiro pedido ativada, aproveite!
      </div>

 
      <section className="relative h-36 w-full overflow-hidden sm:h-4">
        <img
          src="https://images.unsplash.com/photo-1611690078903-71dc5a49f5e3?auto=format&fit=crop&w=1400&q=80"
          alt="LikeAçai banner"
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
      </section>

      <section className="surface-card mx-3 mt-3 rounded-3xl px-4 pb-4 pt-3">
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
          className="surface-card w-full rounded-xl px-3 py-2 text-sm outline-none ring-fuchsia-500 transition-shadow duration-200 focus:ring"
        />
      </section>

      <section id="secao-cardapio" className="px-3 pt-4">
        <h2 className="text-lg font-bold tracking-tight">Cardápio</h2>

        <div className="mt-3 space-y-5">
          {cardapioFiltrado.length === 0 ? (
            <p className="surface-card rounded-xl p-3 text-sm text-slate-500">Nenhum item encontrado.</p>
          ) : (
            cardapioFiltrado.map((secao) => (
              <div key={secao.categoria} className="content-auto">
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

      <nav
        className="safe-bottom sticky-panel relative fixed bottom-0 left-1/2 z-20 w-[calc(100%-1rem)] max-w-md -translate-x-1/2 rounded-[28px] px-2.5 pt-2 text-xs"
        aria-label="Navegação principal"
      >
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <div className="flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={irParaInicio}
            className={estiloAba("inicio")}
            aria-current={abaAtiva === "inicio" ? "page" : undefined}
          >
            <NavIcon>🏠</NavIcon>
            <span className="font-semibold">Início</span>
            {abaAtiva === "inicio" ? <span className="absolute bottom-1 h-1 w-6 rounded-full bg-fuchsia-600" /> : null}
          </button>
          <button type="button" onClick={abrirBusca} className={estiloAba("buscar")}>
            <NavIcon>🔎</NavIcon>
            <span>Buscar</span>
            {abaAtiva === "buscar" ? <span className="absolute bottom-1 h-1 w-6 rounded-full bg-fuchsia-600" /> : null}
          </button>
          <button
            type="button"
            onClick={() => {
              setAbaAtiva("carrinho");
              navigate("/carrinho");
            }}
            className={estiloAba("carrinho")}
          >
            <NavIcon>🛍️</NavIcon>
            <span>Carrinho</span>
            {totalItems > 0 ? (
              <span className="absolute right-2 top-1.5 rounded-full bg-fuchsia-700 px-1.5 text-[10px] font-bold text-white shadow-sm">
                {totalItems}
              </span>
            ) : null}
            {abaAtiva === "carrinho" ? <span className="absolute bottom-1 h-1 w-6 rounded-full bg-fuchsia-600" /> : null}
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("conta")}
            className={estiloAba("conta", "text-slate-500 hover:bg-slate-100/80 hover:text-slate-700")}
          >
            <NavIcon>👤</NavIcon>
            <span>Conta</span>
            {abaAtiva === "conta" ? <span className="absolute bottom-1 h-1 w-6 rounded-full bg-fuchsia-600" /> : null}
          </button>
        </div>
      </nav>
    </main>
  );
}

export default Home;
