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
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
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
              YouTube Playlist Viewer
            </motion.h1>
            <motion.p
              className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-orange-500 font-bold tracking-tight text-2xl drop-shadow-md"
              variants={childVariants}
            >
              Enter a YouTube playlist URL to get started
            </motion.p>
          </motion.div>

          <motion.div className="mt-8" variants={childVariants}>
            <SearchInput
              icon={<Search className="w-5 h-5" />}
              placeholder="https://www.youtube.com/playlist?list=..."
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
