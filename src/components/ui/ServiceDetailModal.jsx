import React, { useState } from 'react';
import { ServiceBadgeIcon } from './FormalIcon';
import { FiFileText, FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

// Persyaratan Resmi & Format WhatsApp Layanan KPP Pratama Rengat
const SERVICE_REQUIREMENTS = {
  npwp: {
    title: 'Pendaftaran & Cetak NPWP (Orang Pribadi & Badan)',
    sla: '1 Hari Kerja (Online Instan)',
    cost: 'Rp 0 (GRATIS)',
    documents: [
      'Foto / Scan e-KTP fisik asli yang masih berlaku',
      'Kartu Keluarga (KK) untuk validasi NIK Dukcapil',
      'Untuk WNA: Paspor dan KITAS / KITAP yang masih berlaku',
      'Untuk Badan: Akta pendirian, SK Kemenkumham, NPWP Penanggung Jawab'
    ],
    whatsappFormat: `Halo Helpdesk KPP Pratama Rengat, saya ingin berkonsultasi mengenai Pendaftaran / Cetak NPWP:
- Nama Lengkap: 
- NIK: 
- Alamat KTP: 
- Nomor HP / Email: 
- Kendala / Kebutuhan: 

Mohon panduan untuk proses penyelesaian. Terima kasih.`
  },
  efin: {
    title: 'Aktivasi & Pemulihan Lupa EFIN',
    sla: 'Maksimal 1 Hari Kerja (Rata-rata 15-30 Menit)',
    cost: 'Rp 0 (GRATIS)',
    documents: [
      'Formulir Permohonan Aktivasi / Cetak Ulang EFIN (sudah ditandatangani)',
      'Foto KTP asli yang jelas terbaca (bukan fotokopi buram)',
      'Foto selfie memegang KTP asli dan NPWP di dada',
      'Nomor HP dan alamat email aktif terdaftar'
    ],
    whatsappFormat: `Halo Helpdesk KPP Pratama Rengat, saya mengajukan Pemulihan Lupa EFIN:
- Nama Wajib Pajak: 
- NIK: 
- NPWP: 
- Email Terdaftar: 
- No. WhatsApp Aktif: 

Dokumen foto KTP dan formulir terlampir. Mohon bantuan pengiriman kode EFIN. Terima kasih.`
  },
  spt: {
    title: 'Konsultasi Pelaporan SPT Tahunan & Masa',
    sla: 'Langsung melalui Coretax / e-Filing DJP',
    cost: 'Rp 0 (GRATIS)',
    documents: [
      'Bukti Potong Formulir 1721-A1 (Karyawan Swasta) atau 1721-A2 (ASN/TNI/Polri)',
      'Rekapitulasi omzet dan pencatatan peredaran bruto bulanan (untuk UMKM)',
      'Daftar harta per 31 Desember (tabungan, kendaraan, tanah/bangunan)',
      'Daftar utang/kewajiban per 31 Desember'
    ],
    whatsappFormat: `Halo Helpdesk KPP Pratama Rengat, saya membutuhkan bantuan terkait Pelaporan SPT:
- Nama: 
- NPWP: 
- Jenis SPT: [1770 / 1770S / 1770SS / 1771 Badan]
- Tahun Pajak: 
- Kendala yang dialami: 

Mohon arahannya. Terima kasih.`
  },
  ebilling: {
    title: 'Pembuatan Kode e-Billing Pajak',
    sla: 'Instan (1 - 5 Menit)',
    cost: 'Rp 0 (GRATIS)',
    documents: [
      'Nomor NPWP / NIK penyetor',
      'Nama jenis pajak (PPh 21, PPh Final UMKM 0.5%, PHTB, PPN, dll.)',
      'Masa dan Tahun Pajak yang dibayarkan',
      'Nominal jumlah setor pajak terutang'
    ],
    whatsappFormat: `Halo Helpdesk KPP Pratama Rengat, mohon bantuan pembuatan Kode Billing Pajak:
- Nama WP: 
- NPWP / NIK: 
- Jenis Pajak: [PHTB / UMKM 0,5% / PPh 21 / Lainnya]
- Masa / Tahun: 
- Nilai Setor Pajak: Rp 

Terima kasih.`
  },
  pkp: {
    title: 'Pengukuhan Pengusaha Kena Pajak (PKP)',
    sla: 'Maksimal 5-10 Hari Kerja (Termasuk Verifikasi Lapangan)',
    cost: 'Rp 0 (GRATIS)',
    documents: [
      'Surat permohonan pengukuhan PKP bermeterai',
      'Fotokopi Akta Notaris & Perubahan serta SK Kemenkumham',
      'Bukti kepemilikan/sewa tempat usaha & foto plang nama usaha',
      'Denah lokasi dan foto tempat kegiatan usaha riil'
    ],
    whatsappFormat: `Halo Petugas Seksi Pelayanan KPP Pratama Rengat, kami bermaksud mengajukan Pengukuhan PKP:
- Nama Perusahaan / Usaha: 
- NPWP Badan: 
- Alamat Usaha: 
- PIC / Nomor Kontak: 

Mohon informasi jadwal verifikasi berkas dan survei lokasi. Terima kasih.`
  },
  skpf: {
    title: 'Surat Keterangan Bebas (SKB) / SKPF',
    sla: 'Maksimal 3 Hari Kerja',
    cost: 'Rp 0 (GRATIS)',
    documents: [
      'Surat Permohonan SKB resmi yang ditandatangani pemohon',
      'Bukti alas hak kepemilikan (Sertifikat / AJB tanah/bangunan)',
      'SPPT PBB tahun berjalan dan bukti pelunasan PBB',
      'Surat Keterangan Waris / Hibah dari pejabat berwenang (jika warisan/hibah)'
    ],
    whatsappFormat: `Halo Helpdesk KPP Pratama Rengat, saya ingin mengajukan Surat Keterangan Bebas (SKB) PHTB:
- Nama Pemohon: 
- NIK: 
- Alamat Objek: 
- Jenis Perolehan: [Waris / Hibah / Jual Beli Rumah Sederhana]
- Nomor BPS: 

Mohon informasi status penelitian berkas. Terima kasih.`
  },
  pph: {
    title: 'Pemotongan PPh 21 / 23 & Unifikasi',
    sla: 'Pelaporan Mandiri via e-Bupot Coretax',
    cost: 'Rp 0 (GRATIS)',
    documents: [
      'NPWP / NIK pihak yang dipotong',
      'Bukti tagihan (Invoice / Faktur) dan kwitansi pembayaran',
      'Perjanjian / Kontrak kerja sama jasa atau sewa',
      'Surat Keterangan PP 55 (jika bertransaksi dengan rekanan UMKM 0,5%)'
    ],
    whatsappFormat: `Halo Konsultan Pajak KPP Pratama Rengat, saya ingin menanyakan ketentuan Pemotongan PPh:
- Nama Perusahaan: 
- NPWP: 
- Objek Pemotongan: [Sewa / Jasa / Penghasilan Pegawai]
- Nilai Bruto: Rp 

Mohon arahan tarif dan kode akun pajak yang sesuai. Terima kasih.`
  },
  restitusi: {
    title: 'Pengembalian Pendahuluan / Restitusi Pajak',
    sla: 'Sesuai Ketentuan PMK (1 Bulan untuk WP Tertentu)',
    cost: 'Rp 0 (GRATIS)',
    documents: [
      'SPT Tahunan atau Masa Lebih Bayar yang telah dilaporkan',
      'Rekening koran dan bukti pembayaran komersial',
      'Faktur Pajak Keluaran & Masukan valid',
      'Nomor rekening bank atas nama Wajib Pajak untuk pencairan'
    ],
    whatsappFormat: `Halo Seksi Pemeriksaan & Pelayanan KPP Pratama Rengat, kami ingin mengonfirmasi permohonan Pengembalian Kelebihan Pajak (Restitusi):
- Nama WP: 
- NPWP: 
- Masa / Tahun Lebih Bayar: 
- Nilai Restitusi Diajukan: Rp 

Terima kasih.`
  }
};

export default function ServiceDetailModal({ service, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !service) return null;

  const detail = SERVICE_REQUIREMENTS[service.id] || {
    title: service.title,
    sla: '1-3 Hari Kerja',
    cost: 'Rp 0 (GRATIS)',
    documents: [
      'KTP Asli Wajib Pajak',
      'NPWP terdaftar',
      'Dokumen pendukung terkait permohonan'
    ],
    whatsappFormat: `Halo Helpdesk KPP Pratama Rengat, saya ingin berkonsultasi mengenai ${service.title}.\nNama: \nNIK/NPWP: \nMohon arahannya. Terima kasih.`
  };

  const handleCopyWhatsapp = () => {
    navigator.clipboard.writeText(detail.whatsappFormat);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const waLink = `https://wa.me/628125000213?text=${encodeURIComponent(detail.whatsappFormat)}`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10, 37, 64, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '640px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }}>
        {/* Header Modal */}
        <div style={{
          backgroundColor: '#0A2540',
          color: '#FFFFFF',
          padding: '20px 24px',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ServiceBadgeIcon serviceId={service.id} containerSize={38} size={20} />
            <div>
              <div style={{ fontSize: '11px', color: '#FFD100', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Panduan Resmi Pelayanan DJP
              </div>
              <h3 style={{ margin: '2px 0 0', fontSize: '17px', fontWeight: 800 }}>
                {service.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#FFFFFF',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Konten Modal */}
        <div style={{ padding: '24px' }}>
          {/* Info Singkat Biaya & SLA */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              padding: '12px 16px',
              borderRadius: '10px'
            }}>
              <span style={{ fontSize: '11px', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>
                Biaya Layanan
              </span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#065F46', marginTop: '2px' }}>
                {detail.cost}
              </div>
              <small style={{ fontSize: '11px', color: '#059669' }}>Bebas pungutan &amp; gratifikasi</small>
            </div>

            <div style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              padding: '12px 16px',
              borderRadius: '10px'
            }}>
              <span style={{ fontSize: '11px', color: '#1D4ED8', fontWeight: 700, textTransform: 'uppercase' }}>
                Standar Waktu (SLA)
              </span>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E40AF', marginTop: '2px' }}>
                {detail.sla}
              </div>
              <small style={{ fontSize: '11px', color: '#2563EB' }}>Sesuai Maklumat Pelayanan DJP</small>
            </div>
          </div>

          {/* Dokumen Persyaratan */}
          <div style={{ marginBottom: '22px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiFileText color="#0056B3" size={16} /> Dokumen Persyaratan yang Wajib Disiapkan:
            </h4>
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '14px 18px'
            }}>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {detail.documents.map((doc, idx) => (
                  <li key={idx} style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Format Pesan WhatsApp Cepat */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BsWhatsapp color="#25D366" size={16} /> Format Permohonan Cepat ke WhatsApp:
              </h4>
              <button
                type="button"
                onClick={handleCopyWhatsapp}
                style={{
                  backgroundColor: copied ? '#ECFDF5' : '#F1F5F9',
                  color: copied ? '#059669' : '#1E293B',
                  border: copied ? '1px solid #A7F3D0' : '1px solid #CBD5E1',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {copied ? <><FiCheck size={13} /> Format Disalin!</> : <><FiCopy size={13} /> Salin Format</>}
              </button>
            </div>

            <pre style={{
              backgroundColor: '#0F172A',
              color: '#F8FAFC',
              padding: '14px',
              borderRadius: '10px',
              fontSize: '11.5px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0,
              fontFamily: 'monospace'
            }}>
              {detail.whatsappFormat}
            </pre>
          </div>

          {/* Tombol Aksi Bawah */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13px',
                padding: '12px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <BsWhatsapp size={16} /> Buka WhatsApp &amp; Kirim Format
            </a>

            <a
              href={service.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#0056B3',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13px',
                padding: '12px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <FiExternalLink size={15} /> Buka Portal DJP Resmi
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
