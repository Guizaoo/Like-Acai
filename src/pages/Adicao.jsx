import { useLocation } from "react-router-dom";

function Adicao() {
  const location = useLocation();
  const item = location.state?.item;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Item Selecionado</h1>

      {item ? (
        <>
          <h2 className="text-xl">{item.title}</h2>
          <p>{item.description}</p>
          <strong className="text-green-400">{item.price}</strong>
        </>
      ) : (
        <p>Nenhum item recebido.</p>
      )}
    </div>
  );
}

export default Adicao;
