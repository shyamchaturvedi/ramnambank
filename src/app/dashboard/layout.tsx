import React from 'react';

// Force the entire dashboard subtree to be dynamic to prevent static generation errors
// when Supabase environment variables are missing during build.
export const dynamic = 'force-dynamic';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
