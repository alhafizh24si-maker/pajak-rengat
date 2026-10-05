import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Daftar model dengan urutan prioritas terbaik & kecepatan respons tertinggi
const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite", // Sangat cepat (~1.5 detik) dan stabil
  "gemini-3.5-flash",      // Kapasitas besar dan sangat akurat
  "gemini-flash-latest",   // Fallback alias Google
  "gemini-3.8-flash",      // Model preview terbaru
  "gemini-flash-lite-latest",
];

const SYSTEM_INSTRUCTION = `Anda adalah Asisten Virtual (Chatbot) AI resmi untuk KPP Pratama Rengat (Direktorat Jenderal Pajak).
Tugas Anda adalah melayani dan menjawab pertanyaan Wajib Pajak seputar perpajakan di Indonesia (NPWP, Coretax, SPT Tahunan/Masa, Kode Billing, PPh, PPN, SKB, dll.) secara ramah, informatif, ringkas, dan akurat dalam Bahasa Indonesia.

Aturan:
1. Berikan jawaban langsung, ramah, dan sopan kepada Wajib Pajak tanpa menampilkan evaluasi atau catatan internal sistem.
2. Gunakan poin-poin yang mudah dipahami bila menjelaskan langkah atau persyaratan.
3. Jika pertanyaan sepenuhnya di luar konteks perpajakan atau keuangan, tolak dengan sopan dan jelaskan bahwa Anda dikhususkan untuk melayani pertanyaan perpajakan.
4. Untuk permohonan data pribadi/rahasia atau sengketa pajak, sarankan untuk berkonsultasi langsung dengan Account Representative (AR) di KPP Pratama Rengat.`;

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
