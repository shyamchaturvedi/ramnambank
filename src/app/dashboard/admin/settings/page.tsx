"use client";

import React, { useState, useEffect } from 'react';
import { getSettings, updateSetting } from '@/services/dataService';
import { 
  CreditCard, 
  ShieldCheck, 
  Globe, 
  Save, 
  QrCode, 
  UserCog,
  BellRing,
  Lock,
  BookOpen,
  Camera,
  Play,
  Share2
} from 'lucide-react';

export default function SettingsPage() {
  const [upiId, setUpiId] = useState('8090525961m@pnb');
  const [memberFee, setMemberFee] = useState('360');
  const [defaultCount, setDefaultCount] = useState('10000');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [regEnabled, setRegEnabled] = useState(true);
  const [adminSignatureUrl, setAdminSignatureUrl] = useState('');
  const [adminSignatureText, setAdminSignatureText] = useState('Ram Nam Bank');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSettings();
        if (settings) {
          setMaintenanceMode(!!settings.maintenance_mode);
          setRegEnabled(settings.registration_enabled !== false);
          if (settings.upi_id) setUpiId(settings.upi_id);
          if (settings.admin_signature_url) setAdminSignatureUrl(settings.admin_signature_url);
          if (settings.admin_signature_text) setAdminSignatureText(settings.admin_signature_text);
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
    loadSettings();
  }, []);

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setAdminSignatureUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSetting('upi_id', upiId);
      await updateSetting('maintenance_mode', maintenanceMode);
      await updateSetting('registration_enabled', regEnabled);
      await updateSetting('admin_signature_url', adminSignatureUrl);
      await updateSetting('admin_signature_text', adminSignatureText);
      
      setToast('✅ सेटिंग्स एवं हस्ताक्षर सफलतापूर्वक सुरक्षित कर दिए गए!');
      setTimeout(() => setToast(null), 4000);
    } catch (e) {
      alert('सेटिंग्स सुरक्षित करने में त्रुटि आई।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 text-white pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black font-serif uppercase gold-text">प्रशासनिक नियंत्रण (Master Controls)</h2>
          <p className="text-white/40 text-sm mt-1">बैंक की ग्लोबल सेटिंग्स और पेमेंट सिस्टम का प्रबंधन करें।</p>
        </div>
        <button 
          onClick={handleSave}
          className="saffron-btn flex items-center gap-3 text-xs"
        >
          <Save size={18} />
          परिवर्तन सुरक्षित करें
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment & Donation Settings */}
          <div className="premium-card p-10 space-y-10 border-t-4 border-saffron">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-saffron/10 flex items-center justify-center text-saffron">
                  <ShieldCheck size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black font-serif gold-text uppercase">भुगतान एवं दान सेटिंग्स</h3>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Donation UPI & QR Management</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">आधिकारिक UPI ID</label>
                  <input 
                    type="text" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white font-mono"
                  />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">आजीवन सदस्यता शुल्क (₹)</label>
                  <input 
                    type="number" 
                    value={memberFee}
                    onChange={(e) => setMemberFee(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white font-bold"
                  />
               </div>
            </div>
          </div>

          {/* Authorized Signature Card */}
          <div className="premium-card p-10 space-y-10 border-t-4 border-amber-500">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <ShieldCheck size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black font-serif gold-text uppercase">डिजिटल पास अधिकृत हस्ताक्षर</h3>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Devotee ID Pass Signature</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">हस्ताक्षर टेक्स्ट (Default)</label>
                  <input 
                    type="text" 
                    value={adminSignatureText}
                    onChange={(e) => setAdminSignatureText(e.target.value)}
                    placeholder="e.g. Ram Nam Bank / President"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-saffron font-bold"
                  />
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">हस्ताक्षर फोटो / इमेज अपलोड करें (PNG/JPG)</label>
                  <div className="flex items-center gap-4">
                    <label className="px-5 py-3.5 bg-saffron/10 hover:bg-saffron/20 border border-saffron/30 text-saffron rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2">
                       <Camera size={16} />
                       सिग्नेचर इमेज चुनें
                       <input 
                         type="file" 
                         accept="image/*" 
                         onChange={handleSignatureUpload} 
                         className="hidden" 
                       />
                    </label>
                    {adminSignatureUrl && (
                      <button 
                        type="button" 
                        onClick={() => setAdminSignatureUrl('')} 
                        className="text-[10px] text-red-400 hover:underline font-bold"
                      >
                        इमेज हटाएं
                      </button>
                    )}
                  </div>
               </div>

               {/* Live Signature Preview */}
               <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <p className="text-[8px] text-white/30 uppercase font-black tracking-widest">पास पर कैसा दिखेगा (Preview):</p>
                  <div className="h-12 flex items-center justify-center">
                    {adminSignatureUrl ? (
                      <img src={adminSignatureUrl} alt="Signature Preview" className="max-h-12 object-contain" />
                    ) : (
                      <div className="relative flex items-center justify-center -rotate-6">
                        <span className="font-serif italic text-sm text-saffron/90 font-black tracking-tighter">{adminSignatureText || 'Ram Nam Bank'}</span>
                        <svg className="absolute bottom-0 left-0 w-full h-4 text-saffron/40" viewBox="0 0 100 20">
                          <path d="M5,15 Q25,5 45,15 T95,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] text-white/40 uppercase tracking-widest">अधिकृत हस्ताक्षर</span>
               </div>
            </div>
          </div>

          {/* Default Spiritual Values */}
          <div className="premium-card p-10 space-y-10 border-t-4 border-blue-500">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <BookOpen size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black font-serif gold-text uppercase">सिस्टम डिफ़ॉल्ट (Spiritual Values)</h3>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Configure default name counts</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">डिफ़ॉल्ट पुस्तिका क्षमता (राम नाम)</label>
                  <input 
                    type="number" 
                    value={defaultCount}
                    onChange={(e) => setDefaultCount(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-saffron text-xl font-black"
                  />
                  <p className="text-[9px] text-white/20 italic font-bold uppercase tracking-widest">
                     * यदि संग्रह के समय संख्या खाली छोड़ी जाती है, तो यह राशि जुड़ जाएगी।
                  </p>
               </div>
            </div>
          </div>

          {/* Social Media Settings */}
          <div className="premium-card p-10 space-y-10 border-t-4 border-white/10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                  <Globe size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black font-serif text-white/80 uppercase">सोशल मीडिया लिंक्स</h3>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Website Footer Social Icons</p>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
               {[
                 { label: 'Facebook', icon: Globe, val: 'https://facebook.com/ramnambank' },
                 { label: 'YouTube', icon: Play, val: 'https://youtube.com/ramnambank' },
                 { label: 'Instagram', icon: Camera, val: 'https://instagram.com/ramnambank' },
                 { label: 'Twitter (X)', icon: Share2, val: 'https://twitter.com/ramnambank' },
               ].map((social, i) => (
                 <div key={i} className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 shrink-0 border border-white/10">
                       <social.icon size={16} />
                    </div>
                    <input 
                      type="text" 
                      defaultValue={social.val}
                      className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-white/30 text-xs text-white/60"
                    />
                 </div>
               ))}
            </div>
          </div>

          {/* System Status Controls */}
          <div className="premium-card p-10 space-y-10">
            <div className="flex items-center gap-4 text-royal-gold">
              <UserCog size={24} />
              <h3 className="font-bold tracking-widest uppercase text-sm">सिस्टम सुरक्षा एवं स्थिति</h3>
            </div>
            
            <div className="space-y-6">
              {[
                { 
                  label: 'रखरखाव मोड (Maintenance Mode)', 
                  desc: 'सभी सार्वजनिक पेजों पर रखरखाव संदेश दिखाएँ', 
                  status: maintenanceMode,
                  key: 'maintenance_mode'
                },
                { 
                  label: 'नवीन पंजीकरण', 
                  desc: 'New Registration Status', 
                  status: regEnabled,
                  key: 'registration_enabled'
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest">{item.label}</p>
                    <p className="text-[10px] text-white/30 mt-1">{item.desc}</p>
                  </div>
                  <div 
                    onClick={async () => {
                      const newVal = !item.status;
                      if (item.key === 'maintenance_mode') setMaintenanceMode(newVal);
                      if (item.key === 'registration_enabled') setRegEnabled(newVal);
                      
                      try {
                        await updateSetting(item.key, newVal);
                      } catch (e) {
                        console.error("Error updating setting:", e);
                      }
                    }}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${item.status ? 'bg-sacred-red shadow-[0_0_15px_rgba(255,0,0,0.3)]' : 'bg-white/10'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${item.status ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              ))}
              
              {maintenanceMode && (
                <div className="p-4 rounded-xl bg-sacred-red/10 border border-sacred-red/20 text-sacred-red text-[10px] font-bold uppercase tracking-widest animate-pulse">
                  * रखरखाव मोड सक्रिय है। सार्वजनिक यूजर अब बैंक का उपयोग नहीं कर पाएंगे।
                </div>
              )}
            </div>
          </div>
      </div>

      {/* Security Logs Footer */}
      <div className="premium-card p-8 bg-sacred-red/5 border border-sacred-red/10 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Lock className="text-sacred-red" size={20} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Master Security: Ayodhya Admin Authorized</p>
         </div>
         <button className="text-[10px] font-bold text-sacred-red hover:underline uppercase tracking-widest">सिस्टम रिसेट</button>
      </div>
    </div>
  );
}
