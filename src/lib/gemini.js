export const askGemini = async (question) => {
  try {
    // Memanggil API backend (Vercel Serverless Function) 
    // agar API Key tidak terekspos di frontend
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Gagal menghubungi server AI.");
    }

    return data.answer;
  } catch (error) {
    console.error("Error dari API Chat:", error);
    return `Maaf, terjadi kesalahan saat menghubungi server kami: ${error.message}`;
  }
};
