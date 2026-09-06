// Mock/Fallback Adapter so any lingering supabase imports never crash the runtime
const createDummyQuery = () => {
  const chain: any = {
    select: () => chain,
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => chain,
    delete: () => chain,
    eq: () => chain,
    ilike: () => chain,
    order: () => chain,
    limit: () => chain,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null })
  };
  return chain;
};

export const supabase: any = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signUp: () => Promise.resolve({ data: {}, error: null }),
    signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => createDummyQuery(),
  channel: () => ({
    on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    subscribe: () => {}
  }),
  removeChannel: () => {}
};
