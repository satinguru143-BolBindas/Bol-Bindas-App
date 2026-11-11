import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
import { MaleApp } from "./MaleApp";   
import { FemaleApp } from "./FemaleApp"; 
import { AdminApp } from "./AdminApp"; 

const categories = [
  { id: "all", name: "🌐 All / Random" }, { id: "yoga", name: "🧘 Yoga (योग)" },
  { id: "storytelling", name: "📚 Storytelling" }, { id: "consultant", name: "💼 Consultant" },
  { id: "casual", name: "💬 Casual Talk" }, { id: "adult", name: "🎭 Entertainment" }
];

const plans = [
  { name: "Monthly", price: 199, duration: "30 Days", description: "Explore VIP" },
  { name: "Quarterly", price: 499, duration: "90 Days", description: "Longer Connection", featured: true },
  { name: "Yearly", price: 1499, duration: "365 Days", description: "Best Value" }
];

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("discover");
  const [loading, setLoading] = useState(true);
  
  const [usePhone, setUsePhone] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("female"); 
  const [isSignup, setIsSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const [people, setPeople] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [wallet, setWallet] = useState(0);
  const [rechargeAmount, setRechargeAmount] = useState("100");

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => { 
      if (!s) { setSession(null); setProfile(null); setTab("discover"); }
    });
    return () => { if(listener?.subscription) listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!session || !supabase) return;
    supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle().then(({ data }) => {
      setProfile(data);
      if (session.user.email === "satinguru143@gmail.com") setTab("admin_root");
      else if (data?.gender === "female") setTab("host"); 
      else setTab("discover");
    });
    supabase.from("profiles").select("id, username, full_name, bio").neq("id", session.user.id).limit(50).then(({ data }) => setPeople(data || []));
    loadWallet();
  }, [session]);

  async function loadWallet() {
    if (!session || !supabase) return;
    supabase.from("wallets").select("balance_paise").eq("user_id", session.user.id).maybeSingle().then(({ data }) => { if (data) setWallet(data.balance_paise); });
  }

  async function authSubmit(e) {
    e.preventDefault(); setBusy(true); setNotice("");
    try {
      if (!supabase) throw new Error("Supabase missing");
      if (usePhone) {
        if (!otpSent) {
          const { error } = await supabase.auth.signInWithOtp({ phone: phone.trim() });
          if (error) throw error; setOtpSent(true); setNotice("OTP Sent!");
        } else {
          const { error } = await supabase.auth.verifyOtp({ phone: phone.trim(), token: otp.trim(), type: 'sms' });
          if (error) throw error;
        }
      } else {
        if (isSignup) {
          const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, gender } } });
          if (error) throw error; setNotice("Registered! Please Log In."); setIsSignup(false);
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
        }
      }
    } catch (err) { setNotice(err.message); } finally { setBusy(false); }
  }

  async function handleRecharge(e) {
    e.preventDefault(); const amt = parseFloat(rechargeAmount);
    if (isNaN(amt) || amt <= 0) return alert("योग्य रक्कम.");
    setBusy(true); const paise = amt * 100;
    const { error } = await supabase.from("wallets").upsert({ user_id: session.user.id, balance_paise: wallet + paise, updated_at: new Date().toISOString() });
    if (error) alert(error.message); else { alert(`₹${amt} रिचार्ज यशस्वी!`); loadWallet(); }
    setBusy(false);
  }

  const filteredPeople = useMemo(() => {
    if (selectedCategory === "all") return people;
    return people.filter(p => p.bio?.toLowerCase().includes(selectedCategory.toLowerCase()));
  }, [people, selectedCategory]);

  if (!supabase) return <div style={{ padding: '20px', color: 'red' }}><h3>आधी Supabase सेटअप करा.</h3></div>;
  if (loading) return <div style={{ background: '#0c0f12', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Connecting...</div>;

  const isMasterAdmin = session?.user?.email === "satinguru143@gmail.com";

  return (
    <div style={{ background: '#0c0f12', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {!session ? (
        <div style={{ maxWidth: "420px", margin: "60px auto", background: "#13171c", padding: "25px", borderRadius: "12px", border: "1px solid #222a35" }}>
          <h2 style={{ textAlign: "center", color: "#2ec4b6" }}>बोलबिंदास Log In</h2>
          <div style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
            <button type="button" onClick={() => setUsePhone(false)} style={{ flex: 1, padding: '8px', background: !usePhone ? '#2ec4b6' : 'transparent', color: !usePhone ? '#000' : '#fff', border: '1px solid #2ec4b6' }}>Email</button>
            <button type="button" onClick={() => setUsePhone(true)} style={{ flex: 1, padding: '8px', background: usePhone ? '#2ec4b6' : 'transparent', color: usePhone ? '#000' : '#fff', border: '1px solid #2ec4b6' }}>Mobile</button>
          </div>
          <form onSubmit={authSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {usePhone ? (
              <>
                <input type="tel" placeholder="Mobile" value={phone} onChange={e => setPhone(e.target.value)} style={{ padding: '10px', background: '#1b232c', color: '#fff', border: '1px solid #2d3846' }} required />
                {otpSent && <input type="text" placeholder="OTP" value={otp} onChange={e => setOtp(e.target.value)} style={{ padding: '10px', background: '#1b232c', color: '#fff', border: '1px solid #2d3846' }} required />}
              </>
            ) : (
              <>
                {isSignup && (
                  <>
                    <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} style={{ padding: '10px', background: '#1b232c', color: '#fff', border: '1px solid #2d3846' }} required />
                    <select value={gender} onChange={e => setGender(e.target.value)} style={{ padding: '10px', background: '#1b232c', color: '#fff', border: '1px solid #2d3846' }}>
                      <option value="female">🚨 Registration for Women (Female)</option>
                      <option value="male">👨 Registration for Men (Male)</option>
                    </select>
                  </>
                )}
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: "10px", background: "#1b232c", color: "#fff", border: "1px solid #2d3846" }} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: "10px", background: "#1b232c", color: "#fff", border: "1px solid #2d3846" }} required />
              </>
            )}
            <button type="submit" disabled={busy} style={{ padding: "12px", background: "#2ec4b6", color: "#000", fontWeight: "bold", border: "none" }}>{busy ? "थांबा..." : (usePhone ? (otpSent ? "Verify" : "Send OTP") : (isSignup ? "Sign Up" : "Log In"))}</button>
          </form>
          {!usePhone && <div style={{ textAlign: 'center', marginTop: '15px' }}><span onClick={() => setIsSignup(!isSignup)} style={{ color: '#2ec4b6', cursor: 'pointer', textDecoration: 'underline' }}>{isSignup ? "Log In instead" : "Create Account"}</span></div>}
          {notice && <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>{notice}</p>}
        </div>
      ) : (
        isMasterAdmin ? (
          <AdminApp session={session} supabase={supabase} wallet={wallet} />
        ) : profile?.gender === "female" ? (
          <FemaleApp session={session} supabase={supabase} />
        ) : (
          <MaleApp session={session} supabase={supabase} profile={profile} wallet={wallet} loadWallet={loadWallet} rechargeAmount={rechargeAmount} setRechargeAmount={setRechargeAmount} handleRecharge={handleRecharge} busy={busy} categories={categories} plans={plans} people={people} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} filteredPeople={filteredPeople} selectedUser={selectedUser} setSelectedUser={setSelectedUser} messages={messages} draft={draft} setDraft={setDraft} sendMessage={null} setTab={setTab} tab={tab} isAdmin={false} />
        )
      )}
    </div>
  );
}
