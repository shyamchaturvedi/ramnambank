"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  Share2,
  Copy,
  Check,
  KeyRound,
  IdCard,
  LogIn,
  Camera,
  Upload,
  Building2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/Footer';
import { getBranches, subscribeToBranches, createMember } from '@/services/dataService';

const ALL_INDIAN_STATES: { [key: string]: string[] } = {
  "Odisha (ओड़िशा)": ["Kendrapara (केन्द्रपड़ा)", "Puri (पुरी)", "Cuttack (कटक)", "Khurda / Bhubaneswar (भुवनेश्वर)", "Balasore (बालासोर)", "Bhadrak (भद्रक)", "Mayurbhanj (मयूरभंज)", "Jagatsinghpur (जगतसिंहपुर)", "Jajpur (जाजपुर)", "Ganjam (गंजाम)", "Sambalpur (सम्बलपुर)", "Sundargarh (सुंदरगढ़)", "Angul", "Balangir", "Bargarh", "Deogarh", "Dhenkanal", "Gajapati", "Jharsuguda", "Kalahandi", "Kandhamal", "Koraput", "Malkangiri", "Nabarangpur", "Nayagarh", "Nuapada", "Rayagada", "Subarnapur", "अन्य (Other)"],
  "Uttar Pradesh (उत्तर प्रदेश)": ["Ayodhya (अयोध्या)", "Mathura (मथुरा)", "Varanasi / Kashi (काशी)", "Lucknow (लखनऊ)", "Gorakhpur (गोरखपुर)", "Prayagraj (प्रयागराज)", "Kanpur (कानपुर)", "Agra (आगरा)", "Bareilly (बरेली)", "Ghaziabad (गाजियाबाद)", "Gautam Buddha Nagar / Noida (नोएडा)", "Farrukhabad (फर्रुखाबाद)", "Aligarh", "Azamgarh", "Basti", "Deoria", "Faizabad", "Jhansi", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Saharanpur", "Sitapur", "Sultanpur", "Unnao", "अन्य (Other)"],
  "Bihar (बिहार)": ["Patna (पटना)", "Gaya (गया)", "Muzaffarpur (मुजफ्फरपुर)", "Bhagalpur (भागलपुर)", "Darbhanga (दरभंगा)", "Sitamarhi (सीतामढ़ी)", "Begusarai", "Bhojpur", "Chapra / Saran", "East Champaran", "Madhubani", "Nalanda", "Purnia", "Rohtas", "Samastipur", "Siwan", "Vaishali", "West Champaran", "अन्य (Other)"],
  "Madhya Pradesh (मध्य प्रदेश)": ["Ujjain (उज्जैन)", "Indore (इंदौर)", "Bhopal (भोपाल)", "Gwalior (ग्वालियर)", "Jabalpur (जबलपुर)", "Satna / Chitrakoot (चित्रकूट)", "Chhindwara", "Dewas", "Hoshangabad", "Katni", "Mandsaur", "Morena", "Ratlam", "Rewa", "Sagar", "Vidisha", "अन्य (Other)"],
  "Rajasthan (राजस्थान)": ["Jaipur (जयपुर)", "Jodhpur (जोधपुर)", "Udaipur (उदयपुर)", "Kota (कोटा)", "Ajmer / Pushkar (अजमेर)", "Alwar", "Bikaner", "Bhilwara", "Chittorgarh", "Sikar", "Sri Ganganagar", "Bharatpur", "Pali", "अन्य (Other)"],
  "Gujarat (गुजरात)": ["Ahmedabad (अहमदाबाद)", "Surat (सूरत)", "Vadodara (वडोदरा)", "Rajkot (राजकोट)", "Dwarka (द्वारका)", "Bhavnagar", "Gandhinagar", "Jamnagar", "Junagadh", "Kutch", "Navsari", "Porbandar", "Valsad", "अन्य (Other)"],
  "Maharashtra (महाराष्ट्र)": ["Mumbai (मुंबई)", "Pune (पुणे)", "Nagpur (नागपुर)", "Nashik / Panchavati (नासिक)", "Thane", "Aurangabad / Chhatrapati Sambhaji Nagar", "Solapur", "Kolhapur", "Amravati", "Nanded", "Jalgaon", "Akola", "Latur", "Dhule", "Ahmednagar", "Chandrapur", "Parbhani", "Satara", "अन्य (Other)"],
  "Delhi (दिल्ली)": ["Central Delhi", "East Delhi", "New Delhi (नई दिल्ली)", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Jharkhand (झारखंड)": ["Ranchi (रांची)", "Dhanbad (धनबाद)", "Jamshedpur / East Singhbhum (जमशेदपुर)", "Bokaro", "Deoghar (देवघर)", "Hazaribagh", "Giridih", "Dumka", "अन्य (Other)"],
  "West Bengal (पश्चिम बंगाल)": ["Kolkata (कोलकाता)", "Howrah (हावड़ा)", "North 24 Parganas", "South 24 Parganas", "Hooghly", "Purba Medinipur", "Paschim Medinipur", "Darjeeling", "Siliguri", "Murshidabad", "Nadia", "Bardhaman", "अन्य (Other)"],
  "Chhattisgarh (छत्तीसगढ़)": ["Raipur (रायपुर)", "Bilaspur (बिलासपुर)", "Durg", "Bhilai", "Rajnandgaon", "Korba", "Jagdalpur", "अन्य (Other)"],
  "Haryana (हरियाणा)": ["Gurugram / Gurgaon (गुरुग्राम)", "Faridabad (फरीदाबाद)", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak", "Sonipat", "Panchkula", "Kurukshetra (कुरुक्षेत्र)", "अन्य (Other)"],
  "Punjab (पंजाब)": ["Amritsar (अमृतसर)", "Ludhiana (लुधियाना)", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Pathankot", "अन्य (Other)"],
  "Uttarakhand (उत्तराखंड)": ["Dehradun (देहरादून)", "Haridwar (हरिद्वार)", "Rishikesh", "Nainital", "Almora", "Udham Singh Nagar", "Pauri Garhwal", "Tehri Garhwal", "Chamoli", "अन्य (Other)"],
  "Himachal Pradesh (हिमाचल प्रदेश)": ["Shimla (शिमला)", "Kullu / Manali", "Kangra / Dharamshala", "Mandi", "Solan", "Bilaspur", "Chamba", "Hamirpur", "Sirmaur", "Una", "अन्य (Other)"],
  "Assam (असम)": ["Guwahati / Kamrup", "Dibrugarh", "Silchar / Cachar", "Jorhat", "Nagaon", "Tinsukia", "Sonitpur / Tezpur", "Barpeta", "Cachar", "Dhubri", "Goalpara", "Golaghat", "Hailakandi", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Morigaon", "Nalbari", "Dima Hasao", "Sivasagar", "अन्य (Other)"],
  "Andhra Pradesh (आंध्र प्रदेश)": ["Visakhapatnam", "Vijayawada / Krishna", "Guntur", "Tirupati", "Kurnool", "Nellore", "Kakinada", "Rajahmundry", "Kadapa", "Anantapur", "अन्य (Other)"],
  "Telangana (तेलंगाना)": ["Hyderabad (हैदराबाद)", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Rangareddy", "Medchal", "अन्य (Other)"],
  "Karnataka (कर्नाटक)": ["Bengaluru / Bangalore (बेंगलुरु)", "Mysuru / Mysore", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Kalaburagi", "Davanagere", "Ballari", "Vijayapura", "Shivamogga", "Tumakuru", "Udupi", "अन्य (Other)"],
  "Tamil Nadu (तमिलनाडु)": ["Chennai (चेन्नई)", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukudi", "Kanchipuram", "Rameswaram", "अन्य (Other)"],
  "Kerala (केरल)": ["Thiruvananthapuram", "Kochi / Ernakulam", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam", "Malappuram", "Kasaragod", "Idukki", "Pathanamthitta", "Wayanad", "अन्य (Other)"],
  "Goa (गोवा)": ["North Goa", "South Goa"],
  "Jammu and Kashmir (जम्मू और कश्मीर)": ["Jammu (जम्मू)", "Srinagar (श्रीनगर)", "Anantnag", "Baramulla", "Kathua", "Udhampur", "Kupwara", "Budgam", "अन्य (Other)"],
  "Ladakh (लद्दाख)": ["Leh", "Kargil"],
  "Chandigarh (चंडीगढ़)": ["Chandigarh"],
  "Puducherry (पुदुचेरी)": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Tripura": ["Agartala / West Tripura", "North Tripura", "South Tripura", "Dhalai", "Gomati", "Khowai", "Sepahijala", "Unakoti"],
  "Meghalaya": ["Shillong / East Khasi Hills", "West Garo Hills", "Ri Bhoi", "West Khasi Hills", "West Jaintia Hills"],
  "Manipur": ["Imphal East", "Imphal West", "Thoubal", "Bishnupur", "Churachandpur"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto"],
  "Arunachal Pradesh": ["Itanagar / Papum Pare", "Changlang", "West Kameng", "Pasighat / East Siang"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
  "Sikkim": ["Gangtok / East Sikkim", "Namchi / South Sikkim", "Gyalshing / West Sikkim", "Mangan / North Sikkim"],
  "Andaman and Nicobar": ["Port Blair / South Andaman", "North and Middle Andaman", "Nicobar"],
  "Dadra & Nagar Haveli and Daman & Diu": ["Daman", "Diu", "Silvassa / Dadra & Nagar Haveli"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Amini", "Andrott", "Minicoy"],
  "Other / अन्य": ["Other District / अन्य जिला"]
};

function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [isLoadingPin, setIsLoadingPin] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Full Profile Form Fields (matching devotee profile page)
  const [form, setForm] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    password: '',
    photo_url: '',
    village: '',
    post_office: '',
    police_station: '',
    district: '',
    state: '',
    pin_code: '',
    landmark: '',
    branch_code: 'UP/AY',
    branch_name: 'अयोध्या धाम केन्द्रीय मुख्य शाखा',
    referral_code: ''
  });

  const [createdCredentials, setCreatedCredentials] = useState<{
    fullName: string;
    membershipId: string;
    mobileNumber: string;
    password: string;
    branchName: string;
    email?: string;
  } | null>(null);

  // Auto assign branch helper
  const findBestBranch = (branchList: any[], districtName: string, stateName: string) => {
    if (!branchList || branchList.length === 0) {
      return { branch_code: 'UP/AY', branch_name: 'अयोध्या धाम केन्द्रीय मुख्य शाखा' };
    }

    const dist = (districtName || '').toLowerCase().trim();

    const matched = branchList.find(b => {
      const bCity = (b.city || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();
      return dist && (bCity.includes(dist) || dist.includes(bCity) || bName.includes(dist) || dist.includes(bName));
    });

    if (matched) {
      return { branch_code: matched.code || matched.id, branch_name: matched.name };
    }

    const ayodhyaBranch = branchList.find(b => (b.code && b.code.includes('UP/AY')) || b.name?.includes('अयोध्या') || b.city?.toLowerCase() === 'ayodhya');
    if (ayodhyaBranch) {
      return { branch_code: ayodhyaBranch.code || ayodhyaBranch.id, branch_name: ayodhyaBranch.name };
    }

    return { branch_code: branchList[0]?.code || 'UP/AY', branch_name: branchList[0]?.name || 'अयोध्या धाम केन्द्रीय मुख्य शाखा' };
  };

  useEffect(() => {
    setMounted(true);
    const ref = searchParams.get('ref') || searchParams.get('referral_code');
    if (ref) {
      setForm(prev => ({ ...prev, referral_code: ref }));
    }
    
    const unsub = subscribeToBranches((data) => {
      setBranches(data);
    });
    return () => unsub();
  }, [searchParams]);

  // Image compression function
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setForm(prev => ({ ...prev, photo_url: compressedBase64 }));
      };
    };
    reader.readAsDataURL(file);
  };

  // PIN code lookup handler
  const handlePinCodeChange = async (pincode: string) => {
    setForm(prev => ({ ...prev, pin_code: pincode }));
    
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setIsLoadingPin(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          const autoDistrict = postOffice.District || '';
          const autoState = postOffice.State || '';
          const autoPO = postOffice.Name || '';

          const bestBranch = findBestBranch(branches, autoDistrict, autoState);

          setForm(prev => ({
            ...prev,
            district: autoDistrict,
            state: autoState,
            post_office: prev.post_office || autoPO,
            branch_code: bestBranch.branch_code,
            branch_name: bestBranch.branch_name
          }));

          const stateEntry = Object.keys(ALL_INDIAN_STATES).find(s => 
            s.toLowerCase().includes(autoState.toLowerCase()) || 
            autoState.toLowerCase().includes(s.split(' ')[0].toLowerCase())
          );
          
          let dList: string[] = [];
          if (stateEntry) {
            dList = [...ALL_INDIAN_STATES[stateEntry]];
          }
          
          const matchedDist = dList.find(d => d.toLowerCase().includes(autoDistrict.toLowerCase()) || autoDistrict.toLowerCase().includes(d.split(' ')[0].toLowerCase()));
          if (!matchedDist && autoDistrict) {
            dList.unshift(autoDistrict);
          }
          
          setDistrictList(dList.length > 0 ? dList : [autoDistrict, "अन्य (Other)"]);
        }
      } catch (err) {
        console.log('Pin code lookup error:', err);
      } finally {
        setIsLoadingPin(false);
      }
    }
  };

  const handleStateSelectChange = (selectedStateVal: string) => {
    const cleanStateName = selectedStateVal.split(' (')[0].trim();
    const bestBranch = findBestBranch(branches, '', cleanStateName);
    setForm(prev => ({ 
      ...prev, 
      state: cleanStateName, 
      district: '',
      branch_code: bestBranch.branch_code,
      branch_name: bestBranch.branch_name
    }));
    if (selectedStateVal && ALL_INDIAN_STATES[selectedStateVal]) {
      setDistrictList(ALL_INDIAN_STATES[selectedStateVal]);
    } else {
      setDistrictList([]);
    }
  };

  const handleDistrictSelectChange = (selectedDistrictVal: string) => {
    const cleanDistName = selectedDistrictVal.split(' (')[0].trim();
    const bestBranch = findBestBranch(branches, cleanDistName, form.state);
    setForm(prev => ({ 
      ...prev, 
      district: cleanDistName,
      branch_code: bestBranch.branch_code,
      branch_name: bestBranch.branch_name
    }));
  };

  const handleBranchSelectChange = (selectedBranchCode: string) => {
    const selected = branches.find(b => (b.code || b.id) === selectedBranchCode);
    if (selected) {
      setForm(prev => ({
        ...prev,
        branch_code: selected.code || selected.id,
        branch_name: selected.name
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Honeypot check for bots
    if ((e.target as any).website?.value) {
      setIsSubmitting(false);
      setSubmitStatus('SUCCESS');
      return;
    }

    const fullPostalAddress = `${form.village ? 'गाँव/मोहल्ला: ' + form.village + ', ' : ''}${form.post_office ? 'पोस्ट: ' + form.post_office + ', ' : ''}${form.police_station ? 'थाना: ' + form.police_station + ', ' : ''}${form.district ? 'जिला: ' + form.district + ', ' : ''}${form.state ? 'राज्य: ' + form.state + ' - ' : ''}${form.pin_code || ''} ${form.landmark ? '(लैंडमार्क: ' + form.landmark + ')' : ''}`.trim();
    
    const result = await createMember({
      ...form,
      address: fullPostalAddress,
      block: form.branch_name,
      profile_completed: true
    });

    setIsSubmitting(false);
    if (result.success && result.data) {
      setCreatedCredentials({
        fullName: form.full_name,
        membershipId: result.data.membership_id,
        mobileNumber: form.mobile_number,
        password: form.password,
        branchName: form.branch_name,
        email: form.email || `${form.mobile_number}@ramnam.bank`
      });
      setSubmitStatus('SUCCESS');
    } else {
      setSubmitStatus('ERROR');
      setError(result.error);
    }
  };

  const copyCredentialsText = () => {
    if (!createdCredentials) return;
    const text = `🚩 श्री राम नाम महा धन संचय बैंक 🚩\n\nभक्त का नाम: ${createdCredentials.fullName}\nसदस्यता ID: ${createdCredentials.membershipId}\nलॉगिन ID / मोबाइल: ${createdCredentials.mobileNumber}\nपासवर्ड: ${createdCredentials.password}\nशाखा: ${createdCredentials.branchName}\n\nपोर्टल लॉगिन: ${window.location.origin}/login\nजय श्री राम! 🙏`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnWhatsApp = () => {
    if (!createdCredentials) return;
    const text = `🚩 श्री राम नाम महा धन संचय बैंक 🚩\n\nभक्त का नाम: ${createdCredentials.fullName}\nसदस्यता ID: ${createdCredentials.membershipId}\nलॉगिन मोबाइल: ${createdCredentials.mobileNumber}\nपासवर्ड: ${createdCredentials.password}\nशाखा: ${createdCredentials.branchName}\n\nलॉगिन लिंक: ${window.location.origin}/login\n\nजय श्री राम! 🙏`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const initials = form.full_name ? form.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'भक्त';

  return (
    <div className="premium-card p-6 md:p-12 space-y-10 sacred-glow border-t-2 border-saffron/50 relative overflow-hidden">
      {/* Account Success Credentials Modal */}
      <AnimatePresence>
        {submitStatus === 'SUCCESS' && createdCredentials && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="absolute inset-0 bg-[#080808]/95 backdrop-blur-2xl z-50 flex flex-col justify-center items-center text-center p-6 md:p-10 space-y-6 overflow-y-auto"
          >
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center text-green-400">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-saffron">खाता सफलतापूर्वक खुल गया</span>
              <h2 className="text-2xl md:text-3xl font-black font-serif gold-text uppercase">आपका खाता विवरण</h2>
              <p className="text-white/60 text-xs font-medium">कृपया अपना लॉगिन आईडी और पासवर्ड सुरक्षित रख लें</p>
            </div>

            {/* Credential Slip Card */}
            <div className="w-full max-w-md bg-white/[0.04] border border-saffron/30 rounded-3xl p-6 text-left space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-saffron/10 rounded-full blur-xl pointer-events-none"></div>

              {/* Name */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">भक्त का नाम</span>
                <span className="text-sm font-bold text-white font-serif">{createdCredentials.fullName}</span>
              </div>

              {/* Membership ID */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <IdCard size={14} className="text-saffron" />
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">सदस्यता ID (Member ID)</span>
                </div>
                <span className="text-sm font-black font-mono text-saffron tracking-wider">{createdCredentials.membershipId}</span>
              </div>

              {/* Login ID / Mobile */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-saffron" />
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">लॉगिन ID / मोबाइल</span>
                </div>
                <span className="text-sm font-bold font-mono text-white tracking-wider">{createdCredentials.mobileNumber}</span>
              </div>

              {/* Branch */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-saffron" />
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">आवंटित शाखा</span>
                </div>
                <span className="text-xs font-bold text-amber-200">{createdCredentials.branchName}</span>
              </div>

              {/* Password */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <KeyRound size={14} className="text-saffron" />
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">पासवर्ड (Password)</span>
                </div>
                <span className="text-sm font-bold font-mono text-green-400 bg-green-500/10 px-3 py-1 rounded-lg tracking-widest border border-green-500/20">
                  {createdCredentials.password}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-md space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={copyCredentialsText}
                  className="py-3.5 px-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider text-white transition-all active:scale-95"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'कॉपी हो गया!' : 'विवरण कॉपी करें'}
                </button>

                <button
                  type="button"
                  onClick={shareOnWhatsApp}
                  className="py-3.5 px-4 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider transition-all active:scale-95"
                >
                  <Share2 size={14} />
                  WhatsApp शेयर
                </button>
              </div>

              <button
                type="button"
                onClick={() => router.push('/dashboard/devotee')}
                className="w-full saffron-btn py-4 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] shadow-[0_10px_25px_rgba(255,153,51,0.25)]"
              >
                <LogIn size={16} />
                डैशबोर्ड में प्रवेश करें
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-black font-serif gold-text uppercase tracking-tight">नया खाता खोलें</h1>
        <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-bold">अपनी आध्यात्मिक पूंजी का संचय शुरू करें</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Honeypot field */}
        <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

        {/* 1. Personal & Contact Info */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">भक्त का पूर्ण नाम (Full Name) *</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                <input required type="text" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="अपना नाम लिखें" className="w-full pl-16 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm transition-all shadow-inner font-bold" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">मोबाइल नंबर (Login Mobile) *</label>
              <div className="relative group">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                <input required type="tel" maxLength={10} value={form.mobile_number} onChange={e => setForm({...form, mobile_number: e.target.value})} placeholder="10 अंकों का मोबाइल नंबर" className="w-full pl-16 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm transition-all shadow-inner font-bold" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">ईमेल आईडी (Email ID) *</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" className="w-full pl-16 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm transition-all shadow-inner font-bold" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">रेफरल कोड (Referral Code - Optional)</label>
              <div className="relative group">
                <Share2 className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                <input type="text" value={form.referral_code} onChange={e => setForm({...form, referral_code: e.target.value})} placeholder="रेफरल कोड यदि कोई हो" className="w-full pl-16 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm transition-all shadow-inner font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Postal Address (Village, Post Office, Police Station) */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-black text-saffron uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-4 h-4 text-saffron" /> डाक डिलीवरी पता (Postal Address)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">गाँव / मोहल्ला *</label>
              <input 
                required 
                type="text" 
                placeholder="गाँव या मोहल्ला"
                value={form.village} 
                onChange={e => setForm({...form, village: e.target.value})} 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-bold" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">डाकघर (Post Office) *</label>
              <input 
                required 
                type="text" 
                placeholder="पोस्ट ऑफिस"
                value={form.post_office} 
                onChange={e => setForm({...form, post_office: e.target.value})} 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-bold" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">थाना (Police Station) *</label>
              <input 
                required 
                type="text" 
                placeholder="थाना"
                value={form.police_station} 
                onChange={e => setForm({...form, police_station: e.target.value})} 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-bold" 
              />
            </div>
          </div>
        </div>

        {/* 4. PIN Code, State, District with Auto-Fill */}
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-saffron uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-saffron" /> पिन कोड, राज्य एवं जिला (Auto-Fill & Select)
            </span>
            {isLoadingPin && (
              <span className="text-[10px] font-black text-saffron animate-pulse">
                डाकघर खोजा जा रहा है... ⏳
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* PIN Code */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center justify-between">
                <span>पिन कोड (PIN Code) *</span>
                {form.pin_code?.length === 6 && (
                  <span className="text-[9px] text-green-400 font-bold">✓ ऑटो-फिल</span>
                )}
              </label>
              <input 
                required 
                type="text" 
                maxLength={6}
                placeholder="उदा: 754211"
                value={form.pin_code} 
                onChange={e => handlePinCodeChange(e.target.value)} 
                className="w-full px-4 py-3.5 bg-white/5 border border-saffron/30 rounded-2xl outline-none focus:border-saffron text-saffron font-mono text-sm font-black tracking-widest placeholder:text-white/20" 
              />
            </div>

            {/* State Dropdown + Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                राज्य (State) *
              </label>
              <select
                value={
                  form.state 
                    ? (Object.keys(ALL_INDIAN_STATES).find(k => k.toLowerCase().includes(form.state.toLowerCase()) || form.state.toLowerCase().includes(k.split(' ')[0].toLowerCase())) || "")
                    : ""
                }
                onChange={e => handleStateSelectChange(e.target.value)}
                className="w-full px-3 py-3.5 bg-[#130d07] border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-xs font-bold cursor-pointer"
              >
                <option value="">-- राज्य चुनें (Select) --</option>
                {Object.keys(ALL_INDIAN_STATES).map((stateKey) => (
                  <option key={stateKey} value={stateKey}>
                    {stateKey}
                  </option>
                ))}
              </select>
              <input 
                required 
                type="text" 
                placeholder="या राज्य का नाम"
                value={form.state} 
                onChange={e => setForm({...form, state: e.target.value})} 
                className="w-full px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg outline-none focus:border-saffron/30 text-white/80 text-[11px]" 
              />
            </div>

            {/* District Dropdown + Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                जिला (District) *
              </label>
              <select
                value={
                  form.district 
                    ? (districtList.find(d => d.toLowerCase().includes(form.district.toLowerCase()) || form.district.toLowerCase().includes(d.split(' ')[0].toLowerCase())) || form.district)
                    : ""
                }
                onChange={e => handleDistrictSelectChange(e.target.value)}
                className="w-full px-3 py-3.5 bg-[#130d07] border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-xs font-bold cursor-pointer"
              >
                <option value="">-- जिला चुनें (Select) --</option>
                {form.district && !districtList.some(d => d.toLowerCase().includes(form.district.toLowerCase()) || form.district.toLowerCase().includes(d.split(' ')[0].toLowerCase())) && (
                  <option value={form.district}>{form.district}</option>
                )}
                {districtList.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              <input 
                required 
                type="text" 
                placeholder="या जिला का नाम"
                value={form.district} 
                onChange={e => setForm({...form, district: e.target.value})} 
                className="w-full px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg outline-none focus:border-saffron/30 text-white/80 text-[11px]" 
              />
            </div>
          </div>
        </div>

        {/* 5. Assigned Branch Section */}
        <div className="p-5 rounded-3xl bg-saffron/[0.04] border border-saffron/20 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-saffron uppercase tracking-widest flex items-center gap-2">
              <Building2 className="w-4 h-4 text-saffron" /> आवंटित शाखा (Assigned Branch)
            </label>
            <span className="text-[10px] text-white/50 font-bold font-mono">
              {form.branch_code ? `कोड: ${form.branch_code}` : ""}
            </span>
          </div>
          <p className="text-[11px] text-white/60 leading-relaxed">
            आपके राज्य एवं जिले के अनुसार शाखा स्वतः चुनी जाती है। आप नीचे से अपनी शाखा बदल भी सकते हैं।
          </p>
          <select
            value={form.branch_code || "UP/AY"}
            onChange={e => handleBranchSelectChange(e.target.value)}
            className="w-full px-4 py-3.5 bg-[#130d07] border border-saffron/40 rounded-2xl outline-none focus:border-saffron text-amber-200 text-sm font-bold cursor-pointer"
          >
            {branches.map(branch => (
              <option key={branch.code || branch.id} value={branch.code || branch.id}>
                {branch.name} ({branch.code || branch.id}) - {branch.city}, {branch.state}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Landmark (Optional) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">लैंडमार्क / प्रसिद्ध स्थान (Landmark - ऐच्छिक)</label>
          <input 
            type="text" 
            placeholder="निकटतम मंदिर / स्कूल / अस्पताल आदि" 
            value={form.landmark} 
            onChange={e => setForm({...form, landmark: e.target.value})} 
            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm font-bold" 
          />
        </div>

        {/* 7. Password Creation */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">लॉगिन पासवर्ड (Set Password) *</label>
          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
            <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="लॉगिन के लिए मजबूत पासवर्ड बनाएं" className="w-full pl-16 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-saffron/50 text-white text-sm shadow-inner font-bold" />
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <button type="submit" disabled={isSubmitting} className="w-full saffron-btn py-5 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] group shadow-[0_15px_40px_rgba(255,153,51,0.2)]">
            {isSubmitting ? (
              <span className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
            ) : (
              <>
                खाता खोलें और आईडी प्राप्त करें
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-[9px] uppercase font-bold text-white/30 tracking-widest">या</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button 
            type="button"
            onClick={async () => {
              try {
                setIsSubmitting(true);
                setError(null);
                const { auth, db, googleProvider } = await import('@/lib/firebase');
                const { signInWithPopup } = await import('firebase/auth');
                const { doc, setDoc } = await import('firebase/firestore');
                
                const result = await signInWithPopup(auth, googleProvider);
                if (result.user) {
                  const uid = result.user.uid;
                  const year = new Date().getFullYear();
                  const serial = Math.floor(1000 + Math.random() * 9000);
                  const branchCode = form.branch_code || 'UP/AY';
                  const branchName = form.branch_name || 'अयोध्या धाम केन्द्रीय मुख्य शाखा';
                  const membershipId = `${branchCode}/${year}/${serial}`;

                  await setDoc(doc(db, 'members', uid), {
                    id: uid,
                    full_name: result.user.displayName || 'भक्त',
                    email: result.user.email,
                    mobile_number: result.user.phoneNumber || '',
                    membership_id: membershipId,
                    district: form.district || 'Ayodhya',
                    state: form.state || 'Uttar Pradesh',
                    block: branchName,
                    branch_code: branchCode,
                    branch_name: branchName,
                    role: result.user.email === 'iammshyam@gmail.com' ? 'ADMIN' : 'DEVOTEE',
                    status: 'ACTIVE',
                    membership_type: 'BANK_LIFE',
                    created_at: new Date().toISOString()
                  }, { merge: true });

                  window.location.href = result.user.email === 'iammshyam@gmail.com' ? '/dashboard/admin' : '/dashboard/devotee';
                }
              } catch (err: any) {
                console.error('Google Sign Up Error:', err);
                setError(err.message || 'Google साइन-अप में त्रुटि आई।');
                setSubmitStatus('ERROR');
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4.5 rounded-[2rem] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Google से 1-क्लिक खाता खोलें
          </button>
        </div>

        {submitStatus === 'ERROR' && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
            <AlertCircle size={16} /> {error || 'कुछ गलत हुआ। कृपया दोबारा प्रयास करें।'}
          </div>
        )}
      </form>
    </div>
  );
}

export default function OpenAccount() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-saffron selection:text-black flex flex-col font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-saffron/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sacred-red/5 rounded-full blur-[150px]"></div>
      </div>

      <nav className="relative z-10 p-6 md:p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-all group">
          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-saffron/10 group-hover:text-saffron transition-all">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] hidden sm:block">मुख्य पृष्ठ</span>
        </Link>
        <div className="text-xl font-bold font-serif gold-text uppercase tracking-[0.3em]">भक्त पंजीकरण</div>
        <div className="w-10 sm:w-20"></div>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
          <Suspense fallback={<div className="text-center p-10 uppercase text-[10px] font-bold text-white/20">लोड हो रहा है...</div>}>
            <RegistrationForm />
          </Suspense>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
