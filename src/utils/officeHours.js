/**
 * Utility untuk menghitung status operasional loket fisik KPP Pratama Rengat
 * berdasarkan waktu lokal WIB (UTC+7 / Asia/Jakarta).
 *
 * Jadwal:
 * - Senin - Kamis : 08:00 - 16:00 WIB
 * - Jumat         : 08:00 - 16:30 WIB
 * - Sabtu - Minggu: Tutup (Chatbot 24/7 Tetap Aktif)
 */
export function getOfficeStatus() {
  const now = new Date();
  const timeZone = 'Asia/Jakarta';

  try {
    const dayFormatter = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' });
    const hourFormatter = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', hour12: false });
    const minuteFormatter = new Intl.DateTimeFormat('en-US', { timeZone, minute: 'numeric', hour12: false });

    const dayShort = dayFormatter.format(now); // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
    let hour = parseInt(hourFormatter.format(now), 10);
    // Handle edge case where 24:00 is returned as 24
    if (hour === 24) hour = 0;
    const minute = parseInt(minuteFormatter.format(now), 10);
    const currentMinutes = hour * 60 + minute;

    const isMonThu = ['Mon', 'Tue', 'Wed', 'Thu'].includes(dayShort);
    const isFri = dayShort === 'Fri';
    const isWeekend = ['Sat', 'Sun'].includes(dayShort);

    let isOpen = false;
    let closingInfo = '';
    const currentDayType = isMonThu ? 'mon_thu' : isFri ? 'fri' : 'weekend';

    if (isMonThu) {
      const openTime = 8 * 60; // 08:00 WIB
      const closeTime = 16 * 60; // 16:00 WIB
      if (currentMinutes >= openTime && currentMinutes < closeTime) {
        isOpen = true;
        const diff = closeTime - currentMinutes;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        closingInfo = `Tutup pukul 16:00 WIB (${h > 0 ? `${h} jam ` : ''}${m} menit lagi)`;
      } else if (currentMinutes < openTime) {
        closingInfo = 'Buka hari ini pukul 08:00 WIB';
      } else {
        closingInfo = dayShort === 'Thu' ? 'Buka besok (Jumat) pukul 08:00 WIB' : 'Buka besok pukul 08:00 WIB';
      }
    } else if (isFri) {
      const openTime = 8 * 60; // 08:00 WIB
      const closeTime = 16 * 60 + 30; // 16:30 WIB
      if (currentMinutes >= openTime && currentMinutes < closeTime) {
        isOpen = true;
        const diff = closeTime - currentMinutes;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        closingInfo = `Tutup pukul 16:30 WIB (${h > 0 ? `${h} jam ` : ''}${m} menit lagi)`;
      } else if (currentMinutes < openTime) {
        closingInfo = 'Buka hari ini pukul 08:00 WIB';
      } else {
        closingInfo = 'Buka kembali Senin pukul 08:00 WIB';
      }
    } else {
      closingInfo = 'Buka kembali Senin pukul 08:00 WIB';
    }

    const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    return {
      isOpen,
      statusText: isOpen ? 'Loket Fisik Buka' : 'Loket Fisik Tutup • Chatbot 24/7 Aktif',
      shortStatus: isOpen ? 'Loket Buka' : 'Loket Tutup • Bot 24/7',
      timeString,
      closingInfo,
      currentDayType,
    };
  } catch (err) {
    console.error('Error calculating office status:', err);
    // Fallback safe defaults
    return {
      isOpen: true,
      statusText: 'Loket Fisik Buka',
      shortStatus: 'Loket Buka',
      timeString: 'WIB',
      closingInfo: 'Senin - Jumat',
      currentDayType: 'mon_thu',
    };
  }
}
