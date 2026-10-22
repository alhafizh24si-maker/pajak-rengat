import React from 'react';
import {
  FiFileText,
  FiKey,
  FiCreditCard,
  FiBriefcase,
  FiPercent,
  FiRefreshCw,
  FiAward,
  FiSearch,
  FiSun,
  FiMoon,
  FiShield,
  FiUserCheck,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiZap,
  FiTarget,
  FiPhone,
  FiMail,
  FiHeadphones,
  FiGlobe,
  FiTrendingUp,
  FiBookOpen,
  FiAlertCircle,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiDownload,
  FiStar,
  FiBell,
  FiLogOut,
  FiArrowRight,
  FiCheck,
  FiX,
  FiSend,
  FiHelpCircle
} from 'react-icons/fi';
import {
  HiOutlineIdentification,
  HiOutlineKey,
  HiOutlineDocumentChartBar,
  HiOutlineReceiptPercent,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentCheck,
  HiOutlineCalculator,
  HiOutlineArrowPathRoundedSquare
} from 'react-icons/hi2';
import { BsWhatsapp, BsShieldCheck } from 'react-icons/bs';
import { RiRobot2Line, RiGovernmentLine } from 'react-icons/ri';

/**
 * Pemetaan Ikon Formal Layanan Perpajakan KPP Pratama Rengat
 * Menggantikan emoji kasual dengan logo/ikon vektor formal standar institusi
 */
export const SERVICE_FORMAL_ICONS = {
  npwp: {
    Icon: HiOutlineIdentification,
    fallback: FiCreditCard,
    title: 'Identitas Wajib Pajak & NIK 16 Digit',
    bg: '#EFF6FF',
    color: '#1D4ED8',
    borderColor: '#BFDBFE'
  },
  efin: {
    Icon: HiOutlineKey,
    fallback: FiKey,
    title: 'Kunci Pengaman Digital Coretax',
    bg: '#FEF3C7',
    color: '#B45309',
    borderColor: '#FDE68A'
  },
  spt: {
    Icon: HiOutlineDocumentChartBar,
    fallback: FiFileText,
    title: 'Pelaporan SPT Tahunan & Masa',
    bg: '#ECFDF5',
    color: '#047857',
    borderColor: '#A7F3D0'
  },
  ebilling: {
    Icon: HiOutlineReceiptPercent,
    fallback: FiCreditCard,
    title: 'Kode Billing Setor Pajak',
    bg: '#EEF2FF',
    color: '#4338CA',
    borderColor: '#C7D2FE'
  },
  pkp: {
    Icon: HiOutlineBuildingOffice2,
    fallback: FiBriefcase,
    title: 'Pengukuhan Pengusaha Kena Pajak',
    bg: '#F5F3FF',
    color: '#6D28D9',
    borderColor: '#DDD6FE'
  },
  skpf: {
    Icon: HiOutlineDocumentCheck,
    fallback: FiAward,
    title: 'Surat Keterangan Bebas (SKB/SKPF)',
    bg: '#FDF2F8',
    color: '#BE185D',
    borderColor: '#FBCFE8'
  },
  pph: {
    Icon: HiOutlineCalculator,
    fallback: FiPercent,
    title: 'Pemotongan PPh 21 TER & Pasal 23',
    bg: '#FFFBEB',
    color: '#B45309',
    borderColor: '#FDE68A'
  },
  restitusi: {
    Icon: HiOutlineArrowPathRoundedSquare,
    fallback: FiRefreshCw,
    title: 'Pengembalian & Pemindahbukuan',
    bg: '#F0FDFA',
    color: '#0F766E',
    borderColor: '#99F6E4'
  }
};

/**
 * Komponen Badge Ikon Formal Layanan
 */
export function ServiceBadgeIcon({ serviceId, size = 20, className = '', containerSize = 40 }) {
  const config = SERVICE_FORMAL_ICONS[serviceId] || {
    Icon: FiFileText,
    bg: '#F1F5F9',
    color: '#0A2540',
    borderColor: '#CBD5E1'
  };

  const IconComponent = config.Icon || config.fallback || FiFileText;

  return (
    <div
      className={`formal-service-badge ${className}`}
      style={{
        width: `${containerSize}px`,
        height: `${containerSize}px`,
        minWidth: `${containerSize}px`,
        minHeight: `${containerSize}px`,
        borderRadius: '12px',
        backgroundColor: config.bg,
        border: `1.5px solid ${config.borderColor}`,
        color: config.color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      title={config.title}
    >
      <IconComponent size={size} style={{ strokeWidth: 1.8 }} />
    </div>
  );
}

/**
 * Ikon Formal Serbaguna berdasarkan Nama Kunci
 */
export function FormalIcon({ name, size = 18, color, className = '', style = {} }) {
  const iconProps = { size, color, className, style };

  switch (name) {
    // Navigasi & Status
    case 'sun': return <FiSun {...iconProps} />;
    case 'moon': return <FiMoon {...iconProps} />;
    case 'search': return <FiSearch {...iconProps} />;
    case 'shield': return <FiShield {...iconProps} />;
    case 'shield-check': return <BsShieldCheck {...iconProps} />;
    case 'gov': return <RiGovernmentLine {...iconProps} />;
    case 'user-check': return <FiUserCheck {...iconProps} />;
    case 'lock': return <FiKey {...iconProps} />;

    // Metrik & Layanan
    case 'clock': return <FiClock {...iconProps} />;
    case 'building': return <HiOutlineBuildingOffice2 {...iconProps} />;
    case 'check': return <FiCheckCircle {...iconProps} />;
    case 'users': return <FiUsers {...iconProps} />;
    case 'zap': return <FiZap {...iconProps} />;
    case 'target': return <FiTarget {...iconProps} />;
    case 'robot': return <RiRobot2Line {...iconProps} />;
    case 'chart': return <FiTrendingUp {...iconProps} />;
    case 'help': return <FiHelpCircle {...iconProps} />;

    // Kontak & Saluran
    case 'phone': return <FiPhone {...iconProps} />;
    case 'whatsapp': return <BsWhatsapp {...iconProps} />;
    case 'mail': return <FiMail {...iconProps} />;
    case 'headphones': return <FiHeadphones {...iconProps} />;
    case 'globe': return <FiGlobe {...iconProps} />;

    // Aksi Admin
    case 'overview': return <FiTrendingUp {...iconProps} />;
    case 'templates': return <FiBookOpen {...iconProps} />;
    case 'chats': return <FiHeadphones {...iconProps} />;
    case 'unmatched': return <FiAlertCircle {...iconProps} />;
    case 'edit': return <FiEdit2 {...iconProps} />;
    case 'trash': return <FiTrash2 {...iconProps} />;
    case 'copy': return <FiCopy {...iconProps} />;
    case 'download': return <FiDownload {...iconProps} />;
    case 'star': return <FiStar {...iconProps} />;
    case 'bell': return <FiBell {...iconProps} />;
    case 'logout': return <FiLogOut {...iconProps} />;
    case 'send': return <FiSend {...iconProps} />;
    case 'arrow-right': return <FiArrowRight {...iconProps} />;
    case 'check-simple': return <FiCheck {...iconProps} />;
    case 'close': return <FiX {...iconProps} />;

    default:
      return <FiFileText {...iconProps} />;
  }
}

export default FormalIcon;
