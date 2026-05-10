"use client";

import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  const downloadTemplate = () => {
    const headers = "Full Name,Mobile Number,State,District,Block,PIN Code,Membership Type (REGULAR/LIFE)\n";
    const sampleData = "Nirmal Swain,9876543210,Odisha,Kendrapara,Derabish Block,754289,LIFE\n";
    const blob = new Blob([headers + sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ram-nam-bank-template.csv';
    a.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setUploadStatus('IDLE');
    }
  };

  const startUpload = () => {
    if (!file) return;
    setIsUploading(true);
    // Simulate parsing and uploading 6000+ records
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus('SUCCESS');
    }, 3000);
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-black font-serif uppercase gold-text text-white">बल्क भक्त पंजीकरण (Bulk Upload)</h2>
        <p className="text-white/40 text-sm mt-1">हज़ारों भक्तों का डेटा एक साथ एक्सेल/सीएसवी फाइल के माध्यम से अपलोड करें।</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1: Download Template */}
        <div className="premium-card p-10 space-y-6">
          <div className="w-12 h-12 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron">
            <div className="flex items-center justify-center">
               <Download size={24} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">स्टेप 1: फॉर्मेट डाउनलोड करें</h3>
            <p className="text-white/40 text-[10px] leading-relaxed">
              डाटा अपलोड करने के लिए सही फॉर्मेट का होना आवश्यक है। कृपया नीचे दिए गए बटन से टेम्पलेट डाउनलोड करें और उसमें भक्तों का विवरण भरें।
            </p>
          </div>
          <button 
            onClick={downloadTemplate}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <FileSpreadsheet size={16} className="text-saffron" />
            टेम्पलेट डाउनलोड करें
          </button>
        </div>

        {/* Step 2: Upload File */}
        <div className="lg:col-span-2 premium-card p-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-saffron">
              <Upload size={20} />
              <h3 className="font-bold tracking-widest uppercase text-[10px]">स्टेप 2: फाइल अपलोड करें</h3>
            </div>
            {file && (
              <span className="text-[10px] font-bold text-saffron bg-saffron/10 px-3 py-1 rounded-full border border-saffron/20">
                {file.name}
              </span>
            )}
          </div>

          {!isUploading && uploadStatus === 'IDLE' && (
            <label className="border-2 border-dashed border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center space-y-4 hover:border-saffron/30 transition-all cursor-pointer group">
              <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20 group-hover:text-saffron transition-all">
                <FileSpreadsheet size={32} />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">फाइल यहाँ ड्रैग करें या चुनें</p>
                <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mt-1">केवल .CSV फाइल (अधिकतम 10MB)</p>
              </div>
            </label>
          )}

          {isUploading && (
            <div className="py-20 flex flex-col items-center justify-center space-y-6">
              <Loader2 size={48} className="text-saffron animate-spin" />
              <div className="text-center space-y-2">
                <p className="font-bold text-lg animate-pulse">डेटा प्रोसेस हो रहा है...</p>
                <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">6,000+ रिकॉर्ड्स की जाँच की जा रही है</p>
              </div>
            </div>
          )}

          {uploadStatus === 'SUCCESS' && (
            <div className="py-16 bg-green-400/5 border border-green-400/20 rounded-3xl flex flex-col items-center justify-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center text-green-400">
                <CheckCircle2 size={32} />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-xl font-bold text-green-400 uppercase tracking-widest">अपलोड सफल!</h4>
                <p className="text-sm text-white/60">सभी भक्तों का डेटा सफलतापूर्वक जोड़ दिया गया है और उनकी आईडी जेनरेट हो गई हैं।</p>
              </div>
              <button 
                onClick={() => { setFile(null); setUploadStatus('IDLE'); }}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase"
              >
                एक और फाइल अपलोड करें
              </button>
            </div>
          )}

          <button 
            disabled={!file || isUploading}
            onClick={startUpload}
            className="w-full py-5 bg-saffron text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(255,153,51,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
          >
            डेटा प्रोसेस और सेव करें
          </button>
        </div>
      </div>

      {/* Guidelines */}
      <div className="premium-card p-8 border-l-4 border-l-saffron bg-saffron/5">
         <div className="flex gap-4">
            <Info className="text-saffron shrink-0" size={20} />
            <div className="space-y-3">
               <h4 className="text-xs font-black uppercase tracking-widest text-saffron">महत्वपूर्ण निर्देश (Guidelines):</h4>
               <ul className="text-[10px] font-bold text-white/40 space-y-2 uppercase leading-relaxed">
                  <li>• मोबाइल नंबर अनिवार्य है और इसमें 10 अंक होने चाहिए।</li>
                  <li>• जिला और ब्लॉक का नाम हमारे डेटाबेस के अनुसार ही रखें (उदा: "Kendrapara", "Derabish Block")।</li>
                  <li>• सदस्यता के प्रकार में केवल "REGULAR" या "LIFE" लिखें।</li>
                  <li>• सभी भक्तों का पासवर्ड डिफ़ॉल्ट रूप से <span className="text-white">RamRam@108</span> सेट कर दिया जाएगा।</li>
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
}
