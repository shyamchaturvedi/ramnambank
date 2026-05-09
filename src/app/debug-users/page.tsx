"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase.from('members').select('membership_id, mobile_number, password, email').order('created_at', { ascending: false }).limit(10);
      setUsers(data || []);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  return (
    <div className="p-10 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 text-saffron">डिबग यूजर लिस्ट (Testing Only)</h1>
      {loading ? <p>लोड हो रहा है...</p> : (
        <table className="w-full border-collapse border border-white/20">
          <thead>
            <tr className="bg-white/10">
              <th className="border border-white/20 p-3">ID</th>
              <th className="border border-white/20 p-3">Mobile</th>
              <th className="border border-white/20 p-3">Password</th>
              <th className="border border-white/20 p-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td className="border border-white/20 p-3">{u.membership_id}</td>
                <td className="border border-white/20 p-3">{u.mobile_number}</td>
                <td className="border border-white/20 p-3 font-mono text-saffron">{u.password}</td>
                <td className="border border-white/20 p-3">{u.email || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="mt-10 text-white/40 text-xs">नोट: लॉगिन करने के बाद इस पेज को डिलीट कर दिया जाएगा।</p>
    </div>
  );
}
