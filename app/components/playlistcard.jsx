import React, { useState, useEffect } from "react";

// Add CSS animations
const cssAnimations = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes scaleOut {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.9); opacity: 0; }
}
`;
import { Play, Clock, Music, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";

const PlaylistCard = ({ playlists }) => {
  // Add styles to head on component mount
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = cssAnimations;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleDeleteClick = (e, playlist) => {
    e.preventDefault(); // Prevent navigation from Link
    e.stopPropagation(); // Prevent event bubbling
    setSelectedPlaylist(playlist);
    setShowModal(true);
    setIsClosing(false);
  };

  const closeModalWithAnimation = () => {
    setIsClosing(true);
    // Wait for animation to complete before fully closing
    setTimeout(() => {
      setShowModal(false);
      setSelectedPlaylist(null);
      setIsClosing(false);
    }, 300); // Match this with animation duration
  };

  const handleCancel = () => {
    closeModalWithAnimation();
  };

  const handleConfirmDelete = () => {
    // Delete operation
    console.log(selectedPlaylist.id); // Log the video ID
    closeModalWithAnimation();
  };

  return (
    <>
      {playlists.map((playlist, index) => (
        <Link key={playlist.id} href={`/play/${playlist.id}`}>
          <div
            key={index}
            className="group relative bg-white rounded-2xl overflow-hidden transform 
                     transition-all duration-500 hover:scale-[1.02]
                     shadow-[0_10px_20px_rgba(0,0,0,0.08)]
                     hover:shadow-[0_20px_40px_rgba(255,166,0,0.2)]"
          >
            {/* Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <img
                src={playlist.thumbnail || "/api/placeholder/400/225"}
                alt={playlist.title}
                className="w-full h-full object-cover transform transition-transform 
                         duration-700 group-hover:scale-110"
              />

              {/* Play Button Overlay */}
              <button
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                             z-20 bg-orange-500 text-white rounded-full p-4
                             transform transition-all duration-500 
                             opacity-0 group-hover:opacity-100 hover:bg-orange-600
                             scale-50 group-hover:scale-100
                             shadow-[0_0_20px_rgba(255,166,0,0.3)]"
              >
                <Play size={24} fill="white" />
              </button>


            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Title */}
              <h3
                className="text-xl font-bold mb-2 line-clamp-2 bg-gradient-to-r 
                          from-orange-600 to-yellow-500 bg-clip-text text-transparent"
              >
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
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white 
                             bg-gradient-to-br from-orange-400 to-yellow-500"
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                <button
                  onClick={(e) => handleDeleteClick(e, playlist)}
                  className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg
                           transition-all duration-300 hover:bg-red-600"
                >
                  <Trash2 size={16} />
                  <span className="font-medium text-sm">Delete</span>
                </button>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 
                           transition-colors duration-300"
                >
                 
                </button>
              </div>
              </div>
            </div>

            
          </div>
        </Link>
      ))}

      {/* Delete Confirmation Modal with Transition */}
      {showModal && selectedPlaylist && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 
                     ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
             style={{animation: isClosing ? "fadeOut 0.3s ease-out" : "fadeIn 0.3s ease-out"}}
        >
          <div className={`bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform 
                       ${isClosing ? 'animate-scaleOut' : 'animate-scaleIn'}`}
               style={{animation: isClosing ? "scaleOut 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"}}>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete "<span className="font-bold">{selectedPlaylist.title}</span>"? This action cannot be undone.
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
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistCard;