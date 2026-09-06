"use client";

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  ShieldCheck,
  RefreshCw,
  IndianRupee,
  BadgeCheck,
  Truck
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
            mobile_number,
            membership_id,
            block,
            district
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

  const handleApproveAndCollect = async (id: string, userId: string, planName: string, amount: number) => {
    if (!window.confirm(`क्या आप पुष्टि करते हैं कि ₹${amount} भुगतान प्राप्त हो चुका है और इस सदस्यता पास को एक्टिवेट करना है?`)) return;
    
    setProcessingId(id);
    try {
      const { error: reqError } = await supabase
        .from('membership_requests')
        .update({ 
          status: 'APPROVED',
          payment_status: 'COLLECTED',
          verified_at: new Date().toISOString()
        })
        .eq('id', id);

      if (reqError) throw new Error(`अपडेट फेल: ${reqError.message}`);

      let membershipType = 'BANK_LIFE';
      if (planName.includes('विशेष')) membershipType = 'SPECIAL_LIFE';
      else if (planName.includes('आजीवन') && !planName.includes('बैंक')) membershipType = 'LIFE';

      const { error: memberError } = await supabase
        .from('members')
        .update({ 
          membership_type: membershipType, 
          status: 'ACTIVE',
          payment_status: 'PAID'
        })
        .eq('id', userId);

      if (memberError) throw new Error(`मेंबर स्टेटस अपडेट फेल: ${memberError.message}`);

      // Record donation / revenue transaction
      await supabase.from('donations').insert([{
        donor_name: requests.find(r => r.id === id)?.members?.full_name || 'भक्त',
        amount: amount,
        donation_type: 'MEMBERSHIP_FEE',
        utr_number: requests.find(r => r.id === id)?.transaction_id || 'DIRECT',
        status: 'APPROVED',
        verified_by_name: 'Admin Central',
        created_at: new Date().toISOString()
      }]);

      await supabase.from('notifications').insert([{
        user_id: userId,
        title: 'सदस्यता पास सक्रिय (Pass Activated)',
        message: `जय श्री राम! आपकी '${planName}' सदस्यता का भुगतान प्राप्त हो गया है और आपका डिजिटल पास सक्रिय कर दिया गया है।`,
        type: 'SUCCESS'
      }]);
      
      alert('सदस्यता पास सफलतापूर्वक सक्रिय हो गया और पेमेंट कलेक्टेड मार्क हो गया!');
      fetchRequests();
    } catch (err: any) {
      alert(`त्रुटि: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, userId: string) => {
    const reason = window.prompt('अस्वीकार करने का कारण लिखें:');
    if (reason === null) return;

    setProcessingId(id);
    try {
      await supabase
        .from('membership_requests')
        .update({ status: 'REJECTED', rejection_reason: reason })
        .eq('id', id);

      await supabase.from('notifications').insert([{
        user_id: userId,
        title: 'सदस्यता अस्वीकृत',
        message: `आपकी सदस्यता रिक्वेस्ट अस्वीकृत कर दी गई है। कारण: ${reason}`,
        type: 'ERROR'
      }]);

      fetchRequests();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.members?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.members?.mobile_number?.includes(searchTerm)
  );

  const pendingTotal = requests.filter(r => r.status === 'PENDING').reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const collectedTotal = requests.filter(r => r.status === 'APPROVED').reduce((s, r) => s + (Number(r.amount) || 0), 0);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black font-serif gold-text uppercase tracking-tight">
            सदस्यता पास एवं पेमेंट सत्यापन
          </h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
            Mark Payment Collected & Activate Devotee Membership Passes
          </p>
        </div>
        <button 
          onClick={fetchRequests}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white flex items-center gap-2 transition-all active:scale-95"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> रिफ्रेश करें
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="premium-card p-6 border-l-4 border-amber-500 space-y-1">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">लंबित पास अनुरोध (Pending)</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-white">{requests.filter(r => r.status === 'PENDING').length}</h3>
            <span className="text-xs font-mono font-bold text-amber-400">₹{pendingTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="premium-card p-6 border-l-4 border-green-500 space-y-1">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">सक्रिय पास (Active Passes)</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-white">{requests.filter(r => r.status === 'APPROVED').length}</h3>
            <span className="text-xs font-mono font-bold text-green-400">₹{collectedTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="premium-card p-6 border-l-4 border-saffron space-y-1">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">कुल सदस्यता संकलन</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black gold-text">₹{(collectedTotal).toLocaleString()}</h3>
            <span className="text-[9px] font-bold text-white/40 uppercase">100% Verified</span>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="premium-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center bg-white/[0.02]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" 
              placeholder="नाम, मोबाइल या UTR से खोजें..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:border-saffron/50 transition-all font-medium text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">भक्त विवरण</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">सदस्यता प्लान</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">UTR / पेमेंट ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">तारीख</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && requests.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">डेटा लोड हो रहा है...</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">कोई लंबित अनुरोध नहीं मिला</td></tr>
              ) : filteredRequests.map((req) => (
                <tr key={req.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron/20 to-transparent flex items-center justify-center font-bold text-saffron border border-saffron/20">
                        {req.members?.full_name?.charAt(0) || 'भ'}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white/90">{req.members?.full_name || 'अज्ञात'}</p>
                        <p className="text-[10px] text-white/30 font-mono">{req.members?.mobile_number || req.members?.email}</p>
                        <p className="text-[8px] text-saffron/60 uppercase">{req.members?.block}, {req.members?.district}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-saffron uppercase tracking-wide">{req.plan_name}</p>
                    <p className="text-sm font-black gold-text">₹{req.amount}/-</p>
                  </td>
                  <td className="px-8 py-6">
                    <code className="text-[11px] px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 font-mono text-white/80 tracking-widest">
                      {req.transaction_id || 'DIRECT_CASH'}
                    </code>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">
                      {new Date(req.created_at).toLocaleString('hi-IN', { 
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    {req.status === 'PENDING' ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleApproveAndCollect(req.id, req.user_id, req.plan_name, req.amount)}
                          disabled={processingId === req.id}
                          className="px-4 py-2.5 bg-saffron text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-saffron/20 flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <BadgeCheck size={14} />
                          {processingId === req.id ? 'सक्रिय हो रहा...' : 'पेमेंट मिला & एक्टिवेट करें'}
                        </button>
                        <button 
                          onClick={() => handleReject(req.id, req.user_id)}
                          disabled={processingId === req.id}
                          className="px-3 py-2.5 bg-white/5 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-black transition-all disabled:opacity-50"
                        >
                          अस्वीकृत
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {req.status === 'APPROVED' ? (
                          <span className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1.5 shadow-sm">
                            <CheckCircle2 size={12} /> पास सक्रिय (Paid)
                          </span>
                        ) : (
                          <span className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1.5">
                            <XCircle size={12} /> अस्वीकृत
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
    </div>
  );
}
