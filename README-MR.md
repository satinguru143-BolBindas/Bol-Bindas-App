# VibeConnect Starter — Windows 10

हा पहिला MVP starter आहे: Signup/Login, member discovery, basic one-to-one text chat, wallet balance display, Razorpay test checkout, membership plans आणि payment verification backend.

**हा production-ready पूर्ण dating/chat platform नाही.** Voice/video calls, moderation/admin tools, profile photo uploads, wallet spending, refunds, webhook reconciliation आणि production hardening पुढील टप्प्यांत करायचे आहेत. वास्तविक पैसे स्वीकारण्यापूर्वी कायदेशीर अटी, Privacy Policy, Terms, Refund Policy, 18+ age checks, abuse reporting आणि Razorpay/Supabase configuration पूर्ण करा.

## 1. Windows वर आवश्यक गोष्टी

1. Node.js LTS install करा: https://nodejs.org/
2. VS Code install करा: https://code.visualstudio.com/
3. Supabase खाते/project तयार करा: https://supabase.com/
4. Razorpay खाते तयार करा आणि आधी फक्त Test Mode वापरा: https://razorpay.com/

## 2. Frontend सुरू करा

1. हा ZIP extract करा. Folder `vibeconnect-starter` उघडा.
2. त्या folder मध्ये `.env.example` ची copy करून तिचे नाव `.env` ठेवा.
3. Supabase Project Settings → API मधील Project URL आणि anon/public key `.env` मध्ये भरा.
4. VS Code मध्ये Terminal → New Terminal उघडा.
5. खालील commands चालवा:

```powershell
npm install
npm run dev
```

6. Terminal मध्ये दाखवलेला local URL browser मध्ये उघडा (साधारण `http://localhost:5173`).

## 3. Supabase Database तयार करा

1. Supabase Dashboard → SQL Editor → New query उघडा.
2. `supabase/schema.sql` मधील संपूर्ण SQL paste करून Run करा.
3. Authentication → Providers मध्ये Email provider सुरू ठेवा.
4. सुरुवातीला email confirmation सुरू असल्यास signup नंतर email confirm करा.

## 4. Razorpay test payment server

1. दुसऱ्या Terminal मध्ये:

```powershell
cd server
npm install
```

2. `server/.env.example` ची copy करून `server/.env` तयार करा.
3. त्यात Supabase URL, **service_role key**, Razorpay Test Key ID आणि Test Secret भरा.
4. Server सुरू करा:

```powershell
npm run dev
```

API `http://localhost:4242` वर सुरू होईल.

**गुपित keys सुरक्षित ठेवा:** `SUPABASE_SERVICE_ROLE_KEY` आणि `RAZORPAY_KEY_SECRET` कधीही `VITE_` नावाच्या frontend env मध्ये, React code मध्ये, GitHub मध्ये किंवा कोणालाही पाठवू नका. `.env` files सार्वजनिक करू नका.

## 5. पहिली चाचणी

- दोन वेगवेगळ्या email accounts ने दोन browser/incognito sessions मध्ये signup करा.
- एकमेकांना Discover मध्ये पाहून text message पाठवा.
- Razorpay Test Mode configure झाल्यावरच test payment करा.
- Test payment आधी frontend आणि server दोन्ही सुरू असावेत.

## सुरक्षा आणि पुढील टप्पे

- वय 18+ असल्याची योग्य पडताळणी, Terms, Privacy, Consent आणि Report/Block workflows प्रत्यक्ष वापरापूर्वी जोडा.
- सध्या profile discovery सर्व signed-in users साठी आहे; moderation आणि visibility controls अजून जोडलेले नाहीत.
- सध्या wallet recharge उपलब्ध आहे; wallet मधून पैसे खर्च/withdraw करण्याची सोय नाही.
- Razorpay payment handler मध्ये signature व order checks आहेत; production मध्ये webhooks, reconciliation, rate limiting, idempotency, refund handling आणि monitoring देखील आवश्यक.
- Calls अजून जोडलेले नाहीत. पुढील टप्प्यात Supabase Realtime signaling + WebRTC, call accept/reject, permissions आणि TURN server जोडू.
- सर्व real-money features launch करण्यापूर्वी security review आणि कायदेशीर तपासणी करा.
