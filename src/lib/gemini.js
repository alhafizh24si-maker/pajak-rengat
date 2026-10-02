import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const askGemini = async (question) => {
  if (!apiKey) {
    return "⚠️ API Key Gemini AI belum dikonfigurasi. Silakan tambahkan `VITE_GEMINI_API_KEY` di file .env (atau di Vercel Environment Variables).";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Anda adalah Asisten Virtual (Chatbot) AI resmi untuk KPP Pratama Rengat.
Tugas Anda adalah menjawab pertanyaan seputar perpajakan di Indonesia dari Wajib Pajak dengan ramah, jelas, ringkas, dan akurat.
Aturan:
1. Jawab menggunakan Bahasa Indonesia yang mudah dipahami (tidak terlalu kaku).
2. Jika pertanyaan di luar konteks perpajakan, tolak dengan halus dan katakan Anda hanya bisa menjawab soal pajak.
3. Selalu sarankan untuk berkonsultasi langsung dengan petugas atau Account Representative (AR) untuk hal yang bersifat sangat teknis/pribadi.
    
Pertanyaan Wajib Pajak: "${question}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error dari Gemini AI:", error);
    return `Maaf, sistem AI kami sedang mengalami gangguan teknis. Error details: ${error.message}`;
  }
};
