# FocusGate 🎯 - Minimalist Distraction-Free YouTube Playlist Player

![FocusGate Banner-1](https://github.com/user-attachments/assets/d450c039-a276-4eaa-a521-6e81ea7a9ccb)
![FocusGate Banner-2](https://github.com/user-attachments/assets/3d31c504-71ec-4036-bdfe-12b4a4900208)


## 🚀 Overview
FocusGate is a **distraction-free YouTube playlist web app** designed for students and professionals who want to **stay focused** while watching educational videos. Say goodbye to recommendations, ads, and unnecessary UI clutter—**just your videos, nothing else.**

## ✨ Features
- 🎯 **Minimalist UI** - No distractions, just your playlists.
- 🔥 **Google Sign-In** - Quick and easy authentication.
- 📂 **Save & Sync Playlists** - Access your study materials anytime.
- 📊 **Tracking (Upcoming)** - Keep track of watched content.
- 🤝 **Collaborative Playlists (Future Plan)** - Share with friends.
- 📱 **PWA Support (Planned)** - Install it as an app for seamless use.

## 🛠 Tech Stack
- **Frontend:** Next.js 15 (App Router, Turbopack)
- **Backend:** Firebase (Authentication, Firestore)
- **Styling:** Custom CSS (No external UI kits)
- **APIs:** YouTube API (Limited to study-focused content)

## 📜 Installation
### **1️⃣ Clone the repository**
```bash
  git clone https://github.com/yourusername/focusgate.git
  cd focusgate
```
### **2️⃣ Install dependencies**
```bash
  npm install
```
### **3️⃣ Set up environment variables**
Create a `.env.local` file and add your Firebase & YouTube API keys:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_key
```
### **4️⃣ Run the development server**
```bash
  npm run dev
```
Visit `http://localhost:3000` to use FocusGate locally.

## 🎬 Usage
1. **Sign in** with Google.
2. **Paste a YouTube playlist link.**
3. **Play distraction-free!**
4. **Save & manage** your study playlists.

## 🤝 Contributing
Contributions are welcome! If you have ideas or find a bug:
1. Fork the repo.
2. Create a new branch.
3. Commit your changes.
4. Submit a PR!

## 📜 License
MIT License. Free to use and modify.

---
🚀 **FocusGate - Your Study. Your Rules.**

