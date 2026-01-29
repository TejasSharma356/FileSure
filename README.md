# VyaparMitr
### Smart Compliance & Return Preparation App for MSMEs

FileSure is a mobile application designed to help small business owners (MSMEs), freelancers, and local businesses understand, prepare, and manage their tax and compliance obligations in a simple, guided way.

The app focuses on **clarity, guidance, and preparation** — not direct government filing. It helps users know what applies to them, organize their data, and prepare returns with reduced confusion and fewer mistakes.

---

## 🚀 Project Overview

Small businesses often struggle with:
- Understanding which compliances apply to them
- Complex government tax forms
- Manual and repetitive data entry
- Missing deadlines
- Fear of penalties due to mistakes

FileSure simplifies this by providing:
- Personalized compliance guidance
- Step‑by‑step preparation flows
- Simplified return forms
- Deadline tracking
- Context‑aware in‑app assistance

---

## 🎯 Target Users

- Small business owners (MSMEs)
- Freelancers
- Retail & service businesses
- First‑time entrepreneurs
- Users with low tax & compliance knowledge

---

## 🧠 Key Features

- **Business Onboarding & Profiling**  
  Understands the user’s business type, turnover, and GST status.

- **Personalized Compliance Checklist**  
  Shows exactly which compliances and filings apply.

- **Simplified Return Filing**  
  Converts complex government forms into easy step‑by‑step questions.

- **Revenue Input (Manual / Upload)**  
  Collects revenue data once for reuse across flows.

- **Auto Pre‑Fill (Mock Automation)**  
  Reduces repetitive data entry and errors.

- **Deadline Tracking & Risk Alerts**  
  Helps users avoid late filings and penalties.

- **Context‑Aware Chatbot Guidance**  
  Step‑by‑step assistance based on current screen and business context.

- **Draft Saving & Progress Tracking**  
  Users can save and resume later.

- **MSME‑Friendly UX**  
  Simple language, mobile‑first design, low learning curve.

---

## 🏗 Tech Stack

**Frontend:**
- React Native (Expo)
- JavaScript (NO TypeScript)

**Architecture:**
- Frontend‑only (no backend for now)
- Mock APIs and mock data
- Backend‑ready structure for future integration

---

## 📁 Project Structure

/screens  
/components  
/navigation  
/services  
/context  
/utils  
/constants  
/mockData  

**Important Rule:**  
All data flows through a centralized `apiService.js` using mock async functions.  
No hardcoded business logic inside screens.

---

## 🤖 Chatbot & Guidance (Concept)

FileSure includes a contextual guidance assistant that:
- Knows the user’s current step
- Understands business profile
- Provides step‑by‑step explanations
- Uses structured, source‑backed guidance (mocked)

This is designed to later integrate with a backend + LLM system.

---

## 🔒 What This App Is NOT

- Not a replacement for government portals  
- Not a direct tax filing system  
- Not a legal or CA replacement  

FileSure is a **preparation, guidance, and confidence‑building tool.**

---

## 🛠 Setup & Run (Frontend)

```
npm install
npx expo start
```

## 🔮 Future Roadmap

- Backend integration (Node.js + DB)
- Live government data updates
- LLM‑powered guidance assistant
- Multi‑language support
- CA / accountant collaboration features
- npm install
- npx expo start

## 📌 Project Goal

To build a realistic, professional compliance‑assistance product that:
- Reduces confusion for MSMEs
- Prevents missed deadlines
- Improves compliance confidence
- Prepares users for accurate filing

👨‍💻 Maintainer
Tejas Sharma
GitHub: https://github.com/TejasSharma356

FileSure helps small businesses understand, prepare, and stay compliant — without fear, confusion, or mistakes.

Built with ❤️
Team VyaparMitr


