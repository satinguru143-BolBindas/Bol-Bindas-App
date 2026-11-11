import React, { useState, useEffect } from "react";
import { Headphones, History, Zap, Landmark, CheckCircle } from "lucide-react";

export function HostDashboard({ session, supabase }) {
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(0); 
  const [wallet, setWallet] = useState(0); 
  const [callDuration, setCallDuration] = useState("0m 0s");
  const [inCall, setInCall] = useState(false);
  const [secs, setSecs] = useState(0);
  const rate = 11; 

  const [bankName, setBankName] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!session || !supabase) return;
    supabase.from("wallets").select("balance_paise").eq("user_id", session.user.id).maybeSingle().then(({ data }) => { if (data) setWallet(data.balance_paise / 100); });
    supabase.from("profiles").select("bank_name, account_number, ifsc_code, upi_id").eq("id", session.user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setBankName(data.bank_name || ""); setAccNumber(data.account_number || ""); setIfsc(data.ifsc_code || ""); setUpiId(data.upi_id || "");
        if (data.account_number || data.upi_id) setIsSaved(true);
      }
    });
  }, [session]);

  async function saveBankDetails(e) {
    e.preventDefault();
    const { error } = await supabase.from("profiles").update({ bank_name: bankName, account_number: accNumber, ifsc_code: ifsc, upi_id: upiId, updated_at: new Date().toISOString() }).eq("id", session.user.id);
    if (error) alert(error.message); else { setIsSaved(true); alert("🎉 तुमची बँक खाते/UPI माहिती सुरक्षित जतन झाली आहे!"); }
  }

  useEffect(() => {
    let timer = null;
    if (inCall) {
      timer = setInterval(() => {
        setSecs((p) => {
          const next = p + 1;
          setCallDuration(`${Math.floor(next / 60)}m ${next % 60}s`);
          if (next > 0 && next % 60 === 0) {
            setEarnings((e) => e + rate); setWallet((w) => w + rate);
            supabase.rpc("increment_wallet_balance", { user_id: session.user.id, amount_paise: rate * 100 });
          }
          return next;
        });
      }, 1000);
    } else { clearInterval(timer); }
    return () => clearInterval(timer);
  }, [inCall]);

  return (
    <div style={{ background: '#0c0f12', color: '#fff', minHeight: '90vh', padding: '15px', fontFamily: 'sans-serif', maxWidth: '420px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px' }}><Headphones size={20} color="#2ec4b6" /><History size={20} color="#8892b0" /></div>
        <div style={{ background: '#13171c', padding: '6px 14px', borderRadius: '20px', border: '1px solid #222a35' }}><b>💵 Wallet:</b> ₹{wallet.toFixed(2)}</div>
      </div>
      {inCall && <div style={{ background: '#ff4d4d22', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '8px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>🚨 LIVE CALL CONNECTED</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#13171c', padding: '15px', borderRadius: '12px', border: '1px solid #222a35' }}><span style={{ fontSize: '12px', color: '#8892b0' }}>Today's Earnings</span><h2 style={{ margin: '5px 0 0 0', color: '#2ec4b6' }}>₹{earnings}</h2></div>
        <div style={{ background: '#13171c', padding: '15px', borderRadius: '12px', border: '1px solid #222a35' }}><span style={{ fontSize: '12px', color: '#8892b0' }}>Duration</span><h2 style={{ margin: '5px 0 0 0' }}>{callDuration}</h2></div>
      </div>
      <div style={{ background: '#13171c', padding: '15px', borderRadius: '12px', border: '1px solid #222a35', marginBottom: '20px' }}>
        <h4 style={{ color: '#2ec4b6', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><Landmark size={16}/> Withdrawal & Bank Settings</h4>
        {isSaved && <p style={{ fontSize: '11px', color: '#2ec4b6', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}><CheckCircle size={12}/> तुमची माहिती ॲडमिनकडे सुरक्षित लिंक झाली आहे.</p>}
        <form onSubmit={saveBankDetails} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input type="text" placeholder="बँकेचे नाव" value={bankName} onChange={e => { setBankName(e.target.value); setIsSaved(false); }} style={{ padding: '8px', background: '#1b232c', color: '#fff', border: '1px solid #333', fontSize: '12px', borderRadius: '4px' }} />
          <input type="text" placeholder="बँक खाते क्रमांक" value={accNumber} onChange={e => { setAccNumber(e.target.value); setIsSaved(false); }} style={{ padding: '8px', background: '#1b232c', color: '#fff', border: '1px solid #333', fontSize: '12px', borderRadius: '4px' }} />
          <input type="text" placeholder="IFSC कोड" value={ifsc} onChange={e => { setIfsc(e.target.value); setIsSaved(false); }} style={{ padding: '8px', background: '#1b232c', color: '#fff', border: '1px solid #333', fontSize: '12px', borderRadius: '4px' }} />
          <input type="text" placeholder="UPI आयडी" value={upiId} onChange={e => { setUpiId(e.target.value); setIsSaved(false); }} style={{ padding: '8px', background: '#1b232c', color: '#fff', border: '1px solid #333', fontSize: '12px', borderRadius: '4px' }} />
          <button type="submit" style={{ padding: '8px', background: '#2ec4b6', color: '#000', border: 'none', fontWeight: 'bold', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', marginTop: '5px' }}>माहिती जतन करा</button>
        </form>
      </div>
      <div style={{ background: '#1b232c', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
        <button type="button" onClick={() => { if (!isOnline) return alert("आधी Online जा!"); setInCall(!inCall); setSecs(0); }} style={{ padding: '6px 12px', background: inCall ? '#ff4d4d' : '#2ec4b6', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>{inCall ? "Stop Call" : "Simulate Call"}</button>
      </div>
      <button type="button" onClick={() => setIsOnline(!isOnline)} style={{ width: '100%', padding: '14px', background: isOnline ? '#ff4d4d' : '#2ec4b6', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <Zap size={18} fill="#000" /> {isOnline ? "Go Offline" : "Go Online"}
      </button>
    </div>
  );
}
