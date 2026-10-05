import { GoogleGenerativeAI } from "@google/generative-ai";

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
4. Untuk permohonan yang membutuhkan verifikasi data pribadi/rahasia (seperti cetak ulang kartu NPWP resmi, pengecekan data spesifik, atau sengketa pajak), arahkan Wajib Pajak untuk menghubungi Account Representative (AR) atau loket TPT KPP Pratama Rengat.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed. Gunakan POST." });
  }

  const { question, history } = req.body;
  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: "Pertanyaan tidak boleh kosong." });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "⚠️ API Key Gemini AI belum dikonfigurasi di sisi server." });
  }

  let conversationContext = "";
  if (Array.isArray(history) && history.length > 0) {
    const recent = history
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

${conversationContext}Pertanyaan Wajib Pajak: "${question.trim()}"`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        });
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        if (text && text.trim().length > 0) {
          return res.status(200).json({ answer: text.trim() });
        }
      } catch (err) {
        console.warn(`[api/chat] Model ${modelName} gagal:`, err?.message || err);
        lastError = err;
      }
    }

    throw lastError || new Error("Semua model Gemini sedang tidak merespons.");
  } catch (error) {
    console.error("Error dari Gemini AI:", error);
    return res.status(500).json({
      error: `Mohon maaf, sistem AI kami sedang mengalami lonjakan antrean sementara. Silakan coba kembali dalam beberapa saat.`
    });
  }
}
