import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const PIX_KEY = "likeacai@pix.com.br";
const MERCHANT_NAME = "LIKE ACAI";
const MERCHANT_CITY = "SAO LUIS";
const TXID = "LIKEACAI001";
const WHATSAPP_PHONE = "5598988831316";

function tlv(id, value) {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

function crc16(payload) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j += 1) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function buildPixPayload(amountCents) {
  const amount = (amountCents / 100).toFixed(2);
  const merchantAccount = tlv("00", "br.gov.bcb.pix") + tlv("01", PIX_KEY);
  const additionalData = tlv("05", TXID);

  const payloadWithoutCRC =
    tlv("00", "01") +
    tlv("26", merchantAccount) +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", amount) +
    tlv("58", "BR") +
    tlv("59", MERCHANT_NAME) +
    tlv("60", MERCHANT_CITY) +
    tlv("62", additionalData) +
    "6304";

  return payloadWithoutCRC + crc16(payloadWithoutCRC);
}

function Pagamento() {
  const navigate = useNavigate();
  const { items, totalPriceCents, totalPriceFormatted, clearCart } = useCart();
  const [copied, setCopied] = useState(false);

  const pixPayload = useMemo(() => buildPixPayload(totalPriceCents), [totalPriceCents]);
  const qrCodeUrl = useMemo(
    () => `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(pixPayload)}`,
    [pixPayload],
  );

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const goToWhatsAppForLocation = () => {
    const message = `Olá! Já paguei meu pedido via Pix (${totalPriceFormatted}). Vou enviar minha localização para entrega agora.`;
    const encodedMessage = encodeURIComponent(message);
    const primaryUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
    const fallbackUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedMessage}`;

    const openedWindow = window.open(primaryUrl, "_blank", "noopener,noreferrer");
    if (!openedWindow) {
      window.location.assign(fallbackUrl);
    }

    clearCart();
  };

  if (items.length === 0) {
    return (
      <main className="app-shell mx-auto min-h-screen w-full max-w-md bg-transparent px-3 py-4 text-slate-800">
        <section className="surface-card rounded-2xl p-5 text-center">
          <p className="text-sm font-semibold">Não há pedido para pagamento.</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 rounded-xl bg-fuchsia-700 px-4 py-2 text-xs font-semibold text-white"
          >
            Voltar para início
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell mx-auto min-h-screen w-full max-w-md bg-transparent pb-6 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate("/carrinho")}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-fuchsia-700 transition-colors duration-200 hover:bg-fuchsia-50"
          >
            ← Voltar
          </button>
          <h1 className="text-base font-bold">Pagamento via Pix</h1>
          <span className="text-[11px] font-semibold text-emerald-600">Seguro</span>
        </div>
      </header>

      <section className="px-3 pt-3">
        <div className="surface-card rounded-2xl p-4 text-center">
          <p className="text-xs text-slate-600">Valor total</p>
          <p className="mt-1 text-2xl font-black text-fuchsia-700">{totalPriceFormatted}</p>
          <p className="mt-2 text-[11px] text-slate-500">Escaneie o QR Code no app do seu banco</p>

          <div className="mx-auto mt-3 w-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <img src={qrCodeUrl} alt="QR Code Pix para pagamento do pedido" className="h-56 w-56 rounded-lg" />
          </div>

          <div className="mt-3 rounded-xl bg-slate-50 p-2 text-left">
            <p className="text-[11px] font-semibold text-slate-600">Pix Copia e Cola</p>
            <p className="mt-1 break-all text-[11px] text-slate-500">{pixPayload}</p>
          </div>

          <button
            type="button"
            onClick={copyPixCode}
            className="mt-3 w-full rounded-xl border border-fuchsia-200 bg-fuchsia-50 py-2 text-xs font-semibold text-fuchsia-700 transition-colors duration-200 hover:bg-fuchsia-100"
          >
            {copied ? "Código Pix copiado!" : "Copiar código Pix"}
          </button>
        </div>
      </section>

      <section className="px-3 pt-3">
        <button
          type="button"
          onClick={goToWhatsAppForLocation}
          className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-emerald-700"
        >
          Já paguei, enviar localização no WhatsApp
        </button>
      </section>
    </main>
  );
}

export default Pagamento;
