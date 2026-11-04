import { useState, useRef, useEffect } from "react";
import { BsWhatsapp } from "react-icons/bs";
import {
  FiX,
  FiSend,
  FiZap,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

const WA_TEMPLATES = [
  {
    id: "billing_phtb",
    icon: "🧾",
    label: "Kode Billing PHTB",
    text: `Halo Helpdesk KPP Pratama Rengat, saya ingin mengajukan permohonan pembuatan Kode Billing PPh Pengalihan Tanah/Bangunan (PHTB):
- Nama Wajib Pajak: 
- NIK: 
- NOP PBB: 
- Nominal Transaksi: 
- Nominal PPh Terutang: 
Mohon dibantu pembuatan kode billing resminya. Terima kasih.`
  },
  {
    id: "efin",
    icon: "🔑",
    label: "Aktivasi / Reset EFIN",
    text: `Halo Helpdesk KPP Pratama Rengat, saya memerlukan bantuan untuk Aktivasi / Reset EFIN:
- Nama Lengkap: 
- NIK: 
- NPWP: 
- Email Aktif: 
- No. WhatsApp: 
Foto KTP fisik dan selfie memegang KTP siap saya lampirkan. Terima kasih.`
  },
  {
    id: "pp20_umkm",
    icon: "📊",
    label: "Konsultasi PP 20/2026",
    text: `Halo Helpdesk KPP Pratama Rengat, saya ingin berkonsultasi mengenai ketentuan tarif PPh Final UMKM 0,5% sesuai PP No. 20 Tahun 2026 dan batasan omzet bebas pajak hingga Rp 500 juta bagi Orang Pribadi. Mohon panduan perhitungannya. Terima kasih.`
  },
  {
    id: "validasi_ssp",
    icon: "📄",
    label: "Validasi SSP Tanah",
    text: `Halo Helpdesk KPP Pratama Rengat, saya ingin menanyakan status penelitian formal / validasi bukti setor SSP PHTB (jual beli tanah):
- Nama Pemohon: 
- NOP Objek Pajak: 
- Kode NTPN Setoran: 
Mohon informasi konfirmasi validasinya. Terima kasih.`
  },
  {
    id: "layanan_tpt",
    icon: "🏛️",
    label: "Layanan Loket TPT",
    text: `Halo Helpdesk KPP Pratama Rengat, saya berencana datang ke kantor KPP Pratama Rengat hari ini untuk keperluan layanan tatap muka di Loket TPT. Apakah loket saat ini sedang beroperasi normal dan berkas apa saja yang perlu saya bawa? Terima kasih.`
  }
];

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hasDragged, setHasDragged] = useState(false);

  const inputRef = useRef(null);
  const chipsRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const waNumber = "628125000213"; // Nomor WhatsApp resmi Helpdesk KPP Pratama Rengat

  const checkScroll = () => {
    if (chipsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = chipsRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(checkScroll, 180);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const scrollChips = (direction) => {
    if (chipsRef.current) {
      const offset = direction === "left" ? -140 : 140;
      chipsRef.current.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(checkScroll, 250);
    }
  };

  // Geser dengan roda mouse (vertical wheel to horizontal scroll)
  const handleWheel = (e) => {
    if (chipsRef.current && e.deltaY !== 0) {
      chipsRef.current.scrollLeft += e.deltaY * 0.85;
      checkScroll();
    }
  };

  // Drag-to-scroll dengan mouse (geser mouse)
  const handleMouseDown = (e) => {
    if (!chipsRef.current) return;
    isDraggingRef.current = true;
    setHasDragged(false);
    startXRef.current = e.pageX - chipsRef.current.offsetLeft;
    scrollLeftRef.current = chipsRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !chipsRef.current) return;
    e.preventDefault();
    const x = e.pageX - chipsRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.35;
    if (Math.abs(walk) > 4) {
      setHasDragged(true);
    }
    chipsRef.current.scrollLeft = scrollLeftRef.current - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleSend = () => {
    if (message.trim()) {
      window.open(
        `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
      setIsOpen(false);
      setMessage("");
      setSelectedTemplateId(null);
    }
  };

  const handleSelectTemplate = (template) => {
    setMessage(template.text);
    setSelectedTemplateId(template.id);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleClearMessage = () => {
    setMessage("");
    setSelectedTemplateId(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        zIndex: 1000,
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {isOpen && (
        <div
          style={{
            backgroundColor: "#efeae2",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.22)",
            width: "350px",
            maxWidth: "calc(100vw - 32px)",
            marginBottom: "20px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            animation: "fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            transformOrigin: "bottom left",
            border: "1px solid rgba(0,0,0,0.08)"
          }}
        >
          <style>
            {`
              @keyframes fadeUp {
                from { opacity: 0; transform: translateY(20px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              .wa-chat-bg {
                background-color: #efeae2;
                background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
              }
              .wa-chips-container {
                display: flex;
                gap: 6px;
                overflow-x: auto;
                padding: 4px 6px 6px;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
              }
              /* Scrollbar tipis dan estetik agar pengguna tahu ada opsi di kanan */
              .wa-chips-container::-webkit-scrollbar {
                height: 4px;
              }
              .wa-chips-container::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.05);
                border-radius: 4px;
              }
              .wa-chips-container::-webkit-scrollbar-thumb {
                background: #94A3B8;
                border-radius: 4px;
              }
              .wa-chips-container::-webkit-scrollbar-thumb:hover {
                background: #00A884;
              }
              .wa-template-chip {
                white-space: nowrap;
                background-color: #FFFFFF;
                color: #1E293B;
                border: 1px solid #CBD5E1;
                border-radius: 20px;
                padding: 5px 11px;
                font-size: 11.5px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                flex-shrink: 0;
                user-select: none;
                box-shadow: 0 1px 2px rgba(0,0,0,0.04);
              }
              .wa-template-chip:hover {
                background-color: #E8F5E9;
                border-color: #00A884;
                color: #005E54;
                transform: translateY(-1px);
              }
              .wa-template-chip.active {
                background-color: #00A884;
                color: #FFFFFF;
                border-color: #008769;
                box-shadow: 0 2px 6px rgba(0, 168, 132, 0.35);
              }
              .wa-clear-btn {
                background: none;
                border: none;
                color: #64748B;
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: color 0.15s, background-color 0.15s;
              }
              .wa-clear-btn:hover {
                color: #DC2626;
                background-color: rgba(220, 38, 38, 0.08);
              }
              .wa-nav-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background-color: #005E54;
                color: #FFFFFF;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 5;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                transition: all 0.15s ease;
              }
              .wa-nav-arrow:hover {
                background-color: #00A884;
                transform: translateY(-50%) scale(1.12);
              }
              .wa-nav-left {
                left: 4px;
              }
              .wa-nav-right {
                right: 4px;
              }
            `}
          </style>

          {/* Header */}
          <div
            style={{
              backgroundColor: "#005e54",
              color: "#fff",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              position: "relative"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                backgroundColor: "#fff",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                flexShrink: 0,
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)"
              }}
            >
              <img
                src="https://ui-avatars.com/api/?name=KPP+Rengat&background=002B49&color=FFD100&bold=true&rounded=true"
                alt="Helpdesk KPP Pratama Rengat"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "14.5px",
                  marginBottom: "2px",
                  color: "#FFFFFF"
                }}
              >
                Helpdesk KPP Pratama
              </div>
              <div
                style={{
                  fontSize: "11.5px",
                  opacity: 0.9,
                  color: "#D1FAE5",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#10B981"
                  }}
                />
                Layanan Resmi WhatsApp DJP
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                transition: "background 0.2s"
              }}
              aria-label="Tutup Obrolan"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Body Pesan */}
          <div
            className="wa-chat-bg"
            style={{
              padding: "16px 16px 12px",
              minHeight: "120px",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "12px 14px",
                borderRadius: "0 12px 12px 12px",
                display: "inline-block",
                maxWidth: "92%",
                fontSize: "13px",
                lineHeight: "1.5",
                position: "relative",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                color: "#1E293B"
              }}
            >
              <svg
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-8px",
                  width: "8px",
                  height: "13px",
                  color: "#fff"
                }}
                viewBox="0 0 8 13"
              >
                <path
                  d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"
                  fill="currentColor"
                />
              </svg>
              Selamat datang di WhatsApp KPP Pratama Rengat 👋
              <br />
              <br />
              Pilih template cepat di bawah atau ketik pesan Anda langsung untuk
              berkonsultasi dengan petugas kami.
              <div
                style={{
                  textAlign: "right",
                  fontSize: "10.5px",
                  color: "#94A3B8",
                  marginTop: "6px"
                }}
              >
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>
          </div>

          {/* Preset Quick Chips Bar */}
          <div
            style={{
              backgroundColor: "#F4F6F8",
              borderTop: "1px solid #E2E8F0",
              borderBottom: "1px solid #E2E8F0",
              padding: "8px 10px 6px"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "4px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#005E54",
                padding: "0 2px"
              }}
            >
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
              >
                <FiZap size={13} color="#00A884" />
                <span>Pilih Template Cepat (Geser ⇄):</span>
              </span>
              {message && (
                <button
                  type="button"
                  onClick={handleClearMessage}
                  className="wa-clear-btn"
                  title="Kosongkan Teks"
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px"
                  }}
                >
                  <FiTrash2 size={11} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Area Carousel Chips dengan Navigasi Panah & Drag Mouse */}
            <div style={{ position: "relative" }}>
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scrollChips("left")}
                  className="wa-nav-arrow wa-nav-left"
                  aria-label="Geser ke kiri"
                  title="Geser ke kiri"
                >
                  <FiChevronLeft size={13} />
                </button>
              )}

              <div
                ref={chipsRef}
                onScroll={checkScroll}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className="wa-chips-container"
                style={{
                  cursor: "grab",
                  paddingLeft: canScrollLeft ? "20px" : "4px",
                  paddingRight: canScrollRight ? "20px" : "4px"
                }}
              >
                {WA_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      if (hasDragged) return;
                      handleSelectTemplate(tpl);
                    }}
                    className={`wa-template-chip ${
                      selectedTemplateId === tpl.id ? "active" : ""
                    }`}
                    title={`Klik untuk mengisi template: ${tpl.label}`}
                  >
                    <span>{tpl.icon}</span>
                    <span>{tpl.label}</span>
                  </button>
                ))}
              </div>

              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scrollChips("right")}
                  className="wa-nav-arrow wa-nav-right"
                  aria-label="Geser ke kanan untuk melihat pilihan lainnya"
                  title="Geser ke kanan"
                >
                  <FiChevronRight size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Footer Input */}
          <div
            style={{
              padding: "10px 12px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              gap: "8px",
              alignItems: "flex-end"
            }}
          >
            <div
              style={{
                flex: 1,
                position: "relative",
                display: "flex",
                alignItems: "center"
              }}
            >
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (selectedTemplateId) setSelectedTemplateId(null);
                }}
                placeholder="Ketik pesan atau pilih template di atas..."
                onKeyDown={handleKeyDown}
                rows={message.includes("\n") ? 3 : 1}
                style={{
                  width: "100%",
                  padding: "9px 34px 9px 14px",
                  borderRadius: message.includes("\n") ? "12px" : "24px",
                  border: "1.5px solid #CBD5E1",
                  outline: "none",
                  fontSize: "13px",
                  lineHeight: "1.4",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.05)",
                  backgroundColor: "#FFFFFF",
                  resize: "none",
                  fontFamily: "inherit",
                  maxHeight: "90px"
                }}
              />
              {message && (
                <button
                  type="button"
                  onClick={handleClearMessage}
                  className="wa-clear-btn"
                  title="Hapus pesan"
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: message.includes("\n") ? "10px" : "50%",
                    transform: message.includes("\n") ? "none" : "translateY(-50%)"
                  }}
                >
                  <FiX size={15} />
                </button>
              )}
            </div>

            <button
              onClick={handleSend}
              disabled={!message.trim()}
              style={{
                backgroundColor: message.trim() ? "#00a884" : "#94A3B8",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: message.trim() ? "pointer" : "default",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
                transition: "background-color 0.2s, transform 0.15s",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                marginBottom: message.includes("\n") ? "2px" : 0
              }}
              aria-label="Kirim Pesan WhatsApp"
              title="Kirim ke WhatsApp Petugas"
            >
              <FiSend size={16} style={{ marginLeft: "2px" }} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button WhatsApp */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: "#25D366",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "50%",
          width: "62px",
          height: "62px",
          cursor: "pointer",
          boxShadow: "0 6px 18px rgba(37,211,102,0.45)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: isOpen
            ? "scale(0.85) rotate(-15deg)"
            : "scale(1) rotate(0)",
          zIndex: 1001,
          position: "relative"
        }}
        aria-label="Buka WhatsApp Helpdesk KPP Pratama Rengat"
        title="Hubungi Helpdesk WhatsApp KPP Pratama Rengat"
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <BsWhatsapp size={32} />
      </button>
    </div>
  );
};

export default FloatingWhatsApp;
