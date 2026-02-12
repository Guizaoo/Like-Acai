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
]

function App() {
  return (
    <main className="min-h-screen bg-[#020b14] px-4 py-6 font-sans text-slate-100">
      <div className="mx-auto w-full max-w-[460px] overflow-hidden rounded-2xl border border-[#89bfff]/35 bg-[#071726] shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
      

        <section className="relative">
          <img
            className="h-[180px] w-full object-cover opacity-90"
            src="https://images.unsplash.com/photo-1490323948794-cc6dde6e8f5b?auto=format&fit=crop&w=1200&q=80"
            alt="Tigela de açaí com frutas"
          />

          <div className="absolute bottom-3 left-3 rounded-full border-2 border-[#89bfff] bg-black/90 px-4 py-1.5 text-xl font-semibold tracking-tight text-white">
            <span className="text-white">Like </span>
            <span className="text-[#86d65d]">Açaí</span>
          </div>
        </section>

        <section className="space-y-3 px-4 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Like Açaí</h1>
            <p className="mt-1 text-sm text-slate-300">São luis · 30–45 min</p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-emerald-600/25 px-2.5 py-1 text-emerald-400">Aberto</span>
            <span className="text-slate-300">⭐ 4.9 (1.291 avaliações)</span>
          </div>

          <div className="rounded-xl border border-[#89bfff]/20 bg-[#0b1f33]/55 p-3 text-sm text-slate-200">
            Pedido mínimo <strong className="text-white">R$ 20,00</strong> · Entrega <span className="text-[#86d65d]">Grátis</span>
          </div>
        </section>

        <section className="px-4 pb-5">
          <h2 className="mb-3 text-lg font-semibold text-[#89bfff]">Promoções</h2>

          <div className="space-y-3">
            {promoItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border border-[#89bfff]/20 bg-[#0b1f33]/60"
              >
                <img src={item.image} alt={item.title} className="h-28 w-full object-cover" />

                <div className="space-y-1.5 p-3">
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-300">{item.description}</p>
                  <p className="text-xs text-slate-400 line-through">{item.oldPrice}</p>

                  <div className="flex items-center justify-between">
                    <strong className="text-xl font-bold text-[#86d65d]">{item.price}</strong>
                    <button
                      type="button"
                      className="rounded-full border border-[#89bfff]/40 bg-[#071726] px-3 py-1 text-sm text-[#89bfff]"
                      onClick={{}}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <nav className="grid grid-cols-4 border-t border-[#89bfff]/20 bg-[#071726] text-xs">
          <a className="px-2 py-3 text-center text-[#89bfff]" href="#">
            Início
          </a>
          <a className="px-2 py-3 text-center text-slate-400" href="#">
            Buscar
          </a>
          <a className="px-2 py-3 text-center text-slate-400" href="#">
            Carrinho
          </a>
          <a className="px-2 py-3 text-center text-slate-400" href="#">
            Conta
          </a>
        </nav>
      </div>
    </main>
  )
}

export default App
