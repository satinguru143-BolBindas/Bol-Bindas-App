import React from "react";
import { Sparkles } from "lucide-react";
import { DiscoverPanel, ChatPanel, WalletPanel } from "./Components"; 
import { CallsPanel } from "./CallsPanel"; 
import { MembershipPanel } from "./MembershipPanel"; 

export function MaleApp({ session, supabase, profile, wallet, loadWallet, rechargeAmount, setRechargeAmount, handleRecharge, busy, categories, plans, people, selectedCategory, setSelectedCategory, filteredPeople, selectedUser, setSelectedUser, messages, draft, setDraft, sendMessage, setTab, tab }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '240px', background: '#13171c', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', borderRight: '1px solid #222a35' }}>
        <h3 style={{ color: '#2ec4b6', marginBottom: '20px' }}><Sparkles size={18}/> BolBindas</h3>
        <button onClick={() => setTab("discover")} style={{ padding: '12px', background: tab === "discover" ? '#2ec4b6' : 'transparent', color: tab === "discover" ? '#000' : '#fff', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>Discover</button>
        <button onClick={() => setTab("chat")} style={{ padding: '12px', background: tab === "chat" ? '#2ec4b6' : 'transparent', color: tab === "chat" ? '#000' : '#fff', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>Chat</button>
        <button onClick={() => setTab("calls")} style={{ padding: '12px', background: tab === "calls" ? '#2ec4b6' : 'transparent', color: tab === "calls" ? '#000' : '#fff', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>Calls</button>
        <button onClick={() => setTab("wallet")} style={{ padding: '12px', background: tab === "wallet" ? '#2ec4b6' : 'transparent', color: tab === "wallet" ? '#000' : '#fff', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>Wallet</button>
        <button onClick={() => setTab("membership")} style={{ padding: '12px', background: tab === "membership" ? '#2ec4b6' : 'transparent', color: tab === "membership" ? '#000' : '#fff', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>👑 VIP Plans</button>
        <button onClick={() => supabase.auth.signOut()} style={{ padding: '12px', background: '#ff4d4d22', color: '#ff4d4d', border: 'none', borderRadius: '6px', textAlign: 'left', marginTop: 'auto', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
      </div>
      <div style={{ flex: 1, padding: '30px' }}>
        {tab === "discover" && <DiscoverPanel categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} filteredPeople={filteredPeople} setSelectedUser={setSelectedUser} setTab={setTab} />}
        {tab === "chat" && <ChatPanel selectedUser={selectedUser} messages={messages} session={session} draft={draft} setDraft={setDraft} sendMessage={sendMessage} selectedCategory={selectedCategory} />}
        {tab === "calls" && <CallsPanel session={session} currentUserName={profile?.full_name || profile?.username || session.user.email} />}
        {tab === "wallet" && <WalletPanel wallet={wallet} rechargeAmount={rechargeAmount} setRechargeAmount={setRechargeAmount} handleRecharge={handleRecharge} busy={busy} />}
        {tab === "membership" && <MembershipPanel wallet={wallet} loadWallet={loadWallet} plans={plans} supabase={supabase} session={session} />}
      </div>
    </div>
  );
}
