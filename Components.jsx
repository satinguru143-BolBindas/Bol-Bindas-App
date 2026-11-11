import React from "react";
import { CircleUserRound, Send } from "lucide-react";
import { supabase } from "./supabase";

export function DiscoverPanel({ categories, selectedCategory, setSelectedCategory, filteredPeople, setSelectedUser, setTab }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {categories.map(c => (
          <button key={c.id} onClick={() => setSelectedCategory(c.id)} style={{ padding: '6px 12px', background: selectedCategory === c.id ? '#2ec4b6' : '#1b232c', color: selectedCategory === c.id ? '#000' : '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>{c.name}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {filteredPeople.map(p => (
          <div key={p.id} style={{ background: '#13171c', padding: '15px', borderRadius: '12px', border: '1px solid #222a35', textAlign: 'center' }}>
            <CircleUserRound size={36} style={{ margin: '0 auto 10px', color: '#8892b0' }} />
            <h4>{p.full_name || p.username || "User"}</h4>
            <button onClick={() => { setSelectedUser(p); setTab("chat"); }} style={{ width: '100%', marginTop: '10px', padding: '6px', background: '#2ec4b6', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Chat Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatPanel({ selectedUser, messages, session, draft, setDraft, loadMessages, selectedCategory }) {
  async function sendMessage(e) {
    e.preventDefault();
    if (!draft.trim() || !selectedUser || !session || !supabase) return;
    if (session.user.email === "satinguru143@gmail.com") {
      const { error } = await supabase.from("messages").insert({ sender_id: session.user.id, receiver_id: selectedUser.id, body: draft.trim() });
      if (!error) { setDraft(""); if (loadMessages) loadMessages(selectedUser.id); }
      return;
    }
    let rate = selectedCategory === "adult" ? 10 : 2;
    const paise = rate * 100;
    try {
      const { data: w } = await supabase.from("wallets").select("balance_paise").eq("user_id", session.user.id).maybeSingle();
      if (!w || w.balance_paise < paise) return alert(`❌ अपुरा बॅलन्स! प्रति मेसेज ₹${rate} शुल्क आहे.`);
      await supabase.from("wallets").update({ balance_paise: w.balance_paise - paise }).eq("user_id", session.user.id);
      await supabase.rpc("increment_wallet_balance", { user_id: selectedUser.id, amount_paise: paise });
      const { error } = await supabase.from("messages").insert({ sender_id: session.user.id, receiver_id: selectedUser.id, body: draft.trim() });
      if (!error) { setDraft(""); if (loadMessages) loadMessages(selectedUser.id); }
    } catch (err) { console.log(err); }
  }

  return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', background: '#13171c', borderRadius: '12px', border: '1px solid #222a35' }}>
      <div style={{ padding: '12px', borderBottom: '1px solid #222a35', color: '#2ec4b6', fontWeight: 'bold' }}>💬 Chatting with: {selectedUser?.full_name || selectedUser?.username}</div>
      <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ alignSelf: m.sender_id === session.user.id ? 'flex-end' : 'flex-start', background: m.sender_id === session.user.id ? '#2ec4b6' : '#2d3846', color: m.sender_id === session.user.id ? '#000' : '#fff', padding: '8px 12px', borderRadius: '8px', maxWidth: '70%', fontSize: '13px' }}>{m.body}</div>
        ))}
      </div>
      {selectedUser && (
        <form onSubmit={sendMessage} style={{ padding: '12px', borderTop: '1px solid #222a35', display: 'flex', gap: '8px' }}>
          <input type="text" placeholder="Type a message..." value={draft} onChange={e => setDraft(e.target.value)} style={{ flex: 1, padding: '10px', background: '#1b232c', border: '1px solid #2d3846', color: '#fff', borderRadius: '6px', fontSize: '13px' }} />
          <button type="submit" style={{ padding: '10px 15px', background: '#2ec4b6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Send size={14} /></button>
        </form>
      )}
    </div>
  );
}

export function WalletPanel({ wallet, rechargeAmount, setRechargeAmount, handleRecharge, busy }) {
  return (
    <div style={{ background: '#13171c', padding: '25px', borderRadius: '12px', border: '1px solid #222a35', maxWidth: '380px' }}>
      <h4>💰 Secure Wallet Balance</h4>
      <h2 style={{ color: '#2ec4b6', margin: '15px 0' }}>₹{Number(wallet / 100).toFixed(2)}</h2>
      <form onSubmit={handleRecharge} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input type="number" value={rechargeAmount} onChange={e => setRechargeAmount(e.target.value)} style={{ padding: '10px', background: '#1b232c', color: '#fff', border: '1px solid #2d3846', borderRadius: '6px' }} required />
        <button type="submit" disabled={busy} style={{ width: '100%', padding: '10px', background: '#2ec4b6', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Add Balance via UPI</button>
      </form>
    </div>
  );
}
