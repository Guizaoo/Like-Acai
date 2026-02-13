import { useLocation, useNavigate } from "react-router-dom";
import ImgAcai from "../assets/ImgAcai.png";

const grupos = [
  {
    titulo: "Escolha sua Base",
    subtitulo: "Escolha 1 item",
    contador: "0/1",
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
    titulo: "Complementos",
    subtitulo: "Escolha até 4 itens",
    contador: "0/4",
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
    titulo: "Frutas",
    subtitulo: "Escolha até 3 itens",
    contador: "0/3",
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
    titulo: "Coberturas",
    subtitulo: "Escolha até 2 itens",
    contador: "0/2",
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
    titulo: "Adicionais",
    subtitulo: "Escolha se desejar",
    contador: "0/9",
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

function SecaoOpcoes({ grupo }) {
  return (
    <section className="border-t border-zinc-200 px-3 py-2.5">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-xs font-semibold text-zinc-900">{grupo.titulo}</h2>
          <p className="text-[11px] text-zinc-500">{grupo.subtitulo}</p>
        </div>
        <span className="text-[11px] font-semibold text-zinc-500">{grupo.contador}</span>
      </div>

      <div className="space-y-1">
        {grupo.opcoes.map((opcao) => (
          <label key={`${grupo.titulo}-${opcao.nome}`} className="flex items-center justify-between gap-2 py-0.5">
            <span className={`text-[12px] ${opcao.destaque ? "text-fuchsia-700" : "text-zinc-700"}`}>
              {opcao.nome}
            </span>
            <input
              type={grupo.tipo}
              name={grupo.titulo}
              className="h-4 w-4 rounded-full border-zinc-300 text-fuchsia-600 focus:ring-fuchsia-500"
            />
          </label>
        ))}
      </div>

      {grupo.obrigatorio ? <p className="pt-1 text-[10px] font-semibold text-fuchsia-600">Obrigatório</p> : null}
    </section>
  );
}

function Adicao() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const item = state?.item;

  const nomeProduto = item?.title ?? "Açaí 700ml";
  const precoProduto = item?.price ?? "R$ 28,97";

  return (
    <main className="mx-auto min-h-screen w-full max-w-sm bg-[#ededf0] text-zinc-900">
      <div className="min-h-screen bg-white pb-24">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-fuchsia-600"
        >
          ← Voltar
        </button>

        <img src={ImgAcai} alt={nomeProduto} className="h-28 w-full object-cover" />

        <section className="border-b border-zinc-200 px-3 py-2.5">
          <h1 className="text-sm font-semibold">{nomeProduto}</h1>
          <p className="mt-1 text-xs leading-snug text-zinc-600">
            Monte seu açaí com até 4 opções dos complementos para você se deliciar.
          </p>
          <p className="mt-2 text-base font-bold text-fuchsia-700">{precoProduto}</p>
        </section>

        {grupos.map((grupo) => (
          <SecaoOpcoes key={grupo.titulo} grupo={grupo} />
        ))}

        <div className="fixed bottom-0 left-1/2 w-full max-w-sm -translate-x-1/2 border-t border-zinc-200 bg-white px-3 pb-3 pt-2">
          <button
            type="button"
            className="w-full rounded bg-fuchsia-700 py-2.5 text-[11px] font-bold uppercase tracking-wide text-white"
          >
            Adicionar ao carrinho • {precoProduto}
          </button>
        </div>
      </div>
    </main>
  );
}

export default Adicao;
