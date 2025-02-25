"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "./lib/firebaseConfig"; // Ensure this is correctly set up
import GoogleLogin from "./components/googlelogin";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard"); // Redirect if user exists
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-50"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="text-center space-y-2" variants={childVariants}>
        <motion.h1
          className="text-transparent bg-clip-text bg-gradient-to-r from-violet-800 to-orange-600 font-extrabold tracking-tight text-5xl drop-shadow-lg"
          variants={childVariants}
        >
          Focus. Learn. Succeed.
        </motion.h1>
        <motion.p
          className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-orange-500 font-bold tracking-tight text-2xl drop-shadow-md"
          variants={childVariants}
        >
          No distractions. Just your playlists.
        </motion.p>
      </motion.div>

      <motion.div className="mt-8" variants={childVariants}>
        <GoogleLogin />
      </motion.div>

      {/* Advertisement Section */}
      <motion.div className="mt-12 text-center max-w-2xl space-y-4" variants={childVariants}>
        <motion.h2
          className="text-gray-800 dark:text-white text-3xl font-extrabold"
          variants={childVariants}
        >
          🚀 FocusGate – Study Without Distractions 🎯
        </motion.h2>
        <motion.p className="text-gray-600 dark:text-gray-300 text-lg" variants={childVariants}>
          ✅ <strong>Minimal UI</strong> – No ads, no clutter.  
          <br />
          ✅ <strong>One-Click Sign-In</strong> – Google login for instant access.  
          <br />
          ✅ <strong>Save & Organize</strong> – Keep track of your study playlists.  
          <br />
          ✅ <strong>Smooth Animations</strong> – Fast, clean, and responsive.  
          <br />
          ✅ <strong>Dashboard Access</strong> – Everything you need in one place.  
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Page;
