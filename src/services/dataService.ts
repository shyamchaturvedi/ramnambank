import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  onSnapshot,
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// 1. Generate Smart Membership ID starting from 001
export const generateMemberId = (branchCode: string, serialNumber: number) => {
  const year = new Date().getFullYear();
  const paddedSerial = serialNumber.toString().padStart(3, '0');
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
    const branchCode = memberData.branch_code || 'OD/17';
    
    // Count existing members for this branch to generate sequential ID starting from 001
    let nextSerial = 1;
    try {
      const branchMembersQ = query(collection(db, 'members'), where('branch_code', '==', branchCode));
      const countSnap = await getDocs(branchMembersQ);
      nextSerial = countSnap.size + 1;
    } catch (e) {
      try {
        const allSnap = await getDocs(collection(db, 'members'));
        nextSerial = allSnap.size + 1;
      } catch (err) {}
    }

    const paddedSerial = nextSerial.toString().padStart(3, '0');
    const membershipId = `${branchCode}/${year}/${paddedSerial}`;

    const newMember = {
      ...memberData,
      id: uid,
      membership_id: membershipId,
      branch_code: branchCode,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };

    await setDoc(doc(db, 'members', uid), newMember, { merge: true });
    return { success: true, data: newMember };
  } catch (error: any) {
    console.error('Firebase createMember error:', error);
    return { success: false, error: error.message || 'पंजीकरण में त्रुटि आई।' };
  }
};

// 3. Branches List & Realtime Listener
export const DEFAULT_BRANCHES = [
  { id: '1', name: 'KENDRAPARA SUB DIVISION', code: 'OD/17', city: 'Kendrapara', state: 'Odisha', status: 'ACTIVE' },
  { id: 'ayodhya-main', name: 'अयोध्या धाम केन्द्रीय मुख्य शाखा', code: 'UP/AY', city: 'Ayodhya', state: 'Uttar Pradesh', status: 'ACTIVE' },
  { id: '2', name: 'PATAMUNDAI NAC', code: 'OD/17', city: 'Kendrapara', state: 'Odisha', status: 'ACTIVE' },
  { id: '3', name: 'ALI BLOCK', code: 'OD/17', city: 'Kendrapara', state: 'Odisha', status: 'ACTIVE' },
  { id: '4', name: 'DERABISH BLOCK', code: 'OD/17', city: 'Kendrapara', state: 'Odisha', status: 'ACTIVE' },
  { id: '5', name: 'GARADPUR BLOCK', code: 'OD/17', city: 'Kendrapara', state: 'Odisha', status: 'ACTIVE' },
  { id: '6', name: 'KENDRAPARA BLOCK', code: 'OD/17', city: 'Kendrapara', state: 'Odisha', status: 'ACTIVE' },
  { id: '7', name: 'MAHAKALPADA BLOCK', code: 'OD/17', city: 'Kendrapara', state: 'Odisha', status: 'ACTIVE' },
  { id: '8', name: 'MARSHAGHAI BLOCK', code: 'OD/17', city: 'Kendrapara', state: 'Odisha', status: 'ACTIVE' },
  { id: '9', name: 'PATAMUNDAI BLOCK', code: 'OD/17', city: 'Kendrapara', state: 'Odisha', status: 'ACTIVE' },
  { id: '10', name: 'RAJNAGAR BLOCK', code: 'OD/17', city: 'Kendrapara', state: 'Odisha', status: 'ACTIVE' },
  { id: '11', name: 'PURI CENTRAL', code: 'OD/26', city: 'Puri', state: 'Odisha', status: 'ACTIVE' },
  { id: '12', name: 'BHUBANESWAR MAIN', code: 'OD/19', city: 'Khordha', state: 'Odisha', status: 'ACTIVE' },
  { id: '13', name: 'CUTTACK SADAR', code: 'OD/07', city: 'Cuttack', state: 'Odisha', status: 'ACTIVE' }
];

export const getBranches = async (): Promise<any[]> => {
  try {
    const snap = await getDocs(collection(db, 'branches'));
    if (!snap.empty) {
      const dbBranches = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Merge with default Ayodhya Dham branch if not present
      const hasAyodhya = dbBranches.some((b: any) => b.code?.startsWith('UP/AY') || b.name?.includes('अयोध्या'));
      if (!hasAyodhya) {
        return [DEFAULT_BRANCHES[1], ...dbBranches];
      }
      return dbBranches;
    }
  } catch (e) {
    console.warn('Fallback to default branches');
  }
  return DEFAULT_BRANCHES;
};

// Real-time live branch listener for immediate updates across all components
export const subscribeToBranches = (callback: (branches: any[]) => void) => {
  try {
    const unsub = onSnapshot(collection(db, 'branches'), (snap) => {
      if (!snap.empty) {
        const dbBranches = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const hasAyodhya = dbBranches.some((b: any) => b.code?.startsWith('UP/AY') || b.name?.includes('अयोध्या'));
        const combined = hasAyodhya ? dbBranches : [DEFAULT_BRANCHES[1], ...dbBranches];
        callback(combined);
      } else {
        callback(DEFAULT_BRANCHES);
      }
    }, (err) => {
      console.warn('Branch subscription error, using defaults:', err);
      callback(DEFAULT_BRANCHES);
    });
    return unsub;
  } catch (e) {
    callback(DEFAULT_BRANCHES);
    return () => {};
  }
};

