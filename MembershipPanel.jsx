import React, { useState } from "react";
import { Crown } from "lucide-react";

export function MembershipPanel({ wallet, loadWallet, plans, supabase, session }) {
  const [busy, setBusy] = useState(false);

  async function buyPlan(plan) {
    const paise = plan.price * 100;
    if (wallet < paise) return alert(`❌ अपुरा बॅलन्स! ₹${plan.price} आवश्यक.`);
    if (!window.confirm(`₹${plan.price} चा ${plan.name} प्लॅन खरेदी करायचा का?`)) return;

    setBusy(true);
    try {
      await supabase.from("wallets").upsert({ user_id: session.user.id, balance_paise: wallet - paise, updated_at: new Date().toISOString() });
      await supabase.from("profiles").upsert({ id: session.user.id, vip_status: true, vip_plan_name: plan.name, updated_at: new Date().toISOString() });
      alert(`🎉 ${plan.name} प्लॅन ॲक्टिव्हेट झाला!`);
      loadWallet();
    } catch (err) { alert(err.message); } finally { setBusy(false); }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h3><Crown size={22} color="#2ec4b6" /> Upgrade to VIP Membership</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {plans.map(p => (
          <div key={p.name} style={{ background: '#13171c', padding: '20px', borderRadius: '12px', border: p.featured ? '2px solid #2ec4b6' : '1px solid #222a35' }}>
            <h4>{p.name} Plan</h4>
            <h1 style={{ color: '#2ec4b6', margin: '10px 0' }}>₹{p.price}</h1>
            <p style={{ fontSize: '12px', color: '#8892b0', marginBottom: '15px' }}>{p.duration} • {p.description}</p>
            <button onClick={() => buyPlan(p)} disabled={busy} style={{ width: '100%', padding: '10px', background: '#2ec4b6', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Activate VIP</button>
          </div>
        ))}
      </div>
    </div>
  );
}
