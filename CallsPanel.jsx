import React, { useRef, useState, useEffect } from "react";
import { Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { supabase } from "./supabase";

export function CallsPanel({ session, currentUserName }) {
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [channelName, setChannelName] = useState("BolBindasRoomHD");
  const localVideoRef = useRef(null);

  useEffect(() => {
    let timer = null;
    if (inCall && session) {
      if (session.user.email === "satinguru143@gmail.com") return;
      timer = setInterval(async () => {
        const { data: w } = await supabase.from("wallets").select("balance_paise").eq("user_id", session.user.id).maybeSingle();
        if (!w || w.balance_paise < 1200) {
          alert("🚨 बॅलन्स संपला!");
          endCall();
        } else {
          await supabase.from("wallets").update({ balance_paise: w.balance_paise - 1200 }).eq("user_id", session.user.id);
        }
      }, 60000);
    }
    return () => clearInterval(timer);
  }, [inCall, session]);

  async function startCall() {
    setInCall(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (err) {
      console.log(err);
    }
  }

  function endCall() {
    setInCall(false);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
      localVideoRef.current.srcObject = null;
    }
  }

  return (
    <div style={{ background: '#13171c', padding: '20px', borderRadius: '12px', border: '1px solid #222a35', maxWidth: '550px', margin: '0 auto' }}>
      <h4 style={{ color: '#2ec4b6', marginBottom: '15px' }}>🟢 Line: {currentUserName || "Live Line"}</h4>
      {!inCall ? (
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" value={channelName} onChange={e => setChannelName(e.target.value)} style={{ flex: 1, padding: '10px', background: '#1b232c', color: '#fff', border: '1px solid #2d3846' }} />
          <button onClick={startCall} style={{ padding: '10px 20px', background: '#2ec4b6', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Connect Call</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ background: '#000', borderRadius: '8px', height: '280px', overflow: 'hidden' }}>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => setMicOn(!micOn)} style={{ padding: '10px', background: '#2d3846', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer' }}>
              {micOn ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
            <button onClick={() => setVideoOn(!videoOn)} style={{ padding: '10px', background: '#2d3846', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer' }}>
              {videoOn ? <Camera size={16} /> : <CameraOff size={16} />}
            </button>
            <button onClick={endCall} style={{ padding: '10px 20px', background: '#ff4d4d', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
