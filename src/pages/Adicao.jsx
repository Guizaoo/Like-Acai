import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ImgAcai from "../assets/ImgAcai.optimized.jpg";
import { useCart } from "../context/CartContext";
import {
  calculateExtraComplementCents,
  EXTRA_COMPLEMENT_CENTS,
  getChargedComplementCount,
  getFreeComplementLimit,
} from "../utils/acaiPricing";
import { formatCents, parseCurrencyToCents } from "../utils/currency";

// Estrutura das seções de personalização.
// Para adicionar/remover opções no configurador, altere este array.
const grupos = [
  {
    id: "base",
    titulo: "Escolha sua Base",
    subtitulo: "Escolha 1 item",
    obrigatorio: true,
    tipo: "radio",
    opcoes: [
      { nome: "Açaí Tradicional" },
      { nome: "Açaí Batido no Morango" },
      { nome: "Açaí Batido na Banana" },
      { nome: "Creme de Cupuaçu" },
      { nome: "Creme de Amendoim" },
      { nome: "Creme de Leite Ninho" },
      { nome: "Creme Leitinho de Morango" },
      { nome: "Creme de Maracujá" },
      { nome: "Creme de Ovomaltine" },
      { nome: "Creme de Menta" },
      { nome: "Creme de Oreo" },
    ],
  },
  {
    id: "complementos",
    titulo: "Complementos",
    subtitulo: "Escolha seus complementos",
    obrigatorio: true,
    tipo: "checkbox",
    opcoes: [
      { nome: "Bolinha de Chocolate" },
      { nome: "Confete" },
      { nome: "Granola" },
      { nome: "Amendoim" },
      { nome: "Leite em Pó" },
      { nome: "Ovomaltine" },
      { nome: "Chocoball" },
      { nome: "Chocoball White" },
      { nome: "Coco Ralado" },
      { nome: "Bis Triturado" },
      { nome: "Castanha de Caju" },
      { nome: "Chocolate Granulado" },
      { nome: "Granulado Colorido" },
      { nome: "Jujuba Gomets" },
      { nome: "Marshmallow Fini" },
      { nome: "Menta Folly" },
      { nome: "Aveia" },
      { nome: "Sucrilhos" },
    ],
  },
  {
    id: "frutas",
    titulo: "Frutas",
    subtitulo: "Escolha até 3 itens",
    max: 3,
    obrigatorio: false,
    tipo: "checkbox",
    opcoes: [
      { nome: "Banana" },
      { nome: "Morango" },
      { nome: "Kiwi" },
      { nome: "Uva" },
      { nome: "Manga" },
      { nome: "Abacaxi" },
    ],
  },
  {
    id: "coberturas",
    titulo: "Coberturas",
    subtitulo: "Escolha até 2 itens",
    max: 2,
    obrigatorio: false,
    tipo: "checkbox",
    opcoes: [
      { nome: "Cobertura de Chocolate" },
      { nome: "Cobertura de Caramelo" },
      { nome: "Cobertura de Uva" },
      { nome: "Cobertura de Maracujá" },
      { nome: "Cobertura de Menta" },
      { nome: "Cobertura de Morango" },
    ],
  },
  {
    id: "adicionais",
    titulo: "Adicionais",
    subtitulo: "Escolha se desejar",
    obrigatorio: false,
    tipo: "checkbox",
    opcoes: [
      { nome: "+ LEITE CONDENSADO (100ml extra)", destaque: true },
      { nome: "+ Nutella", destaque: true },
      { nome: "+ Creme com Calda", destaque: true },
      { nome: "+ Chocoball em Barra (3Un)", destaque: true },
      { nome: "+ Mini Oreo (pacotinho)", destaque: true },
      { nome: "+ Mini Fini (pacotinho)", destaque: true },
      { nome: "+ Doce de Leite" },
    ],
  },
];

function extractMlSize(productName) {
  // Extrai tamanho (ml) do título para aplicar regra de complementos grátis.
  const match = String(productName).match(/(\d+)\s*ml/i);
  return match ? Number.parseInt(match[1], 10) : null;
}

