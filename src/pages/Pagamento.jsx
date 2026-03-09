import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const PIX_KEY = "04151174370";
const MERCHANT_NAME = "LIKE ACAI";
const MERCHANT_CITY = "SAO LUIS";
const TXID = "LIKEACAI001";
const WHATSAPP_PHONE = "559898883316";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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

async function reverseGeocodeWithGoogleMaps(latitude, longitude) {
  if (!GOOGLE_MAPS_API_KEY) return null;

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("latlng", `${latitude},${longitude}`);
    url.searchParams.set("language", "pt-BR");
    url.searchParams.set("key", GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) return null;

    const data = await response.json();
    if (data.status !== "OK" || !Array.isArray(data.results) || data.results.length === 0) {
      return null;
    }

    return data.results[0].formatted_address ?? null;
  } catch {
    return null;
  }
}

async function geocodeAddressWithGoogleMaps(address) {
  if (!GOOGLE_MAPS_API_KEY) return { error: "missing_key" };

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("address", address);
    url.searchParams.set("region", "br");
    url.searchParams.set("language", "pt-BR");
    url.searchParams.set("key", GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) return { error: "network" };

    const data = await response.json();
    if (data.status !== "OK" || !Array.isArray(data.results) || data.results.length === 0) {
      return { error: data.status || "not_found", errorMessage: data.error_message ?? "" };
    }

    const first = data.results[0];
    const location = first?.geometry?.location;
    if (typeof location?.lat !== "number" || typeof location?.lng !== "number") {
      return { error: "not_found", errorMessage: "" };
    }

    return {
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress: first.formatted_address ?? address,
    };
  } catch {
    return { error: "network" };
  }
}

