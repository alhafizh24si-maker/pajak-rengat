import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Daftar model dengan urutan prioritas terbaik & kecepatan respons tertinggi
const CANDIDATE_MODELS = [
  "gemini-3.8-flash",      // Model utama tercepat & paling akurat
  "gemini-flash-latest",   // Fallback alias super cepat
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite", // Fallback lite
  "gemini-3.5-flash",
];

const SYSTEM_INSTRUCTION = `Anda adalah Asisten Virtual (Chatbot) AI resmi untuk Kantor Pelayanan Pajak (KPP) Pratama Rengat, Direktorat Jenderal Pajak (DJP).
Tugas Anda adalah melayani dan menjawab pertanyaan Wajib Pajak seputar perpajakan di Indonesia secara ramah, informatif, ringkas, dan akurat dalam Bahasa Indonesia.

Informasi Kantor & Wilayah Layanan:
- Lokasi Kantor: KPP Pratama Rengat beralamat di Jalan Bupati Tulus No.9 Kampung Besar Kota, Sekip Hulu, Kec. Rengat, Kabupaten Indragiri Hulu, Riau 29319.
- Wilayah Kerja Pengawasan: Meliputi Kabupaten Indragiri Hulu (Inhu), Kabupaten Indragiri Hilir (Inhil), dan Kabupaten Kuantan Singingi (Kuansing).
- Jam Pelayanan Tatap Muka (TPT): Senin s.d. Jumat, pukul 08.00 - 16.00 WIB (hari kerja).
- Layanan Digital: Portal resmi Coretax DJP (pendaftaran NPWP/NITKU, pelaporan SPT Tahunan/Masa, pembuatan kode billing, dsb.).

Layanan Populer:
1. Pembuatan Kode Billing: PPh Final UMKM (0,5%) dan PPh Pengalihan Hak atas Tanah/Bangunan (PHTB).
2. Pelaporan SPT Masa PPN bagi Pengusaha Kena Pajak (PKP) via Coretax.
3. Surat Keterangan Bebas (SKB): Diproses maksimal 3 hari kerja setelah berkas lengkap.
4. Pemutakhiran Profil: NIK-NPWP, perubahan email dan nomor HP terdaftar.

Aturan Respons:
1. Berikan jawaban langsung, ramah, dan sopan kepada Wajib Pajak tanpa menampilkan evaluasi atau catatan teknis internal sistem.
2. Gunakan poin-poin (bullet points) atau langkah bernomor agar mudah dipahami.
3. Jika pertanyaan sepenuhnya di luar konteks perpajakan, keuangan, atau administrasi negara, tolak dengan sopan dan jelaskan bahwa Anda dikhususkan untuk melayani perpajakan.
4. Untuk permohonan data pribadi/rahasia, sengketa pajak, atau konfirmasi bukti pembayaran khusus, sarankan berkonsultasi langsung dengan petugas Helpdesk WhatsApp atau Account Representative (AR) di KPP Pratama Rengat.`;

export const askGemini = async (question, chatHistory = []) => {
  if (!question || typeof question !== "string" || !question.trim()) {
    return "Silakan masukkan pertanyaan Anda seputar perpajakan.";
  }

  // 1. Coba lewat client SDK jika apiKey tersedia
  if (apiKey && genAI) {
    let conversationContext = "";
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      const recent = chatHistory
        .filter((m) => m && m.text && typeof m.text === "string")
        .slice(-4);
      if (recent.length > 0) {
        conversationContext =
          "Konteks percakapan sebelumnya:\n" +
          recent
            .map((m) => `${m.sender === "USER" ? "Wajib Pajak" : "Asisten AI"}: ${m.text}`)
            .join("\n") +
          "\n\n";
      }
    }

    const userPrompt = conversationContext
      ? `${conversationContext}Pertanyaan Wajib Pajak: "${question.trim()}"`
      : question.trim();

    let lastError = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_INSTRUCTION,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();

        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch (err) {
        console.warn(`[Gemini AI] Model '${modelName}' gagal, mencoba fallback...`, err?.message || err);
        lastError = err;
      }
    }

    console.error("[Gemini AI] Semua model client-side mengalami kendala:", lastError);
  }

  // 2. Fallback ke Serverless Function (/api/chat) jika berjalan di Vercel
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history: chatHistory }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.answer) {
        return data.answer;
      }
    }
  } catch (err) {
    console.warn("[Gemini AI] Fallback /api/chat gagal:", err?.message || err);
  }

  // 3. Jika API key belum terkonfigurasi di Vercel/Client
  if (!apiKey) {
    return "⚠️ API Key Gemini AI belum dikonfigurasi di Vercel.\n\nSilakan tambahkan `VITE_GEMINI_API_KEY` (dan `GEMINI_API_KEY`) di menu Settings > Environment Variables pada dashboard Vercel Anda, lalu lakukan Redeploy.";
  }

  return `Mohon maaf, sistem AI kami sedang mengalami lonjakan antrean atau kendala jaringan sementara. Silakan coba kirim ulang pertanyaan Anda dalam beberapa saat, atau pilih menu bantuan di bawah untuk terhubung dengan petugas kami.`;
};