function slugify(value) {
  // Normaliza textos para montar IDs estáveis no carrinho.
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function SecaoOpcoes({ grupo, selecao, onSelect, contador, subtitulo }) {
  const qtdSelecionada = grupo.tipo === "radio" ? (selecao ? 1 : 0) : selecao.length;
  const atingiuLimite = Boolean(grupo.max && qtdSelecionada >= grupo.max);

  return (
    <section className="surface-card content-auto rounded-2xl px-3 py-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">{grupo.titulo}</h2>
          <p className="text-xs text-zinc-500">{subtitulo}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-zinc-500">{contador}</span>
      </div>

      <div className="space-y-1.5">
        {grupo.opcoes.map((opcao) => (
          <label
            key={`${grupo.titulo}-${opcao.nome}`}
            className="flex min-h-10 items-center justify-between gap-2 rounded-xl px-1 transition-colors duration-150 hover:bg-slate-50"
          >
            <span className={`text-[13px] ${opcao.destaque ? "font-medium text-fuchsia-700" : "text-zinc-700"}`}>
              {opcao.nome}
            </span>
            <input
              type={grupo.tipo}
              name={grupo.titulo}
              checked={grupo.tipo === "radio" ? selecao === opcao.nome : selecao.includes(opcao.nome)}
              disabled={grupo.tipo === "checkbox" && Boolean(grupo.max) && !selecao.includes(opcao.nome) && atingiuLimite}
              onChange={() => onSelect(grupo, opcao.nome)}
              className="h-5 w-5 rounded-full border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500"
            />
          </label>
        ))}
      </div>

      {grupo.obrigatorio ? <p className="pt-1 text-[11px] font-semibold text-fuchsia-600">Obrigatório</p> : null}
    </section>
  );
}

function Adicao() {
  // ===== 1) Dependências de navegação e carrinho =====
  const navigate = useNavigate();
  const { state } = useLocation();
  const item = state?.item;
  const { addItem } = useCart();

  // Fallbacks caso a página seja aberta sem state da Home.
  const nomeProduto = item?.title ?? "Açaí 700ml";
  const precoProduto = item?.price ?? "R$ 28,97";
  const tamanhoMl = extractMlSize(nomeProduto);
  // Regra de negócio: 150/200/300ml => 3 grátis; demais => 4.
  const limiteGratisComplementos = getFreeComplementLimit(tamanhoMl);
  const precoBaseCents = Number.isFinite(item?.unitPriceCents) ? item.unitPriceCents : parseCurrencyToCents(precoProduto);

  // ===== 2) Estado das seleções do configurador =====
  const [selecoes, setSelecoes] = useState(() =>
    grupos.reduce((acc, grupo) => {
      acc[grupo.id] = grupo.tipo === "radio" ? "" : [];
      return acc;
    }, {}),
  );

  // ===== 3) Handler de escolha de opções =====
  const selecionarOpcao = (grupo, opcaoNome) => {
    setSelecoes((prev) => {
      if (grupo.tipo === "radio") {
        return { ...prev, [grupo.id]: opcaoNome };
      }

      const selecionadas = prev[grupo.id];
      const jaSelecionada = selecionadas.includes(opcaoNome);

      if (jaSelecionada) {
        return { ...prev, [grupo.id]: selecionadas.filter((nome) => nome !== opcaoNome) };
      }

      if (grupo.max && selecionadas.length >= grupo.max) {
        // Impede selecionar acima do máximo permitido para o grupo.
        return prev;
      }

      return { ...prev, [grupo.id]: [...selecionadas, opcaoNome] };
    });
  };

  // ===== 4) Cálculo de preço final =====
  const qtdComplementos = selecoes.complementos.length;
  const qtdComplementosCobrados = getChargedComplementCount(qtdComplementos, limiteGratisComplementos);
  // Acréscimo financeiro dos complementos excedentes.
  const acrescimoComplementosCents = calculateExtraComplementCents(qtdComplementos, limiteGratisComplementos);
  const precoFinalCents = precoBaseCents + acrescimoComplementosCents;
  const precoFinalFormatado = formatCents(precoFinalCents);

  const obrigatoriosPendentes = useMemo(
    () =>
      grupos.filter((grupo) => {
        if (!grupo.obrigatorio) return false;
        const selecao = selecoes[grupo.id];
        return grupo.tipo === "radio" ? !selecao : selecao.length === 0;
      }),
    [selecoes],
  );

  const podeAdicionar = obrigatoriosPendentes.length === 0;

  // ===== 5) Montagem do item final e envio ao carrinho =====
  const adicionarAoCarrinho = () => {
    if (!podeAdicionar) return;

    // Texto que aparece no carrinho detalhando a personalização.
    const resumoPersonalizacao = [
      selecoes.base ? `Base: ${selecoes.base}` : null,
      selecoes.complementos.length > 0 ? `Complementos: ${selecoes.complementos.join(", ")}` : null,
      selecoes.frutas.length > 0 ? `Frutas: ${selecoes.frutas.join(", ")}` : null,
      selecoes.coberturas.length > 0 ? `Coberturas: ${selecoes.coberturas.join(", ")}` : null,
      selecoes.adicionais.length > 0 ? `Adicionais: ${selecoes.adicionais.join(", ")}` : null,
    ]
      .filter(Boolean)
      .join(" • ");

    // ID único por combinação de opções para evitar misturar configurações diferentes.
    const chavePersonalizacao = [
      selecoes.base,
      ...selecoes.complementos,
      ...selecoes.frutas,
      ...selecoes.coberturas,
      ...selecoes.adicionais,
    ]
      .map(slugify)
      .join("_");

    const itemCarrinho = {
      id: `${item?.id ?? slugify(nomeProduto)}-${chavePersonalizacao || "padrao"}`,
      title: nomeProduto,
      price: precoFinalFormatado,
      unitPriceCents: precoFinalCents,
      customizacao: resumoPersonalizacao,
    };

    addItem(itemCarrinho);
    // Após confirmar, direciona direto para revisão do pedido.
    navigate("/carrinho");
  };

  // ===== 6) Render da tela de personalização =====
  return (
    <main className="app-shell mx-auto min-h-screen w-full max-w-md bg-transparent text-zinc-900">
      <div className="min-h-screen pb-28">
        {/* Topo fixo com ação de voltar */}
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-200/80 bg-white/90 px-3 py-2 backdrop-blur">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-fuchsia-700 transition-colors duration-200 hover:bg-fuchsia-50"
          >
            ← Voltar
          </button>
          <p className="truncate text-xs text-zinc-600">Monte do seu jeito </p>
        </div>

        <img src={ImgAcai} alt={nomeProduto} className="h-36 w-full object-cover" />

        {/* Resumo de preço e regra de complementos */}
        <section className="surface-card mx-3 -mt-4 rounded-2xl px-3 py-3">
          <h1 className="text-base font-semibold">{nomeProduto}</h1>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600">
            {limiteGratisComplementos} complementos grátis neste tamanho. Cada complemento extra custa{" "}
            {formatCents(EXTRA_COMPLEMENT_CENTS)}.
          </p>
          <p className="mt-2 text-lg font-bold text-fuchsia-700">{precoFinalFormatado}</p>
          {qtdComplementosCobrados > 0 ? (
            <p className="mt-1 text-xs font-medium text-amber-600">
              {/* Mostra custo extra em tempo real para transparência de preço */}
              Acréscimo atual: +{formatCents(acrescimoComplementosCents)} ({qtdComplementosCobrados} extra)
            </p>
          ) : null}
        </section>

        {/* Grupos de personalização */}
        <div className="space-y-2.5 px-3 py-3">
          {grupos.map((grupo) => (
            <SecaoOpcoes
              key={grupo.id}
              grupo={grupo}
              selecao={selecoes[grupo.id]}
              onSelect={selecionarOpcao}
              subtitulo={
                grupo.id === "complementos"
                  ? `${limiteGratisComplementos} grátis • ${formatCents(EXTRA_COMPLEMENT_CENTS)} por adicional`
                  : grupo.subtitulo
              }
              contador={
                grupo.tipo === "radio"
                  ? `${selecoes[grupo.id] ? 1 : 0}/1`
                  : grupo.id === "complementos"
                    ? `${selecoes[grupo.id].length}/${limiteGratisComplementos} grátis`
                    : grupo.max
                      ? `${selecoes[grupo.id].length}/${grupo.max}`
                      : `${selecoes[grupo.id].length}`
              }
            />
          ))}
        </div>

        {/* Barra fixa de confirmação */}
        <div className="safe-bottom sticky-panel fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-slate-200 px-3 pb-3 pt-2">
          {!podeAdicionar ? (
            <p className="mb-2 text-center text-[11px] font-semibold text-fuchsia-700">
              Complete os obrigatórios: {obrigatoriosPendentes.map((grupo) => grupo.titulo).join(" e ")}.
            </p>
          ) : null}
          <button
            type="button"
            onClick={adicionarAoCarrinho}
            disabled={!podeAdicionar}
            className={`w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors duration-200 ${
              podeAdicionar ? "bg-fuchsia-700 hover:bg-fuchsia-800" : "cursor-not-allowed bg-slate-400"
            }`}
          >
            Adicionar ao carrinho • {precoFinalFormatado}
          </button>
        </div>
      </div>
    </main>
  );
}

export default Adicao;