function Pagamento() {
  const navigate = useNavigate();
  const { items, totalPriceCents, totalPriceFormatted, clearCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [mapsError, setMapsError] = useState("");
  const [manualLocationLink, setManualLocationLink] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [previewMapUrl, setPreviewMapUrl] = useState("");

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

  const sendToWhatsAppWithLocation = (mapsLink, addressText = "") => {
    const message = [
      `Olá! Já paguei meu pedido via Pix (${totalPriceFormatted}).`,
      addressText ? `Endereço aproximado: ${addressText}` : null,
      `Localização para entrega (Google Maps): ${mapsLink}`,
      "Aguardando confirmação do pedido.",
    ]
      .filter(Boolean)
      .join("\n");
    const encodedMessage = encodeURIComponent(message);
    const primaryUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
    const fallbackUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedMessage}`;

    const openedWindow = window.open(primaryUrl, "_blank", "noopener,noreferrer");
    if (!openedWindow) {
      window.location.assign(fallbackUrl);
    }

    clearCart();
  };

  const shareCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Seu navegador não suporta geolocalização. Use o link manual abaixo.");
      return;
    }

    setLocationError("");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        const embedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`;
        const addressText =
          (await reverseGeocodeWithGoogleMaps(latitude, longitude)) ??
          `Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(6)}`;
        setResolvedAddress(addressText);
        setPreviewMapUrl(embedUrl);
        setManualLocationLink(mapsLink);
        setIsLocating(false);
        sendToWhatsAppWithLocation(mapsLink, addressText);
      },
      () => {
        setIsLocating(false);
        setLocationError("Não foi possível obter sua localização. Use o envio manual abaixo.");
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      },
    );
  };

  const searchAddressInMaps = async () => {
    const trimmedAddress = addressQuery.trim();
    if (!trimmedAddress) {
      setMapsError("Digite seu endereço para localizar no Google Maps.");
      return;
    }

    setMapsError("");
    setLocationError("");
    setIsSearchingAddress(true);

    const result = await geocodeAddressWithGoogleMaps(trimmedAddress);
    if (result?.error) {
      setIsSearchingAddress(false);
      if (result.error === "missing_key") {
        setMapsError("Falta configurar a chave do Google Maps.");
        return;
      }
      if (result.error === "REQUEST_DENIED") {
        const detail = result.errorMessage ? ` (${result.errorMessage})` : "";
        setMapsError(`Google recusou a chave. Confira restrições de domínio e API Geocoding${detail}`);
        return;
      }
      if (result.error === "OVER_DAILY_LIMIT" || result.error === "OVER_QUERY_LIMIT") {
        setMapsError("Limite da API Google Maps atingido. Verifique billing e cota.");
        return;
      }
      if (result.error === "ZERO_RESULTS") {
        setMapsError("Endereço não encontrado. Tente com rua, número e bairro.");
        return;
      }
      setMapsError("Não foi possível localizar esse endereço agora.");
      return;
    }

    const { latitude, longitude, formattedAddress } = result;
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    const embedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`;

    setResolvedAddress(formattedAddress);
    setPreviewMapUrl(embedUrl);
    setManualLocationLink(mapsLink);
    setIsSearchingAddress(false);
  };

  const shareResolvedAddress = () => {
    if (!manualLocationLink.trim()) {
      setLocationError("Primeiro localize seu endereço para enviar.");
      return;
    }

    setLocationError("");
    sendToWhatsAppWithLocation(manualLocationLink.trim(), resolvedAddress);
  };

  const shareManualLocation = () => {
    const trimmed = manualLocationLink.trim();
    if (!trimmed) {
      setLocationError("Cole um link válido do Google Maps para enviar.");
      return;
    }

    setLocationError("");
    sendToWhatsAppWithLocation(trimmed, resolvedAddress);
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
          onClick={shareCurrentLocation}
          disabled={isLocating}
          className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-emerald-700"
        >
          {isLocating ? "Capturando localização..." : "Já paguei, enviar localização automática"}
        </button>
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-semibold text-slate-600">Ou digite seu endereço para localizar no Google Maps</p>
          <input
            type="text"
            value={addressQuery}
            onChange={(event) => setAddressQuery(event.target.value)}
            placeholder="Ex: Rua X, 123, Bairro, Cidade"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none ring-fuchsia-500 focus:ring"
          />
          <button
            type="button"
            onClick={searchAddressInMaps}
            disabled={isSearchingAddress}
            className="mt-2 w-full rounded-lg border border-emerald-200 bg-emerald-50 py-2 text-xs font-semibold text-emerald-700 transition-colors duration-200 hover:bg-emerald-100"
          >
            {isSearchingAddress ? "Buscando endereço..." : "Localizar endereço"}
          </button>
          {previewMapUrl ? (
            <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
              <iframe
                title="Pré-visualização do endereço no mapa"
                src={previewMapUrl}
                className="h-52 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : null}
          {resolvedAddress ? (
            <button
              type="button"
              onClick={shareResolvedAddress}
              className="mt-3 w-full rounded-lg bg-emerald-600 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-emerald-700"
            >
              Usar esse endereço e enviar no WhatsApp
            </button>
          ) : null}
          {mapsError ? <p className="mt-2 text-center text-xs font-semibold text-rose-600">{mapsError}</p> : null}
        </div>
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-semibold text-slate-600">Se preferir, envie localização manual</p>
          <input
            type="url"
            value={manualLocationLink}
            onChange={(event) => setManualLocationLink(event.target.value)}
            placeholder="Cole aqui o link da sua localização do Google Maps"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none ring-fuchsia-500 focus:ring"
          />
          <button
            type="button"
            onClick={shareManualLocation}
            className="mt-2 w-full rounded-lg border border-fuchsia-200 bg-fuchsia-50 py-2 text-xs font-semibold text-fuchsia-700 transition-colors duration-200 hover:bg-fuchsia-100"
          >
            Enviar localização manual no WhatsApp
          </button>
        </div>
        {resolvedAddress ? (
          <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
            Endereço detectado: <span className="font-semibold">{resolvedAddress}</span>
          </p>
        ) : null}
        {locationError ? <p className="mt-2 text-center text-xs font-semibold text-rose-600">{locationError}</p> : null}
        {!GOOGLE_MAPS_API_KEY ? (
          <p className="mt-2 text-center text-[11px] text-amber-600">
            Dica: configure `VITE_GOOGLE_MAPS_API_KEY` para enviar endereço completo automaticamente.
          </p>
        ) : null}
      </section>
    </main>
  );
}

export default Pagamento;
