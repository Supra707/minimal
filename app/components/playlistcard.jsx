import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";// Adjust import based on your project setup
import { Play, Clock, Music, Trash2 } from "lucide-react";
import Link from "next/link";

// CSS Animations
const cssAnimations = `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes scaleOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0.9); opacity: 0; } }
`;

const PlaylistCard = ({ playlists, userId }) => {
  // Inject animations on mount
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = cssAnimations;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = (e, playlist) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPlaylist(playlist);
    setShowModal(true);
    setIsClosing(false);
  };

  const closeModalWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setSelectedPlaylist(null);
      setIsClosing(false);
    }, 300);
  };

  const handleCancel = () => {
    closeModalWithAnimation();
  };

  const handleConfirmDelete = async () => {
    if (loading || !selectedPlaylist) return;
    setLoading(true);

    try {
      const playlistRef = doc(db, "playlists", userId);
      const docSnap = await getDoc(playlistRef);

      if (!docSnap.exists()) {
        console.error("Document does not exist!");
        setLoading(false);
        return;
      }

      const data = docSnap.data();
      const updatedItems = (data.items || []).filter((item) => item.id !== selectedPlaylist.id);

      await updateDoc(playlistRef, { items: updatedItems });

      console.log("Playlist deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting playlist:", error);
    } finally {
      setLoading(false);
      closeModalWithAnimation();
    }
  };

  return (
    <>
      {playlists.map((playlist) => (
        <Link key={playlist.id} href={`/play/${playlist.id}`}>
          <div
            className="group relative bg-white rounded-2xl overflow-hidden transform 
             transition-all duration-500 hover:scale-[1.02] shadow-lg h-full flex flex-col"
          >
            {/* Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <img
                src={playlist.thumbnail || "/api/placeholder/400/225"}
                alt={playlist.title}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />

              {/* Play Button Overlay */}
              <button
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                z-20 bg-orange-500 text-white rounded-full p-4 opacity-0 group-hover:opacity-100
                transition-all duration-500 shadow-lg hover:bg-orange-600"
              >
                <Play size={24} fill="white" />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 line-clamp-2 bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
                {playlist.title || "Playlist Title"}
              </h3>

              {/* Playlist Info */}
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Music size={16} className="text-orange-500" />
                  <span className="text-sm">Study hard</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} className="text-orange-500" />
                  <span className="text-sm">IISC ISI</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleDeleteClick(e, playlist)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg
                    transition-all duration-300 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                    <span className="font-medium text-sm">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {/* Delete Confirmation Modal */}
      {showModal && selectedPlaylist && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 
                     ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}
          style={{ animation: isClosing ? "fadeOut 0.3s ease-out" : "fadeIn 0.3s ease-out" }}
        >
          <div
            className={`bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform 
                       ${isClosing ? "animate-scaleOut" : "animate-scaleIn"}`}
            style={{ animation: isClosing ? "scaleOut 0.3s ease-out" : "scaleIn 0.4s ease-out" }}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete "
              <span className="font-bold">{selectedPlaylist.title}</span>"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  loading ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistCard;
