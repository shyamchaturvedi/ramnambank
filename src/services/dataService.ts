import { supabase } from '@/lib/supabase';

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
export const getInventory = async (branchId?: string) => {
  try {
    let query = supabase.from('inventory').select('*');
    if (branchId) query = query.eq('branch_id', branchId);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
};

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
    const { data: depositsData } = await supabase.from('deposits').select('ram_nam_count');
    const totalDonations = depositsData?.reduce((acc, curr) => acc + (Number(curr.ram_nam_count) || 0), 0) || 0;
    
    return {
      totalBhakt: bhaktCount || 0,
      totalBranches: branchCount || 0,
      totalBooks: totalBooks || 0,
      totalDonations: totalDonations,
      activeBranches: branchCount || 0
    };
  } catch {
    return null;
  }
};

// 10. User Management
export const updateUser = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*, branches(name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
export const getBranches = async () => {
  try {
    const { data, error } = await supabase.from('branches').select('*').order('name');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching branches:', error);
    return [];
  }
};

export const getMembershipPlans = async () => {
  try {
    const { data, error } = await supabase.from('membership_plans').select('*').order('sort_order');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
};

export const getCommitteeMembers = async (branchId?: string) => {
  try {
    let query = supabase.from('committee_members').select('*');
    if (branchId) query = query.eq('branch_id', branchId);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching committee:', error);
    return [];
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
    // Query deposits table instead of inventory_logs to get member's spiritual wealth history
    const { data, error } = await supabase
      .from('deposits')
      .select('*, branches(name)')
      .eq('member_id', memberId)
      .order('deposited_at', { ascending: false });
      
    if (error) {
      console.error('Database query error:', error.message);
      throw error;
    }
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

// 11. Recent Activities
export const getRecentActivities = async () => {
  try {
    // Fetch recent members
    const { data: members } = await supabase
      .from('members')
      .select('full_name, created_at, state')
      .order('created_at', { ascending: false })
      .limit(3);

    // Fetch recent deposits
    const { data: deposits } = await supabase
      .from('deposits')
      .select('ram_nam_count, deposited_at, members(full_name)')
      .order('deposited_at', { ascending: false })
      .limit(3);

    const activities: any[] = [];

    members?.forEach(m => {
      activities.push({
        type: 'USER',
        text: `नया भक्त पंजीकृत: ${m.full_name} (${m.state || '...' })`,
        time: m.created_at,
        icon: 'Users',
        color: 'text-blue-400'
      });
    });

    deposits?.forEach(d => {
      activities.push({
        type: 'STOCK',
        text: `पुस्तिका जमा: ${d.members?.full_name || '...'} (${d.ram_nam_count} नाम)`,
        time: d.deposited_at,
        icon: 'Box',
        color: 'text-green-400'
      });
    });

    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

export const submitDonation = async (donation: any) => {
  try {
    const { data, error } = await supabase.from('donations').insert([donation]).select();
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
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
