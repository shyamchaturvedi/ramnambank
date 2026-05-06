import Image from 'next/image';
import { Hammer, Clock, Phone, Mail } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 z-0 opacity-20">
        <Image 
          src="/hero.png" 
          alt="अयोध्या धाम" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 max-w-2xl animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 rounded-3xl bg-saffron/10 flex items-center justify-center mx-auto mb-8 border border-saffron/20 sacred-glow">
          <Hammer className="text-saffron w-12 h-12" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black font-serif mb-6 gold-text">
          अल्पकालिक रखरखाव
        </h1>
        
        <p className="text-xl md:text-2xl font-medium text-white/80 mb-8 font-serif italic">
          “राम नाम बिनु गति नहिं कोई, राम नाम बिनु उद्धार न होई।”
        </p>

        <p className="text-white/40 text-lg mb-12 leading-relaxed">
          हम बैंक की ऑनलाइन सेवाओं को और अधिक सुदृढ़ और सुरक्षित बनाने के लिए तकनीकी सुधार कर रहे हैं। <br />
          कृपया कुछ समय बाद पुनः प्रयास करें। प्रभु श्री राम की कृपा आप पर बनी रहे।
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-md mx-auto">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
             <Clock className="text-saffron shrink-0" />
             <div>
                <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-bold">संभावित समय</h4>
                <p className="text-sm font-bold text-white/80">शीघ्र ही सक्रिय</p>
             </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
             <Phone className="text-saffron shrink-0" />
             <div>
                <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-bold">सहायता</h4>
                <p className="text-sm font-bold text-white/80">+91-9598023701</p>
             </div>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-white/5">
           <Image 
             src="/logo.png" 
             alt="Ram Nam Bank" 
             width={60} 
             height={60} 
             className="mx-auto opacity-50 mb-4"
           />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">राम नाम बैंक - अयोध्या धाम</p>
        </div>
      </div>
    </div>
  );
}
