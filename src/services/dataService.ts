import { supabase } from '@/lib/supabase';

// Static Fallback Data (Client's Latest Data)
export const DUMMY_BRANCHES = [];

export const DUMMY_MEMBERSHIP_PLANS = [];

export const DUMMY_COMMITTEE = [];

// Generate Smart Membership ID
export const generateMemberId = (branchCode: string, serialNumber: number) => {
  const year = new Date().getFullYear();
  const paddedSerial = serialNumber.toString().padStart(4, '0');
  return `${branchCode}/${year}/${paddedSerial}`;
};

// --- REAL SUPABASE OPERATIONS ---

// 1. Create Member
export const createMember = async (memberData: any) => {
  try {
    // A. Check if mobile number already exists to give clear error
    const { data: existing } = await supabase
      .from('members')
      .select('id')
      .eq('mobile_number', memberData.mobile_number)
      .maybeSingle();

    if (existing) {
      return { success: false, error: 'यह मोबाइल नंबर पहले से पंजीकृत है।' };
    }

    // B. Create Auth User
    const loginEmail = memberData.email || `${memberData.mobile_number}@ramnam.bank`;
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: loginEmail,
      password: memberData.password,
      options: {
        data: {
          full_name: memberData.full_name,
          role: 'MEMBER'
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        // Continue if auth exists but member record missing
      } else {
        throw authError;
      }
    }

    // C. Generate ID
    const { data: lastMember } = await supabase
      .from('members')
      .select('membership_id')
      .ilike('membership_id', `${memberData.branch_code}/${new Date().getFullYear()}/%`)
      .order('membership_id', { ascending: false })
      .limit(1);

    let nextSerial = 1;
    if (lastMember && lastMember[0]) {
      const parts = lastMember[0].membership_id.split('/');
      nextSerial = parseInt(parts[parts.length - 1]) + 1;
    }

    const membershipId = generateMemberId(memberData.branch_code, nextSerial);
    
    // D. Final Database Insert
    const insertData = {
      full_name: memberData.full_name,
      mobile_number: memberData.mobile_number,
      password: memberData.password,
      address: memberData.address,
      pin_code: memberData.pin_code,
      referral_code: memberData.referral_code,
      state: memberData.state || 'Odisha',
      district: memberData.district,
      block: memberData.block,
      branch_code: memberData.branch_code,
      membership_id: membershipId,
      status: 'ACTIVE',
      role: 'DEVOTEE',
      email: loginEmail
    };

    const { data, error: insertError } = await supabase
      .from('members')
      .insert([insertData])
      .select();

    if (insertError) throw insertError;
    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error('Registration Error:', error);
    return { success: false, error: error.message || 'पंजीकरण में त्रुटि आई।' };
  }
};

// 2. Update Stock
export const updateInventory = async (logData: any) => {
  try {
    // 1. Log the transaction
    const { error: logError } = await supabase.from('inventory_logs').insert([logData]);
    if (logError) throw logError;

    // 2. Update current stock
    const { data: currentStock } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('branch_id', logData.branch_id)
      .eq('item_name', logData.item_name)
      .single();

    const newQuantity = logData.type === 'CREDIT' 
      ? (currentStock?.quantity || 0) + logData.quantity 
      : (currentStock?.quantity || 0) - logData.quantity;

    const { error: updateError } = await supabase
      .from('inventory')
      .upsert({ 
        branch_id: logData.branch_id, 
        item_name: logData.item_name, 
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      });

    if (updateError) throw updateError;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 3. Get Global Stats for Admin Dashboard
export const getAdminStats = async () => {
  try {
    const { count: bhaktCount } = await supabase.from('members').select('*', { count: 'exact', head: true });
    const { count: branchCount } = await supabase.from('branches').select('*', { count: 'exact', head: true });
    const { data: inventory } = await supabase.from('inventory').select('quantity, item_name');
    
    const totalBooks = inventory?.filter(i => i.item_name === 'BOOK').reduce((acc, curr) => acc + curr.quantity, 0) || 0;
    
    return {
      totalBhakt: bhaktCount || 6000,
      totalBranches: branchCount || 30,
      totalBooks: totalBooks || 12500,
      activeBranches: 9
    };
  } catch {
    return null;
  }
};

// --- DATA FETCHING METHODS ---
export const getBranches = async () => {
  try {
    const { data, error } = await supabase.from('branches').select('*').order('name');
    if (error || !data || data.length === 0) return DUMMY_BRANCHES;
    return data;
  } catch {
    return DUMMY_BRANCHES;
  }
};

export const getMembershipPlans = async () => {
  try {
    const { data, error } = await supabase.from('membership_plans').select('*').order('sort_order');
    if (error || !data || data.length === 0) return DUMMY_MEMBERSHIP_PLANS;
    return data;
  } catch {
    return DUMMY_MEMBERSHIP_PLANS;
  }
};

export const getCommitteeMembers = async (branchId?: string) => {
  try {
    let query = supabase.from('committee_members').select('*');
    if (branchId) query = query.eq('branch_id', branchId);
    
    const { data, error } = await query;
    if (error || !data || data.length === 0) return branchId ? [] : DUMMY_COMMITTEE;
    return data;
  } catch {
    return branchId ? [] : DUMMY_COMMITTEE;
  }
};

// 4. Bulk Create Members (For CSV Upload)
export const bulkCreateMembers = async (membersArray: any[]) => {
  try {
    const { data, error } = await supabase.from('members').insert(membersArray).select();
    if (error) throw error;
    return { success: true, count: data.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 5. System Settings
export const getSettings = async () => {
  try {
    const { data, error } = await supabase.from('system_settings').select('*').limit(1).single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
};

export const updateSetting = async (key: string, value: any) => {
  try {
    const { error } = await supabase
      .from('system_settings')
      .upsert({ id: 1, [key]: value, updated_at: new Date().toISOString() });
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 6. Member Specific Data
export const getMemberBookletHistory = async (memberId: string) => {
  try {
    const { data, error } = await supabase
      .from('inventory_logs')
      .select('*, branches(name)')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching member history:', error.message);
    return [];
  }
};

// 7. Donation Management
export const getDonations = async () => {
  try {
    const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error: any) {
    return [];
  }
};

export const updateDonationStatus = async (id: string, status: string) => {
  try {
    const { error } = await supabase.from('donations').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 8. Stock Requests
export const createStockRequest = async (request: any) => {
  try {
    const { data, error } = await supabase.from('inventory_requests').insert([request]).select();
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getStockRequests = async () => {
  try {
    const { data, error } = await supabase.from('inventory_requests').select('*, branches(name)').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error: any) {
    return [];
  }
};

// 9. Referral Management
export const getTopReferrals = async () => {
  try {
    // This query counts how many members have used each unique referral_code
    const { data, error } = await supabase.from('members').select('referral_code').not('referral_code', 'is', null);
    if (error) throw error;

    const counts: any = {};
    data.forEach((m: any) => {
      if (m.referral_code) counts[m.referral_code] = (counts[m.referral_code] || 0) + 1;
    });

    return Object.entries(counts).map(([code, count]) => ({ code, count })).sort((a: any, b: any) => b.count - a.count);
  } catch (error: any) {
    return [];
  }
};
