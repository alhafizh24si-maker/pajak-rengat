import { GoogleGenerativeAI } from "@google/generative-ai";

const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const apiKey = typeof rawKey === "string" ? rawKey.trim().replace(/^["']|["']$/g, "") : "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Daftar model resmi Google API aktif (Standar Produksi 2026)
// Model lama (1.5-flash, 2.0-flash, 2.5-flash) sudah deprecated 404 oleh Google
const CANDIDATE_MODELS = [
  "gemini-3.8-flash",          // Model utama Google 2026 (aktif & direkomendasikan resmi)
  "gemini-3.5-flash-lite",     // Super cepat, hemat kuota & respon instan
  "gemini-3.5-flash",          // Model penalaran standar
  "gemini-flash-latest",       // Alias model flash produksi terbaru
  "gemini-flash-lite-latest",  // Alias model lite produksi terbaru
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

/**
 * Intelligent Fallback Respon Resmi KPP Pratama Rengat
 * Menjamin tidak ada pesan error teknis yang tampil ke Wajib Pajak
 */
function getSmartTaxFallback(query) {
  const q = (query || "").toLowerCase();

  if (
    q.includes("pajak itu apa") ||
    q.includes("apa itu pajak") ||
    q.includes("definisi pajak") ||
    q.includes("pengertian pajak") ||
    q.includes("kenapa harus bayar pajak") ||
    q.includes("mengapa bayar pajak")
  ) {
    return `📌 **Pengertian Pajak (Berdasarkan UU KUP)**

Pajak adalah **kontribusi wajib kepada negara** yang terutang oleh orang pribadi atau badan yang bersifat memaksa berdasarkan Undang-Undang, dengan tidak mendapatkan imbalan secara langsung dan digunakan untuk keperluan negara bagi sebesar-besarnya kemakmuran rakyat.

**4 Fungsi Utama Pajak bagi Masyarakat:**
1. **Fungsi Anggaran (Budgetair):** Sumber pendapatan utama negara untuk membiayai fasilitas publik, jembatan, jalan, pendidikan, dan kesehatan.
2. **Fungsi Mengatur (Regulerend):** Mengatur kebijakan ekonomi dan sosial (misalnya pajak UMKM yang ringan 0,5% untuk memajukan usaha rakyat).
3. **Fungsi Stabilitas:** Menjaga kestabilan ekonomi nasional dan ketahanan inflasi.
4. **Fungsi Redistribusi:** Menyeimbangkan pendapatan masyarakat melalui subsidi pendidikan, jaminan kesehatan BPJS, dan bantuan sosial.

🏛️ Di KPP Pratama Rengat, seluruh pengurusan pendaftaran NPWP, konsultasi pelaporan SPT, dan pembuatan kode billing dilayani secara **GRATIS (Rp 0)**.

Ada yang ingin Anda tanyakan lebih lanjut seputar hak & kewajiban perpajakan Anda? Silakan pilih opsi menu di bawah atau ketik pertanyaan Anda.`;
  }

  if (q.includes("phtb") || q.includes("tanah") || q.includes("bangunan") || q.includes("jual beli")) {
    return `📌 **Layanan Kode Billing PPh Pengalihan Tanah/Bangunan (PHTB)**

Untuk pembuatan kode billing PHTB di KPP Pratama Rengat, silakan lengkapi data berikut:
• **Nama Wajib Pajak:**
• **NIK / NPWP:**
• **Nomor Objek Pajak (NOP PBB):**
• **Alamat Objek Pajak:**
• **Nominal Nilai Transaksi / PPh:**

💡 *Tips:* Anda dapat mengetikkan kode **1A** pada chat untuk mendapatkan format permohonan billing cepat.`;
  }

  if (q.includes("umkm") || q.includes("0,5") || q.includes("pp 55") || q.includes("omzet") || q.includes("omset")) {
    return `📌 **Layanan PPh Final UMKM (Tarif 0,5%)**

Berdasarkan PP 55 Tahun 2022:
• Tarif PPh Final UMKM adalah **0,5%** dari omzet bruto bulanan.
• Wajib Pajak Orang Pribadi dengan peredaran bruto s.d. **Rp 500 juta per tahun tidak dikenakan pajak** (bebas PPh).
• Pembayaran disetor paling lambat tanggal 15 bulan berikutnya melalui Kode Akun Pajak 411128 KJS 420.

💡 Ketik **1B** untuk bantuan pembuatan kode billing UMKM via petugas.`;
  }

  if (q.includes("spt") || q.includes("lapor") || q.includes("tahunan") || q.includes("1770") || q.includes("denda")) {
    return `📌 **Panduan Pelaporan SPT Tahunan & Masa**

• **Batas Waktu OP:** 31 Maret setiap tahun (Sanksi telat: Rp 100.000).
• **Batas Waktu Badan:** 30 April setiap tahun (Sanksi telat: Rp 1.000.000).
• **Kanal Pelaporan:** Login ke portal resmi [djponline.pajak.go.id](https://djponline.pajak.go.id) atau Coretax > menu **e-Filing**.
• Siapkan Bukti Potong (1721-A1 untuk swasta atau 1721-A2 untuk ASN/TNI/Polri).`;
  }

  if (q.includes("npwp") || q.includes("nik") || q.includes("daftar") || q.includes("buat npwp") || q.includes("baru")) {
    return `📌 **Pendaftaran NPWP & Pemadanan NIK-NPWP**

• Pendaftaran NPWP baru dilakukan mandiri secara online melalui portal resmi [ereg.pajak.go.id](https://ereg.pajak.go.id) atau Coretax DJP.
• **Syarat:** Foto e-KTP fisik yang jelas dan foto selfie memegang KTP.
• Seluruh pengurusan dan layanan di KPP Pratama Rengat **GRATIS (Rp 0)** tanpa biaya apapun.`;
  }

  if (q.includes("efin") || q.includes("lupa efin") || q.includes("reset efin")) {
    return `📌 **Layanan Aktivasi & Lupa EFIN**

Jika Anda lupa atau belum mengaktifkan EFIN:
1. Kirim permohonan ke email resmi: **lupa.efin@pajak.go.id** dengan melampirkan foto KTP & NPWP asli.
2. Hubungi Kring Pajak di nomor **1500200** atau akun resmi X/Twitter **@kring_pajak**.
3. Datang langsung ke Loket TPT KPP Pratama Rengat dengan membawa dokumen KTP asli.`;
  }

  if (q.includes("skb") || q.includes("surat keterangan bebas")) {
    return `📌 **Informasi Surat Keterangan Bebas (SKB)**

• **Jangka Waktu:** Diproses maksimal **3 hari kerja** sejak berkas permohonan diterima lengkap.
• **Pengambilan Fisik:** Di loket TPT KPP Pratama Rengat membawa Bukti Penerimaan Surat (BPS).
• Dokumen juga dapat dikirim secara digital jika berkas telah diverifikasi lengkap oleh petugas kami.`;
  }

  if (
    q.includes("alamat") ||
    q.includes("lokasi") ||
    q.includes("jam") ||
    q.includes("buka") ||
    q.includes("telepon") ||
    q.includes("kontak")
  ) {
    return `🏛️ **Informasi Kantor & Layanan KPP Pratama Rengat**

• **Alamat Kantor:** Jalan Bupati Tulus No.9 Kampung Besar Kota, Sekip Hulu, Kec. Rengat, Kab. Indragiri Hulu, Riau 29319.
• **Wilayah Kerja:** Kabupaten Indragiri Hulu, Indragiri Hilir, dan Kuantan Singingi.
• **Jam Layanan Tatap Muka (TPT):** Senin s.d. Jumat, pukul 08.00 - 16.00 WIB (Hari Kerja).
• **Telepon:** (0769) 321234
• **Email Resmi:** kpp.rengat@pajak.go.id`;
  }

  return `Halo! Terima kasih telah berkonsultasi dengan Asisten Virtual KPP Pratama Rengat 👋

Terkait pertanyaan Anda seputar administrasi perpajakan:
• Untuk layanan pembuatan **Kode Billing (PHTB / UMKM)**, silakan pilih menu **1** di bawah.
• Untuk kendala pelaporan **SPT**, silakan pilih menu **2**.
• Untuk status **SKB** atau update profil, silakan pilih menu **3** atau **4**.
• Untuk berbicara langsung dengan petugas kami, silakan ketik angka **6** atau klik tombol **Hubungi Petugas**.`;
}

export const askGemini = async (question, chatHistory = []) => {
  if (!question || typeof question !== "string" || !question.trim()) {
    return "Silakan masukkan pertanyaan Anda seputar perpajakan.";
  }

  const cleanQuestion = question.trim().slice(0, 1500);

  // 1. Prioritaskan Serverless Function (/api/chat)
  // Menghindari paparan CORS & red network error di DevTools browser
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: cleanQuestion, history: chatHistory }),
    });

    if (res.ok) {
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data && data.answer) {
          return data.answer;
        }
      }
    }
  } catch {
    // Fail-soft: Lanjut ke client SDK jika /api/chat tidak aktif
  }

  // 2. Client SDK Fallback (hanya jika apiKey tersedia)
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
      ? `${conversationContext}Pertanyaan Wajib Pajak: "${cleanQuestion}"`
      : cleanQuestion;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        let model;
        try {
          model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_INSTRUCTION,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
          });
        } catch {
          model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
          });
        }

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        let text = "";
        try {
          text = response.text();
        } catch {
          const candidate = response.candidates?.[0];
          text = candidate?.content?.parts?.map((p) => p.text).join("") || "";
        }

        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch (err) {
        const errMsg = err?.message || String(err);
        if (
          errMsg.includes("API_KEY_INVALID") ||
          errMsg.includes("API key not valid") ||
          errMsg.includes("400")
        ) {
          break;
        }
        continue;
      }
    }
  }

  // 3. Fallback Cerdas Bebas Error (Smart Tax Guidance KPP Pratama Rengat)
  return getSmartTaxFallback(cleanQuestion);
};
