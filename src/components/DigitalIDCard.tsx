"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Shield, 
  Download, 
  Share2, 
  Check, 
  Loader2, 
  Printer, 
  RotateCw, 
  Award, 
  MapPin, 
  Phone, 
  Calendar,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface IDCardProps {
  user: {
    name: string;
    role?: string;
    id: string;
    membership_id?: string;
    branch?: string;
    photo_url?: string;
    photo?: string;
    mobile?: string;
    mobile_number?: string;
    district?: string;
    state?: string;
    pin_code?: string;
    village?: string;
    post_office?: string;
    membership_type?: string;
    created_at?: string | number | any;
    valid_from?: string;
    valid_till?: string;
    expiry_date?: string;
  };
  showActions?: boolean;
}

export default function DigitalIDCard({ user, showActions = true }: IDCardProps) {
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  const [cardSide, setCardSide] = useState<'FRONT' | 'BACK'>('FRONT');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [adminSig, setAdminSig] = useState<{ url: string; text: string }>({
    url: '',
    text: 'Ram Nam Bank'
  });

  useEffect(() => {
    async function loadSignature() {
      try {
        const { getSettings } = await import('@/services/dataService');
        const settings = await getSettings();
        if (settings) {
          setAdminSig({
            url: settings.admin_signature_url || '',
            text: settings.admin_signature_text || 'Ram Nam Bank'
          });
        }
      } catch(e) {}
    }
    loadSignature();
  }, []);

  const currentYear = new Date().getFullYear();
  const displayId = user.membership_id || (user.id?.length > 15 ? user.id.substring(0, 12).toUpperCase() : (user.id || `OD/17/${currentYear}/001`));
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'RB';
  const photoSrc = user.photo_url || user.photo;
  
  // Explicit Membership Types:
  // SPECIAL_LIFE -> केन्द्रीय विशिष्ट आजीवन सदस्य
  // LIFE -> केन्द्रीय आजीवन सदस्य
  // BANK_LIFE -> श्री राम नाम लेखन सदस्य (₹360 वार्षिक लेखन सदस्यता)
  // REGULAR -> साधारण सदस्य (वार्षिक)
  const roleTitle = user.membership_type === 'SPECIAL_LIFE' ? 'केन्द्रीय विशिष्ट आजीवन सदस्य' : 
                    user.membership_type === 'LIFE' ? 'केन्द्रीय आजीवन सदस्य' : 
                    user.membership_type === 'BANK_LIFE' ? 'श्री राम नाम लेखन सदस्य' : 
                    user.membership_type === 'REGULAR' ? 'साधारण सदस्य' :
                    (user.membership_type || user.role || 'श्री राम नाम लेखन सदस्य');

  // Only true Lifetime plans are SPECIAL_LIFE and LIFE
  const isLifeMember = user.membership_type === 'SPECIAL_LIFE' || user.membership_type === 'LIFE';

  // Format Dates: DD/MM/YY
  const parseDate = (d: any): Date => {
    if (!d) return new Date();
    if (typeof d === 'string' || typeof d === 'number') return new Date(d);
    if (d.seconds) return new Date(d.seconds * 1000);
    if (d.toDate && typeof d.toDate === 'function') return d.toDate();
    return new Date();
  };

  const pad2 = (n: number) => n.toString().padStart(2, '0');
  const formatDDMMYY = (date: Date) => {
    const d = pad2(date.getDate());
    const m = pad2(date.getMonth() + 1);
    const y = date.getFullYear().toString().slice(-2);
    return `${d}/${m}/${y}`;
  };

  const startDate = parseDate(user.valid_from || user.created_at);
  const startStr = formatDDMMYY(startDate);

  let endStr = 'आजीवन (LIFETIME)';
  if (!isLifeMember) {
    // 1 Year Annual Validity for BANK_LIFE / REGULAR
    const expiry = user.valid_till || user.expiry_date 
      ? parseDate(user.valid_till || user.expiry_date) 
      : new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    endStr = formatDDMMYY(expiry);
  }

  const validityText = `${startStr} से ${endStr}`;
  const locationText = [user.district, user.state].filter(Boolean).join(', ') || user.branch || 'अयोध्या धाम';

  // Live Online Verification URL
  const originUrl = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://ramnambank.com';
  const verifyUrl = `${originUrl}/verify?id=${encodeURIComponent(displayId)}`;

  // High-Resolution Image Download (Front or Back)
  const handleDownloadImage = async (side: 'FRONT' | 'BACK') => {
    try {
      setIsDownloading(true);
      const html2canvas = (await import('html2canvas')).default;
      const targetElement = side === 'FRONT' ? frontCardRef.current : backCardRef.current;

      if (targetElement) {
        const canvas = await html2canvas(targetElement, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#0A0A0A',
          logging: false
        });
        const link = document.createElement('a');
        link.download = `Ram-Nam-Bank-Pass-${side}-${user.name.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      console.error('Download error:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareText = `🚩 जय श्री राम! \nमेरा 'श्री राम नाम महाधन संचय बैंक' का डिजिटल सदस्यता पास सक्रिय हो चुका है।\n\nभक्त का नाम: ${user.name}\nसदस्यता: ${roleTitle}\nसदस्यता ID: ${displayId}\nवैधता: ${validityText}\nस्थान: ${locationText}\n\nआप भी राम नाम संचय परिवार से जुड़ें: ${typeof window !== 'undefined' ? window.location.origin : ''}/open-account`;
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'श्री राम नाम बैंक सदस्यता पास',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-5 w-full max-w-[540px]">
      {/* Tab Switcher: FRONT / BACK */}
      <div className="flex items-center justify-between w-full bg-white/5 p-2 rounded-2xl border border-white/10">
        <button
          onClick={() => setCardSide('FRONT')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            cardSide === 'FRONT'
              ? 'bg-saffron text-black shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Award size={16} /> मुख्य पृष्ठ (Front View)
        </button>
        <button
          onClick={() => setCardSide('BACK')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            cardSide === 'BACK'
              ? 'bg-saffron text-black shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <BookOpen size={16} /> नियम पृष्ठ (Back View)
        </button>
      </div>

      {/* CARD CONTAINER (Generous, High-Visibility CR80 Landscape Size: ~530px x 334px) */}
      <div className="relative w-full aspect-[1.586/1] max-w-[530px] select-none">
        
        {/* ===================== FRONT SIDE ===================== */}
        <div
          ref={frontCardRef}
          className={`w-full h-full rounded-[2.25rem] overflow-hidden p-5 sm:p-6 relative border-2 border-saffron/50 bg-[#0C0B0A] shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between transition-all duration-500 ${
            cardSide === 'FRONT' ? 'block' : 'hidden'
          }`}
          style={{
            backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.2) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)'
          }}
        >
          {/* Subtle watermarked texture & borders */}
          <div className="absolute inset-0 border border-saffron/20 rounded-[2.25rem] pointer-events-none"></div>
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-saffron/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Header */}
          <div className="flex items-center justify-between gap-3 border-b border-saffron/30 pb-2.5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-black/70 border-2 border-saffron/60 p-0.5 overflow-hidden shrink-0 shadow-lg flex items-center justify-center">
                <Image src="/logo.png" alt="Logo" width={44} height={44} className="object-cover scale-110" priority />
              </div>
              <div className="leading-tight">
                <h3 className="text-sm sm:text-base font-black uppercase gold-text tracking-wide font-serif">
                  श्री राम नाम महाधन संचय बैंक
                </h3>
                <p className="text-[8.5px] sm:text-[9.5px] text-white/60 font-bold uppercase tracking-[0.25em] mt-0.5">
                  अंतर्राष्ट्रीय मुख्यालय • अयोध्या धाम
                </p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-saffron/20 border border-saffron/40 text-saffron text-[9px] font-black uppercase tracking-widest shrink-0 shadow-sm">
              पास (PASS)
            </div>
          </div>

          {/* Middle Body: Photo + Devotee Info */}
          <div className="grid grid-cols-[95px_1fr] sm:grid-cols-[110px_1fr] gap-3.5 sm:gap-4 items-center my-auto py-1 relative z-10">
            {/* Devotee Photo / Initials Box */}
            <div className="relative w-[95px] h-[110px] sm:w-[110px] sm:h-[125px] rounded-2xl overflow-hidden border-2 border-saffron/50 bg-black/90 shadow-xl flex items-center justify-center shrink-0">
              {photoSrc ? (
                <img src={photoSrc} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-saffron bg-gradient-to-br from-saffron/25 to-black">
                  <span className="text-3xl font-black">{initials}</span>
                  <span className="text-[8px] text-white/50 uppercase font-bold tracking-widest mt-1">भक्त</span>
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 bg-black/85 py-0.5 text-[7.5px] font-black text-center text-saffron uppercase border-t border-saffron/40 tracking-wider">
                ✓ सत्यापित
              </div>
            </div>

            {/* Devotee Details */}
            <div className="space-y-1.5 min-w-0">
              <div>
                <h4 className="text-base sm:text-lg font-black text-white truncate leading-tight uppercase font-serif tracking-wide">
                  {user.name}
                </h4>
                <div className="inline-flex items-center gap-1 bg-amber-500/15 px-2.5 py-0.5 rounded-lg border border-amber-500/40 text-[8.5px] sm:text-[9.5px] font-black text-amber-300 uppercase tracking-widest mt-0.5 shadow-sm">
                  <Award size={10} className="text-amber-400" />
                  {roleTitle}
                </div>
              </div>

              {/* ID & Branch */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8.5px] sm:text-[9.5px]">
                <div>
                  <span className="text-white/40 block font-bold uppercase tracking-wider text-[7.5px]">सदस्यता ID</span>
                  <span className="font-mono font-black text-saffron tracking-wider truncate block text-xs">{displayId}</span>
                </div>
                <div>
                  <span className="text-white/40 block font-bold uppercase tracking-wider text-[7.5px]">स्थान / शाखा</span>
                  <span className="font-bold text-white/95 truncate block">{locationText}</span>
                </div>
              </div>

              {/* Membership Validity Date Badge: DD/MM/YY से DD/MM/YY तक */}
              <div className="pt-1">
                <div className="bg-white/[0.04] border border-saffron/30 rounded-xl px-2.5 py-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-saffron shrink-0" />
                    <span className="text-[7.5px] font-bold text-white/50 uppercase tracking-wider">सदस्यता वैधता (Validity):</span>
                  </div>
                  <span className="text-[8.5px] sm:text-[9px] font-black text-green-400 font-mono tracking-tight">
                    {validityText}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer: Signature & QR */}
          <div className="flex items-end justify-between pt-2 border-t border-white/10 relative z-10">
            {/* Signature */}
            <div className="leading-tight">
              <div className="h-6 sm:h-7 flex items-center">
                {adminSig.url ? (
                  <img src={adminSig.url} alt="Signature" className="max-h-6 sm:max-h-7 max-w-[95px] object-contain" />
                ) : (
                  <span className="font-serif italic text-xs sm:text-sm text-saffron font-black tracking-tight">
                    {adminSig.text || 'Ram Nam Bank'}
                  </span>
                )}
              </div>
              <p className="text-[7px] sm:text-[7.5px] font-black text-white/50 uppercase tracking-[0.25em]">अधिकृत हस्ताक्षर</p>
            </div>

            {/* QR Code */}
            <div className="flex items-center gap-2">
              <div className="text-right leading-none hidden sm:block">
                <p className="text-[7.5px] font-black text-green-400 uppercase">✓ सक्रिय खाता</p>
                <p className="text-[6.5px] text-white/40 uppercase mt-0.5">QR कोड सत्यापन</p>
              </div>
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white p-0.5 rounded-lg shadow-md flex items-center justify-center shrink-0">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}`} 
                  alt="QR"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===================== BACK SIDE (नियम व निर्देश) ===================== */}
        <div
          ref={backCardRef}
          className={`w-full h-full rounded-[2.25rem] overflow-hidden p-5 sm:p-6 relative border-2 border-saffron/50 bg-[#0C0B0A] shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between transition-all duration-500 ${
            cardSide === 'BACK' ? 'block' : 'hidden'
          }`}
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)'
          }}
        >
          {/* Header */}
          <div className="border-b border-saffron/30 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-saffron" />
              <h4 className="text-xs sm:text-sm font-black uppercase text-saffron tracking-wider font-serif">
                सदस्यता नियम एवं निर्देश (Rules & Guidelines)
              </h4>
            </div>
            <span className="text-[9px] font-mono font-bold text-white/50">{displayId}</span>
          </div>

          {/* Rules List */}
          <div className="space-y-1.5 my-auto text-[8.5px] sm:text-[9.5px] text-white/85 leading-relaxed">
            <div className="flex items-start gap-1.5">
              <span className="text-saffron font-black text-xs">१.</span>
              <p>यह पास श्री राम नाम बैंक की आधिकारिक सदस्यता का प्रमाणित एवं वैध पहचान पत्र है।</p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-saffron font-black text-xs">२.</span>
              <p>पुस्तिका में केवल <strong>'श्री राम'</strong> नाम लाल/केसरिया स्याही से शुद्ध भाव एवं पवित्रता से लिखें।</p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-saffron font-black text-xs">३.</span>
              <p>पुस्तिका पूर्ण होने पर अपनी निकटतम अधिकृत शाखा में जमा कर नई पुस्तिका प्राप्त करें।</p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-saffron font-black text-xs">४.</span>
              <p>सदस्यता श्रेणी: <strong>{roleTitle}</strong> ({validityText})।</p>
            </div>
          </div>

          {/* Contact / Help Footer with Sanstha Details */}
          <div className="border-t border-saffron/30 pt-2 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 text-[7.5px] sm:text-[8.5px] text-white/70">
            <div className="space-y-0.5">
              <p className="text-white font-bold uppercase tracking-tight text-[8px] sm:text-[9px]">
                🏛️ श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान
              </p>
              <p className="text-white/80 text-[7px] sm:text-[8px]">
                जगन्नाथ घाट, निकट-राज घाट, अयोध्या (उ.प्र.) - 224123
              </p>
              <p className="text-saffron font-bold font-mono text-[8px] sm:text-[9px]">
                📞 +91 8090525961, +91 9794640807
              </p>
              <p className="text-white/60 lowercase text-[7.5px] sm:text-[8px]">
                ✉️ odiamathayodhya9794@gmail.com
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <p className="text-saffron font-black uppercase text-[8px] sm:text-[9px]">।। ॐ श्री रामचन्द्राय नमः ।।</p>
              <p className="text-[7px] text-white/40 uppercase">मुख्यालय अयोध्या धाम</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== ACTION BUTTONS ===================== */}
      {showActions && (
        <div className="space-y-3 w-full max-w-[530px]">
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={() => handleDownloadImage(cardSide)}
              disabled={isDownloading}
              className="py-3.5 px-4 bg-saffron text-black font-black uppercase text-xs tracking-wider rounded-2xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isDownloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
              {cardSide === 'FRONT' ? 'Front डाउनलोड' : 'Back डाउनलोड'}
            </button>
            <button
              onClick={handlePrint}
              className="py-3.5 px-4 bg-white/10 text-white border border-white/20 font-black uppercase text-xs tracking-wider rounded-2xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all shadow-lg active:scale-95"
            >
              <Printer size={15} className="text-saffron" />
              पास प्रिंट करें (Print)
            </button>
          </div>

          <button
            onClick={handleShare}
            className="w-full py-3 px-4 bg-green-500/20 text-green-400 border border-green-500/30 font-black uppercase text-xs tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-green-500 hover:text-black transition-all shadow-lg active:scale-95"
          >
            {copied ? <Check size={15} /> : <Share2 size={15} />}
            {copied ? 'रेफरल लिंक कॉपी हुआ' : 'WhatsApp पर पास साझा करें'}
          </button>
        </div>
      )}

      {/* ===================== HIDDEN PRINT SHEET (PRINT BOTH SIDES ON 1 PAGE) ===================== */}
      <div className="hidden print:block fixed inset-0 bg-white text-black p-8 z-[9999]">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * { visibility: hidden !important; }
            #printable-card-area, #printable-card-area * { visibility: visible !important; }
            #printable-card-area { position: absolute; left: 0; top: 0; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; background: white; padding: 24px; }
          }
        ` }} />
        
        <div id="printable-card-area" className="flex flex-col items-center gap-6">
          <div className="text-center pb-2">
            <h2 className="text-xl font-black uppercase tracking-wider text-black">श्री राम नाम महाधन संचय बैंक</h2>
            <p className="text-xs text-gray-600 font-bold uppercase">आधिकारिक डिजिटल सदस्यता पास (CR80 Standard ID Card)</p>
          </div>

          {/* FRONT (Print Style) */}
          <div className="w-[370px] h-[235px] rounded-2xl border-2 border-amber-600 p-4 bg-amber-50 relative flex flex-col justify-between shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-300 pb-2">
              <div className="flex items-center gap-2.5">
                <Image src="/logo.png" alt="Logo" width={34} height={34} className="object-contain" />
                <div>
                  <h4 className="text-[11px] font-black text-amber-900 uppercase">श्री राम नाम महाधन संचय बैंक</h4>
                  <p className="text-[7px] text-gray-600 uppercase font-bold">अंतर्राष्ट्रीय मुख्यालय • अयोध्या धाम</p>
                </div>
              </div>
              <span className="text-[8px] font-black uppercase px-2.5 py-0.5 bg-amber-200 text-amber-900 rounded-full">सदस्य पास</span>
            </div>

            <div className="grid grid-cols-[70px_1fr_60px] gap-2.5 items-center my-auto">
              <div className="w-[70px] h-[82px] border-2 border-amber-400 bg-white rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                {photoSrc ? (
                  <img src={photoSrc} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-amber-800">{initials}</span>
                )}
              </div>
              <div className="space-y-0.5 text-left leading-tight">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight">{user.name}</h3>
                <p className="text-[8.5px] font-black text-amber-800 uppercase">{roleTitle}</p>
                <p className="text-[8px] text-gray-700 font-mono font-bold">ID: {displayId}</p>
                <p className="text-[7.5px] text-gray-600 font-bold uppercase truncate">{locationText}</p>
                <p className="text-[7.5px] text-amber-900 font-bold font-mono">वैधता: {validityText}</p>
              </div>
              {/* Front Scannable QR Code */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="w-[58px] h-[58px] bg-white p-1 rounded-lg border-2 border-amber-500 shadow-sm flex items-center justify-center">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}`} 
                    alt="QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[6px] text-amber-900 font-black uppercase mt-0.5 tracking-tighter">Scan to Verify</span>
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-amber-300 pt-1.5 text-[7.5px]">
              <div>
                <p className="font-serif italic text-amber-900 font-black text-[9px]">{adminSig.text || 'Ram Nam Bank'}</p>
                <p className="text-gray-500 uppercase text-[6.5px]">अधिकृत हस्ताक्षर</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-700">✓ अधिकृत एवं सत्यापित</p>
              </div>
            </div>
          </div>

          {/* BACK (Print Style) */}
          <div className="w-[370px] h-[235px] rounded-2xl border-2 border-amber-600 p-4 bg-amber-50 relative flex flex-col justify-between shadow-sm overflow-hidden">
            <div className="border-b border-amber-300 pb-1.5 flex justify-between items-center">
              <h4 className="text-[9.5px] font-black uppercase text-amber-900">सदस्यता नियम एवं निर्देश</h4>
              <span className="text-[7.5px] font-mono font-bold text-gray-600">{displayId}</span>
            </div>
            
            <div className="grid grid-cols-[1fr_65px] gap-2.5 items-center my-auto">
              <div className="space-y-1 text-[7.5px] text-gray-800 leading-snug">
                <p>१. यह पास श्री राम नाम बैंक की आधिकारिक सदस्यता का वैध प्रमाण है।</p>
                <p>२. पुस्तिका में केवल 'श्री राम' नाम लाल/केसरिया स्याही से शुद्ध भाव से लिखें।</p>
                <p>३. पुस्तिका पूर्ण होने पर निकटतम शाखा में जमा कर नई पुस्तिका प्राप्त करें।</p>
                <p>४. सदस्यता श्रेणी: <strong>{roleTitle}</strong> ({validityText})।</p>
              </div>
              {/* Back Large Scannable QR Code */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="w-[62px] h-[62px] bg-white p-1 rounded-lg border-2 border-amber-500 shadow-sm flex items-center justify-center">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verifyUrl)}`} 
                    alt="QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[6px] text-amber-900 font-black uppercase mt-0.5 tracking-tighter">सत्यापन QR</span>
              </div>
            </div>

            {/* Back Contact Footer */}
            <div className="border-t border-amber-300 pt-1.5 flex justify-between items-end text-[6.5px] text-gray-700">
              <div className="space-y-0.5">
                <p className="font-bold text-amber-950 uppercase text-[7px]">🏛️ श्री जगन्नाथ ओड़िआ बाबा सेवा संस्थान</p>
                <p className="text-[6.5px] text-gray-600">जगन्नाथ घाट, निकट-राज घाट, अयोध्या (उ.प्र.) - 224123</p>
                <p className="font-mono text-[7px] text-saffron font-bold mt-0.5">📞 +91 8090525961, +91 9794640807</p>
                <p className="lowercase text-gray-600">✉️ odiamathayodhya9794@gmail.com</p>
              </div>
              <div className="text-right font-black text-amber-900 text-[7.5px]">
                ।। ॐ श्री रामचन्द्राय नमः ।।
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