// Admin save or update branch in Firestore
export const saveBranch = async (branchData: any, branchId?: string) => {
  try {
    const cleanData = {
      name: branchData.name || '',
      code: (branchData.code || '').toUpperCase().trim(),
      city: branchData.city || '',
      state: branchData.state || 'Odisha',
      address: branchData.address || '',
      phone: branchData.phone || '',
      status: branchData.status || 'ACTIVE',
      updated_at: new Date().toISOString()
    };

    if (branchId) {
      await updateDoc(doc(db, 'branches', branchId), cleanData);
      return { success: true, id: branchId };
    } else {
      const docRef = await addDoc(collection(db, 'branches'), {
        ...cleanData,
        created_at: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    }
  } catch (err: any) {
    console.error('Error saving branch:', err);
    return { success: false, error: err.message };
  }
};

// Admin delete branch from Firestore
export const deleteBranch = async (branchId: string) => {
  try {
    await deleteDoc(doc(db, 'branches', branchId));
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting branch:', err);
    return { success: false, error: err.message };
  }
};

// 4. Admin Stats (Real Live Firestore Data)
export const getAdminStats = async () => {
  try {
    const [membersSnap, donationsSnap, bookletsSnap, allBranches] = await Promise.all([
      getDocs(collection(db, 'members')),
      getDocs(collection(db, 'donations')),
      getDocs(collection(db, 'booklet_submissions')),
      getBranches()
    ]);

    const totalBhakt = membersSnap.size;
    const totalDonations = donationsSnap.docs.reduce((sum, d) => sum + (Number(d.data().amount) || 0), 0);
    const totalBranches = allBranches.length;
    const totalBooks = bookletsSnap.docs.reduce((sum, d) => sum + (Number(d.data().quantity) || 0), 0);

    return {
      totalBhakt,
      totalBranches,
      activeBranches: totalBranches,
      totalBooks,
      totalDonations
    };
  } catch (err) {
    return {
      totalBhakt: 0,
      totalBranches: 0,
      activeBranches: 0,
      totalBooks: 0,
      totalDonations: 0
    };
  }
};

// 5. Recent Activities (Real Live Feed)
export const getRecentActivities = async () => {
  try {
    const [membersSnap, donationsSnap] = await Promise.all([
      getDocs(query(collection(db, 'members'), orderBy('created_at', 'desc'), limit(5))),
      getDocs(query(collection(db, 'donations'), orderBy('created_at', 'desc'), limit(5)))
    ]);

    const acts: any[] = [];
    membersSnap.docs.forEach(d => {
      const data = d.data();
      acts.push({
        text: `नया भक्त खाता: ${data.full_name || 'भक्त'} (${data.district || 'Odisha'})`,
        time: data.created_at || new Date().toISOString(),
        type: "USER",
        color: "text-green-400"
      });
    });

    donationsSnap.docs.forEach(d => {
      const data = d.data();
      acts.push({
        text: `दान/सदस्यता संग्रह: ₹${(data.amount || 0).toLocaleString()} (${data.donor_name || 'भक्त'})`,
        time: data.created_at || new Date().toISOString(),
        type: "DONATION",
        color: "text-saffron"
      });
    });

    acts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    return acts.slice(0, 5);
  } catch (e) {
    return [];
  }
};

// 6. Top Referrals (Real Live Data)
export const getTopReferrals = async () => {
  try {
    const membersSnap = await getDocs(collection(db, 'members'));
    const refMap: { [key: string]: number } = {};

    membersSnap.docs.forEach(d => {
      const data = d.data();
      const ref = data.referral_code || data.branch_code;
      if (ref) {
        refMap[ref] = (refMap[ref] || 0) + 1;
      }
    });

    const list = Object.keys(refMap).map(code => ({
      name: `शाखा / रेफरल ${code}`,
      code: code,
      count: refMap[code]
    }));

    list.sort((a, b) => b.count - a.count);
    return list.slice(0, 5);
  } catch {
    return [];
  }
};

// 7. Devotee Booklet History
export const getMemberBookletHistory = async (userId: string) => {
  try {
    const snap = await getDocs(query(collection(db, 'booklet_submissions'), where('user_id', '==', userId)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
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

export const getSettings = async (): Promise<any> => {
  try {
    const snap = await getDoc(doc(db, 'system_settings', 'config'));
    if (snap.exists()) {
      return {
        upi_id: '8090525961m@pnb',
        merchant_name: 'SHRI JAGANNATH ODIA BABA SEWA SANSTHAN',
        maintenance_mode: false,
        registration_enabled: true,
        admin_signature_url: '',
        admin_signature_text: 'Ram Nam Bank',
        ...snap.data()
      };
    }
  } catch (e) {}

  return {
    upi_id: '8090525961m@pnb',
    merchant_name: 'SHRI JAGANNATH ODIA BABA SEWA SANSTHAN',
    maintenance_mode: false,
    registration_enabled: true,
    admin_signature_url: '',
    admin_signature_text: 'Ram Nam Bank'
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
