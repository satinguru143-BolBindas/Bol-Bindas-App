import React, { useState } from "react";
import { Shield, LogOut, Eye, Volume2 } from "lucide-react";
import { AdminPanel } from "./AdminPanel";
import { CallsPanel } from "./CallsPanel";

export function AdminApp({ session, supabase, wallet }) {
  const [adminTab, setAdminTab] = useState("dashboard");
  const [stats] = useState({ totalUsers: 142, maleUsers: 98, femaleUsers: 44, dailyCalls: 35 });
  
  const [liveCalls] = useState([
    { id: 1, male: "Aryan", female: "Kavya", duration: "4m 12s", status: "Active" },
    { id: 2, male: "Rahul", female: "Nilima", duration: "1m 45s", status: "Active" }
  ]);
  const [selectedSpyChat, setSelectedSpyChat] = useState(null);
  const [spyMessages] = useState([
    { id: 1, sender: "Aryan", body: "Hello, कशी आहेस?" },
    { id: 2, sender: "Kavya", body: "मजेत! सांग, काय सेवा करू?" }
  ]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0c0f12', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ width: '250px', background: '#13171c', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', borderRight: '1px solid #222a35' }}>
        <h3 style={{ color: '#2ec4b6', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={20} /> CEO CONTROL</h3>
        <div style={{ background: '#1b232c', padding: '12px', borderRadius: '8px', border: '1px solid #2ec4b633', marginBottom: '15px' }}>
          <span style={{ fontSize: '11px', color: '#8892b0', fontWeight: 'bold' }}>💰 REVENUE BALANCE</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#2ec4b6', fontSize: '20px' }}>₹{Number(wallet / 100).toFixed(2)}</h3>
        </div>
        <button onClick={() => setAdminTab("dashboard")} style={{ padding: '12px', background: adminTab === "dashboard" ? '#2ec4b6' : 'transparent', color: adminTab === "dashboard" ? '#000' : '#fff', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>📊 CEO Dashboard</button>
        <button onClick={() => setAdminTab("spy_center")} style={{ padding: '12px', background: adminTab === "spy_center" ? '#2ec4b6' : 'transparent', color: adminTab === "spy_center" ? '#000' : '#ff4d4d', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>👁️ Live Call & Chat Spy</button>
        <button onClick={() => setAdminTab("free_call")} style={{ padding: '12px', background: adminTab === "free_call" ? '#2ec4b6' : 'transparent', color: adminTab === "free_call" ? '#000' : '#fff', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>📞 Master Direct Call / Msg</button>
        <button onClick={() => supabase.auth.signOut()} style={{ padding: '12px', background: '#ff4d4d22', color: '#ff4d4d', border: 'none', borderRadius: '6px', textAlign: 'left', marginTop: 'auto', fontWeight: 'bold', cursor: 'pointer' }}><LogOut size={14} style={{ marginRight: '5px' }}/> Logout</button>
      </div>

      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {adminTab === "dashboard" && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '30px' }}>
              <div style={{ background: '#13171c', padding: '15px', borderRadius: '10px', border: '1px solid #222a35' }}><span style={{ fontSize: '12px', color: '#8892b0' }}>Total Users</span><h2 style={{ margin: '5px 0 0 0', color: '#2ec4b6' }}>{stats.totalUsers}</h2></div>
              <div style={{ background: '#13171c', padding: '15px', borderRadius: '10px', border: '1px solid #222a35' }}><span style={{ fontSize: '12px', color: '#8892b0' }}>👨 Male Accounts</span><h2 style={{ margin: '5px 0 0 0' }}>{stats.maleUsers}</h2></div>
              <div style={{ background: '#13171c', padding: '15px', borderRadius: '10px', border: '1px solid #222a35' }}><span style={{ fontSize: '12px', color: '#8892b0' }}>👩 Female Hosts</span><h2 style={{ margin: '5px 0 0 0', color: '#ff4d4d' }}>{stats.femaleUsers}</h2></div>
              <div style={{ background: '#13171c', padding: '15px', borderRadius: '10px', border: '1px solid #222a35' }}><span style={{ fontSize: '12px', color: '#8892b0' }}>📞 Today's Calls</span><h2 style={{ margin: '5px 0 0 0', color: '#fdcb6e' }}>{stats.dailyCalls}</h2></div>
            </div>
            <AdminPanel supabase={supabase} />
          </div>
        )}

        {adminTab === "spy_center" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ff4d4d11', border: '1px dashed #ff4d4d44', padding: '12px', borderRadius: '8px', color: '#ff4d4d', fontSize: '13px', fontWeight: 'bold' }}>
              🚨 LIVE SPY INTELLIGENCE: इथून तुम्ही ॲपमधील चालू व्हिडिओ कॉल्स थेट पाहू शकता, ऑडिओ ऐकू शकता आणि खाजगी चॅट्स वाचू शकता.
            </div>
            <div style={{ background: '#13171c', padding: '20px', borderRadius: '12px', border: '1px solid #222a35' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#2ec4b6' }}>📞 Current Running Calls Room List</h4>
              <table style={{ width: '100%', fontSize: '13px', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#8892b0', borderBottom: '1px solid #333' }}><th style={{ padding: '8px' }}>User (Male)</th><th style={{ padding: '8px' }}>Host (Female)</th><th style={{ padding: '8px' }}>Duration</th><th style={{ padding: '8px' }}>Spy Actions</th></tr>
                </thead>
                <tbody>
                  {liveCalls.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #1b232c' }}>
                      <td style={{ padding: '8px' }}>👨 {c.male}</td>
                      <td style={{ padding: '8px', color: '#ff4d4d' }}>👩 {c.female}</td>
                      <td style={{ padding: '8px', color: '#fdcb6e' }}>{c.duration}</td>
                      <td style={{ padding: '8px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => alert(`🎥 Live Stream Screen Joined! Connecting to ${c.female}'s Camera...`)} style={{ background: '#ff4d4d', color: '#000', border: 'none', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}><Eye size={12}/> View Screen</button>
                        <button onClick={() => alert(`🔊 Audio Frequency Wiretapped! Listening to ${c.male} & ${c.female}...`)} style={{ background: '#1b232c', color: '#fff', border: '1px solid #333', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}><Volume2 size={12}/> Listen Audio</button>
                        <button onClick={() => setSelectedSpyChat(c)} style={{ background: '#2ec4b6', color: '#000', border: 'none', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>Read Chat</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedSpyChat && (
              <div style={{ background: '#13171c', padding: '20px', borderRadius: '12px', border: '1px solid #222a35' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#2ec4b6' }}>💬 Chat Spy Log: {selectedSpyChat.male} ↔️ {selectedSpyChat.female}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#0c0f12', padding: '15px', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                  {spyMessages.map(m => (
                    <div key={m.id} style={{ fontSize: '13px' }}><b style={{ color: m.sender === "Kavya" ? "#ff4d4d" : "#2ec4b6" }}>{m.sender}:</b> <span style={{ color: '#fff' }}>{m.body}</span></div>
                  ))}
                </div>
                <button onClick={() => setSelectedSpyChat(null)} style={{ marginTop: '10px', background: '#ff4d4d', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Close Spy Log</button>
              </div>
            )}
          </div>
        )}

        {adminTab === "free_call" && (
          <div>
            <div style={{ background: '#2ec4b611', border: '1px solid #2ec4b633', padding: '10px 15px', borderRadius: '8px', marginBottom: '20px', color: '#2ec4b6', fontSize: '13px', fontWeight: 'bold' }}>
              🔒 CEO DIRECT OVERRIDE: तुम्ही इथून थेट रूम आयडी टाकून कोणत्याही ऑनलाईन युझर किंवा महिला होस्टला थेट विनामूल्य कॉल लावू शकता.
            </div>
            <CallsPanel session={session} currentUserName="MASTER OWNER (CEO)" />
          </div>
        )}
      </div>
    </div>
  );
}
