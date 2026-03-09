import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import BannerAcai from "../assets/IMG-BANNER-ACAI.optimized.jpg";
import Acai150ml from "../assets/acai-150ml.avif";
import Acai200ml from "../assets/acai-200ml.avif";
import Acai500ml from "../assets/acai-500ml.avif";
import AguaSemGasImg from "../assets/agua-sem-gas.optimized.jpg";
import AguaComGasImg from "../assets/agua-com-gas.optimized.jpg";
import CocaColaImg from "../assets/coca-cola.optimized.jpg";
import ShakeProteicoImg from "../assets/shake-proteico.optimized.jpg";
import SaladaFrutaImg from "../assets/saladad-de-fruta.optimized.jpg";
import H2OLimaoImg from "../assets/h2o.optimized.jpg";
import HomeIcon from "../assets/home-svgrepo-com.svg";
import SearchIcon from "../assets/search-svgrepo-com.svg";
import CartIcon from "../assets/cart-shopping-svgrepo-com.svg";
import UserIcon from "../assets/user-svgrepo-com.svg";
import { parseCurrencyToCents } from "../utils/currency";

function NavIcon({ src, alt }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      <img src={src} alt={alt} className="h-5 w-5 object-contain" />
    </span>
  );
}

// Fonte principal dos itens exibidos no cardápio da Home.
// Para alterar preços, nomes, descrições e imagens, edite este array.
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
        image: SaladaFrutaImg,
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
        image: ShakeProteicoImg,
      },
    ],
  },
  {
    categoria: "Açaí Montado",
    itens: [
      {
        id: "acai-150",
        title: "Açaí de 150ml",
        description: "Porção leve e prática para matar a vontade de açaí a qualquer hora.",
        price: "R$ 13,69",
        image: Acai150ml,
      },
      {
        id: "acai-200",
        title: "Açaí de 200ml",
        description: "Tamanho ideal para um lanche rápido, cremoso e delicioso.",
        price: "R$ 20,73",
        image: Acai200ml,
      },
      {
        id: "acai-300",
        title: "Açaí de 300ml",
        description: "Equilíbrio perfeito entre sabor e saciedade para o seu dia.",
        price: "R$ 27,64",
      },
      {
        id: "acai-500",
        title: "Açaí de 500ml",
        description: "Açaí na medida certa! 500ml cremoso e cheio de energia para matar sua fome.",
        price: "R$ 42,90",
        image: Acai500ml,
      },
      {
        id: "acai-700",
        title: "Açaí de 700ml",
        description: "Açaí 700ml: grande, completo e irresistível. Do jeito que você merece!",
        price: "R$ 49,99",
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
        image: AguaSemGasImg,
      },
      {
        id: "agua-gas",
        title: "Água com Gás",
        description: "Água com gás, uma opção refrescante e efervescente para acompanhar suas refeições.",
        price: "R$ 6,99",
        image: AguaComGasImg,
      },
      {
        id: "refrigerante",
        title: "Refrigerante",
        description: "Escolha entre uma variedade de refrigerantes gelados para saciar sua sede com sabor.",
        price: "R$ 7,99",
        image: CocaColaImg,
      },
      {
        id: "h2o",
        title: "H2O Limão 500ml",
        description: "Leve e cítrica, perfeita para acompanhar o seu pedido.",
        price: "R$ 10,99",
        image: H2OLimaoImg,
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

function CardapioItem({ item, onAdd, canAdd }) {
  return (
    <article
      className="surface-card content-auto group flex cursor-pointer items-start gap-3 rounded-2xl p-3 transition-all duration-200 hover:-translate-y-px hover:border-fuchsia-200 hover:bg-fuchsia-50/50 hover:shadow-[0_10px_20px_rgba(217,70,239,0.12)]"
      onClick={(event) => onAdd(event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onAdd(event.currentTarget);
        }
      }}
      role="button"
      tabIndex={0}
    >
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
        <p
          className={`mt-1 text-[11px] font-semibold transition-colors duration-200 ${
            canAdd ? "text-slate-400 group-hover:text-fuchsia-700" : "text-slate-400 group-hover:text-emerald-600"
          }`}
        >
          {canAdd ? "Clique para personalizar" : "Clique para adicionar ao carrinho"}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800">{item.price}</p>
          {canAdd ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onAdd(event.currentTarget.closest("article") ?? event.currentTarget);
              }}
              className="flex h-9 min-w-9 items-center justify-center rounded-full bg-fuchsia-600 px-2 text-xl font-bold text-white transition-colors duration-200 hover:bg-fuchsia-700"
              aria-label={`Adicionar ${item.title}`}
            >
              +
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Home() {
  // ===== 1) Estado e referências de elementos =====
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();
  const buscaInputRef = useRef(null);
  const cartButtonRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const animationTimeoutsRef = useRef([]);
  const [filtro, setFiltro] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("inicio");
  const [cartToast, setCartToast] = useState({ visible: false, message: "" });

  // ===== 2) Helpers de estilo e dados derivados =====
  const estiloAba = (aba, estiloInativo = "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800") =>
    `relative flex min-w-16 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-xs font-medium transition-all duration-200 ${
      abaAtiva === aba ? "bg-fuchsia-600/15 text-fuchsia-700" : estiloInativo
    }`;

  const cardapioFiltrado = useMemo(() => {
    // Filtro de busca em título, descrição e categoria.
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

  // ===== 3) Ações de navegação e interação =====
  const irParaInicio = () => {
    setAbaAtiva("inicio");
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const abrirBusca = () => {
    // Leva o usuário para Home e foca o input de busca.
    setAbaAtiva("buscar");
    navigate("/");
    const inputBusca = buscaInputRef.current;
    if (!inputBusca) return;

    inputBusca.scrollIntoView({ behavior: "smooth", block: "center" });
    requestAnimationFrame(() => {
      inputBusca.focus({ preventScroll: true });
    });
  };

  // ===== 4) Feedback visual de item adicionado =====
  const runFlyToCart = (origemElemento) => {
    // Animação visual de "item voando" até o botão do carrinho.
    const botaoCarrinho = cartButtonRef.current;
    if (!origemElemento || !botaoCarrinho) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const origemRect = origemElemento.getBoundingClientRect();
    const destinoRect = botaoCarrinho.getBoundingClientRect();
    const pontoOrigemX = origemRect.left + origemRect.width / 2;
    const pontoOrigemY = origemRect.top + origemRect.height / 2;
    const pontoDestinoX = destinoRect.left + destinoRect.width / 2;
    const pontoDestinoY = destinoRect.top + destinoRect.height / 2;
    const pontoMeioX = pontoOrigemX + (pontoDestinoX - pontoOrigemX) * 0.55;
    const pontoMeioY = Math.min(pontoOrigemY, pontoDestinoY) - 90;

    origemElemento.classList.remove("item-added-flash");
    void origemElemento.offsetWidth;
    origemElemento.classList.add("item-added-flash");

    const tokenVoador = document.createElement("div");
    tokenVoador.className = "fly-to-cart-token";
    tokenVoador.style.left = `${pontoOrigemX}px`;
    tokenVoador.style.top = `${pontoOrigemY}px`;

    const imagemOrigem = origemElemento.querySelector("img");
    if (imagemOrigem?.src) {
      const img = document.createElement("img");
      img.src = imagemOrigem.src;
      img.alt = "";
      img.className = "fly-to-cart-token__image";
      tokenVoador.appendChild(img);
    } else {
      tokenVoador.textContent = "+";
    }

    document.body.appendChild(tokenVoador);

    if (prefersReducedMotion) {
      tokenVoador.remove();
    } else {
      const animacao = tokenVoador.animate(
        [
          {
            left: `${pontoOrigemX}px`,
            top: `${pontoOrigemY}px`,
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 0.98,
            offset: 0,
          },
          {
            left: `${pontoMeioX}px`,
            top: `${pontoMeioY}px`,
            transform: "translate(-50%, -50%) scale(0.92)",
            opacity: 1,
            offset: 0.62,
          },
          {
            left: `${pontoDestinoX}px`,
            top: `${pontoDestinoY}px`,
            transform: "translate(-50%, -50%) scale(0.26)",
            opacity: 0.1,
            offset: 1,
          },
        ],
        {
          duration: 980,
          easing: "cubic-bezier(0.16, 0.84, 0.22, 1)",
        },
      );

      animacao.onfinish = () => tokenVoador.remove();
      animationTimeoutsRef.current.push(setTimeout(() => tokenVoador.remove(), 1200));
    }

    const badge = document.createElement("div");
    badge.className = "cart-plus-one";
    badge.textContent = "+1";
    badge.style.left = `${pontoDestinoX}px`;
    badge.style.top = `${pontoDestinoY}px`;
    document.body.appendChild(badge);
    animationTimeoutsRef.current.push(setTimeout(() => badge.remove(), 900));

    botaoCarrinho.classList.remove("cart-bump");
    void botaoCarrinho.offsetWidth;
    botaoCarrinho.classList.add("cart-bump");
  };

  // ===== 5) Feedback textual de item adicionado =====
  const showCartToast = (itemTitle) => {
    // Feedback textual curto após adicionar item.
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setCartToast({
      visible: true,
      message: `Você adicionou ao carrinho: ${itemTitle}`,
    });

    toastTimeoutRef.current = setTimeout(() => {
      setCartToast((prev) => ({ ...prev, visible: false }));
    }, 2300);
  };

  // ===== 6) Limpeza de recursos quando a tela desmonta =====
  useEffect(
    () => () => {
      // Limpeza de timeouts para evitar vazamento de memória.
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      animationTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      animationTimeoutsRef.current = [];
    },
    [],
  );

  // ===== 7) Render da Home =====
  return (
    <main className="app-shell mx-auto min-h-screen w-full max-w-md bg-transparent pb-28 text-slate-800">
      {/* Toast de confirmação de adição ao carrinho */}
      <div
        className={`pointer-events-none fixed left-1/2 top-3 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl border border-emerald-200 bg-emerald-50/95 px-4 py-2 text-center text-xs font-semibold text-emerald-700 shadow-[0_10px_24px_rgba(16,185,129,0.2)] backdrop-blur-sm transition-all duration-300 ${
          cartToast.visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        {cartToast.message}
      </div>
      
      {/* Banner principal */}
      <section className="relative h-52 w-full overflow-hidden sm:h-64">
        <img
          src={BannerAcai}
          alt="LikeAçai banner"
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
      </section>

      {/* Cartão de identificação da loja */}
      <section className="surface-card mx-3 mt-3 rounded-3xl px-4 pb-4 pt-3">
        <div className="mb-1 flex items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight">LikeAçai</h1>
        </div>
        <p className="text-xs text-slate-600">📍 São Luís - MA • ⭐ 4,9 (200 avaliações)</p>
      </section>

      {/* Busca no cardápio */}
      <section className="px-3 pt-3">
        <label htmlFor="busca-cardapio" className="sr-only">
          Buscar no cardápio
        </label>
        <input
          ref={buscaInputRef}
          id="busca-cardapio"
          type="search"
          value={filtro}
          onChange={(event) => setFiltro(event.target.value)}
          placeholder="Pesquise por item, categoria ou descrição"
          className="surface-card w-full rounded-xl px-3 py-2 text-sm outline-none ring-fuchsia-500 transition-shadow duration-200 focus:ring"
        />
      </section>

      {/* Lista de categorias e produtos */}
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
                    <CardapioItem
                      key={item.id}
                      item={item}
                      canAdd={secao.categoria === "Açaí Montado"}
                      // Regra de fluxo:
                      // 1) Açaí Montado abre personalização.
                      // 2) Demais categorias adicionam direto no carrinho.
                      onAdd={(origemElemento) =>
                        secao.categoria === "Açaí Montado"
                          ? navigate("/adicao", { state: { item } })
                          : (() => {
                              addItem({ ...item, unitPriceCents: parseCurrencyToCents(item.price) });
                              runFlyToCart(origemElemento);
                              showCartToast(item.title);
                            })()
                      }
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <nav
        // Barra inferior fixa de navegação principal.
        className="safe-bottom sticky-panel relative fixed mt-2 left-1/2 z-20 w-[calc(100%-1rem)] max-w-md -translate-x-1/2 rounded-[28px] px-2.5 pt-2 text-xs"
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
            <NavIcon src={HomeIcon} alt="Início" />
            <span className="font-semibold">Início</span>
            {abaAtiva === "inicio" ? <span className="absolute bottom-1 h-1 w-6 rounded-full bg-fuchsia-600" /> : null}
          </button>
          <button type="button" onClick={abrirBusca} className={estiloAba("buscar")}>
            <NavIcon src={SearchIcon} alt="Buscar" />
            <span>Buscar</span>
            {abaAtiva === "buscar" ? <span className="absolute bottom-1 h-1 w-6 rounded-full bg-fuchsia-600" /> : null}
          </button>
          <button
            ref={cartButtonRef}
            type="button"
            onClick={() => {
              setAbaAtiva("carrinho");
              navigate("/carrinho");
            }}
            className={estiloAba("carrinho")}
          >
            <NavIcon src={CartIcon} alt="Carrinho" />
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
            <NavIcon src={UserIcon} alt="Conta" />
            <span>Conta</span>
            {abaAtiva === "conta" ? <span className="absolute bottom-1 h-1 w-6 rounded-full bg-fuchsia-600" /> : null}
          </button>
        </div>
      </nav>
    </main>
  );
}

export default Home;
