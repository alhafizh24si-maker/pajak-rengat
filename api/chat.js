import { GoogleGenerativeAI } from "@google/generative-ai";

// Daftar model teruji dengan prioritas tercepat & paling stabil
const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
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

export default async function handler(req, res) {
  // 1. Header CORS & Preflight OPTIONS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Gunakan POST." });
  }

  // 2. Parsing & Validasi Request Body
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Format request body JSON tidak valid." });
    }
  }

  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Request body tidak ditemukan." });
  }

  const { question, history } = body;
  if (!question || typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "Pertanyaan tidak boleh kosong." });
  }

  // Batasi panjang pertanyaan untuk efisiensi token & pencegahan spam
  const cleanQuestion = question.trim().slice(0, 1500);

  // 3. Konfigurasi API Key
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "⚠️ API Key Gemini AI belum dikonfigurasi di sisi server." });
  }

  // 4. Susun Konteks Percakapan (Multi-turn chat context)
  let conversationContext = "";
  if (Array.isArray(history) && history.length > 0) {
    const recent = history
      .filter((m) => m && typeof m.text === "string" && m.text.trim())
      .slice(-5);
    if (recent.length > 0) {
      conversationContext =
        "Riwayat percakapan sebelumnya:\n" +
        recent
          .map((m) => {
            const role = m.sender === "USER" ? "Wajib Pajak" : "Asisten AI KPP Rengat";
            const text = m.text.trim().slice(0, 500);
            return `${role}: ${text}`;
          })
          .join("\n") +
        "\n\n";
    }
  }

  const userPrompt = conversationContext
    ? `${conversationContext}Pertanyaan Wajib Pajak: "${cleanQuestion}"`
    : cleanQuestion;

  // 5. Panggil Gemini AI dengan Fallback Model Otomatis
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
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
          return res.status(200).json({ answer: text.trim() });
        }
      } catch (err) {
        console.warn(`[api/chat] Model ${modelName} kendala:`, err?.message || err);
        lastError = err;
      }
    }

    throw lastError || new Error("Semua model Gemini sedang tidak merespons.");
  } catch (error) {
    console.error("Error dari Gemini AI:", error);
    return res.status(500).json({
      error: "Mohon maaf, sistem AI kami sedang mengalami lonjakan antrean sementara. Silakan coba kembali dalam beberapa saat.",
    });
  }
}
