"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Play,Loader} from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "../lib/firebaseConfig"; // Make sure the path is correct
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import axios from "axios";
const PlaylistButton = ({ user }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const[loading,setloading]=useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const tooltipRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsTooltipOpen(false);
        setPlaylistUrl("");
        setIsValidUrl(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validatePlaylistUrl = (url) => {
    const playlistRegex =
      /^https:\/\/www\.youtube\.com\/playlist\?list=[a-zA-Z0-9_-]+$/;
    return playlistRegex.test(url);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPlaylistUrl(url);
    setIsValidUrl(validatePlaylistUrl(url));
  };

  async function getPlaylistTitle(playlistId) {
    try {
      const response = await fetch(
        `/api/playlist-title?playlistId=${playlistId}`
      );
      const data = await response.json();
      console.log("Playlist Title:", data.title);
      return data.title;
    } catch (error) {
      console.error("Error fetching title:", error);
    }
  }
  async function getPlaylistThumbnail (playlistId){
    try {
      const response = await axios.get(
        "https://youtube-v3-lite.p.rapidapi.com/playlistItems",
        {
          params: {
            playlistId: playlistId,
            part: "snippet",
            maxResults: 1,
          },
          headers: {
            "x-rapidapi-key":
              "b8dee9cb48mshcdf3b9dcfb365c8p1ae6e8jsnc937618846dd",
            "x-rapidapi-host": "youtube-v3-lite.p.rapidapi.com",
          },
        }
      );
      return response.data[0].items[0].snippet.resourceId.videoId;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    setloading(true);
    if (!user) return; // Ensure user is authenticated

    const urlParams = new URLSearchParams(new URL(playlistUrl).search);
    const playlistId = urlParams.get("list");

    if (!playlistId) return;

    // Await the playlist title from the async function
    const playlistTitle = await getPlaylistTitle(playlistId);
    console.log("Fetched Playlist Title:", playlistTitle);

    if (!playlistTitle) return; // Ensure the title is valid
     // Await the playlist title from the async function
    const playlistThumbnail = await getPlaylistThumbnail(playlistId);

    // Creating the playlist object
    const newPlaylist = {
      id: playlistId, // Playlist ID
      title: playlistTitle, // Playlist Title
      thumbnail:`https://i4.ytimg.com/vi/${playlistThumbnail}/hqdefault.jpg`, // Playlist Thumbnail
    };

    const userDocRef = doc(db, "playlists", user.uid);

    try {
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // If the document exists, update the "items" array with the new playlist
        await updateDoc(userDocRef, {
          items: arrayUnion(newPlaylist), // Adding new playlist object to the "items" array
        });
      } else {
        // If the document does not exist, create a new document with the first playlist
        await setDoc(userDocRef, {
          userId: user.uid,
          items: [newPlaylist], // First playlist for new user
        });
      }

      console.log("Playlist stored:", newPlaylist);
      setIsTooltipOpen(false);
      setPlaylistUrl("");
      setIsValidUrl(false);
      setloading(false);
      router.push(`/play/${playlistId}`);
    
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  return (
    <div className="relative font-sans flex flex-col items-center z-[999]">
      {/* Add Playlist Button */}
      <motion.button
        onClick={() => setIsTooltipOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 
                   text-white rounded-lg transform transition-all duration-300 
                   hover:scale-105 hover:shadow-lg active:scale-95 active:shadow-inner"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <Plus className="animate-bounce-gentle" size={20} />
        Click to Add Playlist
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {isTooltipOpen && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              y: 10,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
            className="absolute top-full mt-3 p-4 bg-white rounded-lg shadow-xl w-80 border border-gray-200 flex flex-col items-center"
          >
            {/* Arrow indicator */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 
                           bg-white transform rotate-45 border-l border-t border-gray-200"
            />

            {/* Instructions Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                ℹ️
              </div>
              <span className="text-gray-900 font-medium text-center">
                Steps to Add Your Playlist:
              </span>
            </div>

            {/* Step-by-step Instructions */}
            <div className="text-gray-700 text-sm w-full space-y-2">
              <div className="flex items-center gap-2">
                ✅{" "}
                <span className="font-semibold text-gray-900">
                  Copy the YouTube Playlist URL.
                </span>
              </div>

              <div className="flex items-center gap-2">
                ✅{" "}
                <span className="font-semibold text-gray-900">
                  Paste it into the input field below.
                </span>
              </div>

              <div className="flex items-center gap-2">
                ✅{" "}
                <span className="font-semibold text-gray-900">
                  Click <span className="text-orange-500">Play</span> to start
                  watching distraction-free!
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                ✅{" "}
                <span className="font-semibold">
                  Your playlists are{" "}
                  <span className="text-gray-800">automatically saved</span> in
                  the cloud. Click the{" "}
                  <span className="text-gray-800"><b>Dashboard</b> button</span> in the
                  player to return to your dashboard anytime.
                </span>
              </div>
            </div>

            {/* Input and Submit Button */}
            <div className="flex flex-col gap-2 mt-3 w-full">
              <input
                ref={inputRef}
                type="text"
                value={playlistUrl}
                onChange={handleUrlChange}
                placeholder="https://www.youtube.com/playlist?list=..."
                className="px-3 py-2 border border-gray-300 rounded-lg 
                           transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 
                           focus:border-transparent w-full"
              />
              <motion.button
                onClick={handleSubmit}
                disabled={!isValidUrl}
                className={`p-2 rounded-lg transition-all duration-300 transform w-full text-center flex items-center justify-center gap-2 ${
                  isValidUrl
                    ? "bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 active:scale-95"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                whileTap={isValidUrl ? { scale: 0.95 } : {}}
                whileHover={isValidUrl ? { scale: 1.05 } : {}}
              >
                {loading?(<Loader className="animate-spin"/>):(<Play size={20} className={isValidUrl ? "animate-pulse" : ""} />)}
                
                <span>{loading?'Saving and redirecting':'Play'}</span>
              </motion.button>
            </div>

            {/* Error Message */}
            {playlistUrl && !isValidUrl && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3 } }}
                className="mt-2 text-sm text-red-500 animate-fade-in text-center"
              >
                Please enter a valid YouTube playlist URL.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaylistButton;
