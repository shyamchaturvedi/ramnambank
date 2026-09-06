import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// 1. Generate Smart Membership ID
export const generateMemberId = (branchCode: string, serialNumber: number) => {
  const year = new Date().getFullYear();
  const paddedSerial = serialNumber.toString().padStart(4, '0');
  return `${branchCode}/${year}/${paddedSerial}`;
};

// 2. Create Member in Firebase
export const createMember = async (memberData: any) => {
  try {
    const loginEmail = memberData.email || `${memberData.mobile_number}@ramnam.bank`;
    let uid = memberData.mobile_number;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, memberData.password);
      if (userCredential?.user) {
        uid = userCredential.user.uid;
      }
    } catch (authErr: any) {
      console.log('Firebase Auth SignUp notice:', authErr.message);
    }

    const year = new Date().getFullYear();
    const serial = Math.floor(1000 + Math.random() * 9000);
    const membershipId = `${memberData.branch_code}/${year}/${serial}`;

    const newMember = {
      id: uid,
      full_name: memberData.full_name,
      mobile_number: memberData.mobile_number,
      address: memberData.address,
      pin_code: memberData.pin_code || '',
      referral_code: memberData.referral_code || '',
      state: memberData.state || 'Odisha',
      district: memberData.district,
      block: memberData.block,
      branch_code: memberData.branch_code,
      membership_id: membershipId,
      status: 'ACTIVE',
      role: 'DEVOTEE',
      email: loginEmail,
      membership_type: 'BANK_LIFE',
      created_at: new Date().toISOString()
    };

    await setDoc(doc(db, 'members', uid), newMember);
    return { success: true, data: newMember };
  } catch (error: any) {
    console.error('Firebase createMember error:', error);
    return { success: false, error: error.message || 'पंजीकरण में त्रुटि आई।' };
  }
};

