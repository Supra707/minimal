# FocusGate 🎯 - Minimalist Distraction-Free YouTube Playlist Player

![FocusGate Banner-1](https://github.com/user-attachments/assets/d450c039-a276-4eaa-a521-6e81ea7a9ccb)
![FocusGate Banner-2](https://github.com/user-attachments/assets/3d31c504-71ec-4036-bdfe-12b4a4900208)

## 🚀 Overview
FocusGate is a **distraction-free YouTube playlist web app** designed for students, professionals, and anyone who wants to **stay focused** while consuming educational content. Unlike traditional YouTube, which bombards users with recommendations, ads, and autoplay distractions, FocusGate provides a **clean and minimal** environment where you can concentrate solely on your study materials or work-related videos. Whether you're preparing for an exam, upskilling, or deep-diving into tutorials, FocusGate ensures a seamless, **uninterrupted** learning experience. 

With **Google Sign-In**, users can **save and sync their playlists** across devices, making study sessions more efficient. **Upcoming features**, such as **watch tracking** and **collaborative playlists**, will further enhance productivity, making FocusGate the ultimate tool for distraction-free learning.

## ✨ Features
- 🎯 **Minimalist UI** - No distractions, just your playlists.
- 🚫 **100% Ad-Free Experience** - Study without interruptions.
- 🔥 **Google Sign-In** - Quick and easy authentication.
- 📂 **Save & Sync Playlists** - Access your study materials anytime.
- 📊 **Tracking (Upcoming)** - Keep track of watched content.
- 🤝 **Collaborative Playlists (Future Plan)** - Share with friends.
- 📱 **PWA Support (Planned)** - Install it as an app for seamless use.
- ⚡ **Optimized Performance** - Built with Next.js 15 and Turbopack for blazing-fast load times.
- 🔍 **No Unnecessary Distractions** - No autoplay, no recommendations, no unrelated content—just what you need.

## 🛠 Tech Stack
- **Frontend:** Next.js 15 (App Router, Turbopack) for modern, efficient rendering.
- **Backend:** Firebase (Authentication, Firestore) for seamless user data storage and sync.
- **Styling:** Custom CSS (No external UI kits) to maintain a lightweight and clean design.
- **APIs:** YouTube API (Limited to study-focused content) for fetching playlist details while ensuring privacy-focused data handling.
- **Authentication:** Firebase OAuth for hassle-free sign-ins.
- **State Management:** React Hooks & Context API for efficient app state handling.
- **Progressive Web App (PWA) Support:** Future integration for app-like usability.

## 📜 Installation
### **1️⃣ Clone the repository**
```bash
  git clone https://github.com/Supra707/minimal.git
  cd minimal
```
### **2️⃣ Install dependencies**
```bash
  npm install
```
### **3️⃣ Set up environment variables**
Have to setup Firebase auth key inside the `firebaseConfig.js` inside the `app/lib/firebaseConfig.js`
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
