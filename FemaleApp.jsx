import React from "react";
import { HostDashboard } from "./HostDashboard";

export function FemaleApp({ session, supabase }) {
  return (
    <div style={{ position: 'relative', padding: '10px' }}>
      <button onClick={() => supabase.auth.signOut()} style={{ position: 'absolute', top: '15px', right: '15px', padding: '6px 12px', background: '#ff4d4d22', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', zIndex: 10 }}>Log Out</button>
      <HostDashboard session={session} supabase={supabase} />
    </div>
  );
}
