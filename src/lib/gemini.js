import { GoogleGenerativeAI } from "@google/generative-ai";

const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const apiKey = typeof rawKey === "string" ? rawKey.trim().replace(/^["']|["']$/g, "") : "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Daftar model resmi Google API aktif (Standar Produksi 2026)
// gemini-3.5-flash-lite super cepat (1.8s) dan paling stabil untuk interaksi chatbot
const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",     // Super cepat (1.8s), responsif, hemat kuota & akurat
  "gemini-3.1-flash-lite",     // Cepat (3.0s) & stabil
  "gemini-3.6-flash",          // Model penalaran standar
  "gemini-flash-lite-latest",  // Alias model lite produksi terbaru
  "gemini-3.8-flash",          // Model analitis komprehensif 2026
];

const SYSTEM_INSTRUCTION = `Anda adalah Asisten Virtual (Chatbot) AI resmi untuk Kantor Pelayanan Pajak (KPP) Pratama Rengat, Direktorat Jenderal Pajak (DJP).
Tugas Anda adalah melayani dan menjawab pertanyaan Wajib Pajak seputar perpajakan di Indonesia secara ramah, informatif, ringkas, dan akurat dalam Bahasa Indonesia.

Informasi Regulasi & Kebijakan Perpajakan Terkini (2026):
1. Peraturan Pemerintah No. 20 Tahun 2026 (PP 20/2026):
   - Mengubah PP No. 55 Tahun 2022 terkait PPh Final UMKM 0,5%.
   - Subjek yang berhak menggunakan tarif 0,5% dipersempit hanya untuk: (a) Wajib Pajak Orang Pribadi (ada fasilitas bebas s.d. omzet Rp 500 Juta/tahun), (b) Perseroan Perorangan (PT 1 Orang), dan (c) Koperasi.
   - Badan usaha baru CV, Firma, dan PT Reguler TIDAK BERHAK menggunakan tarif 0,5% dan langsung dikenai tarif umum PPh Badan (fasilitas Pasal 31E). Badan lama hanya berlaku sampai habis sisa masa berlakunya tanpa perpanjangan.
   - Pengecualian Pekerjaan Bebas Diperluas: Jasa kreator konten digital (influencer, selebgram, YouTuber, vlogger, blogger), penceramah, pengajar, moderator, dokter, notaris, akuntan, pengacara DILARANG menggunakan tarif UMKM 0,5% walau omzet < Rp 4,8 Miliar. Wajib tarif umum/Norma NPPN.
   - Aturan Anti-Pecah Usaha: Omzet suami dan istri digabung, serta omzet Orang Pribadi dengan Perseroan Perorangan miliknya digabung untuk menguji batas ambang Rp 4,8 Miliar.
   - Larangan Biaya Suap & Gratifikasi (Pasal 20A): Dilarang dijadikan pengurang penghasilan bruto.

2. Kebijakan Penghapusan Sanksi Pajak 100% (KEP-239/PJ/2026):
   - DJP membebaskan sanksi denda administrasi sebesar 100% untuk pelunasan pokok pajak kurang bayar SPT Tahunan (hingga tahun pajak 2025) dan SPT Masa (hingga September 2026) pada periode 8 Oktober s.d. 31 Desember 2026.
   - Pengurangan turun menjadi 50% pada Januari–Maret 2027 dan 25% pada April–Juni 2027.

3. Aturan Baru Pembayaran Utang Pajak (PMK 71/2026):
   - Berlaku sejak 2 Oktober 2026: Setoran pembayaran utang pajak dialokasikan memprioritaskan pelunasan POKOK UTANG PAJAK terlebih dahulu, tidak lagi dihitung proporsional dengan denda.

4. Coretax DJP & AI Pengawasan:
   - Portal terpadu Coretax DJP terintegrasi dengan pemanfaatan AI untuk transparansi pengawasan kepatuhan WP.

Informasi Kantor & Wilayah Layanan:
- Lokasi Kantor: KPP Pratama Rengat beralamat di Jalan Bupati Tulus No.9 Kampung Besar Kota, Sekip Hulu, Kec. Rengat, Kabupaten Indragiri Hulu, Riau 29319.
- Wilayah Kerja Pengawasan: Meliputi Kabupaten Indragiri Hulu (Inhu), Kabupaten Indragiri Hilir (Inhil), dan Kabupaten Kuantan Singingi (Kuansing).
- Jam Pelayanan Tatap Muka (TPT): Senin s.d. Jumat, pukul 08.00 - 16.00 WIB (hari kerja).
- Layanan Digital: Portal resmi Coretax DJP (pendaftaran NPWP/NITKU, pelaporan SPT Tahunan/Masa, pembuatan kode billing, dsb.).

Aturan Respons:
1. Berikan jawaban langsung, ramah, dan solutif dengan merujuk regulasi resmi di atas.
2. Gunakan poin-poin agar mudah dipahami.
3. Ingatkan bahwa seluruh layanan di KPP Pratama Rengat GRATIS (Rp 0).`;

/**
 * Intelligent Fallback Respon Resmi KPP Pratama Rengat
 * Menjamin tidak ada pesan error teknis yang tampil ke Wajib Pajak
 */
function getSmartTaxFallback(query) {
  const q = (query || "").toLowerCase();

  // 1. Pertanyaan seputar PP 20/2026 / Pecah Usaha / UMKM 0,5%
  if (
    q.includes("pp 20") ||
    q.includes("pp20") ||
    q.includes("pecah usaha") ||
    q.includes("anti pecah") ||
    q.includes("kreator") ||
    q.includes("influencer") ||
    q.includes("selebgram") ||
    q.includes("youtuber") ||
    q.includes("pekerjaan bebas")
  ) {
    return `📌 **Ketentuan Baru PP No. 20 Tahun 2026 (Perubahan PP 55/2022)**

Peraturan Pemerintah No. 20 Tahun 2026 mengatur ketentuan PPh Final UMKM 0,5% dengan poin-poin utama:

1. **Subjek Pajak yang Berhak Dipersempit:**
   • Wajib Pajak Orang Pribadi (ada fasilitas bebas s.d omzet Rp 500 Juta/tahun).
   • Perseroan Perorangan (PT 1 Orang yang didirikan sendiri).
   • Koperasi.
   *(Catatan: CV, Firma, dan PT Reguler Baru TIDAK BERHAK lagi menggunakan tarif 0,5% dan langsung dikenai tarif umum PPh Badan).*

2. **Pekerjaan Bebas & Kreator Konten Dikecualikan:**
   • Influencer, selebgram, YouTuber, blogger, vlogger, penceramah, pengajar, moderator, dokter, notaris, dan pengacara **TIDAK BISA** menggunakan tarif 0,5% walau omzet di bawah Rp 4,8 Miliar. Wajib menggunakan tarif umum PPh (NPPN atau Pembukuan).

3. **Aturan Akumulasi Omzet Anti-Pecah Usaha:**
   • Omzet suami dan istri digabungkan.
   • Omzet Orang Pribadi dengan Perseroan Perorangan miliknya digabungkan untuk batas maksimal Rp 4,8 Miliar per tahun.

4. **Larangan Biaya Suap (Pasal 20A):**
   • Biaya suap/gratifikasi dilarang menjadi pengurang pajak bruto.

💡 Ingin simulasi kelayakan UMKM Anda? Buka menu **Kalkulator Pajak** di portal ini.`;
  }

  // 2. Pertanyaan seputar Pemutihan / Penghapusan Sanksi Denda KEP-239/PJ/2026
  if (
    q.includes("sanksi") ||
    q.includes("denda") ||
    q.includes("kep-239") ||
    q.includes("kep 239") ||
    q.includes("pemutihan") ||
    q.includes("hapus denda") ||
    q.includes("potong denda") ||
    q.includes("diskon")
  ) {
    return `📌 **Program Penghapusan Sanksi Pajak 100% (KEP-239/PJ/2026)**

DJP Kementerian Keuangan memberikan pembebasan sanksi administratif dan denda pajak:

• **Periode 8 Oktober s.d. 31 Desember 2026:**
  Diskon Denda **100% (Sanksi DIHAPUS PENUH / Rp 0)** jika Wajib Pajak melunasi pokok kurang bayar dan menyampaikan SPT.
• **Periode Januari – Maret 2027:** Pengurangan denda menjadi **50%**.
• **Periode April – Juni 2027:** Pengurangan denda menjadi **25%**.

**Cakupan SPT yang Berhak:**
1. SPT Tahunan PPh Kurang Bayar s.d. Tahun Pajak 2025.
2. SPT Masa PPh / PPN Kurang Bayar s.d. Masa Pajak September 2026.
3. Surat Tagihan Pajak (STP) / SKPKB bunga keterlambatan.

💡 Anda dapat menghitung penghematan denda Anda secara langsung melalui tab **Hapus Sanksi Pajak 100%** pada Kalkulator Pajak Terpadu kami.`;
  }

  // 3. Pertanyaan seputar PMK 71/2026 (Aturan Pembayaran Utang Pajak)
  if (q.includes("pmk 71") || q.includes("utang pajak") || q.includes("bayar utang") || q.includes("pokok utang")) {
    return `📌 **Mekanisme Baru Pembayaran Utang Pajak (PMK 71/2026)**

Mulai berlaku sejak **2 Oktober 2026**:
• Pembayaran atau setoran utang pajak yang dilakukan oleh Wajib Pajak kini **diprioritaskan untuk melunasi POKOK UTANG PAJAK terlebih dahulu**.
• Tidak ada lagi pembebanan proporsional antara pokok dan denda seperti aturan lama. Hal ini mencegah bunga terus berbunga dan sangat meringankan wajib pajak.

Untuk konsultasi cetak tagihan atau billing pelunasan, silakan hubungi Helpdesk KPP Pratama Rengat di **0812-5000-213**.`;
  }

  // 4. Pertanyaan seputar Coretax & AI
  if (q.includes("coretax") || q.includes("ai") || q.includes("kecerdasan buatan") || q.includes("pengawasan")) {
    return `📌 **Implementasi Coretax DJP & Pengawasan AI**

• **Coretax DJP** adalah sistem administrasi perpajakan terintegrasi nasional untuk mempermudah pendaftaran, pelaporan SPT elektronik, pembuatan e-Billing, hingga permohonan SKB dan Pbk secara mandiri.
• DJP mengintegrasikan teknologi **Artificial Intelligence (AI)** untuk memantau data transaksi dan meningkatkan kepatuhan wajib pajak secara objektif dan transparan.
• Pastikan data profil Anda (NIK-NPWP 16 digit dan nomor HP aktif) telah dimutakhirkan di Coretax.`;
  }

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

🏛️ Di KPP Pratama Rengat, seluruh pengurusan pendaftaran NPWP, konsultasi pelaporan SPT, dan pembuatan kode billing dilayani secara **GRATIS (Rp 0)**.`;
  }

  if (q.includes("phtb") || q.includes("tanah") || q.includes("bangunan") || q.includes("jual beli")) {
    return `📌 **Layanan Kode Billing PPh Pengalihan Tanah/Bangunan (PHTB)**

Untuk pembuatan kode billing PHTB di KPP Pratama Rengat, silakan lengkapi data berikut:
• **Nama Wajib Pajak:**
• **NIK / NPWP:**
• **Nomor Objek Pajak (NOP PBB):**
• **Alamat Objek Pajak:**
• **Nominal Nilai Transaksi / PPh:**

💡 *Tips:* Ketikkan kode **1A** pada chat untuk mendapatkan format permohonan billing PHTB cepat.`;
  }

  if (q.includes("umkm") || q.includes("0,5") || q.includes("omzet") || q.includes("omset")) {
    return `📌 **Layanan PPh Final UMKM 0,5% (PP 20/2026 & PP 55/2022)**

Sesuai aturan terbaru PP 20/2026:
• Tarif PPh Final UMKM adalah **0,5%** dari omzet bruto bulanan.
• Berlaku bagi **Wajib Pajak Orang Pribadi**, **Perseroan Perorangan (PT 1 Orang)**, dan **Koperasi**.
• Wajib Pajak Orang Pribadi berhak atas fasilitas omzet s.d. **Rp 500 Juta per tahun BEBAS PAJAK (Rp 0)**.
• CV/PT reguler baru dan jasa kreator digital (influencer/YouTuber/pekerjaan bebas) tidak berhak atas tarif 0,5%.
• Pembayaran disetor paling lambat tanggal 15 bulan berikutnya melalui Kode Akun Pajak **411128 KJS 420**.

💡 Ketik **1B** untuk bantuan pembuatan kode billing UMKM via petugas.`;
  }

  if (q.includes("spt") || q.includes("lapor") || q.includes("tahunan") || q.includes("1770")) {
    return `📌 **Panduan Pelaporan SPT Tahunan & Masa**

• **Batas Waktu OP:** 31 Maret setiap tahun (Sanksi telat: Rp 100.000).
• **Batas Waktu Badan:** 30 April setiap tahun (Sanksi telat: Rp 1.000.000).
• **Kanal Pelaporan:** Login ke portal resmi [djponline.pajak.go.id](https://djponline.pajak.go.id) atau Coretax > menu **e-Filing**.
• Siapkan Bukti Potong (1721-A1 untuk swasta atau 1721-A2 untuk ASN/TNI/Polri).
• **Manfaatkan KEP-239/PJ/2026:** Jika memiliki SPT tahun lalu yang kurang bayar, lunasi sebelum 31 Desember 2026 untuk mendapatkan **pembebasan sanksi denda 100%**!`;
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
• **WhatsApp Helpdesk:** 0812-5000-213
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
      signal: AbortSignal.timeout(4000), // 4 detik timeout sebelum fallback ke Client SDK
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