// 3. Branches List
export const getBranches = async () => {
  const defaultBranches = [
    { id: '1', name: 'KENDRAPARA SUB DIVISION', code: 'OD/17/01', city: 'Kendrapara', state: 'Odisha' },
    { id: '2', name: 'PATAMUNDAI NAC', code: 'OD/17/02', city: 'Kendrapara', state: 'Odisha' },
    { id: '3', name: 'ALI BLOCK', code: 'OD/17/03', city: 'Kendrapara', state: 'Odisha' },
    { id: '4', name: 'DERABISH BLOCK', code: 'OD/17/04', city: 'Kendrapara', state: 'Odisha' },
    { id: '5', name: 'GARADPUR BLOCK', code: 'OD/17/05', city: 'Kendrapara', state: 'Odisha' },
    { id: '6', name: 'KENDRAPARA BLOCK', code: 'OD/17/06', city: 'Kendrapara', state: 'Odisha' },
    { id: '7', name: 'MAHAKALPADA BLOCK', code: 'OD/17/07', city: 'Kendrapara', state: 'Odisha' },
    { id: '8', name: 'MARSHAGHAI BLOCK', code: 'OD/17/08', city: 'Kendrapara', state: 'Odisha' },
    { id: '9', name: 'PATAMUNDAI BLOCK', code: 'OD/17/09', city: 'Kendrapara', state: 'Odisha' },
    { id: '10', name: 'RAJNAGAR BLOCK', code: 'OD/17/10', city: 'Kendrapara', state: 'Odisha' },
    { id: '11', name: 'PURI CENTRAL', code: 'OD/26/01', city: 'Puri', state: 'Odisha' },
    { id: '12', name: 'BHUBANESWAR MAIN', code: 'OD/19/01', city: 'Khordha', state: 'Odisha' },
    { id: '13', name: 'CUTTACK SADAR', code: 'OD/07/01', city: 'Cuttack', state: 'Odisha' }
  ];

  try {
    const snap = await getDocs(collection(db, 'branches'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (e) {
    console.warn('Fallback to default branches');
  }
  return defaultBranches;
};

// 4. Admin Stats
export const getAdminStats = async () => {
  try {
    const membersSnap = await getDocs(collection(db, 'members'));
    const donationsSnap = await getDocs(collection(db, 'donations'));

    const totalBhakt = membersSnap.size || 148;
    const totalDonations = donationsSnap.docs.reduce((sum, d) => sum + (Number(d.data().amount) || 0), 0);

    return {
      totalBhakt,
      totalBranches: 30,
      activeBranches: 24,
      totalBooks: 45200,
      totalDonations: totalDonations || 36000
    };
  } catch (err) {
    return {
      totalBhakt: 148,
      totalBranches: 30,
      activeBranches: 24,
      totalBooks: 45200,
      totalDonations: 36000
    };
  }
};

// 5. Recent Activities
export const getRecentActivities = async () => {
  return [
    { text: "नया भक्त खाता पंजीकृत हुआ (Kendrapara)", time: new Date().toISOString(), type: "USER", color: "text-green-400" },
    { text: "सदस्यता पास सक्रिय किया गया (Bank Life)", time: new Date().toISOString(), type: "USER", color: "text-saffron" },
    { text: "अर्चना पुस्तिका वितरण (Puri Branch)", time: new Date().toISOString(), type: "BOOK", color: "text-blue-400" }
  ];
};

// 6. Top Referrals
export const getTopReferrals = async () => {
  return [
    { name: "निर्मल रंजन स्वाईं", code: "OD17-01", count: 48 },
    { name: "सुभाष चंद्र स्वाईं", code: "OD17-07", count: 32 },
    { name: "प्रशांत कुमार पात्रा", code: "OD17-10", count: 29 }
  ];
};

// 7. Devotee Booklet History
export const getMemberBookletHistory = async (userId: string) => {
  return [
    { id: '1', quantity: 108000, date: new Date().toISOString(), status: 'VERIFIED' }
  ];
};

// 8. Donations
export const getDonations = async () => {
  try {
    const snap = await getDocs(collection(db, 'donations'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (e) {}
  return [];
};

export const updateDonationStatus = async (id: string, status: string) => {
  try {
    await updateDoc(doc(db, 'donations', id), { status });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const submitDonation = async (donationData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'donations'), {
      ...donationData,
      status: 'PENDING',
      created_at: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// 9. Inventory & Stock Requests
export const getInventory = async (branchId?: string) => {
  return [
    { item_name: 'BOOK', quantity: 45200 },
    { item_name: 'PEN', quantity: 12800 }
  ];
};

export const createStockRequest = async (data: any) => {
  try {
    await addDoc(collection(db, 'stock_requests'), {
      ...data,
      status: 'PENDING',
      created_at: new Date().toISOString()
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const getStockRequests = async (branchId?: string) => {
  try {
    const snap = await getDocs(collection(db, 'stock_requests'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
};

// 10. Committee Members
export const getCommitteeMembers = async (branchCode?: string) => {
  return [
    { name: "NIRMAL RANJAN SWAIN", role: "President", phone: "6372858933" },
    { name: "BICHITRA NANDA BAYEE", role: "V.President", phone: "9938103418" },
    { name: "PRASANT KUMAR PATRA", role: "Working President", phone: "9420854091" },
    { name: "CHANDRAKANTA NAYAK", role: "Secretary", phone: "7008367181" },
    { name: "PRABHAKAR GRAHACHARYA", role: "Treasury", phone: "7873981619" }
  ];
};

// 11. User Management
export const getUsers = async () => {
  try {
    const snap = await getDocs(collection(db, 'members'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
};

export const updateUser = async (id: string, updates: any) => {
  try {
    await updateDoc(doc(db, 'members', id), updates);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// 12. Settings & Membership Plans
export const getSettings = async () => {
  return {
    upi_id: '8090525961m@pnb',
    merchant_name: 'SHRI JAGANNATH ODIA BABA SEWA SANSTHAN',
    maintenance_mode: false
  };
};

export const updateSetting = async (key: string, value: any) => {
  try {
    await setDoc(doc(db, 'system_settings', 'config'), { [key]: value }, { merge: true });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const getMembershipPlans = async () => {
  return [
    { id: '1', name: 'केन्द्रीय विशिष्ट आजीवन सदस्य', amount: 21051 },
    { id: '2', name: 'केन्द्रीय आजीवन सदस्य', amount: 2151 },
    { id: '3', name: 'श्री राम नाम लिखन सदस्य', amount: 360 }
  ];
};
