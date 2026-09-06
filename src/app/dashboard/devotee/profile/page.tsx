"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  MapPin, 
  Edit3, 
  Shield, 
  Calendar, 
  X, 
  CheckCircle, 
  User, 
  Award, 
  CheckCircle2, 
  BellRing,
  Camera,
  Upload,
  Sparkles,
  Building2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DigitalIDCard from '@/components/DigitalIDCard';
import { getBranches, subscribeToBranches } from '@/services/dataService';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
   const router = useRouter();
   const fileInputRef = useRef<HTMLInputElement>(null);

   const [userData, setUserData] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [totalNames, setTotalNames] = useState(0);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isUpdating, setIsUpdating] = useState(false);
   const [missingDeliveryInfo, setMissingDeliveryInfo] = useState(false);
   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
   const [branches, setBranches] = useState<any[]>([]);
   
   const [formData, setFormData] = useState({
      name: '',
      mobile: '',
      photo_url: '',
      village: '',
      post_office: '',
      police_station: '',
      district: '',
      state: '',
      pin_code: '',
      landmark: '',
      delivery_address: '',
      branch_code: 'UP/AY',
      branch_name: 'अयोध्या धाम केन्द्रीय मुख्य शाखा'
   });

   const [isLoadingPin, setIsLoadingPin] = useState(false);
   const [districtList, setDistrictList] = useState<string[]>([]);

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

   // Image compression function
   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;

     const reader = new FileReader();
     reader.onload = (event) => {
       const img = new window.Image();
       img.src = event.target?.result as string;
       img.onload = () => {
         // Create canvas to compress to max 300x300 px
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

         // Compress to JPEG with 0.8 quality
         const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
         setFormData(prev => ({ ...prev, photo_url: compressedBase64 }));
       };
     };
     reader.readAsDataURL(file);
   };

   // Helper: Auto-assign branch by District / State
   const findBestBranch = (branchList: any[], districtName: string, stateName: string) => {
     if (!branchList || branchList.length === 0) {
       return { branch_code: 'UP/AY/01', branch_name: 'अयोध्या धाम केन्द्रीय मुख्य शाखा' };
     }

     const dist = (districtName || '').toLowerCase().trim();
     const st = (stateName || '').toLowerCase().trim();

     // 1. Search for matching city/district in branches
     const matched = branchList.find(b => {
       const bCity = (b.city || '').toLowerCase();
       const bName = (b.name || '').toLowerCase();
       return dist && (bCity.includes(dist) || dist.includes(bCity) || bName.includes(dist) || dist.includes(bName));
     });

     if (matched) {
       return { branch_code: matched.code || matched.id, branch_name: matched.name };
     }

     // 2. Fallback to Ayodhya Dham Main Branch
     const ayodhyaBranch = branchList.find(b => b.code === 'UP/AY/01' || b.name?.includes('अयोध्या') || b.city?.toLowerCase() === 'ayodhya');
     if (ayodhyaBranch) {
       return { branch_code: ayodhyaBranch.code || ayodhyaBranch.id, branch_name: ayodhyaBranch.name };
     }

     return { branch_code: branchList[0]?.code || 'UP/AY/01', branch_name: branchList[0]?.name || 'अयोध्या धाम केन्द्रीय मुख्य शाखा' };
   };

   const handlePinCodeChange = async (pincode: string) => {
     setFormData(prev => ({ ...prev, pin_code: pincode }));
     
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

           // Auto Match Best Branch
           const bestBranch = findBestBranch(branches, autoDistrict, autoState);

           setFormData(prev => ({
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
         console.log('Pin code lookup fallback:', err);
       } finally {
         setIsLoadingPin(false);
       }
     }
   };

   const handleStateSelectChange = (selectedStateVal: string) => {
     const cleanStateName = selectedStateVal.split(' (')[0].trim();
     const bestBranch = findBestBranch(branches, '', cleanStateName);
     setFormData(prev => ({ 
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
     const bestBranch = findBestBranch(branches, cleanDistName, formData.state);
     setFormData(prev => ({ 
       ...prev, 
       district: cleanDistName,
       branch_code: bestBranch.branch_code,
       branch_name: bestBranch.branch_name
     }));
   };

   const handleBranchSelectChange = (selectedBranchCode: string) => {
     const selected = branches.find(b => (b.code || b.id) === selectedBranchCode);
     if (selected) {
       setFormData(prev => ({
         ...prev,
         branch_code: selected.code || selected.id,
         branch_name: selected.name
       }));
     }
   };

   useEffect(() => {
       // Real-time live branch listener
       const unsubBranches = subscribeToBranches((liveBranches) => {
          setBranches(liveBranches);
       });

       let unsubAuth: (() => void) | undefined;

       const fetchUserData = async () => {
          try {
             const branchList = await getBranches();
             setBranches(branchList);

             const { auth, db } = await import('@/lib/firebase');
             const { onAuthStateChanged } = await import('firebase/auth');
             const { doc, getDoc, collection, query, where, getDocs } = await import('firebase/firestore');

             unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser) {
                   try {
                      const userDoc = await getDoc(doc(db, 'members', currentUser.uid));
                      let memberData: any = userDoc.exists() ? userDoc.data() : null;

                      if (!memberData && currentUser.email) {
                         const q = query(collection(db, 'members'), where('email', '==', currentUser.email));
                         const snap = await getDocs(q);
                         if (!snap.empty) {
                            memberData = snap.docs[0].data();
                         }
                      }

                      const initialBranch = memberData?.branch_name 
                        ? { branch_code: memberData.branch_code || 'UP/AY', branch_name: memberData.branch_name }
                        : findBestBranch(branchList, memberData?.district || '', memberData?.state || '');

                      const thisYear = new Date().getFullYear();
                      const finalMember = memberData || {
                         id: currentUser.uid,
                         full_name: currentUser.displayName || 'भक्त',
                         email: currentUser.email,
                         mobile_number: currentUser.phoneNumber || '',
                         membership_id: `OD/17/${thisYear}/001`,
                         branch_code: initialBranch.branch_code,
                         branch_name: initialBranch.branch_name,
                         district: 'Kendrapara',
                         state: 'Odisha',
                         role: 'DEVOTEE',
                         status: 'PENDING_MEMBERSHIP',
                         membership_type: null,
                         photo_url: ''
                      };

                      const isMissing = !finalMember.pin_code || !finalMember.address || !finalMember.mobile_number;
                      setMissingDeliveryInfo(isMissing);

                      setUserData({
                         id: finalMember.id,
                         membership_id: finalMember.membership_id || `OD/17/${thisYear}/001`,
                         name: finalMember.full_name || 'भक्त',
                         role: finalMember.role || 'DEVOTEE',
                         status: finalMember.status || 'PENDING_MEMBERSHIP',
                         branch: finalMember.branch_name || initialBranch.branch_name,
                         branch_code: finalMember.branch_code || initialBranch.branch_code,
                         email: finalMember.email || currentUser.email,
                         mobile: finalMember.mobile_number || '',
                         photo_url: finalMember.photo_url || finalMember.photo || '',
                         address: finalMember.address || `${finalMember.district || ''}, ${finalMember.state || ''}`.replace(/^, /, ''),
                         village: finalMember.village || '',
                         post_office: finalMember.post_office || '',
                         police_station: finalMember.police_station || '',
                         district: finalMember.district || '',
                         state: finalMember.state || '',
                         pin_code: finalMember.pin_code || '',
                         landmark: finalMember.landmark || '',
                         membership_type: finalMember.membership_type || null,
                         is_overdue: false
                      });

                      setFormData({
                         name: finalMember.full_name || 'भक्त',
                         mobile: finalMember.mobile_number || '',
                         photo_url: finalMember.photo_url || finalMember.photo || '',
                         village: finalMember.village || '',
                         post_office: finalMember.post_office || '',
                         police_station: finalMember.police_station || '',
                         district: finalMember.district || '',
                         state: finalMember.state || '',
                         pin_code: finalMember.pin_code || '',
                         landmark: finalMember.landmark || '',
                         delivery_address: finalMember.address || '',
                         branch_code: finalMember.branch_code || initialBranch.branch_code,
                         branch_name: finalMember.branch_name || initialBranch.branch_name
                      });

                      if (finalMember.state) {
                        const stateKey = Object.keys(ALL_INDIAN_STATES).find(k => 
                          k.toLowerCase().includes(finalMember.state.toLowerCase()) || 
                          finalMember.state.toLowerCase().includes(k.split(' ')[0].toLowerCase())
                        );
                        if (stateKey) {
                          setDistrictList(ALL_INDIAN_STATES[stateKey]);
                        }
                      }

                      try {
                         const subQ = query(collection(db, 'booklet_submissions'), where('user_id', '==', finalMember.id));
                         const subSnap = await getDocs(subQ);
                         const total = subSnap.docs.reduce((sum, d) => sum + (Number(d.data().quantity) || 0), 0);
                         setTotalNames(total);
                      } catch(e) {}
                   } catch(e) {
                      console.error('Profile fetch error:', e);
                   }
                }
                setIsLoading(false);
             });
          } catch (err) {
             console.error('Error fetching profile:', err);
             setIsLoading(false);
          }
       };

       fetchUserData();

       return () => {
          unsubBranches();
          if (unsubAuth) unsubAuth();
       };
    }, []);

   const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const { auth, db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const fullPostalAddress = `${formData.village ? 'गाँव/मोहल्ला: ' + formData.village + ', ' : ''}${formData.post_office ? 'पोस्ट: ' + formData.post_office + ', ' : ''}${formData.police_station ? 'थाना: ' + formData.police_station + ', ' : ''}${formData.district ? 'जिला: ' + formData.district + ', ' : ''}${formData.state ? 'राज्य: ' + formData.state + ' - ' : ''}${formData.pin_code || ''} ${formData.landmark ? '(लैंडमार्क: ' + formData.landmark + ')' : ''}`.trim();

      await setDoc(doc(db, 'members', currentUser.uid), {
        full_name: formData.name,
        mobile_number: formData.mobile,
        photo_url: formData.photo_url,
        village: formData.village,
        post_office: formData.post_office,
        police_station: formData.police_station,
        district: formData.district,
        state: formData.state,
        pin_code: formData.pin_code,
        landmark: formData.landmark,
        address: fullPostalAddress || formData.delivery_address,
        branch_code: formData.branch_code,
        branch_name: formData.branch_name,
        block: formData.branch_name,
        profile_completed: true
      }, { merge: true });

      setUserData({
        ...userData,
        name: formData.name,
        mobile: formData.mobile,
        photo_url: formData.photo_url,
        village: formData.village,
        post_office: formData.post_office,
        police_station: formData.police_station,
        district: formData.district,
        state: formData.state,
        pin_code: formData.pin_code,
        landmark: formData.landmark,
        address: fullPostalAddress || formData.delivery_address,
        branch: formData.branch_name,
        branch_code: formData.branch_code
      });

      setMissingDeliveryInfo(false);
      setIsEditModalOpen(false);
      setToast({ show: true, message: '🎉 प्रोफ़ाइल फ़ोटो, पता एवं शाखा सुरक्षित हो गई!', type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

   if (isLoading) {
      return <div className="h-96 flex items-center justify-center text-saffron uppercase font-black tracking-widest text-xs animate-pulse">डेटा लोड हो रहा है...</div>;
   }

   if (!userData) {
      return <div className="h-96 flex items-center justify-center text-white/40 uppercase font-black tracking-widest text-xs">प्रोफ़ाइल नहीं मिली</div>;
   }

   const initials = userData.name ? userData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'RB';

   return (
      <div className="space-y-12 pb-20">
         {/* Profile Header */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6 md:gap-10">
               {/* Avatar / Photo with click to change */}
               <div 
                 onClick={() => setIsEditModalOpen(true)}
                 className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-saffron/30 sacred-glow cursor-pointer group bg-black/60 shrink-0"
                 title="फोटो बदलें"
               >
                  {userData.photo_url ? (
                    <img src={userData.photo_url} alt={userData.name} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-saffron bg-white/5">
                       {initials}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                    <Camera size={24} className="text-saffron mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest">फोटो बदलें</span>
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                     <h2 className="text-3xl md:text-4xl font-black font-serif gold-text">{userData.name}</h2>
                     <span className="px-4 py-1.5 bg-saffron/10 text-saffron text-[9px] font-black rounded-full uppercase tracking-widest border border-saffron/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                        {userData.membership_type === 'SPECIAL_LIFE' ? 'केन्द्रीय विशिष्ट आजीवन सदस्य' :
                         userData.membership_type === 'LIFE' ? 'केन्द्रीय आजीवन सदस्य' : 
                         userData.membership_type === 'BANK_LIFE' ? 'श्री राम नाम लिखन सदस्य' : 
                         userData.membership_type === 'REGULAR' ? 'साधारण सदस्य' : 
                         userData.membership_type || 'श्री राम नाम लिखन सदस्य'}
                     </span>
                  </div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em]">सदस्यता आईडी: {userData.membership_id || userData.id}</p>
               </div>
            </div>

            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="px-6 py-3 bg-saffron text-black rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-lg active:scale-95"
            >
               <Edit3 size={15} /> प्रोफाइल एवं फोटो एडिट करें
            </button>
         </div>

         {userData.is_overdue && (
           <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-[2rem] animate-pulse">
              <div className="flex flex-col md:flex-row items-center gap-6 text-red-500">
                 <div className="p-4 bg-red-500/20 rounded-2xl shrink-0"><BellRing size={24} /></div>
                 <div className="space-y-1 text-center md:text-left">
                    <p className="text-xs font-black uppercase tracking-widest">वार्षिक रखरखाव शुल्क लंबित है!</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase">365 दिन पूरे हो चुके हैं। नई पुस्तिका प्राप्त करने के लिए ₹108 का वार्षिक शुल्क जमा करें।</p>
                 </div>
                 <button onClick={() => router.push('/dashboard/devotee/membership')} className="md:ml-auto px-8 py-4 bg-red-500 text-black text-[10px] font-black uppercase rounded-2xl shadow-xl hover:scale-105 transition-all">अभी भुगतान करें</button>
              </div>
           </div>
         )}

         {/* Postal Delivery Details Required Banner */}
         {missingDeliveryInfo && (
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="p-8 bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
           >
             <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                 <Award size={32} />
               </div>
               <div>
                 <span className="px-3 py-1 bg-amber-400 text-black font-black uppercase text-[9px] tracking-widest rounded-full">
                   अर्चना पुस्तिका एवं सनातनी पेन किट डिलीवरी
                 </span>
                 <h3 className="text-xl font-black font-serif gold-text mt-1">
                   कृपया अपना पूरा डाक डिलीवरी पता दर्ज करें
                 </h3>
                 <p className="text-xs text-white/70 mt-1 leading-relaxed">
                   आपकी सदस्यता सक्रिय है! आपके पते पर श्री राम नाम लेखन पुस्तिका एवं विशेष पेन किट स्पीड पोस्ट/कूरियर से भेजी जाएगी।
                 </p>
               </div>
             </div>
             <button 
               onClick={() => setIsEditModalOpen(true)}
               className="px-8 py-4 bg-saffron text-black font-black uppercase text-xs rounded-2xl shadow-lg hover:bg-amber-400 transition-all shrink-0 active:scale-95"
             >
               डाक पता भरें (Fill Address)
             </button>
           </motion.div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
               <div className="premium-card p-8 sm:p-10 space-y-8">
                  <h3 className="text-lg font-bold uppercase tracking-widest border-b border-white/5 pb-4 gold-text">व्यक्तिगत एवं डाक डिलीवरी विवरण</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                        { label: 'ईमेल पता', val: userData.email, icon: Mail },
                        { label: 'मोबाइल नंबर', val: userData.mobile || 'दर्ज नहीं', icon: Calendar },
                        { label: 'गाँव / मोहल्ला', val: userData.village || 'दर्ज नहीं', icon: MapPin },
                        { label: 'डाकघर (Post Office)', val: userData.post_office || 'दर्ज नहीं', icon: MapPin },
                        { label: 'थाना (Police Station)', val: userData.police_station || 'दर्ज नहीं', icon: Shield },
                        { label: 'पिन कोड (PIN Code)', val: userData.pin_code || 'दर्ज नहीं', icon: Award },
                        { label: 'जिला एवं राज्य', val: `${userData.district || ''}, ${userData.state || ''}`.replace(/^, /, '') || 'दर्ज नहीं', icon: MapPin },
                        { label: 'मुख्य शाखा', val: userData.branch, icon: Shield },
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                           <div className="w-10 h-10 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron shrink-0 mt-0.5">
                              <item.icon size={18} />
                           </div>
                           <div className="min-w-0">
                              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">{item.label}</p>
                              <p className="text-sm font-bold text-white/90 truncate">{item.val}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="premium-card p-8 sm:p-10 bg-saffron/5 border border-saffron/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <h3 className="text-lg font-bold uppercase tracking-widest mb-6">आध्यात्मिक प्रगति</h3>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                        <span>अगला लक्ष्य (10 लाख नाम)</span>
                        <span className="text-saffron">{Math.min(100, Math.floor((totalNames / 1000000) * 100))}% पूर्ण</span>
                     </div>
                     <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div 
                          className="h-full bg-saffron rounded-full sacred-glow transition-all duration-1000"
                          style={{ width: `${Math.min(100, Math.floor((totalNames / 1000000) * 100))}%` }}
                        ></div>
                     </div>
                     <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-2">
                        कुल संचय: {totalNames.toLocaleString()} / 1,000,000
                     </p>
                  </div>
               </div>
            </div>

            {/* Right Side: Digital ID Card (CR80 Standard Pass with Front/Back and Print) */}
            <div className="space-y-6 flex flex-col items-center">
               <div className="w-full">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-saffron flex items-center gap-2 mb-3">
                   <Award size={16} /> डिजिटल सदस्यता पास (CR80 ID Pass)
                 </h3>
                 <DigitalIDCard user={userData} />
               </div>

               <div className="premium-card p-6 bg-sacred-red/5 border border-sacred-red/20 space-y-3 w-full">
                  <p className="text-[10px] font-black text-sacred-red uppercase tracking-widest">महत्वपूर्ण सूचना</p>
                  <p className="text-xs text-white/60 leading-relaxed">
                     इस पास को प्रिंट कराकर अपने पास रखें। पुस्तिका पूर्ण होने पर अपनी निकटतम शाखा में जमा करें।
                  </p>
               </div>
            </div>
         </div>

         {/* Toast Notification */}
         <AnimatePresence>
            {toast.show && (
               <motion.div 
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.9 }}
                  className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 bg-black/80 backdrop-blur-xl border border-saffron/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4"
               >
                  <div className="w-8 h-8 rounded-full bg-saffron/20 flex items-center justify-center text-saffron">
                     <CheckCircle size={18} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-white">{toast.message}</p>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Edit Profile & Postal Delivery Details Modal */}
         {isEditModalOpen && (
           <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
             <div className="bg-[#0D0D0D] border border-saffron/30 rounded-[2.5rem] w-full max-w-2xl overflow-hidden animate-zoom-in my-8 shadow-2xl">
               <div className="p-8 sm:p-10 space-y-8">
                 <div className="flex items-center justify-between border-b border-white/10 pb-4">
                   <div>
                     <h3 className="text-2xl font-black font-serif uppercase gold-text">प्रोफ़ाइल फ़ोटो एवं डाक डिलीवरी पता</h3>
                     <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                       आपकी फ़ोटो आपके सदस्यता पास में दिखेगी एवं किट इसी पते पर भेजी जाएगी
                     </p>
                   </div>
                   <button onClick={() => setIsEditModalOpen(false)} className="text-white/30 hover:text-white transition-colors">
                     <X size={24} />
                   </button>
                 </div>

                 <form onSubmit={handleUpdateProfile} className="space-y-6">
                   {/* Profile Picture Upload Section (With Auto-Compression) */}
                   <div className="p-4 rounded-2xl bg-white/[0.03] border border-saffron/30 flex items-center gap-5">
                     <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-saffron/50 bg-black/80 flex items-center justify-center shrink-0 shadow-lg">
                       {formData.photo_url ? (
                         <img src={formData.photo_url} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-2xl font-black text-saffron">{initials}</span>
                       )}
                     </div>

                     <div className="space-y-1.5 flex-1">
                       <label className="text-[10px] font-black text-saffron uppercase tracking-widest flex items-center gap-1.5">
                         <Camera size={13} /> प्रोफ़ाइल फ़ोटो (Profile Picture)
                       </label>
                       <p className="text-[9px] text-white/50 leading-relaxed">
                         पास कार्ड पर फ़ोटो लगाने के लिए अपलोड करें (फ़ोटो स्वतः कंप्रेस हो जाएगी)
                       </p>
                       <input 
                         ref={fileInputRef}
                         type="file" 
                         accept="image/*" 
                         onChange={handleImageUpload} 
                         className="hidden" 
                       />
                       <button
                         type="button"
                         onClick={() => fileInputRef.current?.click()}
                         className="py-2 px-4 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95"
                       >
                         <Upload size={13} className="text-saffron" /> फ़ोटो चुनें / बदलें
                       </button>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">पूरा नाम (Full Name) *</label>
                       <input 
                         required 
                         type="text" 
                         value={formData.name} 
                         onChange={e => setFormData({...formData, name: e.target.value})} 
                         className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-bold" 
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">मोबाइल नंबर (WhatsApp) *</label>
                       <input 
                         required 
                         type="tel" 
                         value={formData.mobile} 
                         onChange={e => setFormData({...formData, mobile: e.target.value})} 
                         placeholder="10 अंकों का मोबाइल नंबर"
                         className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-bold" 
                       />
                     </div>
                   </div>

                   {/* Postal Address: Village, Post Office, Police Station */}
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">गाँव / मोहल्ला *</label>
                       <input 
                         required 
                         type="text" 
                         placeholder="गाँव या मोहल्ला"
                         value={formData.village} 
                         onChange={e => setFormData({...formData, village: e.target.value})} 
                         className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-bold" 
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">डाकघर (Post Office) *</label>
                       <input 
                         required 
                         type="text" 
                         placeholder="पोस्ट ऑफिस का नाम"
                         value={formData.post_office} 
                         onChange={e => setFormData({...formData, post_office: e.target.value})} 
                         className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-bold" 
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">थाना (Police Station) *</label>
                       <input 
                         required 
                         type="text" 
                         placeholder="थाना"
                         value={formData.police_station} 
                         onChange={e => setFormData({...formData, police_station: e.target.value})} 
                         className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm font-bold" 
                       />
                     </div>
                   </div>

                   {/* PIN Code, State, District with Auto-lookup & Select Dropdown */}
                   <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                     <div className="flex items-center justify-between">
                       <span className="text-xs font-black text-saffron uppercase tracking-widest flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-saffron" /> पिन कोड, राज्य एवं जिला (Auto-Fill & Select)
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
                           {formData.pin_code?.length === 6 && (
                             <span className="text-[9px] text-green-400 font-bold">✓ ऑटो-फिल</span>
                           )}
                         </label>
                         <input 
                           required 
                           type="text" 
                           maxLength={6}
                           placeholder="उदा: 754211"
                           value={formData.pin_code} 
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
                             formData.state 
                               ? (Object.keys(ALL_INDIAN_STATES).find(k => k.toLowerCase().includes(formData.state.toLowerCase()) || formData.state.toLowerCase().includes(k.split(' ')[0].toLowerCase())) || "")
                               : ""
                           }
                           onChange={e => handleStateSelectChange(e.target.value)}
                           className="w-full px-3 py-3.5 bg-[#130d07] border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-xs font-bold"
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
                           value={formData.state} 
                           onChange={e => setFormData({...formData, state: e.target.value})} 
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
                             formData.district 
                               ? (districtList.find(d => d.toLowerCase().includes(formData.district.toLowerCase()) || formData.district.toLowerCase().includes(d.split(' ')[0].toLowerCase())) || formData.district)
                               : ""
                           }
                           onChange={e => handleDistrictSelectChange(e.target.value)}
                           className="w-full px-3 py-3.5 bg-[#130d07] border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-xs font-bold"
                         >
                           <option value="">-- जिला चुनें (Select) --</option>
                           {formData.district && !districtList.some(d => d.toLowerCase().includes(formData.district.toLowerCase()) || formData.district.toLowerCase().includes(d.split(' ')[0].toLowerCase())) && (
                             <option value={formData.district}>{formData.district}</option>
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
                           value={formData.district} 
                           onChange={e => setFormData({...formData, district: e.target.value})} 
                           className="w-full px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg outline-none focus:border-saffron/30 text-white/80 text-[11px]" 
                         />
                       </div>
                     </div>
                   </div>

                    {/* Assigned Branch Section */}
                    <div className="p-4 rounded-2xl bg-saffron/[0.04] border border-saffron/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-saffron uppercase tracking-widest flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-saffron" /> आवंटित शाखा (Assigned Branch)
                        </label>
                        <span className="text-[10px] text-white/50 font-bold">
                          {formData.branch_code ? `코드: ${formData.branch_code}`.replace("코드:", "कोड:") : ""}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 leading-relaxed">
                        आपके पिन कोड एवं जिले के अनुसार शाखा स्वतः चुनी जाती है। यदि आपके जिले में कोई शाखा नहीं है तो <strong className="text-saffron">अयोध्या धाम मुख्य शाखा</strong> डिफ़ॉल्ट रहेगी। आप चाहें तो नीचे से अपनी शाखा बदल भी सकते हैं।
                      </p>
                      <select
                        value={formData.branch_code || "UP/AY/01"}
                        onChange={e => handleBranchSelectChange(e.target.value)}
                        className="w-full px-4 py-3.5 bg-[#130d07] border border-saffron/40 rounded-2xl outline-none focus:border-saffron text-amber-200 text-sm font-bold"
                      >
                        {branches.map(branch => (
                          <option key={branch.code} value={branch.code}>
                            {branch.name} ({branch.code}) - {branch.city}, {branch.state}
                          </option>
                        ))}
                      </select>
                    </div>

                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">नजदीकी लैंडमार्क / पहचान (Landmark)</label>
                     <input 
                       type="text" 
                       placeholder="उदा: मंदिर के पास, स्कूल के सामने"
                       value={formData.landmark} 
                       onChange={e => setFormData({...formData, landmark: e.target.value})} 
                       className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-saffron/50 text-white text-sm" 
                     />
                   </div>

                   <div className="pt-4">
                     <button 
                       type="submit" 
                       disabled={isUpdating}
                       className="w-full saffron-btn py-5 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl"
                     >
                       {isUpdating ? 'सुरक्षित हो रहा है...' : 'प्रोफ़ाइल एवं पता सुरक्षित करें (Save Profile & Address)'}
                     </button>
                   </div>
                 </form>
               </div>
             </div>
           </div>
         )}
      </div>
   );
}
