"use client";

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function MembershipRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('membership_requests')
        .select(`
          *,
          members:user_id (
            id,
            full_name,
            email,
            membership_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, userId: string, planName: string, status: 'APPROVED' | 'REJECTED') => {
    if (!window.confirm(`क्या आप इस रिक्वेस्ट को ${status === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत'} करना चाहते हैं?`)) return;
    
    setProcessingId(id);
    try {
      const { error: reqError } = await supabase
        .from('membership_requests')
        .update({ status })
        .eq('id', id);

      if (reqError) throw new Error(`अपडेट फेल: ${reqError.message}`);

      if (status === 'APPROVED') {
        let membershipType = 'BANK_LIFE';
        if (planName.includes('विशेष')) membershipType = 'SPECIAL_LIFE';
        else if (planName.includes('आजीवन') && !planName.includes('बैंक')) membershipType = 'LIFE';

        const { error: memberError } = await supabase
          .from('members')
          .update({ membership_type: membershipType, status: 'ACTIVE' })
          .eq('id', userId);

        if (memberError) throw new Error(`मेंबर स्टेटस अपडेट फेल: ${memberError.message}`);

        await supabase.from('notifications').insert([{
          user_id: userId,
          title: 'सदस्यता स्वीकृत',
          message: `आपकी '${planName}' सदस्यता स्वीकृत कर दी गई है। अब आप अपना डिजिटल ID कार्ड देख सकते हैं।`,
          type: 'SUCCESS'
        }]);
      } else {
        await supabase.from('notifications').insert([{
          user_id: userId,
          title: 'सदस्यता अस्वीकृत',
          message: `आपकी सदस्यता रिक्वेस्ट अस्वीकृत कर दी गई है। कृपया UTR नंबर की जांच करें।`,
          type: 'ERROR'
        }]);
      }
      
      fetchRequests();
    } catch (err: any) {
      alert(`त्रुटि: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.members?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black font-serif gold-text uppercase tracking-tight">सदस्यता वेरिफिकेशन</h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Verify transactions and activate devotee accounts</p>
        </div>
        <button 
          onClick={fetchRequests}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 transition-all active:scale-95"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> रिफ्रेश करें
        </button>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="p-8 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center bg-white/[0.02]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" 
              placeholder="नाम या UTR से खोजें..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:border-saffron/50 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">भक्त विवरण</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">प्लान</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">UTR / ट्रांजेक्शन ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">तारीख</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && requests.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">लोड हो रहा है...</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">कोई लंबित रिक्वेस्ट नहीं मिली</td></tr>
              ) : filteredRequests.map((req) => (
                <tr key={req.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron/20 to-transparent flex items-center justify-center font-bold text-saffron border border-saffron/20">
                        {req.members?.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white/90">{req.members?.full_name || 'अज्ञात'}</p>
                        <p className="text-[10px] text-white/30 lowercase font-medium">{req.members?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-saffron uppercase tracking-wide">{req.plan_name}</p>
                    <p className="text-[10px] text-white/50 font-bold">₹{req.amount}</p>
                  </td>
                  <td className="px-8 py-6">
                    <code className="text-[11px] px-3 py-1 bg-white/5 rounded-lg border border-white/10 font-mono text-white/60 tracking-widest">
                      {req.transaction_id}
                    </code>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">
                      {new Date(req.created_at).toLocaleString('hi-IN', { 
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true 
                      })}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    {req.status === 'PENDING' ? (
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleAction(req.id, req.user_id, req.plan_name, 'APPROVED')}
                          disabled={processingId === req.id}
                          className="px-5 py-2.5 bg-green-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-400 active:scale-95 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                        >
                          {processingId === req.id ? 'प्रोसेसिंग...' : 'स्वीकृत'}
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, req.user_id, req.plan_name, 'REJECTED')}
                          disabled={processingId === req.id}
                          className="px-5 py-2.5 bg-white/5 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-black transition-all disabled:opacity-50"
                        >
                          अस्वीकृत
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {req.status === 'APPROVED' ? (
                          <span className="px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1.5">
                            <CheckCircle2 size={10} /> स्वीकृत
                          </span>
                        ) : (
                          <span className="px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1.5">
                            <XCircle size={10} /> अस्वीकृत
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-8 bg-saffron/5 border border-saffron/10 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="p-5 bg-saffron/20 rounded-2xl text-saffron relative z-10 shadow-xl shadow-saffron/10">
          <ShieldCheck size={32} />
        </div>
        <div className="space-y-2 text-center md:text-left relative z-10">
          <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">एडमिन वेरिफिकेशन गाइड</h4>
          <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed max-w-2xl">
            कृपया भुगतान स्वीकृत करने से पहले अपने बैंक स्टेटमेंट या UPI ऐप में भक्त द्वारा दिए गए UTR नंबर का मिलान अवश्य कर लें। एक बार स्वीकृत होने पर भक्त का अकाउंट तुरंत एक्टिव हो जाएगा और उसे सूचना मिल जाएगी।
          </p>
        </div>
      </div>
    </div>
  );
}
