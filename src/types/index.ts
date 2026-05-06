export type BranchLevel = 'STATE' | 'DISTRICT' | 'BLOCK';

export interface Branch {
  id: string;
  name: string;
  level: BranchLevel;
  parent_id?: string;
  code: string;
  address?: string;
  contact_no?: string;
  admin_id?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: 'SUPER_ADMIN' | 'STATE_ADMIN' | 'DISTRICT_ADMIN' | 'BLOCK_ADMIN' | 'VOLUNTEER';
  branch_id?: string;
  mobile_no: string;
}

export interface Member {
  id: string;
  member_no: number;
  full_name: string;
  is_life_member: boolean;
  life_member_no?: string;
  mobile_no: string;
  address: string;
  po: string;
  block_id: string;
  district_id: string;
  state_id: string;
  pin_code: string;
  profile_photo_url?: string;
  signature_url?: string;
  created_at: string;
}

export interface Deposit {
  id: string;
  member_id: string;
  branch_id: string;
  booklet_id: string;
  ram_nam_count: number;
  deposited_at: string;
  verified_by: string;
}
