import React, { useState, useEffect } from "react";
import { Shield, Palette, Users, BarChart3, Landmark } from "lucide-react";

export function AdminPanel({ supabase }) {
  const [appName, setAppName] = useState("बोलबिंदास (BolBindas)");
  const [primaryColor, setPrimaryColor] = useState("#2ec4b6");
  const [backgroundColor, setBackgroundColor] = useState("#0c0f12");
  const [ownerTotalRevenue, setOwnerTotalRevenue] = useState(14520.50);
  const [hosts, setHosts] = useState([]);

  const revenueSheet = [
    { id: 1, date: "2026-11-09", host: "Kavya", calls: 12, userPaid: 600, hostCommission: 330, ownerNetProfit: 270 },
    { id: 2, date: "2026-11-09", host: "Nilima", calls: 8, userPaid: 400, hostCommission: 200, ownerNetProfit: 200 }
  ];

  useEffect(() => {
    if (!supabase) return;
    supabase.from("profiles")
      .select("id, full_name, username, is_online, bank_name, account_number, ifsc_code, upi_id")
      .eq("gender", "female").limit(5)
      .then(({ data }) => {
        if (data) setHosts(data.map(h => ({ ...h, rank: "Iron Level", commission_percent: 55 })));
      });
  }, [supabase]);

  function handleUpdateHostCommission(id, newPercent) {
    setHosts(hosts.map(h => h.id === id ? { ...h, commission_percent: Number(newPercent) } : h));
    alert(`⚙️ होस्टचे कमिशन ${newPercent}% वर सेट झाले!`);
  }

  return (
    <div style={{ maxWidth: "950px", margin: "0 auto", padding: "15px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #2ec4b6", paddingBottom: "10px", marginBottom: "20px" }}>
        <div><h3><Shield size={22} color="#2ec4b6" /> 👔 OWNER & CEO Control Center</h3><span style={{ fontSize: "11px", color: "#8892b0" }}>ॲडमिनसाठी सर्व कॉल्स आणि मेसेजेस १००% मोफत आहेत.</span></div>
        <button onClick={() => alert("📧 रिपोर्ट satinguru143@gmail.com वर पाठवला!")} style={{ background: "#2ec4b622", color: "#2ec4b6", border: "1px solid #2ec4b6", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Get Email Report</button>
      </div>

      <div style={{ background: "#13171c", padding: "15px", borderRadius: "12px", border: "1px solid #2ec4b644", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><span style={{ fontSize: "12px", color: "#8892b0", fontWeight: "bold" }}>🏢 OWNER NET REVENUE BALANCE</span><h2 style={{ margin: "5px 0 0 0", color: "#2ec4b6" }}>₹{ownerTotalRevenue.toLocaleString('en-IN')}</h2></div>
        <div style={{ background: "#1b232c", padding: "10px", borderRadius: "8px", fontSize: "12px" }}><span><Landmark size={12}/> SBI: XXXXXX1234</span><button onClick={() => { alert("💸 ₹" + ownerTotalRevenue + " बँकेत क्रेडिट झाले!"); setOwnerTotalRevenue(0); }} style={{ marginTop: "5px", width: "100%", padding: "4px", background: "#2ec4b6", color: "#000", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "10px" }}>Credit directly to Bank</button></div>
      </div>

      <div style={{ background: "#13171c", padding: "20px", borderRadius: "12px", border: "1px solid #222a35", marginBottom: "20px" }}>
        <h4 style={{ color: "#2ec4b6", margin: "0 0 15px 0", display: "flex", alignItems: "center", gap: "8px" }}><Users size={18}/> Female Host Management & Settlement Audit Sheet</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2d3846", color: "#8892b0" }}>
              <th style={{ padding: "8px" }}>होस्ट नाव</th><th style={{ padding: "8px" }}>बँक खाते तपशील</th><th style={{ padding: "8px" }}>UPI आयडी</th><th style={{ padding: "8px" }}>कमिशन (%)</th><th style={{ padding: "8px" }}>ॲक्शन</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map(h => (
              <tr key={h.id} style={{ borderBottom: "1px solid #1b232c" }}>
                <td style={{ padding: "8px", fontWeight: "bold", color: "#fff" }}>{h.full_name || h.username} <br/><span style={{ fontSize: "10px", color: h.is_online ? "#2ec4b6" : "#8892b0" }}>{h.is_online ? "● Online" : "Offline"}</span></td>
                <td style={{ padding: "8px", color: "#fff", lineHeight: "1.4" }}>{h.account_number ? (<>🏦 <b>{h.bank_name}</b> <br/>A/C: <span style={{ color: "#fdcb6e" }}>{h.account_number}</span> <br/>IFSC: <span style={{ color: "#8892b0" }}>{h.ifsc_code}</span></>) : <span style={{ color: "#666" }}>बँक डिटेल्स भरलेली नाही</span>}</td>
                <td style={{ padding: "8px", color: "#2ec4b6", fontWeight: "bold" }}>{h.upi_id ? `📱 ${h.upi_id}` : <span style={{ color: "#666", fontWeight: "normal" }}>नॉट सेट</span>}</td>
                <td style={{ padding: "8px" }}><input type="number" value={h.commission_percent} onChange={(e) => handleUpdateHostCommission(h.id, e.target.value)} style={{ width: "42px", background: "#1b232c", color: "#fff", border: "1px solid #333", textAlign: "center" }} /> %</td>
                <td style={{ padding: "8px" }}><button type="button" onClick={() => alert(`💸 ${h.full_name || h.username} ला पेमेंट पाठवण्याची ऑर्डर यशस्वी झाली!`)} style={{ background: "#2ec4b6", color: "#000", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Pay Now</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        <div style={{ background: "#13171c", padding: "15px", borderRadius: "12px", border: "1px solid #222a35" }}>
          <h4 style={{ color: "#2ec4b6", margin: "0 0 10px 0" }}><Palette size={16}/> Global UI Design & Brand controls</h4>
          <label style={{ fontSize: "12px", color: "#8892b0" }}>ॲपचे नाव बदला:</label>
          <input type="text" value={appName} onChange={e => setAppName(e.target.value)} style={{ width: "90%", padding: "6px", background: "#1b232c", color: "#fff", border: "1px solid #333", marginTop: "5px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}><span>थीम कलर: <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} /></span><span>बॅकग्राउंड: <input type="color" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} /></span></div>
          <button onClick={() => { document.title = appName; alert("डिझाईन लाईव्ह झाले!"); }} style={{ marginTop: "10px", width: "100%", padding: "8px", background: "#ff4d4d", border: "none", fontWeight: "bold", cursor: "pointer" }}>बदल जतन करा</button>
        </div>

        <div style={{ background: "#13171c", padding: "15px", borderRadius: "12px", border: "1px solid #222a35" }}>
          <h4 style={{ color: "#2ec4b6", margin: "0 0 10px 0" }}><BarChart3 size={16}/> Live Traffic & Net Profit Sheet</h4>
          <table style={{ width: "100%", fontSize: "11px", textAlign: "left" }}>
            <thead><tr style={{ color: "#8892b0", borderBottom: "1px solid #333" }}><th>तारीख</th><th>होस्ट</th><th>पेड</th><th style={{ color: "#2ec4b6" }}>तुमचा नफा</th></tr></thead>
            <tbody>{revenueSheet.map(r => <tr key={r.id} style={{ borderBottom: "1px solid #1b232c" }}><td style={{ padding: "4px 0" }}>{r.date}</td><td><b>{r.host}</b></td><td>₹{r.userPaid}</td><td style={{ color: "#2ec4b6" }}><b>₹{r.ownerNetProfit}</b></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
