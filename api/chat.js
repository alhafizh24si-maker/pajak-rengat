import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Hanya melayani method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed. Gunakan POST." });
  }

  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Pertanyaan tidak boleh kosong." });
  }

  // Gunakan GEMINI_API_KEY dari environment variable server (bukan VITE_)
  // Fallback ke VITE_GEMINI_API_KEY untuk memudahkan transisi jika belum diset di Vercel Dashboard
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: "⚠️ API Key Gemini AI belum dikonfigurasi di sisi server." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

    const prompt = `Anda adalah Asisten Virtual (Chatbot) AI resmi untuk KPP Pratama Rengat.
Tugas Anda adalah menjawab pertanyaan seputar perpajakan di Indonesia dari Wajib Pajak dengan ramah, jelas, ringkas, dan akurat.
Aturan:
1. Jawab menggunakan Bahasa Indonesia yang mudah dipahami (tidak terlalu kaku).
2. Jika pertanyaan di luar konteks perpajakan, tolak dengan halus dan katakan Anda hanya bisa menjawab soal pajak.
3. Selalu sarankan untuk berkonsultasi langsung dengan petugas atau Account Representative (AR) untuk hal yang bersifat sangat teknis/pribadi.
    
Pertanyaan Wajib Pajak: "${question}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return res.status(200).json({ answer: response.text() });
  } catch (error) {
    console.error("Error dari Gemini AI:", error);
    return res.status(500).json({ error: `Maaf, sistem AI kami sedang mengalami gangguan teknis. Error: ${error.message}` });
  }
}
