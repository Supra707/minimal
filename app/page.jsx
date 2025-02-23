"use client";
import { motion } from "framer-motion";
import SearchInput from "./components/searchinput";
import { Search } from "lucide-react";

const Page = () => {
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 100,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    
        <motion.div
          className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="text-center space-y-2"
            variants={childVariants}
          >
            <motion.h1
              className="text-transparent bg-clip-text bg-gradient-to-r from-violet-800 to-orange-600 font-extrabold tracking-tight text-5xl drop-shadow-lg"
              variants={childVariants}
            >
              Your Focused YouTube Experience – No Distractions, Just Learning.
            </motion.h1>
            <motion.p
              className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-orange-500 font-bold tracking-tight text-2xl drop-shadow-md"
              variants={childVariants}
            >
              Seamlessly Browse Playlists with a Clean & Minimal UI.
            </motion.p>
          </motion.div>

          <motion.div className="mt-8" variants={childVariants}>
            <SearchInput
              icon={<Search className="w-5 h-5" />}
              placeholder="https://www.youtube.com/playlist?list=..."
            />
          </motion.div>
        </motion.div>
     
  );
};

export default Page;
