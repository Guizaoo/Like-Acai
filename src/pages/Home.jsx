import { useNavigate } from "react-router-dom";

const promoItems = [
  {
    id: 1,
    title: 'Copo Açaí 400ml',
    description: 'Açaí cremoso com 3 complementos.',
    oldPrice: 'R$ 24,90',
    price: 'R$ 19,90',
    image:
      'https://images.unsplash.com/photo-1490323948794-cc6dde6e8f5b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Barca Especial 1L',
    description: 'Monte com frutas frescas e caldas.',
    oldPrice: 'R$ 49,90',
    price: 'R$ 39,90',
    image:
      'https://images.unsplash.com/photo-1490323948794-cc6dde6e8f5b?auto=format&fit=crop&w=1200&q=80',
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#020b14] px-4 py-6 font-sans text-slate-100">
      {/* Seu código inteiro continua igual */}

      {promoItems.map((item) => (
        <article key={item.id}>
          {/* resto igual */}

          <button
            type="button"
            className="rounded-full border border-[#89bfff]/40 bg-[#071726] px-3 py-1 text-sm text-[#89bfff] hover:bg-[#0b1f33]/80"
            onClick={() =>
              navigate("/adicao", { state: { item } })
            }
          >
            Adicionar
          </button>
        </article>
      ))}
    </main>
  );
}

export default Home;
