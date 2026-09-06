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
  Truck,
  AlertCircle,
  Package,
  Send,
  ExternalLink,
  MapPin
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
      const { db } = await import('@/lib/firebase');
      const { collection, getDocs, doc, getDoc } = await import('firebase/firestore');

      const reqSnap = await getDocs(collection(db, 'membership_requests'));
      const reqList = await Promise.all(
        reqSnap.docs.map(async (d) => {
          const reqData = d.data();
          let memberInfo: any = {};
          try {
            if (reqData.user_id) {
              const memSnap = await getDoc(doc(db, 'members', reqData.user_id));
              if (memSnap.exists()) memberInfo = memSnap.data();
            }
          } catch (e) {}

          return {
            id: d.id,
            ...reqData,
            members: memberInfo
          };
        })
      );

      setRequests(reqList);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Modal & Toast States
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: string;
    userId: string;
    planName: string;
    amount: number;
    userName: string;
    utr: string;
  } | null>(null);

  // Dispatch Modal State
  const [dispatchModal, setDispatchModal] = useState<{
    isOpen: boolean;
    reqId: string;
    userId: string;
    userName: string;
    phone: string;
    address: string;
    courierName: string;
    trackingId: string;
    deliveryStatus: 'PENDING' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED';
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApproveAndCollect = async (id: string, userId: string, planName: string, amount: number) => {
    const item = requests.find(r => r.id === id);
    setConfirmModal({
      isOpen: true,
      id,
      userId,
      planName,
      amount,
      userName: item?.members?.full_name || 'भक्त',
      utr: item?.transaction_id || 'N/A'
    });
  };

  const executeApproval = async () => {
    if (!confirmModal) return;
    const { id, userId, planName, amount } = confirmModal;
    
    setProcessingId(id);
    setConfirmModal(null);
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, updateDoc, addDoc, collection } = await import('firebase/firestore');

      await updateDoc(doc(db, 'membership_requests', id), {
        status: 'APPROVED',
        payment_status: 'COLLECTED',
        delivery_status: 'PROCESSING', // automatically set kit status to processing
        verified_at: new Date().toISOString()
      });

      let membershipType = 'BANK_LIFE';
      if (planName.includes('विशेष')) membershipType = 'SPECIAL_LIFE';
      else if (planName.includes('आजीवन') && !planName.includes('बैंक')) membershipType = 'LIFE';

      if (userId) {
        try {
          await updateDoc(doc(db, 'members', userId), {
            membership_type: membershipType,
            status: 'ACTIVE',
            payment_status: 'PAID',
            delivery_status: 'PROCESSING'
          });
        } catch (e) {}
      }

      await addDoc(collection(db, 'donations'), {
        donor_name: requests.find(r => r.id === id)?.members?.full_name || 'भक्त',
        amount: amount,
        donation_type: 'MEMBERSHIP_FEE',
        utr_number: requests.find(r => r.id === id)?.transaction_id || 'DIRECT',
        status: 'APPROVED',
        verified_by_name: 'Admin Central',
        created_at: new Date().toISOString()
      });

      showToast(`🎉 ₹${amount} भुगतान सत्यापित! सदस्यता पास सक्रिय व किट प्रक्रिया प्रारंभ की गई।`, 'success');
      fetchRequests();
    } catch (err: any) {
      showToast(`त्रुटि: ${err.message}`, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenDispatchModal = (req: any) => {
    const mem = req.members || {};
    const fullAddr = [
      mem.address_line,
      mem.at_post ? `Post: ${mem.at_post}` : '',
      mem.via_route ? `Via: ${mem.via_route}` : '',
      mem.police_station ? `Thana: ${mem.police_station}` : '',
      mem.block ? `Block: ${mem.block}` : '',
      mem.district ? `Dist: ${mem.district}` : '',
      mem.state ? `State: ${mem.state}` : '',
      mem.pincode ? `PIN: ${mem.pincode}` : ''
    ].filter(Boolean).join(', ') || 'पता दर्ज नहीं है';

    setDispatchModal({
      isOpen: true,
      reqId: req.id,
      userId: req.user_id,
      userName: mem.full_name || 'भक्त',
      phone: mem.mobile_number || 'N/A',
      address: fullAddr,
      courierName: req.courier_name || 'India Post (Speed Post)',
      trackingId: req.tracking_id || '',
      deliveryStatus: req.delivery_status || 'PROCESSING'
    });
  };

  const handleSaveDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModal) return;
    
    setProcessingId(dispatchModal.reqId);
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, updateDoc } = await import('firebase/firestore');

      const updatePayload: any = {
        delivery_status: dispatchModal.deliveryStatus,
        courier_name: dispatchModal.courierName,
        tracking_id: dispatchModal.trackingId,
        dispatched_at: dispatchModal.deliveryStatus === 'DISPATCHED' ? new Date().toISOString() : null,
        delivered_at: dispatchModal.deliveryStatus === 'DELIVERED' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      await updateDoc(doc(db, 'membership_requests', dispatchModal.reqId), updatePayload);

      if (dispatchModal.userId) {
        try {
          await updateDoc(doc(db, 'members', dispatchModal.userId), {
            delivery_status: dispatchModal.deliveryStatus,
            kit_courier_name: dispatchModal.courierName,
            kit_tracking_id: dispatchModal.trackingId,
            kit_dispatched_at: updatePayload.dispatched_at || null,
            kit_delivered_at: updatePayload.delivered_at || null
          });
        } catch(e) {}
      }

      showToast(`📦 आर्डर/किट स्टेटस अपडेट: ${dispatchModal.deliveryStatus}`, 'success');
      setDispatchModal(null);
      fetchRequests();
    } catch (err: any) {
      showToast(`अपडेट में त्रुटि: ${err.message}`, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, userId: string) => {
    setProcessingId(id);
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, updateDoc } = await import('firebase/firestore');

      await updateDoc(doc(db, 'membership_requests', id), {
        status: 'REJECTED',
        verified_at: new Date().toISOString()
      });

      showToast('अनुरोध अस्वीकृत किया गया।', 'error');
      fetchRequests();
    } catch (err: any) {
      showToast(`त्रुटि: ${err.message}`, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.members?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.members?.mobile_number?.includes(searchTerm) ||
    r.tracking_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTotal = requests.filter(r => r.status === 'PENDING').reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const collectedTotal = requests.filter(r => r.status === 'APPROVED').reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const dispatchedCount = requests.filter(r => r.delivery_status === 'DISPATCHED' || r.delivery_status === 'DELIVERED').length;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black font-serif gold-text uppercase tracking-tight">
            सदस्यता पास, पेमेंट एवं किट आर्डर
          </h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
            Payment Verification & Welcome Kit (Booklet/Pen) Order Dispatch
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
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

        <div className="premium-card p-6 border-l-4 border-blue-500 space-y-1">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">किट डिस्पैच (Sent / Delivered)</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-blue-400">{dispatchedCount}</h3>
            <span className="text-[9px] font-bold text-blue-400/60 uppercase">डाक / कुरियर</span>
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
              placeholder="नाम, मोबाइल, UTR या ट्रैकिंग ID से खोजें..." 
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
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">भक्त विवरण व पता</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">सदस्यता प्लान</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">UTR / पेमेंट ID</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">किट आर्डर स्टेटस (Kit)</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && requests.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">डेटा लोड हो रहा है...</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">कोई लंबित अनुरोध नहीं मिला</td></tr>
              ) : filteredRequests.map((req) => (
                <tr key={req.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-6 py-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron/20 to-transparent flex items-center justify-center font-bold text-saffron border border-saffron/20 shrink-0 mt-0.5">
                        {req.members?.full_name?.charAt(0) || 'भ'}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white/90">{req.members?.full_name || 'अज्ञात'}</p>
                        <p className="text-[10px] text-white/40 font-mono">{req.members?.mobile_number || req.members?.email}</p>
                        <p className="text-[9px] text-white/50 mt-1 max-w-xs leading-relaxed">
                          📍 {req.members?.address_line || req.members?.at_post || 'पता दर्ज नहीं'} 
                          {req.members?.pincode ? ` - ${req.members?.pincode}` : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-xs font-bold text-saffron uppercase tracking-wide">{req.plan_name}</p>
                    <p className="text-sm font-black gold-text">₹{req.amount}/-</p>
                  </td>
                  <td className="px-6 py-6">
                    <code className="text-[11px] px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 font-mono text-white/80 tracking-widest">
                      {req.transaction_id || 'DIRECT_CASH'}
                    </code>
                    <p className="text-[9px] text-white/30 uppercase mt-1">
                      {new Date(req.created_at).toLocaleDateString('hi-IN')}
                    </p>
                  </td>
                  
                  {/* Kit Delivery Status Column */}
                  <td className="px-6 py-6">
                    {req.status === 'APPROVED' ? (
                      <div className="space-y-1.5">
                        {req.delivery_status === 'DELIVERED' ? (
                          <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
                            <CheckCircle2 size={12} /> डिलीवर हो गया
                          </span>
                        ) : req.delivery_status === 'DISPATCHED' ? (
                          <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-flex items-center gap-1.5">
                            <Truck size={12} className="animate-pulse" /> डिस्पैच / रवाना
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1.5">
                            <Package size={12} /> पैकिंग / तैयारी में
                          </span>
                        )}
                        {req.tracking_id && (
                          <p className="text-[9px] font-mono text-white/50 tracking-wider">
                            TRK: <span className="text-white/80">{req.tracking_id}</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-[9px] text-white/30 uppercase font-bold">पेमेंट सत्यापन शेष</span>
                    )}
                  </td>

                  <td className="px-6 py-6">
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
                        <button
                          onClick={() => handleOpenDispatchModal(req)}
                          className="px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-black border border-blue-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <Truck size={13} />
                          {req.delivery_status === 'DISPATCHED' ? 'ट्रैकिंग बदलें' : 'आर्डर भेजें / ट्रैक करें'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Kit Dispatch Modal */}
      {dispatchModal?.isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141414] border border-blue-500/30 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Truck size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black font-serif gold-text">किट आर्डर एवं पार्सल डिस्पैच</h3>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Update Delivery & Tracking Details</p>
              </div>
            </div>

            <form onSubmit={handleSaveDispatch} className="space-y-4">
              {/* Devotee Info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-white/40">भक्त का नाम:</span>
                  <span className="font-bold text-white">{dispatchModal.userName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40">मोबाइल नंबर:</span>
                  <span className="font-mono text-white/80">{dispatchModal.phone}</span>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <span className="text-white/40 block mb-1">डिलीवरी का पता:</span>
                  <p className="text-white/80 leading-relaxed font-sans">{dispatchModal.address}</p>
                </div>
              </div>

              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">डिलीवरी स्थिति (Order Status)</label>
                <select
                  value={dispatchModal.deliveryStatus}
                  onChange={(e: any) => setDispatchModal({ ...dispatchModal, deliveryStatus: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-blue-500/50"
                >
                  <option value="PROCESSING">📦 तैयारी / पैकिंग में (Processing)</option>
                  <option value="DISPATCHED">🚚 डिस्पैच / डाक से रवाना (Dispatched)</option>
                  <option value="DELIVERED">✅ भक्त को प्राप्त / डिलीवर (Delivered)</option>
                </select>
              </div>

              {/* Courier Partner */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">कुरियर / डाक सेवा (Courier Partner)</label>
                <input
                  type="text"
                  placeholder="उदा. India Post (Speed Post), DTDC, BlueDart..."
                  value={dispatchModal.courierName}
                  onChange={(e) => setDispatchModal({ ...dispatchModal, courierName: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Tracking / Consignment Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">ट्रैकिंग नंबर / Consignment No.</label>
                <input
                  type="text"
                  placeholder="उदा. SP123456789IN"
                  value={dispatchModal.trackingId}
                  onChange={(e) => setDispatchModal({ ...dispatchModal, trackingId: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono uppercase text-white outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setDispatchModal(null)}
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  रद्द करें
                </button>
                <button 
                  type="submit"
                  disabled={processingId === dispatchModal.reqId}
                  className="flex-1 py-3.5 bg-blue-500 text-black font-bold rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  {processingId === dispatchModal.reqId ? 'सेव हो रहा...' : 'स्टेटस अपडेट करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Payment Confirmation Modal */}
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141414] border border-saffron/30 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-saffron/10 border border-saffron/30 flex items-center justify-center text-saffron shrink-0">
                <BadgeCheck size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black font-serif gold-text">भुगतान सत्यापन & सक्रियता</h3>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Confirm Payment Collection</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40">भक्त का नाम:</span>
                <span className="font-bold text-white">{confirmModal.userName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40">सदस्यता योजना:</span>
                <span className="font-bold text-saffron">{confirmModal.planName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40">UTR / Ref No:</span>
                <span className="font-mono text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">{confirmModal.utr}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                <span className="text-white/60 font-bold">कुल प्राप्त राशि:</span>
                <span className="text-2xl font-black text-green-400">₹{confirmModal.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                रद्द करें (Cancel)
              </button>
              <button 
                type="button"
                onClick={executeApproval}
                className="flex-1 py-4 bg-saffron text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all font-sans font-bold shadow-lg shadow-saffron/20 active:scale-95"
              >
                हाँ, एक्टिवेट करें ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className={`fixed bottom-8 right-8 z-[1000] px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 transition-all animate-slideUp ${
          toastMessage.type === 'success' 
            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-xs font-black uppercase tracking-wider">{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
