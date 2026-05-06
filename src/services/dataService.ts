import { supabase } from '@/lib/supabase';
import { Branch, Member, Deposit } from '@/types';

// In a real app, these would call Supabase. 
// For now, I'm providing a clean service structure.

export const dataService = {
  // Branch Management
  async getBranches() {
    const { data, error } = await supabase.from('branches').select('*');
    if (error) throw error;
    return data as Branch[];
  },

  async createBranch(branch: Omit<Branch, 'id' | 'created_at'>) {
    const { data, error } = await supabase.from('branches').insert(branch).select().single();
    if (error) throw error;
    return data as Branch;
  },

  // Member Management
  async getMembers(branchId?: string) {
    let query = supabase.from('members').select('*');
    if (branchId) query = query.eq('block_id', branchId);
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Member[];
  },

  async registerMember(member: Omit<Member, 'id' | 'created_at' | 'member_no'>) {
    const { data, error } = await supabase.from('members').insert(member).select().single();
    if (error) throw error;
    return data as Member;
  },

  // Deposit Management
  async recordDeposit(deposit: Omit<Deposit, 'id' | 'deposited_at'>) {
    const { data, error } = await supabase.from('deposits').insert(deposit).select().single();
    if (error) throw error;
    return data as Deposit;
  },

  async getGlobalStats() {
    // This would typically call a RPC or a Materialized View
    const { data, error } = await supabase.rpc('get_global_stats');
    if (error) {
        // Fallback for mock/preview
        return {
            total_members: 15420,
            total_ram_nam: 1284567293,
            total_branches: 450
        };
    }
    return data;
  },

  // Settings Management
  async getSettings() {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) {
      // Fallback for demo if table doesn't exist
      return { maintenance_mode: false, registration_enabled: true };
    }
    return data.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value === 'true' ? true : curr.value === 'false' ? false : curr.value;
      return acc;
    }, {});
  },

  async updateSetting(key: string, value: string | boolean) {
    const valStr = String(value);
    const { error } = await supabase.from('site_settings').upsert({ key, value: valStr }, { onConflict: 'key' });
    if (error) throw error;
  }
};
