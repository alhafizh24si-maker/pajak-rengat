import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Daftar model dengan urutan prioritas terbaik & fallback otomatis.
// Jika satu model mengalami 503 (high demand) atau 429 (rate limit), otomatis beralih ke model berikutnya.
const CANDIDATE_MODELS = [
  "gemini-flash-latest",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-flash-lite-latest",
];

const SYSTEM_INSTRUCTION = `Anda adalah Asisten Virtual (Chatbot) AI resmi untuk KPP Pratama Rengat (Direktorat Jenderal Pajak).
Tugas Anda adalah melayani dan menjawab pertanyaan Wajib Pajak seputar perpajakan di Indonesia (NPWP, Coretax, SPT Tahunan/Masa, Kode Billing, PPh, PPN, SKB, dll.) secara ramah, informatif, ringkas, dan akurat.

Panduan Jawaban:
1. Berikan penjelasan yang ramah, sopan, dan mudah dipahami oleh Wajib Pajak awam.
2. Gunakan format poin-poin atau bold jika membantu memperjelas langkah-langkah.
3. Jika pertanyaan sepenuhnya di luar konteks perpajakan atau keuangan negara, tolak dengan halus dan jelaskan bahwa Anda dikhususkan untuk melayani pertanyaan perpajakan KPP Pratama Rengat.
4. Untuk hal-hal yang membutuhkan verifikasi data pribadi/rahasia (seperti cetak ulang kartu NPWP resmi, pengecekan data spesifik, atau sengketa pajak), arahkan Wajib Pajak untuk berkonsultasi langsung dengan Account Representative (AR) atau loket TPT KPP Pratama Rengat.`;

export const askGemini = async (question, chatHistory = []) => {
  if (!apiKey || !genAI) {
    return "⚠️ API Key Gemini AI belum dikonfigurasi. Silakan tambahkan `VITE_GEMINI_API_KEY` di file .env Anda.";
  }

  if (!question || typeof question !== "string" || !question.trim()) {
    return "Silakan masukkan pertanyaan Anda seputar perpajakan.";
  }

  // Format riwayat percakapan singkat untuk konteks (maksimal 4 percakapan terakhir)
  let conversationContext = "";
  if (Array.isArray(chatHistory) && chatHistory.length > 0) {
    const recent = chatHistory
      .filter((m) => m && m.text && typeof m.text === "string")
      .slice(-4);
    if (recent.length > 0) {
      conversationContext =
        "\nKonteks percakapan sebelumnya:\n" +
        recent
          .map((m) => `${m.sender === "USER" ? "Wajib Pajak" : "Asisten AI"}: ${m.text}`)
          .join("\n") +
        "\n\n";
    }
  }

  const fullPrompt = `${SYSTEM_INSTRUCTION}

${conversationContext}Pertanyaan Wajib Pajak saat ini: "${question.trim()}"`;

  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err) {
      console.warn(`[Gemini AI] Model '${modelName}' gagal, mencoba fallback berikutnya...`, err?.message || err);
      lastError = err;
      // Otomatis mencoba model berikutnya di CANDIDATE_MODELS
    }
  }

  console.error("[Gemini AI] Semua model mengalami kendala:", lastError);
  return `Mohon maaf, sistem AI kami sedang mengalami lonjakan antrean atau kendala jaringan sementara. Silakan coba kirim ulang pertanyaan Anda dalam beberapa saat, atau pilih menu bantuan di bawah untuk terhubung dengan petugas kami.`;
};
